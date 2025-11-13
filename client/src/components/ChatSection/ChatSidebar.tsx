"use client";
import React from "react";

interface ChatMessage {
  id: number;
  user: string;
  message: string;
  time: string;
  avatar: string;
  isCode?: boolean;
}

interface ChatSidebarProps {
  chatMessages: ChatMessage[];
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ chatMessages }) => {
  return (
    <div className="w-96 bg-[#1e1e2e] border-l border-[#313244] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[#313244]">
        <p className="text-sm text-gray-300">
          💬 <span className="text-blue-400 font-medium">Team Chat:</span> collaborate and share ideas here.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-[#45475a] scrollbar-track-transparent">
        {chatMessages.map((msg) => (
          <div key={msg.id} className="space-y-1">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 ${msg.avatar} rounded-full flex items-center justify-center text-sm font-medium`}
              >
                {msg.user[0]}
              </div>
              <span className="text-sm font-medium text-gray-200">{msg.user}</span>
            </div>

            {msg.isCode ? (
              <div className="ml-10 p-3 bg-[#181825] rounded-lg border border-[#313244]">
                <div className="text-sm font-medium mb-2 text-blue-400">Code Snippet</div>
                <pre className="text-xs font-mono text-gray-300 overflow-x-auto">
{`function validateInput(data) {
  if (!data || typeof data !== 'object') {
    return false;
  }
  return true;
}`}
                </pre>
              </div>
            ) : (
              <p className="ml-10 text-sm text-gray-300 leading-snug">{msg.message}</p>
            )}

            <span className="ml-10 text-xs text-gray-500">{msg.time}</span>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-[#313244] bg-[#181825]">
        <input
          type="text"
          placeholder="Type a message..."
          className="w-full px-3 py-2 bg-[#1e1e2e] border border-[#313244] rounded text-sm focus:outline-none focus:border-blue-500 text-gray-200 placeholder-gray-500"
        />
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <p>Press <span className="text-gray-300">Enter</span> to send. <span className="text-gray-300">Shift+Enter</span> for new line.</p>
          <p>0/500</p>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
