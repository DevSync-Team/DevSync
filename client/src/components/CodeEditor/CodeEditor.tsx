"use client";

import React, { useRef, useEffect } from "react";
import CodeBlock from "../CodeBlock/CodeBlock";

interface CodeEditorProps {
  code: string;
  setCode: (value: string) => void;
  language?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  setCode,
  language = "js",
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  // Sync scroll between textarea and highlight block
  const syncScroll = () => {
    if (scrollRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = scrollRef.current.scrollTop;
      highlightRef.current.scrollLeft = scrollRef.current.scrollLeft;
    }
  };

  // Resize textarea height automatically (optional)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [code]);

  return (
    <div className="relative flex-1 bg-[#1e1e2e] text-gray-100 font-mono overflow-hidden rounded-md">
      {/* Highlighted code layer */}
      <div
        ref={highlightRef}
        className="absolute inset-0 p-4 overflow-auto pointer-events-none whitespace-pre-wrap"
        style={{ lineHeight: "1.6", tabSize: 2 }}
      >
        <CodeBlock code={code || " "} language={language} />
      </div>

      {/* Editable textarea layer */}
      <div
        ref={scrollRef}
        onScroll={syncScroll}
        className="absolute inset-0 overflow-auto"
      >
        <textarea
          title="Editor"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="w-full h-full p-4 font-mono text-sm bg-transparent resize-none focus:outline-none text-transparent caret-white"
          style={{
            lineHeight: "1.6",
            tabSize: 2,
            whiteSpace: "pre",
            outline: "none",
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
