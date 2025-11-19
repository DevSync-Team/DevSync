"use client";

import { Button } from "@/components";
import { sessions, stats } from "@/data/dashboard";
import { useState } from "react";
import { BiPlus } from "react-icons/bi";
import CreateSessionModal from "./modal/CreateSessionModal";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Code } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [sessionList, setSessionList] = useState(sessions);
  const handleCreate = (newSession: { name: string; language: string }) => {
    const session = {
      id: Date.now().toString(),
      name: newSession.name,
      language: newSession.language,
      collaborators: 1,
      time: "Just now",
      status: "Live" as const,
    };

    setSessionList([session, ...sessionList]);
    setOpen(false);
  };

  return (
    <main className="flex flex-col ">
      <div className=" flex flex-col sm:flex-row  text-white sm:items-center sm:justify-between gap-2 px-3 sm:px-4 py-2 bg-[#111827] border-b border-[#3e3e42]">
        <div className="flex px-4">
          <Link href={"/"} className="flex items-center gap-2">
          <div 
            className="bg-linear-to-r from-blue-500  to-cyan-400 text-white p-2 rounded-md text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all shadow-sm hover:shadow-md"
          >
            <Code/>
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
            className="bg-linear-to-r from-blue-500  to-cyan-400 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all shadow-sm hover:shadow-md"
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
              backgroundColor=" bg-linear-to-r from-blue-500 to-cyan-400"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-[#111827] border border-[#1f2937] rounded-xl p-6 flex items-center justify-between shadow-md"
              >
                <div className="flex flex-col gap-1">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </div>
                <div
                  className={`p-3 bg-[#1f2937] rounded-lg ${stat.iconColor}`}
                >
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>

          {/* Recent Sessions */}
          <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-6 shadow-md">
            <h2 className="text-lg font-semibold py-4 border-b-[0.5px] border-[#1f2937] ">
              Recent Sessions
            </h2>

            <div className="divide-y divide-[#1f2937]">
              {sessionList.map((session) => (
                <div
                  key={session.id}
                  className="flex justify-between items-center py-4 hover:bg-[#1a1f2a] transition-colors rounded-lg px-3"
                >
                  <div className="flex flex-col gap-1">
                    <h3 className="font-medium">{session.name}</h3>
                    <p className="text-sm text-gray-400 ">
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

                    <Button
                      text="Open"
                      backgroundColor="bg-transparent"
                      color="text-blue-400"
                      className="text-sm"
                      onClick={() => router.push(`/editor/${session.id}`)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal */}
        <CreateSessionModal
          isOpen={open}
          onClose={() => setOpen(false)}
          onCreate={handleCreate}
        />
      </div>
    </main>
  );
}
