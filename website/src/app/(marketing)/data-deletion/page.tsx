import type { Metadata } from "next";
import Link from "next/link";
import DataDeletionForm from "@/components/DataDeletionForm";

export const metadata: Metadata = {
  title: "Excluir meus dados — EXO",
  description: "Solicite a exclusão dos seus dados pessoais da plataforma EXO.",
};

export default function DataDeletionPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-20">
      <div className="max-w-2xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-3">Excluir meus dados</h1>
        <p className="text-[#888] mb-10">
          Você tem o direito de pedir a exclusão dos seus dados pessoais conforme o artigo 18 da LGPD.
        </p>

        <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold mb-3">Como funciona</h2>
          <ol className="list-decimal pl-5 space-y-2 text-sm text-[#ccc]">
            <li>Preencha o formulário abaixo com o número de WhatsApp ou e-mail que você usou.</li>
            <li>Confirmamos sua identidade (pode envolver pedir validação extra).</li>
            <li>Em até <strong>15 dias úteis</strong>, todos os seus dados pessoais associados são removidos do nosso banco.</li>
            <li>Você recebe um e-mail (ou WhatsApp) confirmando.</li>
          </ol>
          <p className="text-xs text-[#666] mt-4">
            Observação: dados que tenhamos obrigação legal de manter (registros fiscais, por exemplo) podem ser
            preservados pelo prazo legal exigido. Logs técnicos anonimizados podem ser mantidos pra fins de segurança.
          </p>
        </div>

        <DataDeletionForm />

        <div className="mt-10 p-5 bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl">
          <p className="text-sm text-[#999]">
            Prefere outro canal? Escreva pra{" "}
            <a href="mailto:privacidade@exo.tec.br" className="text-blue-400 hover:underline">privacidade@exo.tec.br</a>
            {" "}com o assunto &quot;Pedido de Exclusão&quot;.
          </p>
        </div>

        <div className="mt-12 pt-6 border-t border-[#1e1e1e] flex flex-wrap gap-6 text-sm">
          <Link href="/privacidade" className="text-[#888] hover:text-white transition-colors">Política de Privacidade</Link>
          <Link href="/termos" className="text-[#888] hover:text-white transition-colors">Termos de Serviço</Link>
          <Link href="/" className="text-[#888] hover:text-white transition-colors">Voltar à home</Link>
        </div>
      </div>
    </main>
  );
}
