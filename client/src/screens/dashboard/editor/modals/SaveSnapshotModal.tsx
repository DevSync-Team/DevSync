"use client";

import { X } from "lucide-react";
import Modal from "./Modal";
import { useState } from "react";
import { Button } from "@/components";

interface SaveSnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (message: string) => void;
}

export default function SaveSnapshotModal({
  isOpen,
  onClose,
  onSave,
}: SaveSnapshotModalProps) {
  const [message, setMessage] = useState("");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex justify-between items-center py-5">
        <h2 className="text-xl font-semibold">Save Code Snapshot</h2>
        <button onClick={onClose}>
          <X className="w-5 h-5 text-gray-300 hover:text-white" />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-normal">Snapshot Message</label>
        <textarea
          className="w-full h-24 bg-[#2d374aa2] text-white rounded-lg p-3 focus:outline-none focus:none"
          placeholder="Describe what changed in this version..."
          maxLength={200}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className=" text-gray-400 text-xs">
          {message.length}/200 characters
        </div>
      </div>

      <div className=" py-3 flex w-full gap-3">
        <Button
          text="Cancel"
          onClick={onClose}
          className=" w-full rounded-lg bg-transparent hover:bg-gray-700 text-sm"
        />

        <Button
          text="Save Snapshot"
          onClick={() => onSave(message)}
          className=" w-full rounded-lg bg-linear-to-r from-blue-600 to-cyan-300 text-sm"
        />
      </div>
    </Modal>
  );
}
