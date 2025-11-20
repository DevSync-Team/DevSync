import { useState } from "react";
import { Plus, Code, Users, Clock, Activity } from "lucide-react";

// Mock data
const initialStats = [
  { value: "12", label: "Total Sessions", icon: <Code size={24} />, iconColor: "text-blue-400" },
  { value: "48", label: "Collaborators", icon: <Users size={24} />, iconColor: "text-green-400" },
  { value: "156h", label: "Coding Time", icon: <Clock size={24} />, iconColor: "text-purple-400" },
  { value: "3", label: "Active Now", icon: <Activity size={24} />, iconColor: "text-cyan-400" },
];

export const initialSessions = [
  {
    id: 1,
    name: "React Dashboard Refactor",
    language: "TypeScript",
    collaborators: 3,
    time: "2 hours ago",
    status: "Live",
  },
  {
    id: 2,
    name: "API Integration Sprint",
    language: "Python",
    collaborators: 2,
    time: "5 hours ago",
    status: "Completed",
  },
  {
    id: 3,
    name: "Mobile App Bug Fixes",
    language: "JavaScript",
    collaborators: 1,
    time: "1 day ago",
    status: "Completed",
  },
];

export default function DashboardPage() {
  const [open, setOpen] = useState(false);
  const [sessions, setSessions] = useState(initialSessions);
  const [newSession, setNewSession] = useState({ name: "", language: "JavaScript" });

  const handleCreate = () => {
    if (!newSession.name.trim()) return;
    
    const session = {
      id: Date.now(),
      name: newSession.name,
      language: newSession.language,
      collaborators: 1,
      time: "Just now",
      status: "Live",
    };
    
    // Add new session at the beginning of the list
    setSessions([session, ...sessions]);
    
    // Reset form and close modal
    setNewSession({ name: "", language: "JavaScript" });
    setOpen(false);
  };

  return (
    <main className="min-h-screen bg-[#0d1117] text-white px-6 py-10">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        {/* Header */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-semibold">Dashboard</h1>
            <p className="text-gray-400 text-sm">
              Manage your coding sessions and collaborate with your team
            </p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            <Plus size={20} />
            New Session
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {initialStats.map((stat, index) => (
            <div
              key={index}
              className="bg-[#111827] border border-[#1f2937] rounded-xl p-6 flex items-center justify-between shadow-md"
            >
              <div className="flex flex-col gap-1">
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
              <div className={`p-3 bg-[#1f2937] rounded-lg ${stat.iconColor}`}>
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Sessions */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-6 shadow-md">
          <h2 className="text-lg font-semibold py-4 border-b-[0.5px] border-[#1f2937]">
            Recent Sessions
          </h2>
          <div className="divide-y divide-[#1f2937]">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex justify-between items-center py-4 hover:bg-[#1a1f2a] transition-colors rounded-lg px-3"
              >
                <div className="flex flex-col gap-1">
                  <h3 className="font-medium">{session.name}</h3>
                  <p className="text-sm text-gray-400">
                    {session.language} • {session.collaborators} collaborator
                    {session.collaborators > 1 && "s"} • {session.time}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {session.status === "Live" && (
                    <span className="flex items-center text-green-400 text-sm font-medium">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                      Live
                    </span>
                  )}
                  <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    Open
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Session Modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-6 max-w-md w-full shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Create New Session</h2>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Session Name</label>
                <input
                  type="text"
                  value={newSession.name}
                  onChange={(e) => setNewSession({ ...newSession, name: e.target.value })}
                  placeholder="Enter session name"
                  className="w-full bg-[#0d1117] border border-[#1f2937] rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Language</label>
                <select
                  value={newSession.language}
                  onChange={(e) => setNewSession({ ...newSession, language: e.target.value })}
                  className="w-full bg-[#0d1117] border border-[#1f2937] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option>JavaScript</option>
                  <option>TypeScript</option>
                  <option>Python</option>
                  <option>Java</option>
                  <option>Go</option>
                  <option>Rust</option>
                </select>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    setOpen(false);
                    setNewSession({ name: "", language: "JavaScript" });
                  }}
                  className="flex-1 px-4 py-2 bg-[#1f2937] rounded-lg hover:bg-[#2a3441] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!newSession.name.trim()}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}