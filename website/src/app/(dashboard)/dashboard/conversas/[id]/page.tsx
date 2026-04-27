"use client";

import { use } from "react";
import ConversationThread from "@/components/dashboard/ConversationThread";

export default function ConversaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ConversationThread conversationId={id} />;
}
