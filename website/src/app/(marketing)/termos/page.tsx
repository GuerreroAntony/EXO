import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Termos de Serviço — EXO",
  description: "Termos e condições de uso da plataforma EXO.",
};

export default function TermosPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-2">Termos de Serviço</h1>
        <p className="text-[#888] text-sm mb-10">Última atualização: 27 de abril de 2026</p>

        <div className="space-y-8 text-[#ccc] leading-relaxed">
          <Section title="1. Aceitação">
            <p>
              Ao criar uma conta, acessar ou usar a plataforma <strong>EXO</strong>, operada por
              <strong> AZURE ASSES E INTERMEDIACAO DE NEGOCIOS LTDA</strong>, CNPJ 43.537.371/0001-10
              (&quot;EXO&quot;, &quot;nós&quot;), você (&quot;Cliente&quot;) aceita estes termos integralmente.
              Se não concordar, não use a plataforma.
            </p>
          </Section>

          <Section title="2. Descrição do serviço">
            <p>
              A EXO fornece infraestrutura de software para que empresas configurem agentes de inteligência artificial
              que atendem clientes finais por voz (telefone) e WhatsApp Business (Cloud API), incluindo:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Painel web para configurar agentes (nome, tom, prompts, base de conhecimento)</li>
              <li>Integração com WhatsApp Business Platform (via Meta) e telefonia</li>
              <li>Processamento de mensagens via modelo de linguagem (Anthropic Claude)</li>
              <li>Painel de acompanhamento de conversas e métricas</li>
              <li>Possibilidade de intervenção humana nas conversas</li>
            </ul>
          </Section>

          <Section title="3. Cadastro e conta">
            <p>
              O Cliente é responsável por:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Fornecer informações verídicas no cadastro e mantê-las atualizadas</li>
              <li>Manter a confidencialidade das credenciais de acesso</li>
              <li>Todas as atividades realizadas em sua conta</li>
              <li>Notificar imediatamente em caso de uso não autorizado</li>
            </ul>
          </Section>

          <Section title="4. Obrigações do Cliente">
            <p>O Cliente compromete-se a:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Usar a plataforma em conformidade com a lei brasileira, LGPD e regulamentos aplicáveis</li>
              <li>Cumprir as <a href="https://www.whatsapp.com/legal/business-policy" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Políticas Comerciais do WhatsApp Business</a> e <a href="https://developers.facebook.com/docs/whatsapp/cloud-api/messages-policy" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Política de Mensagens</a> da Meta</li>
              <li>Obter consentimento adequado dos destinatários antes de iniciar conversas (opt-in)</li>
              <li>Configurar prompts que respeitem privacidade, dignidade e direitos dos usuários finais</li>
              <li>Não usar a plataforma pra spam, phishing, fraude, golpes financeiros, conteúdo ilegal ou enganoso</li>
              <li>Não usar pra fins discriminatórios, assediadores, ameaçadores ou que violem direitos humanos</li>
              <li>Manter sua própria política de privacidade quando aplicável e respeitar pedidos de opt-out</li>
              <li>Pagar pontualmente as faturas devidas</li>
            </ul>
          </Section>

          <Section title="5. Usos proibidos">
            <p>É expressamente proibido:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Engenharia reversa, descompilação ou tentativa de extrair código-fonte</li>
              <li>Tentativas de quebrar autenticação, RLS ou outros mecanismos de segurança</li>
              <li>Sobrecarga intencional da infraestrutura (rate-limit abuse, DoS)</li>
              <li>Uso da plataforma como infraestrutura para outro produto SaaS sem acordo prévio</li>
              <li>Distribuir malware, conteúdo proibido por lei ou que viole direitos de terceiros</li>
              <li>Personificar pessoas reais sem autorização</li>
              <li>Uso da plataforma para automatizar campanhas políticas eleitorais sem identificação clara</li>
            </ul>
            <p className="mt-3">
              Violações graves implicam suspensão imediata e podem ser reportadas às autoridades.
            </p>
          </Section>

          <Section title="6. Propriedade intelectual">
            <p>
              O código-fonte, marca, design e infraestrutura da EXO são de propriedade da EXO e protegidos por direitos autorais e leis aplicáveis.
            </p>
            <p>
              Conteúdo enviado pelo Cliente (base de conhecimento, configurações, conversas dos seus canais) é
              propriedade do Cliente. A EXO recebe licença limitada apenas pra operar o serviço contratado.
            </p>
          </Section>

          <Section title="7. Pagamento e cobrança">
            <p>
              Os planos e preços vigentes estão disponíveis em <Link href="/precos" className="text-blue-400 hover:underline">/precos</Link>.
              Cobranças recorrentes seguem o ciclo escolhido (mensal ou anual). Falta de pagamento por mais de 15 dias
              após o vencimento implica suspensão do acesso. Após 60 dias, a conta pode ser cancelada e os dados arquivados conforme política de retenção.
            </p>
            <p>
              Custos variáveis (mensagens WhatsApp, minutos de voz, chamadas LLM) podem ser cobrados separadamente conforme uso.
            </p>
          </Section>

          <Section title="8. Disponibilidade e SLA">
            <p>
              A EXO empenha-se pra manter a plataforma disponível 24/7 mas não garante disponibilidade ininterrupta.
              Manutenções programadas serão comunicadas com pelo menos 24h de antecedência sempre que possível.
              Indisponibilidades de provedores terceiros (Meta, Anthropic, Supabase, Vercel) podem afetar o serviço.
            </p>
          </Section>

          <Section title="9. Limitação de responsabilidade">
            <p>
              A plataforma é fornecida &quot;como está&quot;. A EXO não se responsabiliza por:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Decisões tomadas pelo Cliente ou seus usuários finais com base em respostas geradas pela IA</li>
              <li>Conteúdo enviado por terceiros através dos canais do Cliente</li>
              <li>Indisponibilidades causadas por fornecedores terceiros</li>
              <li>Lucros cessantes, danos indiretos ou consequenciais</li>
              <li>Perda de dados decorrente de uso indevido ou exclusão pelo próprio Cliente</li>
            </ul>
            <p className="mt-3">
              Em qualquer hipótese, a responsabilidade total da EXO está limitada ao valor pago pelo Cliente nos
              últimos 12 meses anteriores ao evento que originou a reclamação.
            </p>
          </Section>

          <Section title="10. Indenização">
            <p>
              O Cliente concorda em indenizar a EXO por qualquer reclamação, perda ou dano decorrente de uso indevido da
              plataforma, violação destes termos ou violação de direitos de terceiros.
            </p>
          </Section>

          <Section title="11. Vigência e rescisão">
            <p>
              Estes termos vigem a partir do aceite e enquanto a conta estiver ativa.
              Qualquer parte pode rescindir a qualquer momento, com 30 dias de aviso prévio.
              Em caso de violação grave, a EXO pode rescindir imediatamente.
            </p>
            <p>
              Após a rescisão, dados são tratados conforme a <Link href="/privacidade" className="text-blue-400 hover:underline">Política de Privacidade</Link>.
            </p>
          </Section>

          <Section title="12. Alterações nos termos">
            <p>
              A EXO pode atualizar estes termos. Mudanças materiais serão comunicadas com 30 dias de antecedência via
              e-mail. O uso continuado após a entrada em vigor implica aceitação da nova versão.
            </p>
          </Section>

          <Section title="13. Foro e lei aplicável">
            <p>
              Estes termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da Comarca de
              <strong> São Paulo/SP</strong> pra dirimir qualquer disputa, com renúncia expressa a qualquer outro,
              por mais privilegiado que seja.
            </p>
          </Section>

          <Section title="14. Contato">
            <p>
              Dúvidas sobre estes termos: <a href="mailto:contato@exo.tec.br" className="text-blue-400 hover:underline">contato@exo.tec.br</a>
            </p>
          </Section>
        </div>

        <div className="mt-16 pt-8 border-t border-[#1e1e1e] flex flex-wrap gap-6 text-sm">
          <Link href="/privacidade" className="text-[#888] hover:text-white transition-colors">Política de Privacidade</Link>
          <Link href="/data-deletion" className="text-[#888] hover:text-white transition-colors">Excluir meus dados</Link>
          <Link href="/" className="text-[#888] hover:text-white transition-colors">Voltar à home</Link>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-white mb-3">{title}</h2>
      <div className="space-y-2">{children}</div>
    </section>
  );
}
