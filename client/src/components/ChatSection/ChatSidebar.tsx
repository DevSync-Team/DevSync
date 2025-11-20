"use client";
import { ChatSidebarProps } from "@/types/chats.types";
import React, { useState, useRef, useEffect } from "react";

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chatMessages,
  onSendMessage,
}) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="w-full h-full bg-[#1c2536] border-l border-[#313244] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[#313244]">
        <p className="text-sm text-gray-300">
          💬 <span className="text-blue-400 font-medium">Team Chat:</span>{" "}
          collaborate and share ideas here.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-[#45475a] scrollbar-track-transparent">
        {chatMessages.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          chatMessages.map((msg) => (
            <div key={msg.id} className="space-y-1">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 ${msg.avatar} rounded-full flex items-center justify-center text-sm font-medium text-white`}
                >
                  {msg.user[0]}
                </div>
                <span className="text-sm font-medium text-gray-200">
                  {msg.user}
                </span>
                <span className="text-xs text-gray-500">{msg.time}</span>
              </div>

              {msg.isCode ? (
                <div className="ml-10 p-3 bg-[#3b475d] rounded-lg border border-[#313244]">
                  <div className="text-sm font-medium mb-2 text-blue-400">
                    Code Snippet
                  </div>
                  <pre className="text-xs font-mono text-gray-300 overflow-x-auto">
                    {msg.message}
                  </pre>
                </div>
              ) : (
                <p className="ml-10 text-sm text-gray-300 leading-snug">
                  {msg.message}
                </p>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-[#313244] bg-[#1c2536]">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 bg-[#3b475d] border border-[#313244] rounded text-sm focus:outline-none focus:border-blue-500 text-gray-200 placeholder-gray-500 resize-none h-12"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white rounded text-sm font-medium transition"
          >
            Send
          </button>
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <p>
            Press <span className="text-gray-300">Enter</span> to send.{" "}
            <span className="text-gray-300">Shift+Enter</span> for new line.
          </p>
          <p>{input.length}/500</p>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
