"use client";

import React, { useState } from "react";
import Modal from "./Modal";
import { X, Mail } from "lucide-react";
import { InviteCollaboratorModalProps } from "../interface/interface";



export default function InviteCollaboratorModal({
  isOpen,
  onClose,
  onInvite,
}: InviteCollaboratorModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"editor" | "viewer">("editor");

  const submit = () => {
    if (!email) return;
    onInvite(email, role);
    setEmail("");
    setRole("editor");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Invite Collaborator</h2>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Email Input */}
      <div>
        <label className="block text-white font-medium mb-2">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="email"
            placeholder="colleague@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-700 text-white pl-10 pr-4 py-3 rounded-lg border border-slate-600 
                       focus:outline-none focus:border-blue-500 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Role Selection */}
      <div className="mt-6">
        <label className="block text-white font-medium mb-3">Role</label>

        <div className="space-y-3">
          {/* Editor */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="radio"
              name="role"
              value="editor"
              checked={role === "editor"}
              onChange={() => setRole("editor")}
              className="mt-1 w-4 h-4 bg-slate-700 border-slate-600 text-blue-600"
            />
            <div>
              <div className="text-white font-medium group-hover:text-blue-400 transition-colors">
                Editor
              </div>
              <div className="text-slate-400 text-sm">Can edit code and run executions</div>
            </div>
          </label>

          {/* Viewer */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="radio"
              name="role"
              value="viewer"
              checked={role === "viewer"}
              onChange={() => setRole("viewer")}
              className="mt-1 w-4 h-4 bg-slate-700 border-slate-600 text-blue-600"
            />
            <div>
              <div className="text-white font-medium group-hover:text-blue-400 transition-colors">
                Viewer
              </div>
              <div className="text-slate-400 text-sm">Can only view code and chat</div>
            </div>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-3 bg-slate-700 rounded-lg hover:bg-slate-600 font-medium"
        >
          Cancel
        </button>

        <button
          onClick={submit}
          disabled={!email}
          className="flex-1 px-4 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
        >
          Send Invite
        </button>
      </div>
    </Modal>
  );
}
