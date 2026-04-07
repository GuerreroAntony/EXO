"use client";

import { useState } from "react";
import { submitDemoRequest } from "@/app/actions/demo";

export function DemoForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const result = await submitDemoRequest(formData);
    if (result.success) {
      window.location.href = "/demo/confirmacao";
    }
    setLoading(false);
  }

  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl">
      <form action={handleSubmit} className="p-8 sm:p-10 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm text-white/30 font-medium mb-2">Nome</label>
            <input name="nome" required className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/[0.15] focus:ring-0 transition-colors" placeholder="Seu nome" />
          </div>
          <div>
            <label className="block text-sm text-white/30 font-medium mb-2">Email</label>
            <input name="email" type="email" required className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/[0.15] focus:ring-0 transition-colors" placeholder="seu@email.com" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm text-white/30 font-medium mb-2">Telefone</label>
            <input name="telefone" className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/[0.15] focus:ring-0 transition-colors" placeholder="(11) 99999-9999" />
          </div>
          <div>
            <label className="block text-sm text-white/30 font-medium mb-2">Empresa</label>
            <input name="empresa" className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/[0.15] focus:ring-0 transition-colors" placeholder="Nome da empresa" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm text-white/30 font-medium mb-2">Cargo</label>
            <input name="cargo" className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/[0.15] focus:ring-0 transition-colors" placeholder="Seu cargo" />
          </div>
          <div>
            <label className="block text-sm text-white/30 font-medium mb-2">Interesse</label>
            <select name="vertical_interesse" className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3.5 text-sm text-white/60 focus:outline-none focus:border-white/[0.15] focus:ring-0 transition-colors">
              <option value="">Selecione</option>
              <option value="callcenter">Call Center IA</option>
              <option value="inteligencia-virtual">Influencers Virtuais</option>
              <option value="digital-workers">Digital Workers</option>
              <option value="robotica">Robótica</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm text-white/30 font-medium mb-2">Mensagem</label>
          <textarea name="mensagem" rows={4} className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/[0.15] focus:ring-0 transition-colors resize-none" placeholder="Como podemos ajudar?" />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black font-medium rounded-full px-8 py-4 text-sm tracking-wide transition-all duration-300 hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Enviando..." : "Solicitar Demonstração"}
        </button>
      </form>
    </div>
  );
}
