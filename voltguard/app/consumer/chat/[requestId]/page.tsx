import type { Metadata } from "next";
import ChatPage from "@/components/consumer/ChatPage";
import React from "react";

export const metadata: Metadata = {
  title: "Chat with Electrician - VoltGuard",
  description: "Real-time chat with electrician about your service request",
};

export default async function ChatPageRoute({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;
  return <ChatPage requestId={requestId} />;
}
