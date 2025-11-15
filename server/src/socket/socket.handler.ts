import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import SessionMember from '../models/sessionMember.model.js';
import UserCursor from '../models/userCursor.model.js';
import UserSelection from '../models/userSelection.model.js';
import ChatMessage from '../models/chatMessage.model.js';
import mongoose from 'mongoose';


// --- TYPESCRIPT INTERFACES ---

export interface AuthPayload {
    userId: string;
}

export interface CodeOperation {
    sessionId: string;
    fileId: string;
    op: any; 
    version: number;
    userId: string;
}

export interface CursorUpdate {
    sessionId: string;
    fileId: string;
    userId: string;
    line: number;
    column: number;
    color: string;
}

export interface SelectionUpdate {
    sessionId: string;
    fileId: string;
    userId: string;
    startLine: number;
    startColumn: number;
    endLine: number;
    endColumn: number;
    color: string;
}

export interface NewChatMessage {
    sessionId: string;
    userId: string;
    message: string;
    messageType: 'text' | 'code' | 'system';
}


// --- SOCKET.IO INITIALIZATION ---

export const initializeSocketIO = (io: Server) => {
    
    // MiddleWare to authenticate and attach userId to socket
    io.use((socket, next) => {
        // --- OUTER TRY/CATCH TO CATCH SYNCHRONOUS CRASHES ---
        try {
            // Token can be from auth header (auth.token) or query param (query.token)
            const tokenRaw = socket.handshake.auth.token || socket.handshake.query.token;
            
            // Normalize token (handle array/string/undefined cases from query)
            let token: string | undefined;
            if (Array.isArray(tokenRaw)) {
                token = tokenRaw[0];
            } else if (typeof tokenRaw === 'string') {
                token = tokenRaw;
            }

            if (!token) {
                console.error('Socket Auth Failed: No token provided or token is invalid format.');
                return next(new Error('Authentication error: No token provided'));
            }
            
            // --- INNER TRY/CATCH FOR JWT VERIFICATION ---
            try {
                const secret = process.env.JWT_SECRET || "secret";
                
                // Ensure token is trimmed of potential whitespace
                const trimmedToken = token.trim();

                const decoded = jwt.verify(trimmedToken, secret) as AuthPayload; 
                
                console.log(`Socket Auth Success for User ID: ${decoded.userId}`);
                
                (socket as any).userId = decoded.userId;
                next();
                
            } catch (err) {
                // LOG: The JWT error (e.g., JsonWebTokenError: invalid signature)
                console.error('Socket Auth Failed: JWT Verification Failed.', err);
                next(new Error('Authentication error: Invalid token')); 
            }
            // --- END INNER TRY/CATCH ---
            
        } catch (err) {
            // LOG: The emergency synchronous crash log
            console.error('FATAL SYNCHRONOUS ERROR in Socket Middleware:', err);
            next(new Error('Internal server error during authentication.'));
        }
        // --- END OUTER TRY/CATCH ---
    });

    // Main connection handler
    io.on('connection', (socket) => {
        const userId = (socket as any).userId;
        
        // --- JOIN SESSION ---
        socket.on('joinSession', async (sessionId: string) => {
            console.log(`User ${userId} attempting to join session ${sessionId}`);
            
            try {
                const sessionObjectId = new mongoose.Types.ObjectId(sessionId);
                
                // 1. Check if member exists and update status to 'online'
                await SessionMember.findOneAndUpdate(
                    { session_id: sessionObjectId, user_id: userId },
                    { $set: { status: 'online', last_seen: new Date() } }
                );

                // 2. Join a dedicated room for the session
                socket.join(sessionId);
                console.log(`User ${userId} successfully joined room ${sessionId}`);

                // 3. Broadcast presence to the session
                socket.to(sessionId).emit('memberJoined', { userId: userId, socketId: socket.id });

            } catch (error) {
                console.error(`Error joining session ${sessionId} for user ${userId}:`, error);
                socket.emit('sessionError', { message: 'Failed to join session or update membership status.' });
            }
        });

        // --- CODE SYNC ---
        socket.on('code:operation', (payload: CodeOperation) => {
            socket.to(payload.sessionId).emit('code:operation', payload);
        });

        // --- CURSOR TRACKING ---
        socket.on('presence:cursor', async (payload: CursorUpdate) => {
            const { sessionId, fileId, line, column, color } = payload;
            
            await UserCursor.findOneAndUpdate(
                { session_id: sessionId, user_id: userId, file_id: fileId },
                { $set: { line_number: line, column_number: column, color: color } },
                { upsert: true, new: true }
            );

            socket.to(sessionId).emit('presence:cursor', payload);
        });

        // --- SELECTION TRACKING ---
        socket.on('presence:selection', async (payload: SelectionUpdate) => {
            const { sessionId, fileId, startLine, startColumn, endLine, endColumn, color } = payload;

            await UserSelection.findOneAndUpdate(
                { session_id: sessionId, user_id: userId, file_id: fileId },
                { $set: { start_line: startLine, start_column: startColumn, end_line: endLine, end_column: endColumn, color: color } },
                { upsert: true, new: true }
            );

            socket.to(sessionId).emit('presence:selection', payload);
        });

        // --- CHAT ---
        socket.on('chat:message', async (payload: NewChatMessage) => {
            const { sessionId, message, messageType } = payload;
            console.log(`New chat message in session ${sessionId} from ${userId}`);

            try {
                // Save to DB
                const chatMessage = new ChatMessage({
                    session_id: sessionId,
                    user_id: userId,
                    message: message,
                    message_type: messageType,
                });
                await chatMessage.save();

                // Broadcast message to everyone in the room
                io.to(sessionId).emit('chat:message', {
                    ...payload,
                    timestamp: chatMessage.createdAt, 
                    _id: chatMessage._id
                });
            } catch (error) {
                 console.error(`Error saving/broadcasting chat message in session ${sessionId}:`, error);
            }
        });

        // --- DISCONNECT HANDLER ---
        socket.on('disconnect', async () => {
            console.log(`User disconnected: ${userId} (${socket.id})`);
            
            const rooms = Array.from(socket.rooms).filter(room => room !== socket.id);

            await SessionMember.updateMany(
                { user_id: userId, session_id: { $in: rooms } },
                { $set: { status: 'offline', last_seen: new Date() } }
            );
            
            rooms.forEach(sessionId => {
                socket.to(sessionId).emit('memberLeft', { userId: userId });
            });
        });
    });
};