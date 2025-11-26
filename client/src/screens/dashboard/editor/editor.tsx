"use client";
import React, { useEffect, useState } from "react";
import {
  Play,
  Save,
  Clock,
  FileUp,
  Download,
  Users,
  UserPlus,
  Share2,
  FileCode,
} from "lucide-react";
import { Button, ChatSidebar, CodeEditor } from "@/components";
import VersionHistoryModal from "./modals/VersionHistoryModal";
import SaveSnapshotModal from "./modals/SaveSnapshotModal";
import InviteCollaboratorModal from "./modals/InviteCollaboratorModal";
import SessionMembersModal from "./modals/SessionMembersModal";
import { Member } from "./interface/interface";
import ShareSessionModal from "./modals/SessionModal";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChatMessage } from "@/types/chats.types";
import FileManager from "./modals/FileManager";
import api from "@/utils/api";

export interface FileItem {
  id: string;
  name: string;
  content: string;
}

interface Session {
  _id: string;
  language: string;
  name?: string;
  description?: string;
  members?: Array<{
    _id: string;
    user_id: {
      _id: string;
      full_name: string;
    };
    role: string;
    status: string;
    joined_at: string;
    last_seen: string;
  }>;
}

export default function EditorScreen() {
  const params = useParams();
  
  // ✅ ALL HOOKS AT THE TOP - BEFORE ANY CONDITIONAL LOGIC
  // --- Modals ---
  const [historyOpen, setHistoryOpen] = useState(false);
  const [snapshotOpen, setSnapshotOpen] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // --- Toggle Panels ---
  const [showFiles, setShowFiles] = useState(true);
  const [showChat, setShowChat] = useState(true);
  
  // --- Session State ---
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // --- Editor State ---
  const [code, setCode] = useState(`// Welcome to DevSync - Collaborative Coding Platform
Start coding together with your team!

function calculateSum(a, b) {
  return a + b;
}`);

  const [files, setFiles] = useState<FileItem[]>([]);
  const [activeFileId, setActiveFileId] = useState("1");
  
  // ✅ Members from API - initially empty
  const [members, setMembers] = useState<Member[]>([]);

  const [output, setOutput] = useState("");
  const [activeUsers] = useState([
    { id: 1, name: "J", color: "bg-purple-500" },
    { id: 2, name: "J", color: "bg-pink-500" },
    { id: 3, name: "D", color: "bg-blue-500" },
  ]);

  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      user: "Jane Smith",
      message: "Hey everyone! Ready to start coding?",
      time: "10:25 AM",
      avatar: "bg-teal-500",
    },
    {
      id: 2,
      user: "John Doe",
      message: "Absolutely! I just shared the main function. Take a look.",
      time: "10:35 AM",
      avatar: "bg-orange-500",
    },
    {
      id: 3,
      user: "Jane Smith",
      message: "Code snippet",
      time: "10:45 AM",
      avatar: "bg-teal-500",
      isCode: true,
    },
  ]);
  
  // NOW extract sessionId
  const id = params?.id;
  const sessionId = Array.isArray(id) ? id[0] : id;
  
  console.log("🔍 sessionId from URL:", sessionId);
  
  // ✅ Fetch session from backend
  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }
    
    const fetchSession = async () => {
      try {
        setLoading(true);
        console.log("📡 Fetching session from backend:", sessionId);
        
        const response = await api.get(`/api/sessions/${sessionId}`);
        
        console.log("✅ Session loaded from backend:", response.data);
        
        // ✅ Handle both {session: {...}} and {...} response formats
        const sessionData = response.data.session || response.data;
        setSession(sessionData);
        
        // ✅ Transform API members to your Member interface
        if (sessionData.members && Array.isArray(sessionData.members)) {
          const transformedMembers: Member[] = sessionData.members.map((member: any) => ({
            id: member._id,
            name: member.user_id.full_name,
            email: member.user_id.email || `${member.user_id.full_name.toLowerCase().replace(' ', '.')}@example.com`, // Fallback if email not in response
            role: member.role as "host" | "editor" | "viewer",
            avatar: "#8B5CF6", // You can generate different colors based on user
            online: member.status === "online",
          }));
          
          console.log("👥 Transformed members:", transformedMembers);
          setMembers(transformedMembers);
        }
        
        setError(null);
      } catch (err: any) {
        console.error("❌ Error fetching session:", err);
        setError(err.response?.data?.message || "Failed to load session");
      } finally {
        setLoading(false);
      }
    };
    
    fetchSession();
  }, [sessionId]);
  
  // ✅ Initialize files when session loads
  useEffect(() => {
    if (session) {
      const extMap: Record<string, string> = {
        javascript: "js",
        typescript: "ts",
        js: "js",
        ts: "ts",
        python: "py",
      };
      
      setFiles([
        {
          id: "1",
          name: `main.${extMap[session.language.toLowerCase()] || "js"}`,
          content: code,
        },
      ]);
    }
  }, [session, code]);
  
  // Sync editor changes to active file
  useEffect(() => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === activeFileId ? { ...f, content: code } : f
      )
    );
  }, [code, activeFileId]);
  
  // NOW conditional returns AFTER all hooks
  if (!sessionId) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#111827] text-gray-100">
        <div className="text-center">
          <p className="text-gray-400">No session ID provided</p>
          <Link href="/dashboard" className="text-blue-500 hover:underline mt-4 inline-block">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#111827] text-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading session...</p>
        </div>
      </div>
    );
  }
  
  if (error || !session) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#111827] text-gray-100">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Session not found"}</p>
          <Link href="/dashboard" className="text-blue-500 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  // Helper functions
  const extMap: Record<string, string> = {
    javascript: "js",
    typescript: "ts",
    js: "js",
    ts: "ts",
    python: "py",
  };

  const handleCreateFile = (fileName: string) => {
    if (!fileName.trim()) return;
    const ext = extMap[session.language.toLowerCase()] || "js";
    const cleanName = fileName.replace(/\.[^/.]+$/, "");

    const newFile: FileItem = {
      id: Date.now().toString(),
      name: `${cleanName}.${ext}`,
      content: "",
    };

    setFiles((prev) => [...prev, newFile]);
    setActiveFileId(newFile.id);
    setCode("");
  };

  const handleSelectFile = (id: string) => {
    const f = files.find((x) => x.id === id);
    if (!f) return;
    setActiveFileId(id);
    setCode(f.content);
  };

  const handleDeleteFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const changeRole = (id: string, role: "editor" | "viewer") =>
    setMembers((m) => m.map((x) => (x.id === id ? { ...x, role } : x)));

  const remove = (id: string) =>
    setMembers((m) => m.filter((x) => x.id !== id));
  
  const handleSendMessage = (message: string) => {
    const newMessage: ChatMessage = {
      id: chatMessages.length + 1,
      user: "You",
      message: message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      avatar: "bg-blue-500",
      isCode:
        message.includes("function") ||
        message.includes("const ") ||
        message.includes("let "),
    };

    setChatMessages((prev) => [...prev, newMessage]);
  };
  
  const handleRunCode = () => {
    setOutput(
      "Hello, Developer! Welcome to DevSync.\nResult: 8\nDevSync is ready for collaboration!"
    );
  };

  console.log("🎯 Rendering editor with sessionId:", sessionId);
  console.log("👥 Current members count:", members.length);

  return (
    <div className="flex flex-col h-screen bg-[#111827] text-gray-100 font-sans">
      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-3 sm:px-4 py-5 bg-[#111827] border-b border-[#3e3e42]">
        <div className="flex items-center justify-between sm:justify-start gap-6">
          <Link href={"/"} className="flex items-center gap-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded flex items-center justify-center">
              <FileCode className="w-3 h-3 sm:w-5 sm:h-5" />
            </div>
            <span className="text-lg sm:text-xl font-semibold">DevSync</span>
          </Link>
          <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-400 ">
            <div>Session: {session.name || sessionId.substring(0, 8) + '...'}</div>
            <button
              onClick={() => setShareModalOpen(true)}
              className="flex items-center gap-1 px-2 py-1 hover:bg-[#2d2d30] rounded"
            >
              <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Share </span>
            </button>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 sm:gap-3">
          <button className="px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm hover:bg-[#2d2d30] rounded">
            Sign In
          </button>
          <button className="px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm bg-blue-500 hover:bg-blue-600 rounded font-medium">
            Get Started
          </button>
        </div>
      </div>

      {/* Main Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-3 sm:px-4 py-2 bg-[#232c3e] border-b border-[#3e3e42]">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
          <select
            title="languageoptions"
            className="px-2 py-1 sm:px-3 sm:py-1.5 rounded text-xs sm:text-sm bg-slate-700"
          >
            <option>{session.language}</option>
          </select>

          <Button
            text="Run Code"
            onClick={handleRunCode}
            icon={<Play size={16} />}
            className="text-xs sm:text-sm"
          />
          <button
            onClick={() => setSnapshotOpen(true)}
            className="flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 rounded text-xs sm:text-sm hover:bg-slate-700"
          >
            <Save className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Save Snapshot</span>
            <span className="xs:hidden">Save</span>
          </button>
          <button
            onClick={() => setHistoryOpen(true)}
            className="flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 rounded text-xs sm:text-sm hover:bg-slate-700"
          >
            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">History (1)</span>
            <span className="xs:hidden">History</span>
          </button>
          <button className="flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 rounded text-xs sm:text-sm hover:bg-slate-700">
            <FileUp className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button className="flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 rounded text-xs sm:text-sm hover:bg-slate-700">
            <Download className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-1 sm:gap-2">
          {/* ✅ Show real member avatars */}
          <div className="flex -space-x-1 sm:-space-x-2">
            {members.slice(0, 3).map((member, index) => {
              const colors = ['bg-purple-500', 'bg-pink-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500'];
              const initial = member.name.charAt(0).toUpperCase();
              
              return (
                <div
                  key={member.id}
                  className={`w-6 h-6 sm:w-8 sm:h-8 ${colors[index % colors.length]} rounded-full border-2 border-[#111827] flex items-center justify-center text-xs sm:text-sm font-medium`}
                  title={member.name}
                >
                  {initial}
                </div>
              );
            })}
            {members.length > 3 && (
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-500 rounded-full border-2 border-[#111827] flex items-center justify-center text-xs sm:text-sm font-medium">
                +{members.length - 3}
              </div>
            )}
          </div>
          <button
            onClick={() => setShowSessionModal(true)}
            className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded text-xs sm:text-sm hover:bg-slate-700"
          >
            <Users className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{members.length}</span>
          </button>
          <button
            onClick={() => {
              console.log("🔵 Opening invite modal, sessionId:", sessionId);
              setShowInviteModal(true);
            }}
            className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 bg-blue-500 hover:bg-blue-600 rounded text-xs sm:text-sm font-medium"
          >
            <UserPlus className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Invite</span>
          </button>
          <button className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded text-xs sm:text-sm hover:bg-slate-700">
            <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
          <button
            onClick={() => setShowFiles((prev) => !prev)}
            className="px-2 py-1 sm:px-3 sm:py-1.5 bg-transparent border border-[#3e3e42] rounded text-xs sm:text-sm"
          >
            <span className="hidden sm:inline">Files</span>
            <span className="sm:hidden">F</span>
          </button>
          <button
            onClick={() => setShowChat((prev) => !prev)}
            className="px-2 py-1 sm:px-3 sm:py-1.5 bg-transparent border border-[#3e3e42] rounded text-xs sm:text-sm"
          >
            <span className="hidden sm:inline">Chat</span>
            <span className="sm:hidden">C</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        {showFiles && (
          <FileManager
            files={files}
            activeFileId={activeFileId}
            onCreateFile={handleCreateFile}
            onSelectFile={handleSelectFile}
            onDeleteFile={handleDeleteFile}
          />
        )}

        <div className="flex-1 flex flex-col min-h-0">
          <CodeEditor
            code={code}
            setCode={setCode}
            language={
              session.language === "javascript" ? "js" : session.language.toLowerCase()
            }
          />

          <div className="h-32 sm:h-48 bg-[#1c2536] border-t border-[#313244]">
            <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-[#1c2536] border-b border-[#313244]">
              <span className="text-sm">Output Console</span>
            </div>
            <div className="p-3 sm:p-4 font-mono text-xs sm:text-sm text-gray-300 whitespace-pre-wrap overflow-auto">
              {output || "Click 'Run Code' to see output here..."}
            </div>
          </div>
        </div>

        {showChat && (
          <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-[#3e3e42]">
            <ChatSidebar
              chatMessages={chatMessages}
              onSendMessage={handleSendMessage}
            />
          </div>
        )}
      </div>

      <VersionHistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />

      <SaveSnapshotModal
        isOpen={snapshotOpen}
        onClose={() => setSnapshotOpen(false)}
        onSave={(msg) => {
          console.log("Snapshot saved:", msg);
          setSnapshotOpen(false);
        }}
      />
      
      <SessionMembersModal
        isOpen={showSessionModal}
        onClose={() => setShowSessionModal(false)}
        members={members}
        sessionId={sessionId}
        sessionDate="11/15/2025"
        onRoleChange={changeRole}
        onRemoveMember={remove}
        onCopyLink={() => alert("Link copied!")}
      />

      <InviteCollaboratorModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        sessionId={sessionId}
        onInviteSuccess={(email) => {
          console.log(`Successfully sent invite to ${email}`);
          // Optionally refetch session to get updated members list
        }}
      />
      
      <ShareSessionModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        sessionUrl={`http://localhost:3000/editor/${sessionId}`}
      />
    </div>
  );
}