"use client";
import React, { useState } from "react";
import Image from "next/image";

interface Message {
  id: string;
  sender: "electrician" | "consumer";
  text: string;
  timestamp: string;
}

export default function ActiveSession() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "consumer",
      text: "Hi, the circuit breaker in my house keeps tripping every few hours",
      timestamp: "10:30 AM",
    },
    {
      id: "2",
      sender: "electrician",
      text: "Hello! I can help you with that. Can you send me a photo of your circuit breaker panel?",
      timestamp: "10:32 AM",
    },
    {
      id: "3",
      sender: "consumer",
      text: "Sure, I've uploaded the photo",
      timestamp: "10:35 AM",
    },
    {
      id: "4",
      sender: "electrician",
      text: "Thanks! I can see the issue. I'll be at your location in 15 minutes to fix this.",
      timestamp: "10:37 AM",
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [activeRequest] = useState({
    consumerName: "John Doe",
    location: "123 Main St, Coimbatore",
    description: "Main circuit breaker keeps tripping",
    faultImage: "/images/product/product-01.jpg",
  });

  const sendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: "electrician",
        text: inputMessage,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, newMessage]);
      setInputMessage("");
    }
  };

  const handleEndSession = () => {
    console.log("Ending session");
    // TODO: Implement end session logic
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                💬 Active Session
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {activeRequest.consumerName}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block size-2 rounded-full bg-success-500 animate-pulse"></span>
              <span className="text-sm font-medium text-success-600 dark:text-success-400">
                Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
            <svg
              className="size-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {activeRequest.location}
          </div>
        </div>
      </div>

      {/* Fault Photo */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Reported Issue:
        </p>
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
          {activeRequest.description}
        </p>
        <div className="relative w-full overflow-hidden bg-gray-100 rounded-lg h-44 dark:bg-gray-800">
          <Image
            src={activeRequest.faultImage}
            alt="Fault photo"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Chat Messages */}
      <div className="h-72 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "electrician" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-4 py-2.5 ${
                message.sender === "electrician"
                  ? "bg-brand-500 text-white"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p
                className={`mt-1 text-xs ${
                  message.sender === "electrician"
                    ? "text-white/70"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2.5 text-sm rounded-lg border border-gray-300 bg-white focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2.5 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600 transition-colors"
          >
            <svg
              className="size-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>

        <button
          onClick={handleEndSession}
          className="w-full px-4 py-2.5 text-sm font-medium text-white rounded-lg bg-error-500 hover:bg-error-600 transition-colors"
        >
          End Session
        </button>
      </div>
    </div>
  );
}
