"use client";
import React, { useState } from "react";
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
  MessageSquare,
  Settings,
  Plus,
  Minus,
} from "lucide-react";
import { Button, ChatSidebar, CodeEditor } from "@/components";
import VersionHistoryModal from "./modals/VersionHistoryModal";
import SaveSnapshotModal from "./modals/SaveSnapshotModal";
import InviteCollaboratorModal from "./modals/InviteCollaboratorModal";
import SessionMembersModal from "./modals/SessionMembersModal";
import { Member } from "./interface/interface";
import ShareSessionModal from "./modals/SessionModal";

export default function DevSyncEditor() {
  // --- Modals ---
  const [historyOpen, setHistoryOpen] = useState(false);
  const [snapshotOpen, setSnapshotOpen] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
    const [shareModalOpen, setShareModalOpen] = useState(false);

  // --- Toggle Panels ---
  const [showFiles, setShowFiles] = useState(true);
  const [showChat, setShowChat] = useState(true);

  const [members, setMembers] = useState<Member[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "host",
      avatar: "#8B5CF6",
      online: true,
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "editor",
      avatar: "#8B5CF6",
      online: true,
    },
    {
      id: "3",
      name: "Bob Wilson",
      email: "bob@example.com",
      role: "viewer",
      avatar: "#8B5CF6",
      online: true,
    },
  ]);

  const changeRole = (id: string, role: "editor" | "viewer") =>
    setMembers((m) => m.map((x) => (x.id === id ? { ...x, role } : x)));

  const remove = (id: string) =>
    setMembers((m) => m.filter((x) => x.id !== id));
 const [code, setCode] =
  useState(`// Welcome to DevSync - Collaborative Coding Platform
Start coding together with your team!

function calculateSum(a, b {
  return a + b;
}

function greetUser(name) {
  console.log(\`Hello, \${name}! Welcome to DevSync.\`);
}

// Example usage
const result = calculateSum(5, 3;
greetUser("Developer);

console.log("Result:", result);
console.log("DevSync is ready for collaboration!");`);


  const [output, setOutput] = useState("");
  const [activeUsers] = useState([
    { id: 1, name: "J", color: "bg-purple-500" },
    { id: 2, name: "J", color: "bg-pink-500" },
    { id: 3, name: "D", color: "bg-blue-500" },
  ]);

  const [chatMessages] = useState([
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

  const handleRunCode = () => {
    setOutput(
      "Hello, Developer! Welcome to DevSync.\nResult: 8\nDevSync is ready for collaboration!"
    );
  };

  return (
    <div className="flex flex-col h-screen bg-[#111827] text-gray-100 font-sans">
      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-3 sm:px-4 py-2 bg-[#111827] border-b border-[#3e3e42]">
        <div className="flex items-center justify-between sm:justify-start gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded flex items-center justify-center">
              <FileCode className="w-3 h-3 sm:w-5 sm:h-5" />
            </div>
            <span className="text-lg sm:text-xl font-semibold">DevSync</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 sm:block">
            <span>Session:</span>
            <button   onClick={() => setShareModalOpen(true)} className="flex items-center gap-1 px-2 py-1 hover:bg-[#2d2d30] rounded">
              <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Share</span>
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
          <select title="languageoptions" className="px-2 py-1 sm:px-3 sm:py-1.5 rounded text-xs sm:text-sm">
            <option>JavaScript</option>
          </select>

          <Button
            text="Run Code"
            onClick={handleRunCode}
            icon={<Play size={16} />}
            className="text-xs sm:text-sm"
          />
          <button
            onClick={() => setSnapshotOpen(true)}
            className="flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 rounded text-xs sm:text-sm"
          >
            <Save className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Save Snapshot</span>
            <span className="xs:hidden">Save</span>
          </button>
          <button
            onClick={() => setHistoryOpen(true)}
            className="flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 rounded text-xs sm:text-sm"
          >
            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">History (1)</span>
            <span className="xs:hidden">History</span>
          </button>
          <button className="flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 rounded text-xs sm:text-sm">
            <FileUp className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button className="flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 rounded text-xs sm:text-sm">
            <Download className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-1 sm:gap-2">
          <div className="flex -space-x-1 sm:-space-x-2">
            {activeUsers.map((user) => (
              <div
                key={user.id}
                className={`w-6 h-6 sm:w-8 sm:h-8 ${user.color} rounded-full border-2 border-[#111827] flex items-center justify-center text-xs sm:text-sm font-medium`}
              >
                {user.name}
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowSessionModal(true)}
            className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded text-xs sm:text-sm"
          >
            <Users className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{members.length}</span>
          </button>
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 bg-blue-500 hover:bg-blue-600 rounded text-xs sm:text-sm font-medium"
          >
            <UserPlus className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Invite</span>
          </button>
          <button className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded text-xs sm:text-sm">
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
        {/* Sidebar */}
        {showFiles && (
          <div className="w-full lg:w-56 bg-[#232c3e] border-b lg:border-b-0 lg:border-r border-[#3e3e42]">
            <div className="p-2">
              <div className="flex items-center justify-between px-2 py-1 bg-[#37373d] rounded">
                <span className="text-sm">main.js</span>
                <span className="text-xs text-gray-400">3</span>
              </div>
            </div>
          </div>
        )}

        {/* Editor */}
        <div className="flex-1 flex flex-col min-h-0">
          <CodeEditor code={code} setCode={setCode} language="js" />

          {/* Output Console */}
          <div className="h-32 sm:h-48 bg-[#1e1e2e] border-t border-[#313244]">
            <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-[#252526] border-b border-[#313244]">
              <span className="text-sm">Output Console</span>
            </div>
            <div className="p-3 sm:p-4 font-mono text-xs sm:text-sm text-gray-300 whitespace-pre-wrap overflow-auto">
              {output || "Click 'Run Code' to see output here..."}
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-[#3e3e42]">
            <ChatSidebar chatMessages={chatMessages} />
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
        sessionId="r6t1l6e3b3k"
        sessionDate="11/15/2025"
        onRoleChange={changeRole}
        onRemoveMember={remove}
        onCopyLink={() => alert("Link copied!")}
      />

      <InviteCollaboratorModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onInvite={(email, role) => alert(`Invited ${email} as ${role}`)}
      />
        <ShareSessionModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        sessionUrl="https://readdy.link/editor/r6t1l6e3b3k"
      />
    </div>
  );
}