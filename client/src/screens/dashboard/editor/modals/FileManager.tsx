"use client";
import React, { useState } from "react";
import { FileCode, Plus, Minus } from "lucide-react";

export interface FileItem {
  id: string;
  name: string;
  content: string;
}
interface FileManagerProps {
  files: FileItem[];
  activeFileId: string;
  onCreateFile: (name: string) => void;
  onSelectFile: (id: string) => void;
  onDeleteFile: (id: string) => void;
}

export default function FileManager({
  files,
  activeFileId,
  onCreateFile,
  onSelectFile,
  onDeleteFile,
}: FileManagerProps) {
  const [newFileName, setNewFileName] = useState("");

  const handleCreate = () => {
    if (!newFileName.trim()) return;
    onCreateFile(newFileName.trim());
    setNewFileName("");
  };

  return (
    <div className="w-full lg:w-64 bg-[#1c2536] border-b lg:border-b-0 lg:border-r border-[#3e3e42] flex flex-col">
      
      {/* Header */}
      <div className="p-3 flex justify-between items-center bg-[#232c3e] border-b border-[#3e3e42]">
        <span className="text-sm font-semibold">Files</span>

        <button
          onClick={handleCreate}
          disabled={!newFileName.trim()}
          className="p-1 rounded hover:bg-[#2d3748] disabled:opacity-50"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* File Input */}
      <div className="px-3 py-2">
        <input
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
          placeholder="New file name (no extension)"
          className="w-full text-sm px-2 py-1 rounded bg-[#111827] border border-[#374151] text-gray-200"
        />
      </div>

      {/* File List */}
      <div className="flex-1 overflow-auto px-2 py-2 space-y-1">
        {files.map((file) => (
          <div
            key={file.id}
            className={`flex items-center justify-between group px-2 py-1 rounded cursor-pointer ${
              activeFileId === file.id ? "bg-[#2d3748]" : "hover:bg-[#2d3748]"
            }`}
          >
            <div
              onClick={() => onSelectFile(file.id)}
              className="flex items-center gap-2"
            >
              <FileCode size={16} className="text-blue-400" />
              <span className="text-sm">{file.name}</span>
            </div>

            <button
              onClick={() => onDeleteFile(file.id)}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400"
            >
              <Minus size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
