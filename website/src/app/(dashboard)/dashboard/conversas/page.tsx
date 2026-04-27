"use client";

import PageHeader from "@/components/dashboard/PageHeader";
import ConversationsList from "@/components/dashboard/ConversationsList";

export default function ConversasPage() {
  return (
    <div>
      <PageHeader
        title="Conversas"
        subtitle="Mensagens de WhatsApp dos seus agentes"
      />
      <ConversationsList />
    </div>
  );
}
