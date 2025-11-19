import ChatMessage from "../models/chatMessage.model.js";
import type { IChatMessage } from "../models/chatMessage.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

export const getChatHistoryService = async (
  sessionId: string,
  limit: number = 50,
  beforeId?: string
): Promise<IChatMessage[]> => {
  
  const query: any = { 
    session_id: new mongoose.Types.ObjectId(sessionId) 
  };
  
  if (beforeId) {
    query._id = { $lt: new mongoose.Types.ObjectId(beforeId) };
  }

  const history = await ChatMessage.find(query)
    .sort({ createdAt: -1 }) 
    .limit(limit)
    .populate({
      path: "user_id",
      model: User,
      select: "full_name avatar_url",
    })
    .lean() as IChatMessage[];

  return history.reverse();
};