"use client";

import { use } from "react";
import AgentEditor from "@/components/dashboard/AgentEditor";

export default function EditAgentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <AgentEditor agentId={id} />;
}
