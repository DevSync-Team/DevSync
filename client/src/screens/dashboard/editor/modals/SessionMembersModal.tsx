"use client";

import React from "react";
import Modal from "./Modal";
import { X, Link2 } from "lucide-react";
import { SessionMembersModalProps } from "../interface/interface";

export default function SessionMembersModal({
  isOpen,
  onClose,
  members,
  sessionId,
  sessionDate,
  onRoleChange,
  onRemoveMember,
  onCopyLink,
}: SessionMembersModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Session Members</h2>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Active Members Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-white">
          Active Members ({members.length})
        </h3>

        <button
          onClick={onCopyLink}
          className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
        >
          <Link2 className="w-4 h-4" />
          Copy Link
        </button>
      </div>

      {/* Members List */}
      <div className="space-y-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="bg-slate-700 rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: member.avatar }}
                >
                  {member.name.charAt(0).toUpperCase()}
                </div>

                {member.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-700" />
                )}
              </div>

              {/* Member info */}
              <div>
                <div className="text-white font-medium">{member.name}</div>
                <div className="text-slate-400 text-sm">{member.email}</div>
              </div>
            </div>

            {/* Role actions */}
            <div className="flex items-center gap-2">
              {member.role === "host" ? (
                <span className="px-3 py-1 bg-purple-600 text-white text-xs rounded-md font-medium">
                  host
                </span>
              ) : (
                <>
                  <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-md font-medium">
                    {member.role}
                  </span>

                  <select
                    title="User role"
                    value={member.role}
                    onChange={(e) =>
                      onRoleChange(
                        member.id,
                        e.target.value as "editor" | "viewer"
                      )
                    }
                    className="bg-slate-600 text-white text-xs px-2 py-1 rounded border border-slate-500 focus:outline-none focus:border-blue-500"
                  >
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>

                  <button
                    onClick={() => onRemoveMember(member.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-slate-700 text-sm text-slate-400">
        Session created {sessionDate} • ID: {sessionId}
      </div>
    </Modal>
  );
}
