"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Message {
  id: string;
  sender: "user" | "electrician";
  content: string;
  timestamp: string;
  senderName: string;
  senderAvatar: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "electrician",
      content: "Hi, I'm John Electrician. I'm on my way to your location!",
      timestamp: "10:35 AM",
      senderName: "John Electrician",
      senderAvatar: "J",
    },
    {
      id: "2",
      sender: "user",
      content:
        "Great! Thank you. How long until you arrive?",
      timestamp: "10:36 AM",
      senderName: "You",
      senderAvatar: "C",
    },
    {
      id: "3",
      sender: "electrician",
      content:
        "About 15-20 minutes. I'm currently about 5 km away. Weather is good.",
      timestamp: "10:36 AM",
      senderName: "John Electrician",
      senderAvatar: "J",
    },
    {
      id: "4",
      sender: "user",
      content: "Perfect! I'll be waiting at the entrance.",
      timestamp: "10:37 AM",
      senderName: "You",
      senderAvatar: "C",
    },
    {
      id: "5",
      sender: "electrician",
      content: "See you soon! 👍",
      timestamp: "10:37 AM",
      senderName: "John Electrician",
      senderAvatar: "J",
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message: Message = {
        id: (messages.length + 1).toString(),
        sender: "user",
        content: newMessage,
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        senderName: "You",
        senderAvatar: "C",
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 border-b border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 sm:px-6">
        <div className="flex items-center gap-3 flex-1">
          <Link
            href="/dashboard"
            className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.5858 3.58579C11.3668 2.80474 12.6332 2.80474 13.4142 3.58579L20.4142 10.5858C21.1953 11.3668 21.1953 12.6332 20.4142 13.4142L13.4142 20.4142C12.6332 21.1953 11.3668 21.1953 10.5858 20.4142C9.80474 19.6332 9.80474 18.3668 10.5858 17.5858L15.1716 13H4C2.89543 13 2 12.1046 2 11C2 9.89543 2.89543 9 4 9H15.1716L10.5858 4.41421C9.80474 3.63316 9.80474 2.36684 10.5858 1.58579Z"
                fill="currentColor"
              />
            </svg>
          </Link>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold text-gray-800 dark:text-white truncate">
              Chat with John Electrician
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              Request REQ-001 • Power outage issue
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors" title="Call">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1.33371 4.34161C1.33371 3.38004 2.00036 2.56654 2.93026 2.50289C5.3707 2.33446 9.50416 3.36231 12.5263 6.38442C15.5484 9.40653 16.5763 13.5401 16.4078 15.9805C16.3442 16.9104 15.5307 17.577 14.5691 17.577C14.0223 17.577 13.5328 17.3051 13.2752 16.8787L11.6897 13.6742C11.4321 13.2478 11.6348 12.674 12.1041 12.4717L13.8197 11.6725C13.4175 10.1944 12.5852 8.77348 11.3937 7.5819C10.2022 6.39032 8.78126 5.55807 7.30318 5.15588L6.50396 6.87145C6.30169 7.34069 5.72795 7.54343 5.30159 7.28582L2.09715 5.70036C1.67078 5.44275 1.39886 4.95328 1.33371 4.34161Z"
                fill="currentColor"
              />
            </svg>
          </button>
          <button className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors" title="Info">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM13 17C13 17.5523 12.5523 18 12 18C11.4477 18 11 17.5523 11 17C11 16.4477 11.4477 16 12 16C12.5523 16 13 16.4477 13 17ZM12 7C11.4477 7 11 7.44772 11 8V13C11 13.5523 11.4477 14 12 14C12.5523 14 13 13.5523 13 13V8C13 7.44772 12.5523 7 12 7Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 sm:px-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex gap-3 max-w-xs sm:max-w-sm ${
                message.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 text-xs font-semibold ${
                  message.sender === "user"
                    ? "bg-brand-500 text-white"
                    : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                }`}
              >
                {message.senderAvatar}
              </div>

              {/* Message Content */}
              <div className={message.sender === "user" ? "text-right" : ""}>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                  {message.senderName}
                </p>
                <div
                  className={`px-4 py-2.5 rounded-lg shadow-theme-xs ${
                    message.sender === "user"
                      ? "bg-brand-500 text-white"
                      : "bg-white text-gray-800 border border-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                  {message.timestamp}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-900 sm:px-6">
        <form onSubmit={handleSendMessage} className="flex gap-2.5">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 h-11 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90 dark:placeholder-gray-500 dark:focus:border-brand-800"
            autoFocus
          />
          <button
            type="submit"
            className="flex items-center justify-center w-11 h-11 rounded-lg bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            disabled={!newMessage.trim()}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.198 0.896L1.701 8.75C0.95504 9.09 0.824038 10.05 1.80404 10.84C2.65404 11.15 6.30304 12.33 7.15404 16.01C7.35304 16.92 8.39404 17.28 9.18904 16.62L11.613 14.5L15.283 17.52C15.817 17.95 16.671 17.96 17.211 17.54C17.751 17.12 18.012 16.34 17.812 15.63L2.59904 1.23C2.24904 0.67 1.52104 0.48 0.976038 0.65C0.421038 0.82 0.108038 1.47 0.285038 2.09L15.498 16.49C15.817 16.81 16.348 16.81 16.667 16.49C16.986 16.17 16.986 15.63 16.667 15.31L2.10204 1.79L18.198 0.896Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
