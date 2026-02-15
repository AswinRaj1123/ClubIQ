"use client";
import React, { useState, useEffect, useRef } from "react";
import { faultAPI } from "@/lib/api";
import Button from "../ui/button/Button";
import Link from "next/link";

interface Message {
  id: string;
  sender: "electrician" | "consumer";
  text: string;
  timestamp: string;
}

interface AssignedRequest {
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

export default function ActiveSession() {
  const [activeRequest, setActiveRequest] = useState<AssignedRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch assigned requests on component mount
  useEffect(() => {
    fetchAssignedRequests();
    // Refresh every 10 seconds to get new assigned requests
    const interval = setInterval(fetchAssignedRequests, 10000);
    
    // Listen for request acceptance event
    const handleRequestAccepted = () => {
      console.log("Request accepted event received, refreshing...");
      fetchAssignedRequests();
    };
    
    window.addEventListener("request-accepted", handleRequestAccepted as EventListener);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener("request-accepted", handleRequestAccepted as EventListener);
    };
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchAssignedRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await faultAPI.getAllFaultRequests("assigned");
      
      if (response.requests && response.requests.length > 0) {
        const assignedRequest = response.requests[0]; // Get first assigned request
        setActiveRequest(assignedRequest as AssignedRequest);
        
        // Load mock messages for now (in a real app, fetch from chat API)
        loadMockMessages();
      } else {
        setActiveRequest(null);
        setMessages([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load active session";
      console.error("Error fetching assigned requests:", errorMessage);
      // Don't set error state for network issues, just show empty state
    } finally {
      setIsLoading(false);
    }
  };

  const loadMockMessages = () => {
    // Initialize with a welcome message
    setMessages([
      {
        id: "welcome",
        sender: "electrician",
        text: "👋 Session started. You can now communicate with the consumer!",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  const sendMessage = () => {
    if (inputMessage.trim() && activeRequest) {
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
      
      // TODO: Send message to backend API for persistence
      // await chatAPI.sendMessage(activeRequest.id, inputMessage);
    }
  };

  const handleEndSession = async () => {
    if (!activeRequest) return;
    
    try {
      // Update request status to "completed"
      await faultAPI.updateFaultStatus(activeRequest.id, {
        status: "resolved",
        assigned_to: activeRequest.assigned_to,
      });
      
      console.log("Session ended");
      setActiveRequest(null);
      setMessages([]);
      
      // Dispatch event to notify RequestQueue
      window.dispatchEvent(new CustomEvent("session-completed", { detail: { requestId: activeRequest.id } }));
      
      // Refresh to show updated list
      setTimeout(() => {
        fetchAssignedRequests();
      }, 500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to end session";
      console.error("Error ending session:", errorMessage);
      alert(`Error: ${errorMessage}`);
    }
  };

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            💬 Active Session
          </h3>
        </div>
        <div className="p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">Loading active sessions...</p>
        </div>
      </div>
    );
  }

  if (!activeRequest) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            💬 Active Session
          </h3>
        </div>
        <div className="p-6 text-center py-12">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            No active sessions. Accept a request to start chatting with a consumer.
          </p>
        </div>
      </div>
    );
  }

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
                {activeRequest.title}
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

      {/* Request Details */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            📋 Request Details:
          </p>
          <span className={`text-xs px-2 py-1 rounded font-medium ${
            activeRequest.priority === "critical" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
            activeRequest.priority === "high" ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" :
            activeRequest.priority === "medium" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
            "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          }`}>
            {activeRequest.priority.toUpperCase()}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {activeRequest.description}
        </p>
        
        {activeRequest.photo_url && (
          <div className="mt-3">
            <button
              onClick={() => window.open(activeRequest.photo_url, '_blank')}
              className="text-xs text-brand-500 hover:text-brand-600 dark:text-brand-400 underline"
            >
              📷 View submitted photo
            </button>
          </div>
        )}
      </div>

      {/* Chat Messages */}
      <div className="h-64 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-800/30">
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
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
        <div className="flex gap-2">
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

        <Link href={`/electrician/chat/${activeRequest.id}`}>
          <Button 
            variant="secondary"
            className="w-full"
          >
            💬 Open Full Chat
          </Button>
        </Link>

        <Button
          onClick={handleEndSession}
          variant="outline"
          className="w-full text-error-600 dark:text-error-400"
        >
          ✓ Mark as Completed
        </Button>
      </div>
    </div>
  );
}
