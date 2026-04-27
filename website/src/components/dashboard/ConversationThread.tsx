"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bot, Hand, Send, AlertTriangle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ConversationDetail {
  id: string;
  contact_phone: string;
  contact_name: string | null;
  status: "active" | "paused" | "escalated" | "closed";
  auto_reply: boolean;
}

interface MessageRow {
  id: string;
  direction: "inbound" | "outbound";
  sender_type: "contact" | "agent" | "human";
  content: string | null;
  status: string;
  created_at: string;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function formatPhone(phone: string): string {
  if (phone.length === 13 && phone.startsWith("55")) {
    return `+55 (${phone.slice(2, 4)}) ${phone.slice(4, 9)}-${phone.slice(9)}`;
  }
  return `+${phone}`;
}

export default function ConversationThread({ conversationId }: { conversationId: string }) {
  const [conversation, setConversation] = useState<ConversationDetail | null>(null);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const fetchAll = async () => {
      const [{ data: conv }, { data: msgs }] = await Promise.all([
        supabase
          .from("conversations")
          .select("id, contact_phone, contact_name, status, auto_reply")
          .eq("id", conversationId)
          .maybeSingle<ConversationDetail>(),
        supabase
          .from("messages")
          .select("id, direction, sender_type, content, status, created_at")
          .eq("conversation_id", conversationId)
          .order("created_at", { ascending: true }),
      ]);

      setConversation(conv ?? null);
      setMessages((msgs ?? []) as MessageRow[]);
      setLoading(false);
    };

    fetchAll();

    const channel = supabase
      .channel(`thread-${conversationId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          setMessages((prev) => {
            const next = payload.new as MessageRow;
            if (prev.some((m) => m.id === next.id)) return prev;
            return [...prev, next];
          });
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          const updated = payload.new as MessageRow;
          setMessages((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "conversations", filter: `id=eq.${conversationId}` },
        (payload) => setConversation(payload.new as ConversationDetail),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function handleToggleAutoReply() {
    if (!conversation || toggling) return;
    setToggling(true);
    setError(null);
    const action = conversation.auto_reply ? "pause" : "resume";
    try {
      const res = await fetch(`/api/conversas/${conversationId}/${action}`, { method: "POST" });
      if (!res.ok) throw new Error(await res.text());
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setToggling(false);
    }
  }

  async function handleSend() {
    const content = draft.trim();
    if (!content || sending) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch(`/api/conversas/${conversationId}/reply`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error(await res.text());
      setDraft("");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSending(false);
    }
  }

  if (loading) return <div className="text-[#666] text-sm">Carregando...</div>;
  if (!conversation) return <div className="text-[#888] text-sm">Conversa não encontrada</div>;

  const displayName = conversation.contact_name?.trim() || formatPhone(conversation.contact_phone);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center gap-3 mb-4">
        <Link href="/dashboard/conversas" className="text-[#666] hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div className="w-10 h-10 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400 text-sm font-medium">
          {(conversation.contact_name?.trim().charAt(0) || "?").toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-white text-base font-medium truncate">{displayName}</h2>
          <p className="text-[#666] text-xs">{formatPhone(conversation.contact_phone)}</p>
        </div>
        {conversation.status === "escalated" && (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/15 text-amber-400 text-xs">
            <AlertTriangle size={12} />
            escalado
          </span>
        )}
        <button
          onClick={handleToggleAutoReply}
          disabled={toggling}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            conversation.auto_reply
              ? "bg-violet-500/15 text-violet-400 hover:bg-violet-500/25"
              : "bg-blue-500/15 text-blue-400 hover:bg-blue-500/25"
          }`}
        >
          {toggling ? (
            <Loader2 size={12} className="animate-spin" />
          ) : conversation.auto_reply ? (
            <Bot size={12} />
          ) : (
            <Hand size={12} />
          )}
          {conversation.auto_reply ? "Auto-resposta" : "Modo humano"}
        </button>
      </div>

      <div className="flex-1 bg-[#111] border border-[#1e1e1e] rounded-2xl overflow-y-auto p-4 mb-3">
        {messages.length === 0 ? (
          <p className="text-[#555] text-sm text-center mt-8">Nenhuma mensagem ainda</p>
        ) : (
          <div className="space-y-3">
            {messages.map((m) => {
              const isOut = m.direction === "outbound";
              const senderLabel =
                m.sender_type === "agent" ? "Sofia (IA)" : m.sender_type === "human" ? "Você" : null;
              return (
                <div key={m.id} className={`flex ${isOut ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                      isOut
                        ? m.sender_type === "agent"
                          ? "bg-violet-500/15 text-white"
                          : "bg-blue-500/15 text-white"
                        : "bg-[#1a1a1a] text-white"
                    }`}
                  >
                    {senderLabel && (
                      <p className={`text-[10px] font-medium mb-0.5 ${
                        m.sender_type === "agent" ? "text-violet-400" : "text-blue-400"
                      }`}>
                        {senderLabel}
                      </p>
                    )}
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{m.content}</p>
                    <div className="flex items-center gap-1 justify-end mt-1">
                      <span className="text-[10px] text-[#666]">{formatTime(m.created_at)}</span>
                      {isOut && (
                        <span className="text-[10px] text-[#555] capitalize">· {m.status}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {error && (
        <div className="mb-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={
            conversation.auto_reply
              ? "Digite pra responder manualmente (vai pausar a IA pra esta conversa)..."
              : "Digite sua resposta..."
          }
          rows={2}
          className="flex-1 bg-[#111] border border-[#1e1e1e] rounded-2xl px-4 py-3 text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-[#333] resize-none"
        />
        <button
          onClick={handleSend}
          disabled={!draft.trim() || sending}
          className="px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-[#1e1e1e] disabled:text-[#555] text-white text-sm font-medium transition-colors flex items-center gap-2"
        >
          {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          Enviar
        </button>
      </div>
    </div>
  );
}
