"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function DataDeletionForm() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim() && !email.trim()) {
      setError("Informe pelo menos seu WhatsApp ou e-mail.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/data-deletion", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          requester_phone: phone.trim() || null,
          requester_email: email.trim() || null,
          requester_name: name.trim() || null,
          reason: reason.trim() || null,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="text-emerald-400 font-semibold mb-1">Pedido recebido</h3>
            <p className="text-sm text-[#ccc]">
              Vamos processar em até 15 dias úteis. Você receberá uma confirmação no contato informado quando a
              exclusão for concluída. Pra acompanhar ou cancelar o pedido, escreva pra{" "}
              <a href="mailto:privacidade@exo.tec.br" className="text-blue-400 hover:underline">privacidade@exo.tec.br</a>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6 space-y-4">
      <Field label="Nome" hint="Como podemos te chamar (opcional)">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome"
          className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-[#444]"
        />
      </Field>

      <Field label="WhatsApp" hint="Com DDI e DDD (ex: +55 11 91234-5678)">
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+55 11 91234-5678"
          className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-[#444]"
        />
      </Field>

      <Field label="E-mail" hint="Se preferir não informar WhatsApp, informe e-mail">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="voce@exemplo.com"
          className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-[#444]"
        />
      </Field>

      <Field label="Motivo (opcional)" hint="Nos ajuda a melhorar; não é obrigatório">
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          placeholder="Por que está pedindo exclusão?"
          className="w-full bg-[#0a0a0a] border border-[#222] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-[#444] resize-y"
        />
      </Field>

      {error && (
        <div className="flex items-start gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-[#1e1e1e] disabled:text-[#555] text-white font-medium rounded-xl transition-colors"
      >
        {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
        Enviar pedido de exclusão
      </button>

      <p className="text-[11px] text-[#555] text-center">
        Ao enviar, você confirma que é o titular dos dados ou tem autorização pra solicitar a exclusão.
      </p>
    </form>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm text-white font-medium mb-1">{label}</label>
      {hint && <p className="text-xs text-[#666] mb-1.5">{hint}</p>}
      {children}
    </div>
  );
}
