"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import React from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
}

const customStyle: React.CSSProperties = {
  background: "transparent", // prevents overlay blocking
  margin: 0,
  padding: 0,
  tabSize: 2,
  lineHeight: "1.6",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};

export default function CodeBlock({
  code,
  language = "jsx",
}: CodeBlockProps) {
  return (
    <SyntaxHighlighter
      language={language}
      style={vscDarkPlus}
      customStyle={customStyle}
      showLineNumbers={false}
      wrapLines={true}
    >
      {code}
    </SyntaxHighlighter>
  );
}
