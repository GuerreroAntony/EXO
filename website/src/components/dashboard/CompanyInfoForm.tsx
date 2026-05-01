"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, CheckCircle2, AlertCircle, Building2, Plus, X as XIcon } from "lucide-react";
import CompanyDocuments from "./CompanyDocuments";

interface HorarioDia {
  dia: string;
  ativo: boolean;
  inicio: string;
  fim: string;
}

const DIAS_SEMANA = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

const HORARIO_DEFAULT: HorarioDia[] = DIAS_SEMANA.map((dia, i) => ({
  dia,
  ativo: i < 5,
  inicio: "08:00",
  fim: "18:00",
}));

interface CompanyInfo {
  nome_fantasia: string;
  descricao: string;
  endereco: string;
  horario_funcionamento_dias: HorarioDia[];
  formas_pagamento: string;
  politica_cancelamento: string;
  faq: string;
  escalonamento_humano: string;
  restricoes: string;
  contatos_humanos: string[];
  tom_marca: string;
}

const EMPTY: CompanyInfo = {
  nome_fantasia: "",
  descricao: "",
  endereco: "",
  horario_funcionamento_dias: HORARIO_DEFAULT,
  formas_pagamento: "",
  politica_cancelamento: "",
  faq: "",
  escalonamento_humano: "",
  restricoes: "",
  contatos_humanos: [""],
  tom_marca: "",
};

export default function CompanyInfoForm() {
  const [info, setInfo] = useState<CompanyInfo>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/empresa-info")
      .then((r) => r.json() as Promise<{ info: Partial<CompanyInfo> | null }>)
      .then((data) => {
        if (data.info) setInfo({ ...EMPTY, ...data.info });
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    if (saving) return;
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch("/api/empresa-info", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(info),
      });
      if (!res.ok) throw new Error(await res.text());
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  }

  function update<K extends keyof CompanyInfo>(key: K, value: CompanyInfo[K]) {
    setInfo((prev) => ({ ...prev, [key]: value }));
  }

  if (loading) return <div className="text-[#666] text-sm">Carregando...</div>;

  const filledCount = Object.entries(info).filter(([k, v]) => {
    if (k === "horario_funcionamento_dias") return Array.isArray(v) && v.some((d: HorarioDia) => d.ativo);
    if (k === "contatos_humanos") return Array.isArray(v) && v.some((c: string) => c.trim().length > 0);
    return typeof v === "string" && v.trim().length > 0;
  }).length;
  const totalFields = Object.keys(info).length;

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
          <Building2 size={18} className="text-emerald-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-white text-sm font-semibold mb-1">Como seus agentes usam isso</h3>
          <p className="text-[#888] text-xs leading-relaxed">
            Tudo que você preencher aqui é injetado automaticamente no contexto dos seus agentes na hora
            de responder mensagens. Quanto mais campos preenchidos, melhor a qualidade das respostas —
            principalmente quando o cliente pergunta sobre horário, formas de pagamento, política, ou
            algo da FAQ.
          </p>
          <p className="text-[#666] text-[11px] mt-2">{filledCount} de {totalFields} campos preenchidos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

      <Section title="Identificação">
        <Field label="Nome fantasia" hint="Como a empresa é conhecida no mercado">
          <input
            type="text"
            value={info.nome_fantasia}
            onChange={(e) => update("nome_fantasia", e.target.value)}
            placeholder="Ex: Clínica Sorriso"
            className="input"
          />
        </Field>
      </Section>

      <Section title="Sobre a empresa">
        <Field
          label="O que oferece"
          hint="Descrição clara do que a empresa vende ou faz. Esse texto vai direto no contexto dos agentes."
        >
          <textarea
            value={info.descricao}
            onChange={(e) => update("descricao", e.target.value)}
            rows={4}
            placeholder="Ex: Clínica de odontologia especializada em estética e implantes. Atendemos pacientes particulares e via convênios. Mais de 10 anos no mercado."
            className="input resize-y"
          />
        </Field>
        <Field label="Endereço">
          <input
            type="text"
            value={info.endereco}
            onChange={(e) => update("endereco", e.target.value)}
            placeholder="Rua, número, bairro, cidade, CEP"
            className="input"
          />
        </Field>
      </Section>

      <Section title="Operação">
        <Field
          label="Horário de funcionamento"
          hint="Os agentes usam isso pra responder 'qual horário?' e pra saber quando estão em fora do expediente."
        >
          <div className="space-y-2">
            {info.horario_funcionamento_dias.map((h, idx) => (
              <div key={h.dia} className="flex items-center gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={h.ativo}
                  onClick={() => {
                    const next = [...info.horario_funcionamento_dias];
                    next[idx] = { ...next[idx], ativo: !next[idx].ativo };
                    update("horario_funcionamento_dias", next);
                  }}
                  className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${h.ativo ? "bg-[#5B9BF3]" : "bg-[#333]"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${h.ativo ? "translate-x-4" : "translate-x-0"}`} />
                </button>
                <span className={`text-sm w-20 ${h.ativo ? "text-[#ccc]" : "text-[#666]"}`}>{h.dia}</span>
                {h.ativo ? (
                  <div className="flex items-center gap-2 text-sm">
                    <input
                      type="time"
                      value={h.inicio}
                      onChange={(e) => {
                        const next = [...info.horario_funcionamento_dias];
                        next[idx] = { ...next[idx], inicio: e.target.value };
                        update("horario_funcionamento_dias", next);
                      }}
                      className="bg-[#0a0a0a] border border-[#222] rounded-md px-2 py-1 text-white"
                    />
                    <span className="text-[#666]">até</span>
                    <input
                      type="time"
                      value={h.fim}
                      onChange={(e) => {
                        const next = [...info.horario_funcionamento_dias];
                        next[idx] = { ...next[idx], fim: e.target.value };
                        update("horario_funcionamento_dias", next);
                      }}
                      className="bg-[#0a0a0a] border border-[#222] rounded-md px-2 py-1 text-white"
                    />
                  </div>
                ) : (
                  <span className="text-sm text-[#666]">Fechado</span>
                )}
              </div>
            ))}
          </div>
        </Field>
        <Field label="Formas de pagamento aceitas">
          <textarea
            value={info.formas_pagamento}
            onChange={(e) => update("formas_pagamento", e.target.value)}
            rows={3}
            placeholder="Pix, cartão de crédito (até 12x), débito, dinheiro. Convênios: Bradesco Saúde, Amil, SulAmérica."
            className="input resize-y"
          />
        </Field>
        <Field
          label="Política de cancelamento e reembolso"
          hint="Quando o cliente pode cancelar, multas, prazos. Os agentes seguem essa política à risca."
        >
          <textarea
            value={info.politica_cancelamento}
            onChange={(e) => update("politica_cancelamento", e.target.value)}
            rows={3}
            placeholder="Cancelamento gratuito até 24h antes do horário marcado. Após esse prazo, cobramos 50% da consulta."
            className="input resize-y"
          />
        </Field>
      </Section>

      <Section title="Atendimento e limites">
        <Field
          label="Quando chamar humano"
          hint="Liste assuntos que disparam handoff automático. O agente vai escalar nesses casos em vez de tentar responder."
        >
          <textarea
            value={info.escalonamento_humano}
            onChange={(e) => update("escalonamento_humano", e.target.value)}
            rows={4}
            placeholder={`Reclamações graves ou ameaças.\nPedidos de desconto acima de 20%.\nProblemas de cobrança duplicada ou estorno.\nCliente visivelmente irritado pedindo gerente.\nTermos jurídicos / processo / advogado.\nMudanças de endereço / dados sensíveis.`}
            className="input resize-y"
          />
        </Field>
        <Field
          label="Restrições — o que o agente NUNCA deve fazer"
          hint="Regras absolutas. Vão entrar como guardrails no prompt — o agente não desobedece."
        >
          <textarea
            value={info.restricoes}
            onChange={(e) => update("restricoes", e.target.value)}
            rows={4}
            placeholder={`Nunca prometa prazo sem confirmar com humano.\nNunca dê opinião sobre concorrentes.\nNunca compartilhe preços negociados de outros clientes.\nNunca confirme agendamento sem ver na agenda real.\nNunca peça dados de cartão por mensagem.\nNunca invente informação que não está aqui na base.`}
            className="input resize-y"
          />
        </Field>
        <Field
          label="Contatos humanos de plantão"
          hint="Quem o agente avisa quando escalar. Pode ter mais de um — nome + WhatsApp ou email."
        >
          <div className="space-y-2">
            {info.contatos_humanos.map((contato, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={contato}
                  onChange={(e) => {
                    const next = [...info.contatos_humanos];
                    next[idx] = e.target.value;
                    update("contatos_humanos", next);
                  }}
                  placeholder="Ex: Maria — +55 11 98765-4321 (WhatsApp)"
                  className="input flex-1"
                />
                {info.contatos_humanos.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const next = info.contatos_humanos.filter((_, i) => i !== idx);
                      update("contatos_humanos", next.length ? next : [""]);
                    }}
                    aria-label="Remover contato"
                    className="p-2 rounded-lg text-[#666] hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-colors shrink-0"
                  >
                    <XIcon size={14} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => update("contatos_humanos", [...info.contatos_humanos, ""])}
              className="flex items-center gap-1.5 text-xs text-[#5B9BF3] hover:text-[#7AB1F5] transition-colors mt-1"
            >
              <Plus size={14} />
              Adicionar mais um contato
            </button>
          </div>
        </Field>
        <Field
          label="Tom de voz e personalidade da marca"
          hint="Como a marca fala — diferente do tom do agente individual. Define a voz que todos os agentes da empresa compartilham."
        >
          <textarea
            value={info.tom_marca}
            onChange={(e) => update("tom_marca", e.target.value)}
            rows={4}
            placeholder={`Ex: Trate o cliente como você. Linguagem informal mas educada, sem gírias regionais. Sempre cumprimente pelo nome quando souber. Quando errar, assuma diretamente sem rodeios. Frases curtas, sem floreio.`}
            className="input resize-y"
          />
        </Field>
      </Section>

      <Section title="Documentos da empresa" className="lg:col-span-2">
        <CompanyDocuments />
      </Section>

      <Section title="FAQ — perguntas frequentes" className="lg:col-span-2">
        <Field
          label="Liste as dúvidas mais comuns dos clientes e suas respostas"
          hint="Formato livre. Pode usar P:/R: ou bullets. Quanto mais detalhado, mais autônomos os agentes."
        >
          <textarea
            value={info.faq}
            onChange={(e) => update("faq", e.target.value)}
            rows={10}
            placeholder={`Exemplo:\n\nP: Vocês atendem crianças?\nR: Sim, temos uma odontopediatra especializada.\n\nP: Quanto custa uma limpeza?\nR: A consulta de avaliação é gratuita. Limpeza simples R$ 150.`}
            className="input resize-y"
          />
        </Field>
      </Section>

      </div>

      {error && (
        <div className="flex items-start gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-400">
          <CheckCircle2 size={14} />
          <span>Salvo. Agentes vão usar a nova versão em até 60s.</span>
        </div>
      )}

      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-[#1e1e1e] disabled:text-[#555] text-white text-sm font-medium rounded-xl transition-colors"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Salvar informações da empresa
        </button>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          background-color: #0d0d0d;
          border: 1px solid #2a2a2a;
          border-radius: 0.625rem;
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          color: #f0f0f0;
          transition: border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;
        }
        .input::placeholder {
          color: #4a4a4a;
        }
        .input:hover:not(:focus) {
          border-color: #3a3a3a;
          background-color: #101010;
        }
        .input:focus {
          outline: none;
          border-color: #5B9BF3;
          background-color: #0f0f0f;
          box-shadow: 0 0 0 3px rgba(91, 155, 243, 0.12);
        }
      `}</style>
    </div>
  );
}

function Section({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[#141414] border border-[#262626] rounded-2xl p-6 shadow-[0_1px_0_0_rgba(255,255,255,0.02)] ${className ?? ""}`}>
      <h3 className="text-white text-base font-semibold mb-1.5">{title}</h3>
      <div className="h-px bg-[#222] -mx-6 mb-5" />
      <div className="space-y-5">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[13px] text-white font-medium mb-1">{label}</label>
      {hint && <p className="text-[12px] text-[#7a7a7a] mb-2 leading-relaxed">{hint}</p>}
      {children}
    </div>
  );
}
