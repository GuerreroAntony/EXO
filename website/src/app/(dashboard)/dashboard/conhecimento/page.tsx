"use client";

import PageHeader from "@/components/dashboard/PageHeader";
import KnowledgeBase from "@/components/dashboard/KnowledgeBase";

export default function ConhecimentoPage() {
  return (
    <div>
      <PageHeader
        title="Base de Conhecimento"
        subtitle="Material que seus agentes usam para responder (FAQ, preços, políticas, scripts)"
      />
      <KnowledgeBase />
    </div>
  );
}
