"use client";

import { Button, TextInput } from "@/components";
import React, { useState } from "react";
import { FaCode } from "react-icons/fa";
import api from "@/utils/api";

interface CreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // Callback to refresh dashboard
}

const languages = ["javascript", "typescript", "python", "java"];

export default function CreateSessionModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateSessionModalProps) {
  const [sessionName, setSessionName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!sessionName || !selectedLang) {
      setError("Please provide a session name and select a language");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await api.post("/api/sessions", {
        name: sessionName,
        description: description || undefined,
        language: selectedLang,
      });

      console.log("Session created:", res.data);

      // Reset form
      setSessionName("");
      setDescription("");
      setSelectedLang(null);
      
      // Call success callback to refresh dashboard
      onSuccess();
    } catch (err: any) {
      console.error("Failed to create session:", err);
      setError(
        err.response?.data?.message || 
        "Failed to create session. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSessionName("");
    setDescription("");
    setSelectedLang(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="flex flex-col gap-5 bg-[#121a25] border border-[#1f2937] rounded-2xl w-full max-w-[500px] p-6 shadow-xl relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold text-white">
            Create New Session
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-200 text-2xl leading-none"
            disabled={loading}
          >
            ✕
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Session Name */}
        <TextInput
          label="Session Name"
          placeholder="e.g., My Coding Project"
          value={sessionName}
          onChange={(e) => setSessionName(e.target.value)}
          disabled={loading}
        />

        {/* Description (Optional) */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-300 text-sm">
            Description <span className="text-gray-500">(optional)</span>
          </label>
          <textarea
            placeholder="What is this session about?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            className="bg-[#242e46] text-white border border-[#1f2937] rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 resize-none"
            rows={3}
          />
        </div>

        {/* Languages */}
        <div className="flex flex-col gap-3">
          <p className="text-gray-300 text-sm">Programming Language</p>
          <div className="grid grid-cols-2 gap-3">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLang(lang)}
                disabled={loading}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border transition-all capitalize
                  ${
                    selectedLang === lang
                      ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20"
                      : "bg-[#242e46] text-gray-300 border-[#1f2937] hover:bg-[#2a3548] hover:border-gray-600"
                  }
                  ${loading ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                <FaCode className="text-sm" /> {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg font-medium text-gray-300 border border-gray-600 hover:bg-gray-700/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            disabled={!sessionName || !selectedLang || loading}
            className={`px-5 py-2 rounded-lg font-medium transition flex items-center gap-2
              ${
                sessionName && selectedLang && !loading
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/20"
                  : "bg-gray-700 text-gray-500 cursor-not-allowed"
              }`}
          >
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            {loading ? "Creating..." : "Create Session"}
          </button>
        </div>
      </div>
    </div>
  );
}