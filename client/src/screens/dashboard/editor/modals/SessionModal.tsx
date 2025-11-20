import React, { useState } from "react";
import { Copy, X, Share2, Check } from "lucide-react";

interface ShareSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionUrl?: string;
}

export default function ShareSessionModal({
  isOpen,
  onClose,
  sessionUrl = "https://readdy.link/editor/nudefined",
}: ShareSessionModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(sessionUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50">
      <div className="bg-[#0f1624] rounded-lg w-full max-w-md mx-4 border border-[#242f46] flex flex-col gap-5 p-4">
        {/* Header */}
        <div className="flex items-center justify-between p-2 border-b border-[#313244]">
          <h2 className="text-xl font-semibold text-white">Share Session</h2>

          <button
            onClick={onClose}
            className="p-2 hover:bg-[#313244] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className=" flex flex-col gap-3 justify-center align-middle items-start">
          <p className="text-gray-300 text-sm leading-relaxed">
            Share this session URL with your collaborators:
          </p>

          {/* URL Box */}
          <div className="flex gap-2">
          <div className="bg-[#111827] border border-[#313244] rounded-lg p-3">
            <p className="text-blue-400 text-sm font-mono break-all">
              {sessionUrl}
            </p>
            </div>
              <button
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-2 flex-1 px-4 py-2 bg-linear-to-r from-blue-500 to-cyan-300 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
          </div>

          <p className="text-gray-400 text-xs leading-relaxed">
            Anyone with this link can join your coding session.
          </p>
        </div>

     
      </div>
    </div>
  );
}
