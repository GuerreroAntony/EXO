"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, CheckCircle2, AlertCircle, Building2 } from "lucide-react";

interface CompanyInfo {
  nome_fantasia: string;
  razao_social: string;
  cnpj: string;
  setor: string;
  descricao: string;
  endereco: string;
  telefone: string;
  whatsapp: string;
  email: string;
  site: string;
  horario_funcionamento: string;
  formas_pagamento: string;
  politica_cancelamento: string;
  faq: string;
  observacoes: string;
}

const EMPTY: CompanyInfo = {
  nome_fantasia: "",
  razao_social: "",
  cnpj: "",
  setor: "",
  descricao: "",
  endereco: "",
  telefone: "",
  whatsapp: "",
  email: "",
  site: "",
  horario_funcionamento: "",
  formas_pagamento: "",
  politica_cancelamento: "",
  faq: "",
  observacoes: "",
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

  const filledCount = Object.values(info).filter((v) => v.trim().length > 0).length;
  const totalFields = Object.keys(info).length;

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
          <Building2 size={18} className="text-emerald-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-white text-sm font-semibold mb-1">Como seus agentes usam isso</h3>
          <p className="text-[#888] text-xs leading-relaxed">
            Tudo que você preencher aqui é injetado automaticamente no contexto dos seus agentes na hora
            de responder mensagens. Seus agentes vão saber quem é a empresa, o que ela vende, horário,
            preços e políticas. Quanto mais campos preenchidos, melhor a qualidade das respostas.
          </p>
          <p className="text-[#666] text-[11px] mt-2">{filledCount} de {totalFields} campos preenchidos</p>
        </div>
      </div>

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Razão social">
            <input
              type="text"
              value={info.razao_social}
              onChange={(e) => update("razao_social", e.target.value)}
              placeholder="Ex: Clínica Sorriso LTDA"
              className="input"
            />
          </Field>
          <Field label="CNPJ">
            <input
              type="text"
              value={info.cnpj}
              onChange={(e) => update("cnpj", e.target.value)}
              placeholder="00.000.000/0000-00"
              className="input"
            />
          </Field>
        </div>
        <Field label="Setor / ramo" hint="Em qual segmento atua">
          <input
            type="text"
            value={info.setor}
            onChange={(e) => update("setor", e.target.value)}
            placeholder="Ex: Saúde — odontologia estética"
            className="input"
          />
        </Field>
      </Section>

      <Section title="Sobre a empresa">
        <Field
          label="O que oferece"
          hint="Descrição clara do que a empresa vende ou faz. Esse texto vai aparecer no contexto da Sofia."
        >
          <textarea
            value={info.descricao}
            onChange={(e) => update("descricao", e.target.value)}
            rows={4}
            placeholder="Ex: Clínica de odontologia especializada em estética e implantes. Atendemos pacientes particulares e via convênios. Mais de 10 anos no mercado."
            className="input resize-y"
          />
        </Field>
      </Section>

      <Section title="Contato">
        <Field label="Endereço">
          <input
            type="text"
            value={info.endereco}
            onChange={(e) => update("endereco", e.target.value)}
            placeholder="Rua, número, bairro, cidade, CEP"
            className="input"
          />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Telefone">
            <input
              type="text"
              value={info.telefone}
              onChange={(e) => update("telefone", e.target.value)}
              placeholder="(11) 3000-0000"
              className="input"
            />
          </Field>
          <Field label="WhatsApp">
            <input
              type="text"
              value={info.whatsapp}
              onChange={(e) => update("whatsapp", e.target.value)}
              placeholder="(11) 91234-5678"
              className="input"
            />
          </Field>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="E-mail">
            <input
              type="email"
              value={info.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="contato@empresa.com.br"
              className="input"
            />
          </Field>
          <Field label="Site">
            <input
              type="text"
              value={info.site}
              onChange={(e) => update("site", e.target.value)}
              placeholder="empresa.com.br"
              className="input"
            />
          </Field>
        </div>
      </Section>

      <Section title="Operação">
        <Field
          label="Horário de funcionamento"
          hint="Texto livre — os agentes vão usar isso pra responder 'qual horário?'"
        >
          <textarea
            value={info.horario_funcionamento}
            onChange={(e) => update("horario_funcionamento", e.target.value)}
            rows={3}
            placeholder="Segunda a sexta das 8h às 18h. Sábado das 8h às 12h. Fechado domingos e feriados."
            className="input resize-y"
          />
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

      <Section title="FAQ — perguntas frequentes">
        <Field
          label="Liste as dúvidas mais comuns dos clientes e suas respostas"
          hint="Formato livre. Pode usar P:/R: ou bullets. Quanto mais detalhado, mais autônoma a Sofia."
        >
          <textarea
            value={info.faq}
            onChange={(e) => update("faq", e.target.value)}
            rows={8}
            placeholder={`Exemplo:\n\nP: Vocês atendem crianças?\nR: Sim, temos uma odontopediatra especializada.\n\nP: Quanto custa uma limpeza?\nR: A consulta de avaliação é gratuita. Limpeza simples R$ 150.`}
            className="input resize-y"
          />
        </Field>
      </Section>

      <Section title="Observações">
        <Field
          label="Outras informações importantes"
          hint="Qualquer regra específica do negócio que os agentes devem saber"
        >
          <textarea
            value={info.observacoes}
            onChange={(e) => update("observacoes", e.target.value)}
            rows={4}
            placeholder="Não fechamos para almoço. Atendimento de emergência fora do horário pelo WhatsApp. Estacionamento gratuito por 2 horas."
            className="input resize-y"
          />
        </Field>
      </Section>

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
          background-color: #0a0a0a;
          border: 1px solid #222;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          color: white;
        }
        .input::placeholder {
          color: #555;
        }
        .input:focus {
          outline: none;
          border-color: #444;
        }
      `}</style>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6">
      <h3 className="text-white text-base font-semibold mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
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
