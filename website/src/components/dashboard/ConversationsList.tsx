"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle, Bot, Hand, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useOrg } from "@/lib/supabase/use-org";

interface ConversationRow {
  id: string;
  contact_phone: string;
  contact_name: string | null;
  status: "active" | "paused" | "escalated" | "closed";
  auto_reply: boolean;
  last_message_at: string;
  unread_count: number;
}

interface ConversationListItem extends ConversationRow {
  last_message_preview: string | null;
  last_message_direction: string | null;
}

function formatRelative(iso: string): string {
  const d = new Date(iso);
  const now = Date.now();
  const diffMin = Math.floor((now - d.getTime()) / 60000);
  if (diffMin < 1) return "agora";
  if (diffMin < 60) return `${diffMin}m`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `${diffD}d`;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

function formatPhone(phone: string): string {
  if (phone.length === 13 && phone.startsWith("55")) {
    return `+55 (${phone.slice(2, 4)}) ${phone.slice(4, 9)}-${phone.slice(9)}`;
  }
  return `+${phone}`;
}

export default function ConversationsList() {
  const { orgId, loading: orgLoading } = useOrg();
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orgLoading || !orgId) return;
    const supabase = createClient();

    const fetchAll = async () => {
      const { data: convs } = await supabase
        .from("conversations")
        .select("id, contact_phone, contact_name, status, auto_reply, last_message_at, unread_count")
        .eq("organization_id", orgId)
        .order("last_message_at", { ascending: false });

      if (!convs || convs.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      const ids = convs.map((c: { id: string }) => c.id);
      const { data: lastMsgs } = await supabase
        .from("messages")
        .select("conversation_id, content, direction, created_at")
        .in("conversation_id", ids)
        .order("created_at", { ascending: false });

      const previewMap = new Map<string, { preview: string; direction: string }>();
      (lastMsgs ?? []).forEach((m: { conversation_id: string; content: string | null; direction: string }) => {
        if (!previewMap.has(m.conversation_id)) {
          previewMap.set(m.conversation_id, {
            preview: m.content ?? "",
            direction: m.direction,
          });
        }
      });

      const enriched: ConversationListItem[] = (convs as ConversationRow[]).map((c) => ({
        ...c,
        last_message_preview: previewMap.get(c.id)?.preview ?? null,
        last_message_direction: previewMap.get(c.id)?.direction ?? null,
      }));

      setConversations(enriched);
      setLoading(false);
    };

    fetchAll();

    const channel = supabase
      .channel(`conversations-${orgId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "conversations", filter: `organization_id=eq.${orgId}` },
        () => fetchAll(),
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        () => fetchAll(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orgId, orgLoading]);

  if (loading || orgLoading) {
    return <div className="text-[#666] text-sm">Carregando...</div>;
  }

  if (conversations.length === 0) {
    return (
      <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-12 text-center">
        <MessageCircle className="mx-auto text-[#333] mb-3" size={40} strokeWidth={1.5} />
        <p className="text-[#999] text-sm">Nenhuma conversa ainda</p>
        <p className="text-[#555] text-xs mt-1">
          Quando alguém mandar mensagem pro seu número WhatsApp, vai aparecer aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl overflow-hidden">
      {conversations.map((c, i) => (
        <Link
          key={c.id}
          href={`/dashboard/conversas/${c.id}`}
          className={`block px-5 py-4 hover:bg-[#1a1a1a] transition-colors ${
            i > 0 ? "border-t border-[#1e1e1e]" : ""
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400 text-sm font-medium shrink-0">
              {(c.contact_name?.trim().charAt(0) || "?").toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <p className="text-white text-sm font-medium truncate">
                  {c.contact_name?.trim() || formatPhone(c.contact_phone)}
                </p>
                <span className="text-[10px] text-[#555] shrink-0">{formatRelative(c.last_message_at)}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-[#888] text-xs truncate">
                  {c.last_message_direction === "outbound" && (
                    <span className="text-[#666]">você: </span>
                  )}
                  {c.last_message_preview ?? "—"}
                </p>
                <div className="flex items-center gap-2 shrink-0">
                  {c.status === "escalated" && (
                    <AlertTriangle size={12} className="text-amber-400" />
                  )}
                  {c.auto_reply ? (
                    <Bot size={12} className="text-violet-400" />
                  ) : (
                    <Hand size={12} className="text-blue-400" />
                  )}
                  {c.unread_count > 0 && (
                    <span className="bg-emerald-500 text-white text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] px-1.5 flex items-center justify-center">
                      {c.unread_count}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
