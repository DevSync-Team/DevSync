"use client";

import React from "react";

interface CodeEditorProps {
  code: string;
  setCode: (value: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, setCode }) => {
  return (
    <div className="flex-1 relative bg-[#1e1e2e] text-gray-100">
      {/* Scrollable Editor */}
      <div className="h-full overflow-y-auto">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full min-h-full p-4 bg-transparent font-mono text-sm resize-none focus:outline-none"
          style={{
            tabSize: 2,
            lineHeight: "1.6",
            caretColor: "#fff",
          }}
          spellCheck="false"
        />
      </div>

      {/* Bottom Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-[#181825] border-t border-[#313244] flex items-center justify-between text-xs text-gray-400">
        <span>Line 9, Column 54</span>
        <span className="text-gray-300">JAVASCRIPT</span>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            2 active
          </span>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
