"use client";

import { Button, TextInput } from "@/components";
import React, { useState } from "react";
import { FaCode } from "react-icons/fa";

interface CreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (session: { name: string; language: string }) => void;
}

const languages = ["Javascript", "Typescript", "Python", "Java"];

export default function CreateSessionModal({
  isOpen,
  onClose,
  onCreate,
}: CreateSessionModalProps) {
  const [sessionName, setSessionName] = useState("");
  const [selectedLang, setSelectedLang] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!sessionName || !selectedLang) return;

    onCreate({
      name: sessionName,
      language: selectedLang,
    });

    setSessionName("");
    setSelectedLang(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="flex flex-col gap-5 bg-[#121a25] border border-[#1f2937] rounded-2xl w-[90%] sm:w-[450px] p-6 shadow-xl relative">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Create New Session</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200 text-xl">✕</button>
        </div>

        {/* Name input */}
        <TextInput
          label="Session Name"
          placeholder="Enter session name"
          value={sessionName}
          onChange={(e) => setSessionName(e.target.value)}
        />

        {/* Language selection */}
        <div className="flex flex-col gap-3">
          <p className="text-gray-300 text-sm">Programming Language</p>
          <div className="grid grid-cols-2 gap-3">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLang(lang)}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border transition-all
                  ${
                    selectedLang === lang
                      ? "bg-blue-600 text-white border-blue-500"
                      : "bg-[#242e46] text-gray-300 border-[#1f2937] hover:bg-[#232938]"
                  }`}
              >
                <FaCode className="text-sm" /> {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <Button text="Cancel" outline color="text-white" onClick={onClose} />

          <button
            onClick={handleCreate}
            disabled={!sessionName || !selectedLang}
            className={`px-4 py-2 rounded-lg font-medium transition
              ${
                sessionName && selectedLang
                  ? "bg-linear-to-r from-blue-600 to-cyan-500 hover:opacity-90 text-white"
                  : "bg-gray-700 text-gray-500 cursor-not-allowed"
              }`}
          >
            Create Session
          </button>
        </div>
      </div>
    </div>
  );
}
