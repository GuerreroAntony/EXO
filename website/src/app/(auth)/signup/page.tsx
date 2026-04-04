"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { GlowCard } from "@/components/ui/spotlight-card";

export default function SignupPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: nome } },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    const user = authData.user;
    if (!user) {
      setError("Erro ao criar conta. Tente novamente.");
      setLoading(false);
      return;
    }

    // Create organization
    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .insert({ name: empresa })
      .select()
      .single();

    if (orgError) {
      setError(orgError.message);
      setLoading(false);
      return;
    }

    // Link profile to organization
    await supabase
      .from("profiles")
      .update({ organization_id: org.id })
      .eq("id", user.id);

    router.push("/onboarding");
  }

  const inputClass =
    "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors";
  const labelClass =
    "block text-[12px] font-mono text-white/40 uppercase tracking-wider mb-2";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <GlowCard>
        <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-5">
          <h1 className="text-xl font-semibold text-white mb-2">Criar Conta</h1>

          {error && (
            <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className={labelClass}>Nome</label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className={inputClass}
              placeholder="Seu nome completo"
            />
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className={labelClass}>Empresa</label>
            <input
              type="text"
              required
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              className={inputClass}
              placeholder="Nome da empresa"
            />
          </div>

          <div>
            <label className={labelClass}>Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className={labelClass}>Confirmar Senha</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#ffffff",
            }}
          >
            {loading ? "Criando conta..." : "Criar Conta"}
          </button>

          <p className="text-sm text-center text-white/40 pt-2">
            Já tem conta?{" "}
            <Link
              href="/login"
              className="text-[#5B9BF3] hover:text-[#5B9BF3]/80 transition-colors"
            >
              Entrar
            </Link>
          </p>
        </form>
      </GlowCard>
    </motion.div>
  );
}
