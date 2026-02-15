import type { Metadata } from "next";
import ChatPage from "@/components/electrician/ChatPage";
import React from "react";

export const metadata: Metadata = {
  title: "Chat with Consumer - VoltGuard",
  description: "Real-time chat with consumer about the service request",
};

export default async function ElectricianChatPage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;
  return <ChatPage requestId={requestId} />;
}
