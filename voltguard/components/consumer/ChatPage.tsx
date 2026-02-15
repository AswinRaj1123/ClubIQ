"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { faultAPI, chatAPI } from "@/lib/api";

interface Contact {
  id: string;
  name: string;
  role: string;
  avatar: string;
  lastSeen: string;
  online: boolean;
}

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

export default function ChatPage({ requestId }: { requestId?: string }) {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [requestDetails, setRequestDetails] = useState<RequestDetails | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(!!requestId);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitializedRef = useRef(false);

  const [contacts] = useState<Contact[]>([
    {
      id: "1",
      name: "Kaiya George",
      role: "Project Manager",
      avatar: "/images/user/user-01.png",
      lastSeen: "15 mins",
      online: true,
    },
    {
      id: "2",
      name: "Lindsey Curtis",
      role: "Designer",
      avatar: "/images/user/user-02.png",
      lastSeen: "30 mins",
      online: true,
    },
    {
      id: "3",
      name: "Zain Geidt",
      role: "Content Writer",
      avatar: "/images/user/user-03.png",
      lastSeen: "45 mins",
      online: true,
    },
    {
      id: "4",
      name: "Carla George",
      role: "Front-end Developer",
      avatar: "/images/user/user-04.png",
      lastSeen: "2 days",
      online: false,
    },
    {
      id: "5",
      name: "Abram Schleifer",
      role: "Digital Marketer",
      avatar: "/images/user/user-05.png",
      lastSeen: "1 hour",
      online: true,
    },
  ]);

  useEffect(() => {
    if (requestId) {
      fetchRequestDetails();
    } else {
      setSelectedContact({
        id: "2",
        name: "Lindsey Curtis",
        role: "Designer",
        avatar: "/images/user/user-02.png",
        lastSeen: "30 mins",
        online: true,
      });
    }
  }, [requestId]);

  // Poll for messages every 10 seconds when requestId is present (less visible refresh)
  useEffect(() => {
    if (!requestId) return;

    let shouldStopPolling = false;

    const pollMessages = async () => {
      if (shouldStopPolling) return;

      try {
        const response = await chatAPI.getMessages(requestId);
        // Convert backend messages to frontend format
        const formattedMessages = response.messages.map((msg: any) => ({
          id: msg.id,
          sender: msg.sender_type === "consumer" ? "user" : "contact",
          content: msg.content,
          timestamp: new Date(msg.created_at).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          senderName: msg.sender_type === "consumer" ? "You" : "Electrician",
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

    // Set up polling every 10 seconds
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
      const request = await faultAPI.getFaultRequest(requestId!);
      setRequestDetails(request as RequestDetails);

      const requestContact: Contact = {
        id: request.id,
        name: request.title,
        role: "Service Request",
        avatar: "/images/user/user-01.png",
        lastSeen: request.status,
        online: request.status === "assigned",
      };

      setSelectedContact(requestContact);
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
    if (!newMessage.trim() || !requestId) return;

    try {
      setIsSending(true);
      await chatAPI.sendMessage(requestId, newMessage);
      setNewMessage("");
      
      // Fetch messages immediately after sending to show the message without waiting for polling
      const response = await chatAPI.getMessages(requestId);
      const formattedMessages = response.messages.map((msg: any) => ({
        id: msg.id,
        sender: msg.sender_type === "consumer" ? "user" : "contact",
        content: msg.content,
        timestamp: new Date(msg.created_at).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        senderName: msg.sender_type === "consumer" ? "You" : "Electrician",
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

  if (requestId && isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">Loading chat...</p>
      </div>
    );
  }

  if (requestId && error) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900 px-4">
        <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Error
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Link
            href="/consumer/dashboard"
            className="inline-block px-4 py-2 text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 rounded-lg"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      {/* Sidebar */}
      {!requestId && (
        <div className="w-96 border-r border-gray-200 dark:border-gray-800 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Chats
              </h2>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 text-sm bg-white border border-gray-300 rounded-lg placeholder:text-gray-500 focus:outline-none focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Contacts */}
          <div className="flex-1 overflow-y-auto">
            {contacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`w-full flex items-center gap-3 px-6 py-4 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                  selectedContact?.id === contact.id
                    ? "bg-gray-50 dark:bg-gray-800/50"
                    : ""
                }`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-11 h-11 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-200 font-semibold">
                    {contact.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  {contact.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-success-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                    {contact.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {contact.role}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Area */}
      {selectedContact && (
        <div className={`${requestId ? "w-full" : "flex-1"} flex flex-col`}>
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900">
            <div className="flex items-center gap-3">
              {requestId && (
                <Link
                  href="/consumer/dashboard"
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
              )}
              <div className="relative">
                <div className="w-11 h-11 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-200 font-semibold">
                  {selectedContact.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                {selectedContact.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-success-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
                )}
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-800 dark:text-white">
                  {selectedContact.name}
                </h3>
                {requestDetails && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {requestDetails.status === "assigned"
                      ? "🟢 Electrician assigned"
                      : requestDetails.status === "open"
                      ? "⏳ Waiting for electrician"
                      : "✓ Closed"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 dark:bg-gray-900/50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.sender === "contact" && (
                  <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-200 font-semibold text-sm flex-shrink-0">
                    {message.senderName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
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
            ))}
          </div>

          {/* Input */}
          <div className="p-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            {requestDetails?.status === "open" && requestId && (
              <div className="px-4 py-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg mb-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  💡 Waiting for an electrician to accept your request...
                </p>
              </div>
            )}
            <form onSubmit={handleSendMessage} className="flex items-center gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message"
                disabled={requestDetails?.status === "open" && !!requestId}
                className="flex-1 h-11 px-4 text-sm bg-white border border-gray-300 rounded-lg placeholder:text-gray-500 focus:outline-none focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={
                  !newMessage.trim() ||
                  (requestDetails?.status === "open" && !!requestId)
                }
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
      )}
    </div>
  );
}
