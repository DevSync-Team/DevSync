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

export default function DevSyncEditor() {
  // --- Modals ---
  const [historyOpen, setHistoryOpen] = useState(false);
  const [snapshotOpen, setSnapshotOpen] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

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
// Start coding together with your team!

function calculateSum(a, b) {
  return a + b;
}

function greetUser(name) {
  console.log(\`Hello, \${name}! Welcome to DevSync.\`);
}

// Example usage
const result = calculateSum(5, 3);
greetUser("Developer");

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
      <div className="flex items-center justify-between px-4 py-2 bg-[#111827] border-b border-[#3e3e42]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
              <FileCode className="w-5 h-5" />
            </div>
            <span className="text-xl font-semibold">DevSync</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Session:</span>
            <button className="flex items-center gap-1 px-2 py-1 hover:bg-[#2d2d30] rounded">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-1.5 text-sm hover:bg-[#2d2d30] rounded">
            Sign In
          </button>
          <button className="px-4 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 rounded font-medium">
            Get Started
          </button>
        </div>
      </div>

      {/* Main Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#232c3e] border-b border-[#3e3e42]">
        <div className="flex items-center gap-2">
          <select title="languageoptions" className="px-3 py-1.5  rounded text-sm">
            <option>JavaScript</option>
          </select>

          <Button
            text="Run Code"
            onClick={handleRunCode}
            icon={<Play size={18} />}
            className="text-sm"
          />
          <button
            onClick={() => setSnapshotOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5  rounded text-sm"
          >
            <Save className="w-4 h-4" />
            Save Snapshot
          </button>
          <button
            onClick={() => setHistoryOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5  rounded text-sm"
          >
            <Clock className="w-4 h-4" />
            History (1)
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5  rounded text-sm">
            <FileUp className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5  rounded text-sm">
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {activeUsers.map((user) => (
              <div
                key={user.id}
                className={`w-8 h-8 ${user.color} rounded-full border-2  flex items-center justify-center text-sm font-medium`}
              >
                {user.name}
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowSessionModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded text-sm"
          >
            <Users className="w-4 h-4" />
            {members.length}
          </button>
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 rounded text-sm font-medium"
          >
            <UserPlus className="w-4 h-4" />
            Invite
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5  rounded text-sm">
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button
            onClick={() => setShowFiles((prev) => !prev)}
            className="px-3 py-1.5 bg-transparent border border-[#3e3e42] rounded text-sm"
          >
            Files
          </button>
          <button
            onClick={() => setShowChat((prev) => !prev)}
            className="px-3 py-1.5 bg-transparent ] border border-[#3e3e42] rounded text-sm"
          >
            Chat
          </button>

          <button className="p-1.5 hover:bg-[#2d2d30] rounded">
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-400">14</span>
          <button className="p-1.5 hover:bg-[#2d2d30] rounded">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {showFiles && (
          <div className="w-56 bg-[#232c3e] border-r border-[#3e3e42]">
            <div className="p-2">
              <div className="flex items-center justify-between px-2 py-1 bg-[#37373d] rounded">
                <span className="text-sm">main.js</span>
                <span className="text-xs text-gray-400">3</span>
              </div>
            </div>
          </div>
        )}

        {/* Editor */}
        <div className="flex-1 flex flex-col">
          <CodeEditor code={code} setCode={setCode} />

          {/* Output Console */}
          <div className="h-48 bg-[#1e1e2e] border-t border-[#313244]">
            <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-[#313244]">
              <span className="text-sm">Output Console</span>
            </div>
            <div className="p-4 font-mono text-sm text-gray-300 whitespace-pre-wrap">
              {output || "Click 'Run Code' to see output here..."}
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        {showChat && <ChatSidebar chatMessages={chatMessages} />}
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
    </div>
  );
}
