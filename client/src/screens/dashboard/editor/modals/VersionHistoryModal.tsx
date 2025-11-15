"use client";

import Modal from "./Modal";
import { X } from "lucide-react";

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VersionHistoryModal({
  isOpen,
  onClose,
}: VersionHistoryModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center py-2">
          <h2 className="text-xl font-semibold">Version History</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-300 hover:text-white" />
          </button>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-white font-semibold text-lg ">Code Snapshots</p>
          <span className="text-gray-400 text-sm">1 Snapshot</span>
        </div>
        <div className="bg-[#3a475f] p-4 rounded-lg cursor-pointer hover:bg-[#263346] transition">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 rounded-full w-10 h-10 flex items-center justify-center font-bold">
              J
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-medium">
                John Doe <span className="font-light">(Current)</span>
              </h3>
              <p className="text-sm text-white">Initial project setup</p>
              <p className="text-sm text-gray-400">1 hour ago • 1 file</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
