"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  FileText,
  Type,
  Trash2,
  Upload,
  Plus,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Bot,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useOrg } from "@/lib/supabase/use-org";

interface KnowledgeItem {
  id: string;
  title: string;
  source_type: "file" | "text";
  file_size_bytes: number | null;
  agent_id: string | null;
  criado_em: string;
  char_count: number;
  preview: string;
}

interface AgentOption {
  id: string;
  agent_name: string;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

function formatBytes(b: number | null): string {
  if (b == null) return "";
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

export default function KnowledgeBase() {
  const { orgId, loading: orgLoading } = useOrg();
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [agents, setAgents] = useState<AgentOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddText, setShowAddText] = useState(false);
  const [textTitle, setTextTitle] = useState("");
  const [textContent, setTextContent] = useState("");
  const [textTargetAgent, setTextTargetAgent] = useState("all");
  const [savingText, setSavingText] = useState(false);
  const [uploadTargetAgent, setUploadTargetAgent] = useState("all");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchItems = useCallback(async () => {
    const res = await fetch("/api/knowledge");
    if (!res.ok) {
      setLoading(false);
      return;
    }
    const data = (await res.json()) as { items: KnowledgeItem[] };
    setItems(data.items ?? []);
    setLoading(false);
  }, []);

  const fetchAgents = useCallback(async () => {
    if (!orgId) return;
    const supabase = createClient();
    const { data } = await supabase
      .from("agent_provisioning")
      .select("id, agent_name")
      .eq("organization_id", orgId);
    setAgents((data ?? []) as AgentOption[]);
  }, [orgId]);

  useEffect(() => {
    if (orgLoading) return;
    fetchItems();
    fetchAgents();
  }, [orgLoading, fetchItems, fetchAgents]);

  async function handleSaveText() {
    if (!textContent.trim() || savingText) return;
    setSavingText(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: textTitle.trim() || "Sem título",
          content: textContent,
          agent_id: textTargetAgent,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setSuccess("Conteúdo salvo. Agentes vão usar em até 60s.");
      setTextTitle("");
      setTextContent("");
      setShowAddText(false);
      fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSavingText(false);
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    setSuccess(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("title", file.name.replace(/\.[^.]+$/, ""));
      form.append("agent_id", uploadTargetAgent);
      const res = await fetch("/api/knowledge", { method: "POST", body: form });
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as { char_count: number };
      setSuccess(`Arquivo processado: ${data.char_count.toLocaleString("pt-BR")} caracteres extraídos.`);
      fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remover este item da base de conhecimento? Os agentes deixam de usar este material.")) return;
    setError(null);
    try {
      const res = await fetch(`/api/knowledge/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  if (loading || orgLoading) {
    return <div className="text-[#666] text-sm">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white text-base font-semibold">Adicionar material</h3>
            <p className="text-[#666] text-xs mt-0.5">
              Texto livre ou arquivo (PDF, TXT, MD, CSV até ~4 MB).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-xs text-[#888] mb-1.5">Aplica a:</label>
            <select
              value={uploadTargetAgent}
              onChange={(e) => {
                setUploadTargetAgent(e.target.value);
                setTextTargetAgent(e.target.value);
              }}
              className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#444]"
            >
              <option value="all">Todos os agentes (compartilhado)</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>Apenas {a.agent_name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-[#1e1e1e] disabled:text-[#555] text-white text-sm font-medium rounded-xl transition-colors"
          >
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            Upload de arquivo
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.md,.csv,application/pdf,text/plain,text/markdown,text/csv"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => setShowAddText((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:bg-[#222] text-white text-sm font-medium rounded-xl transition-colors"
          >
            <Type size={16} />
            {showAddText ? "Cancelar" : "Colar texto"}
          </button>
        </div>

        {showAddText && (
          <div className="mt-4 space-y-3 pt-4 border-t border-[#1e1e1e]">
            <input
              type="text"
              value={textTitle}
              onChange={(e) => setTextTitle(e.target.value)}
              placeholder="Título (ex: 'Tabela de preços', 'Política de cancelamento')"
              className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-[#444]"
            />
            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Cole o conteúdo aqui. Vai virar contexto que o agente usa nas respostas."
              rows={10}
              className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-3 py-2 text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-[#444] resize-y"
            />
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-[#555]">{textContent.length.toLocaleString("pt-BR")} caracteres</span>
              <button
                onClick={handleSaveText}
                disabled={!textContent.trim() || savingText}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-[#1e1e1e] disabled:text-[#555] text-white text-sm font-medium rounded-xl transition-colors"
              >
                {savingText ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                Salvar
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-3 flex items-start gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-400">
            <CheckCircle2 size={14} />
            <span>{success}</span>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-white text-base font-semibold mb-3">Material já cadastrado ({items.length})</h3>
        {items.length === 0 ? (
          <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-12 text-center">
            <FileText className="mx-auto text-[#333] mb-3" size={36} strokeWidth={1.5} />
            <p className="text-[#999] text-sm">Nenhum material ainda.</p>
            <p className="text-[#555] text-xs mt-1">Suba PDFs ou cole texto pra começar.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => {
              const agent = agents.find((a) => a.id === item.agent_id);
              return (
                <div
                  key={item.id}
                  className="bg-[#111] border border-[#1e1e1e] rounded-xl p-4 hover:border-[#2a2a2a] transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      item.source_type === "file" ? "bg-blue-500/15 text-blue-400" : "bg-violet-500/15 text-violet-400"
                    }`}>
                      {item.source_type === "file" ? <FileText size={16} /> : <Type size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="text-sm font-medium text-white truncate">{item.title}</h4>
                        {agent && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400 text-[10px]">
                            <Bot size={10} />
                            {agent.agent_name}
                          </span>
                        )}
                        {!item.agent_id && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px]">
                            todos os agentes
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#666] line-clamp-2 mb-2">{item.preview}</p>
                      <div className="flex items-center gap-3 text-[11px] text-[#555]">
                        <span>{item.char_count.toLocaleString("pt-BR")} caracteres</span>
                        {item.file_size_bytes && <span>· {formatBytes(item.file_size_bytes)}</span>}
                        <span>· {formatDate(item.criado_em)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-[#555] hover:text-red-400 transition-colors p-1.5"
                      title="Remover"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
