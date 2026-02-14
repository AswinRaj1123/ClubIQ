"use client";
import React, { useState } from "react";
import Link from "next/link";

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
}

export default function ChatPage() {
  const [selectedContact, setSelectedContact] = useState<Contact>({
    id: "2",
    name: "Lindsey Curtis",
    role: "Designer",
    avatar: "/images/user/user-02.png",
    lastSeen: "30 mins",
    online: true,
  });

  const [searchQuery, setSearchQuery] = useState("");

  const contacts: Contact[] = [
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
  ];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "contact",
      content: "I want to make an appointment tomorrow from 2:00 to 5:00pm?",
      timestamp: "Kaiya George, 15 mins",
      senderName: "Kaiya George",
    },
    {
      id: "2",
      sender: "contact",
      content: "I want to make an appointment tomorrow from 2:00 to 5:00pm?",
      timestamp: "Lindsey Curtis, 30 mins",
      senderName: "Lindsey Curtis",
    },
    {
      id: "3",
      sender: "user",
      content: "If don't like something, I'll stay away from it.",
      timestamp: "2 hours ago",
      senderName: "You",
    },
    {
      id: "4",
      sender: "contact",
      content: "I want more detailed information.",
      timestamp: "Lindsey Curtis, 2 hours ago",
      senderName: "Lindsey Curtis",
    },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message: Message = {
        id: (messages.length + 1).toString(),
        sender: "user",
        content: newMessage,
        timestamp: "Just now",
        senderName: "You",
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      {/* Sidebar - Contacts List */}
      <div className="w-96 border-r border-gray-200 dark:border-gray-800 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Chats
            </h2>
            <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z"
                stroke="currentColor"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 text-sm bg-white border border-gray-300 rounded-lg placeholder:text-gray-500 focus:outline-none focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`w-full flex items-center gap-3 px-6 py-4 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                selectedContact.id === contact.id
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
              <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                {contact.lastSeen}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900">
          <div className="flex items-center gap-3">
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
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
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
            <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
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
                  d="M1.5 12C1.5 6.20101 6.20101 1.5 12 1.5C17.799 1.5 22.5 6.20101 22.5 12C22.5 17.799 17.799 22.5 12 22.5C6.20101 22.5 1.5 17.799 1.5 12ZM12 7.5C12.8284 7.5 13.5 6.82843 13.5 6C13.5 5.17157 12.8284 4.5 12 4.5C11.1716 4.5 10.5 5.17157 10.5 6C10.5 6.82843 11.1716 7.5 12 7.5ZM12 9C11.1716 9 10.5 9.67157 10.5 10.5V18C10.5 18.8284 11.1716 19.5 12 19.5C12.8284 19.5 13.5 18.8284 13.5 18V10.5C13.5 9.67157 12.8284 9 12 9Z"
                  fill="currentColor"
                />
              </svg>
            </button>
            <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages Area */}
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

        {/* Message Input */}
        <div className="p-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <form onSubmit={handleSendMessage} className="flex items-center gap-3">
            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.99984 13.3333C11.8408 13.3333 13.3332 11.8409 13.3332 9.99996C13.3332 8.15901 11.8408 6.66663 9.99984 6.66663C8.15889 6.66663 6.6665 8.15901 6.6665 9.99996C6.6665 11.8409 8.15889 13.3333 9.99984 13.3333Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 1.66663V3.33329M10 16.6666V18.3333M3.51667 3.51663L4.69167 4.69163M15.3083 15.3083L16.4833 16.4833M1.66667 9.99996H3.33333M16.6667 9.99996H18.3333M3.51667 16.4833L4.69167 15.3083M15.3083 4.69163L16.4833 3.51663"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message"
              className="flex-1 h-11 px-4 text-sm bg-white border border-gray-300 rounded-lg placeholder:text-gray-500 focus:outline-none focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
            />
            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.5 2.5L8.75 11.25M17.5 2.5L11.875 17.5L8.75 11.25M17.5 2.5L2.5 8.125L8.75 11.25"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 16.25C11.0355 16.25 11.8750 15.4105 11.8750 14.375C11.8750 13.3395 11.0355 12.5 10 12.5C8.96447 12.5 8.125 13.3395 8.125 14.375C8.125 15.4105 8.96447 16.25 10 16.25Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="w-10 h-10 flex items-center justify-center bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
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
    </div>
  );
}
