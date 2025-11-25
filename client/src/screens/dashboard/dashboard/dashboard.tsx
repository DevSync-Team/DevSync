"use client";

import { Button } from "@/components";
import { useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import CreateSessionModal from "./modal/CreateSessionModal";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Code } from "lucide-react";
import { Session, DisplaySession } from "@/types/dashboard.types";
import api from "@/utils/api";
import StatsGrid from "@/components/StatsCard/StatsCard";
import { FaClock, FaCode, FaUsers } from "react-icons/fa";
import { MdOutlinePlayCircle } from "react-icons/md";

// Helper to transform backend session to display format
const transformSession = (session: Session): DisplaySession => {
  const memberCount = session.members?.length ?? 1;

  const lastActivity = new Date(session.last_activity);
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - lastActivity.getTime()) / (1000 * 60)
  );

  let timeString = "";
  if (diffInMinutes < 1) timeString = "Just now";
  else if (diffInMinutes < 60) timeString = `${diffInMinutes}m ago`;
  else if (diffInMinutes < 1440)
    timeString = `${Math.floor(diffInMinutes / 60)}h ago`;
  else timeString = `${Math.floor(diffInMinutes / 1440)}d ago`;

  return {
    ...session,
    id: session._id,
    collaborators: memberCount,
    status: session.is_active ? "Live" : "Inactive",
    time: timeString,
  };
};

export default function DashboardPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [sessionList, setSessionList] = useState<DisplaySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardStats, setDashboardStats] = useState({
    totalSessions: 0,
    liveSessions: 0,
    totalCollaborators: 0,
    totalCodingMinutes: 0,
  });

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get("/api/sessions");

      // Transform backend sessions to display format
      const transformedSessions: DisplaySession[] = (
        res.data.sessions || []
      ).map(transformSession);
      const totalSessions = transformedSessions.length;

      const liveSessions = transformedSessions.filter(
        (s: DisplaySession) => s.status === "Live"
      ).length;

      const totalCollaborators = transformedSessions.reduce(
        (sum, s) => sum + s.collaborators,
        0
      );

      const totalCodingMinutes = transformedSessions.reduce((sum, s) => {
        const last = new Date(s.last_activity).getTime();
        const now = Date.now();
        return sum + Math.floor((now - last) / (1000 * 60));
      }, 0);

      setDashboardStats({
        totalSessions,
        liveSessions,
        totalCollaborators,
        totalCodingMinutes,
      });
      setSessionList(transformedSessions);
    } catch (error: any) {
      console.error("Failed to fetch sessions:", error);
      setError(error.response?.data?.message || "Failed to load sessions");

      if (error.response?.status === 401) {
        router.push("/signin");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [router]);

  const handleSessionCreated = async () => {
    // Refresh the session list after creation
    await fetchSessions();
    setOpen(false);
  };

  return (
    <main className="flex flex-col">
      <div className="flex flex-col sm:flex-row text-white sm:items-center sm:justify-between gap-2 px-3 sm:px-4 py-2 bg-[#111827] border-b border-[#3e3e42]">
        <div className="flex px-4">
          <Link href={"/"} className="flex items-center gap-2">
            <div className="bg-linear-to-r from-blue-500 to-cyan-400 text-white p-2 rounded-md text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all shadow-sm hover:shadow-md">
              <Code />
            </div>
            <p className="text-lg sm:text-xl font-semibold text-white">
              DevSync
            </p>
          </Link>
        </div>
        <div className="flex items-center justify-end gap-2 sm:gap-3">
          <Link
            href="/signin"
            className="bg-transparent text-white px-4 py-2 rounded-md text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all shadow-sm hover:shadow-md"
          >
            Signin
          </Link>
          <Link
            href="/signin"
            className="bg-linear-to-r from-blue-500 to-cyan-400 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all shadow-sm hover:shadow-md"
          >
            Get Started
          </Link>
        </div>
      </div>

      <div className="min-h-screen bg-[#0d1117] text-white px-6 py-10">
        <div className="max-w-6xl mx-auto flex flex-col gap-10">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-semibold">Dashboard</h1>
              <p className="text-gray-400 text-sm">
                Manage your coding sessions and collaborate with your team
              </p>
            </div>

            <Button
              text="New Session"
              icon={<BiPlus />}
              onClick={() => setOpen(true)}
              backgroundColor="bg-linear-to-r from-blue-500 to-cyan-400"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsGrid
              value={dashboardStats.totalSessions}
              label="Total Sessions"
              icon={<FaCode className="text-blue-600 text-xl" />}
              iconColor={"bg-blue-900/50"}
            />
            <StatsGrid
              value={dashboardStats.liveSessions}
              label="Live Sessions"
              icon={<MdOutlinePlayCircle className="text-green-600 text-xl" />}
              iconColor={"bg-green-900/50"}
            />
            <StatsGrid
              value={dashboardStats.totalCollaborators}
              label="Collaborators"
              icon={<FaUsers className="text-purple-600 text-xl" />}
              iconColor={"bg-purple-900/40"}
            />
            <StatsGrid
              value={dashboardStats.totalCodingMinutes}
              label="Coding Minutes"
              icon={<FaClock className="text-orange-600 text-xl" />}
              iconColor={"bg-orange-900/40"}
            />
          </div>

          {/* Recent Sessions */}
          <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-6 shadow-md">
            <h2 className="text-lg font-semibold py-4 border-b-[0.5px] border-[#1f2937]">
              Recent Sessions
            </h2>

            {/* Loading State */}
            {loading && (
              <div className="py-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="mt-4 text-gray-400">Loading sessions...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="py-8 text-center">
                <p className="text-red-400 mb-4">{error}</p>
                <button
                  onClick={fetchSessions}
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && sessionList.length === 0 && (
              <div className="py-12 text-center">
                <div className="text-gray-500 mb-4">
                  <Code className="mx-auto h-12 w-12 mb-3" />
                </div>
                <p className="text-gray-400 mb-2">No sessions yet</p>
                <p className="text-gray-500 text-sm">
                  Create your first session to start collaborating
                </p>
              </div>
            )}

            {/* Sessions List */}
            {!loading && !error && sessionList.length > 0 && (
              <div className="divide-y divide-[#1f2937]">
                {sessionList.map((session) => (
                  <div
                    key={session.id}
                    className="flex justify-between items-center py-4 hover:bg-[#1a1f2a] transition-colors rounded-lg px-3"
                  >
                    <div className="flex flex-col gap-1">
                      <h3 className="font-medium">{session.name}</h3>
                      {session.description && (
                        <p className="text-sm text-gray-500">
                          {session.description}
                        </p>
                      )}
                      <p className="text-sm text-gray-400">
                        {session.language} • {session.collaborators}{" "}
                        collaborator{session.collaborators > 1 ? "s" : ""} •{" "}
                        {session.time}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {session.status === "Live" && (
                        <span className="flex items-center text-green-400 text-sm font-medium">
                          <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                          Live
                        </span>
                      )}

                      <Button
                        text="Open"
                        backgroundColor="bg-transparent"
                        color="text-blue-400"
                        className="text-sm hover:text-blue-300"
                        onClick={() => router.push(`/editor/${session._id}`)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        <CreateSessionModal
          isOpen={open}
          onClose={() => setOpen(false)}
          onSuccess={handleSessionCreated}
        />
      </div>
    </main>
  );
}
