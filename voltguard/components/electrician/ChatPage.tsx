"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { faultAPI, chatAPI } from "@/lib/api";

interface Message {
  id: string;
  sender: "user" | "contact";
  content: string;
  timestamp: string;
  senderName: string;
  sender_type?: "consumer" | "electrician";
  sender_id?: string;
}

interface RequestDetails {
  id: string;
  consumer_id: string;
  title: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  priority: string;
  photo_url?: string;
  status: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

export default function ChatPage({ requestId }: { requestId: string }) {
  const [requestDetails, setRequestDetails] = useState<RequestDetails | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    // Check if user is electrician
    const checkRole = async () => {
      try {
        const token = localStorage.getItem("voltguard_token");
        if (!token) {
          window.location.href = "/auth/signin";
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/api/auth/me`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          window.location.href = "/auth/signin";
          return;
        }

        const user = await response.json();
        if (user.role !== "electrician") {
          setError("Only electricians can access this page");
          setTimeout(() => {
            window.location.href = "/consumer/dashboard";
          }, 2000);
          return;
        }

        fetchRequestDetails();
      } catch (err) {
        console.error("Error checking role:", err);
        window.location.href = "/auth/signin";
      }
    };

    checkRole();
  }, [requestId]);

  // Poll for messages every 10 seconds (less visible refresh)
  useEffect(() => {
    let shouldStopPolling = false;
    
    const pollMessages = async () => {
      if (shouldStopPolling) return;
      
      try {
        const response = await chatAPI.getMessages(requestId);
        const formattedMessages = response.messages.map((msg: any) => ({
          id: msg.id,
          sender: msg.sender_type === "electrician" ? "user" : "contact",
          content: msg.content,
          timestamp: new Date(msg.created_at).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          senderName: msg.sender_type === "electrician" ? "You" : "Consumer",
          sender_type: msg.sender_type,
          sender_id: msg.sender_id,
        }));
        
        // Only update state if messages actually changed (prevent flickering)
        setMessages((prevMessages) => {
          const oldJson = JSON.stringify(prevMessages.map(m => m.id));
          const newJson = JSON.stringify(formattedMessages.map(m => m.id));
          return oldJson === newJson ? prevMessages : formattedMessages;
        });
      } catch (err: any) {
        // Stop polling if we get a 404 (request doesn't exist)
        if (err.message && err.message.includes("404")) {
          shouldStopPolling = true;
          console.warn("Request not found, stopping message polling");
        } else {
          console.error("Error fetching messages:", err);
        }
      }
    };

    // Initial fetch after a short delay
    const initialTimer = setTimeout(() => pollMessages(), 500);
    
    // Poll every 10 seconds
    const interval = setInterval(pollMessages, 10000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
      shouldStopPolling = true;
    };
  }, [requestId]);

  // Only scroll when new messages arrive or on first load
  useEffect(() => {
    // Only auto-scroll if messages actually increased (new message added)
    if (messages.length > messageCount || !hasInitializedRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      hasInitializedRef.current = true;
      setMessageCount(messages.length);
    }
  }, [messages, messageCount]);

  const fetchRequestDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Fetch the request using electrician endpoint
      const response = await faultAPI.getAllFaultRequests("assigned");
      const request = response.requests.find((r: any) => r.id === requestId);

      if (!request) {
        setError("Request not found");
        return;
      }

      setRequestDetails(request as RequestDetails);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load request";
      console.error("Error fetching request:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setIsSending(true);
      await chatAPI.sendMessage(requestId, newMessage);
      setNewMessage("");
      
      // Fetch messages immediately after sending to show the message without waiting for polling
      const response = await chatAPI.getMessages(requestId);
      const formattedMessages = response.messages.map((msg: any) => ({
        id: msg.id,
        sender: msg.sender_type === "electrician" ? "user" : "contact",
        content: msg.content,
        timestamp: new Date(msg.created_at).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        senderName: msg.sender_type === "electrician" ? "You" : "Consumer",
        sender_type: msg.sender_type,
        sender_id: msg.sender_id,
      }));
      
      // Always update after send (don't skip comparison)
      setMessages(formattedMessages);
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleMarkCompleted = async () => {
    try {
      await faultAPI.updateFaultStatus(requestId, {
        status: "resolved",
      });
      window.dispatchEvent(
        new Event("session-completed")
      );
      window.location.href = "/electrician/dashboard";
    } catch (err) {
      console.error("Error marking as completed:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">Loading chat...</p>
      </div>
    );
  }

  if (error || !requestDetails) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900 px-4">
        <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Error
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error || "Request not found"}
          </p>
          <Link
            href="/electrician/dashboard"
            className="inline-block px-4 py-2 text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 rounded-lg"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const priorityColors: { [key: string]: string } = {
    critical: "text-red-600 dark:text-red-400",
    high: "text-orange-600 dark:text-orange-400",
    medium: "text-yellow-600 dark:text-yellow-400",
    low: "text-green-600 dark:text-green-400",
  };

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <Link
              href="/electrician/dashboard"
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
                  d="M19 12H5M12 19l-7-7 7-7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <div>
              <h3 className="text-base font-semibold text-gray-800 dark:text-white">
                {requestDetails.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Consumer Service Request
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 dark:bg-gray-900/50">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 dark:text-gray-400">
                No messages yet. Start the conversation!
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.sender === "contact" && (
                  <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-200 font-semibold text-sm flex-shrink-0">
                    C
                  </div>
                )}
                <div
                  className={`max-w-md ${
                    message.sender === "user" ? "text-right" : ""
                  }`}
                >
                  <div
                    className={`inline-block px-4 py-3 rounded-lg ${
                      message.sender === "user"
                        ? "bg-brand-500 text-white"
                        : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <form onSubmit={handleSendMessage} className="flex items-center gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              disabled={isSending}
              className="flex-1 h-11 px-4 text-sm bg-white border border-gray-300 rounded-lg placeholder:text-gray-500 focus:outline-none focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || isSending}
              className="w-10 h-10 flex items-center justify-center bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.3332 1.66663L9.1665 10.8333M18.3332 1.66663L12.4998 18.3333L9.1665 10.8333M18.3332 1.66663L1.6665 7.49996L9.1665 10.8333"
                  stroke="currentColor"
                  strokeWidth="1.67"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* Request Details Sidebar */}
      <div className="w-80 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            📋 Request Details
          </h3>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold mb-2">
              Title
            </p>
            <p className="text-sm font-semibold text-gray-800 dark:text-white">
              {requestDetails.title}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold mb-2">
              Description
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {requestDetails.description}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold mb-2">
              Location
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              📍 {requestDetails.location}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold mb-2">
              Priority
            </p>
            <p className={`text-sm font-semibold ${
              priorityColors[requestDetails.priority] || "text-gray-600"
            }`}>
              {requestDetails.priority.toUpperCase()}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold mb-2">
              Status
            </p>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
              <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                Assigned
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-semibold mb-2">
              Created
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {new Date(requestDetails.created_at).toLocaleDateString()} at{" "}
              {new Date(requestDetails.created_at).toLocaleTimeString()}
            </p>
          </div>

          <button
            onClick={handleMarkCompleted}
            className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
          >
            ✓ Mark as Completed
          </button>
        </div>
      </div>
    </div>
  );
}
