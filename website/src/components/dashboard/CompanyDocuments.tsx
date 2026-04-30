"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  FileText,
  Trash2,
  Upload,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface KnowledgeItem {
  id: string;
  title: string;
  source_type: "file" | "text" | "structured";
  file_size_bytes: number | null;
  agent_id: string | null;
  criado_em: string;
  char_count: number;
  preview: string;
}

function formatBytes(b: number | null): string {
  if (b == null) return "";
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export default function CompanyDocuments() {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch("/api/knowledge");
      if (!res.ok) throw new Error("Falha ao carregar documentos");
      const data = (await res.json()) as { items: KnowledgeItem[] };
      // Apenas docs nível-empresa (agent_id null) e que não sejam o registro estruturado company_info
      setItems((data.items ?? []).filter((i) => i.agent_id === null && i.source_type !== "structured"));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const onUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("file", file);
        form.append("agent_id", "all");
        const res = await fetch("/api/knowledge", { method: "POST", body: form });
        if (!res.ok) throw new Error(`${file.name}: ${await res.text()}`);
      }
      await fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Remover este documento? Os agentes deixam de usá-lo.")) return;
    setError(null);
    try {
      const res = await fetch(`/api/knowledge/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-[#666] -mt-1">
        Faça upload de PDFs, DOCX, TXT ou MD que valem pra <strong className="text-[#aaa]">todos os agentes</strong>.
        Documentos por agente específico ficam em <a href="/dashboard/conhecimento" className="text-[#5B9BF3] hover:underline">/dashboard/conhecimento</a>.
      </p>

      {/* Upload */}
      <label
        htmlFor="company-doc-upload"
        className="block border-2 border-dashed border-[#222] rounded-xl p-5 text-center cursor-pointer hover:border-[#5B9BF3]/50 hover:bg-[#5B9BF3]/5 transition-all"
        onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("border-[#5B9BF3]/50", "bg-[#5B9BF3]/5"); }}
        onDragLeave={(e) => { e.currentTarget.classList.remove("border-[#5B9BF3]/50", "bg-[#5B9BF3]/5"); }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove("border-[#5B9BF3]/50", "bg-[#5B9BF3]/5");
          onUpload(e.dataTransfer.files);
        }}
      >
        <input
          id="company-doc-upload"
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.txt,.md"
          onChange={(e) => onUpload(e.target.files)}
          className="hidden"
          disabled={uploading}
        />
        {uploading ? (
          <div className="flex items-center justify-center gap-2 text-sm text-[#aaa]">
            <Loader2 size={14} className="animate-spin text-[#5B9BF3]" />
            Processando upload...
          </div>
        ) : (
          <>
            <Upload size={18} className="text-[#5B9BF3] mx-auto mb-1.5" />
            <p className="text-[13px] text-white">Arraste arquivos aqui ou clique pra selecionar</p>
            <p className="text-[11px] text-[#666] mt-1">PDF, DOCX, TXT ou MD — até 20MB cada</p>
          </>
        )}
      </label>

      {error && (
        <div className="flex items-start gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Lista */}
      {loading ? (
        <p className="text-xs text-[#666]">Carregando...</p>
      ) : items.length === 0 ? (
        <p className="text-[11px] text-[#666] italic">Nenhum documento ainda.</p>
      ) : (
        <div className="space-y-1.5">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 bg-[#0a0a0a] border border-[#1e1e1e] rounded-lg px-3 py-2"
            >
              <FileText size={14} className="text-[#5B9BF3] shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-white truncate">{item.title}</p>
                <p className="text-[10px] text-[#666]">
                  {formatBytes(item.file_size_bytes)} · {item.char_count.toLocaleString("pt-BR")} caracteres · {formatDate(item.criado_em)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onDelete(item.id)}
                className="p-1.5 rounded text-[#666] hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                aria-label="Remover documento"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
