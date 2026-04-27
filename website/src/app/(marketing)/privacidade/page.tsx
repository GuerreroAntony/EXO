import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidade — EXO",
  description: "Como a EXO coleta, usa e protege dados na plataforma de agentes de IA.",
};

export default function PrivacidadePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-2">Política de Privacidade</h1>
        <p className="text-[#888] text-sm mb-10">Última atualização: 27 de abril de 2026</p>

        <div className="prose prose-invert max-w-none space-y-8 text-[#ccc] leading-relaxed">
          <Section title="1. Quem somos">
            <p>
              A <strong>EXO</strong> é uma plataforma operada por <strong>AZURE ASSES E INTERMEDIACAO DE NEGOCIOS LTDA</strong>,
              CNPJ 43.537.371/0001-10, com sede na Rua Rubens Gomes Bueno, 227, Sala 6, São Paulo/SP, CEP 04730-000.
            </p>
            <p>
              A EXO oferece agentes de inteligência artificial que atendem clientes finais por voz (telefone) e
              WhatsApp em nome de empresas contratantes (clientes da EXO).
            </p>
            <p>
              Esta política descreve como tratamos dados pessoais quando você (a) usa o painel da EXO como cliente
              empresarial ou (b) interage por WhatsApp/voz com um agente operado pela EXO em nome de uma empresa.
            </p>
          </Section>

          <Section title="2. Dados que coletamos">
            <h3 className="text-white font-semibold mt-4 mb-2">2.1 Quando você é cliente da EXO (acesso ao painel)</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Nome, e-mail, telefone e empresa (cadastro)</li>
              <li>Dados de uso do painel (logs de acesso, ações realizadas)</li>
              <li>Conteúdo que você sobe para a base de conhecimento dos agentes (textos, PDFs, scripts)</li>
              <li>Configurações dos seus agentes (prompts, tom, regras)</li>
            </ul>

            <h3 className="text-white font-semibold mt-6 mb-2">2.2 Quando você conversa com um agente EXO via WhatsApp</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Seu número de WhatsApp (recebido da Meta via WhatsApp Cloud API)</li>
              <li>Seu nome de perfil do WhatsApp</li>
              <li>Conteúdo das mensagens trocadas (texto; futuramente mídia)</li>
              <li>Identificadores técnicos da Meta (wamid, phone_number_id, timestamps)</li>
              <li>Status de entrega das mensagens (enviada, entregue, lida)</li>
            </ul>
            <p className="mt-3">
              Esses dados são processados pela EXO em nome da empresa que opera o canal. A empresa contratante é a
              <strong> Controladora</strong> dos dados; a EXO é <strong>Operadora</strong> nos termos da LGPD (Lei 13.709/2018).
            </p>
          </Section>

          <Section title="3. Como usamos seus dados">
            <p>Os dados são usados exclusivamente para:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Operar o atendimento automatizado solicitado pelo cliente da EXO</li>
              <li>Gerar respostas via modelo de linguagem (Anthropic Claude)</li>
              <li>Manter histórico da conversa para contexto do agente</li>
              <li>Permitir que operadores humanos da empresa visualizem e respondam quando necessário</li>
              <li>Cumprir obrigações legais e regulatórias</li>
              <li>Melhorar a qualidade do serviço (de forma agregada e anonimizada)</li>
            </ul>
            <p className="mt-3">
              <strong>Não vendemos seus dados.</strong> Não usamos suas mensagens para treinar modelos de IA próprios.
            </p>
          </Section>

          <Section title="4. Com quem compartilhamos">
            <p>Compartilhamos dados estritamente com os subprocessadores necessários pra entregar o serviço:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Anthropic, PBC</strong> (EUA) — provedor do modelo Claude que gera as respostas dos agentes.
                A Anthropic não retém o conteúdo das chamadas API por padrão (zero data retention para clientes API).
                Política da Anthropic: <a href="https://www.anthropic.com/legal/privacy" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">anthropic.com/legal/privacy</a>
              </li>
              <li>
                <strong>Meta Platforms, Inc.</strong> (EUA/Irlanda) — fornecedor da WhatsApp Cloud API por onde as mensagens trafegam.
              </li>
              <li>
                <strong>Supabase, Inc.</strong> (EUA, dados em US East) — banco de dados PostgreSQL onde armazenamos
                conversas, configurações e base de conhecimento. Política: <a href="https://supabase.com/privacy" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">supabase.com/privacy</a>
              </li>
              <li>
                <strong>Vercel, Inc.</strong> (EUA) — hospedagem da aplicação web.
              </li>
              <li>
                Empresa contratante da EXO (cliente) — tem acesso às conversas dos seus próprios canais via painel.
              </li>
              <li>
                Autoridades competentes mediante ordem judicial ou requisição legal válida.
              </li>
            </ul>
            <p className="mt-3 text-sm text-[#999]">
              Transferências internacionais ocorrem com base em cláusulas contratuais padrão e mecanismos de adequação previstos na LGPD.
            </p>
          </Section>

          <Section title="5. Por quanto tempo guardamos">
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Conversas e mensagens</strong>: até 12 meses após a última interação, ou enquanto durar o contrato com a empresa contratante (o que for menor)</li>
              <li><strong>Base de conhecimento</strong>: enquanto o cliente da EXO mantiver a configuração</li>
              <li><strong>Dados de cadastro do painel</strong>: enquanto a conta estiver ativa + 5 anos para fins fiscais e legais</li>
              <li><strong>Logs técnicos</strong>: até 90 dias</li>
            </ul>
            <p className="mt-3">
              Você pode solicitar exclusão antecipada — veja a seção 7 ou acesse{" "}
              <Link href="/data-deletion" className="text-blue-400 hover:underline">/data-deletion</Link>.
            </p>
          </Section>

          <Section title="6. Como protegemos">
            <ul className="list-disc pl-6 space-y-1">
              <li>Criptografia em trânsito (HTTPS/TLS) e em repouso (AES-256 no Supabase)</li>
              <li>Validação criptográfica HMAC-SHA256 em todos os webhooks da Meta</li>
              <li>Row Level Security (RLS) no PostgreSQL: cada empresa só enxerga os próprios dados</li>
              <li>Tokens de acesso e chaves de API em variáveis de ambiente isoladas, nunca em código</li>
              <li>Acesso administrativo restrito por role e auditado</li>
              <li>Atualizações de dependências e correções de segurança contínuas</li>
            </ul>
          </Section>

          <Section title="7. Seus direitos (LGPD)">
            <p>Como titular de dados, você tem direito a:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Confirmação e acesso</strong>: saber quais dados temos sobre você</li>
              <li><strong>Correção</strong>: pedir atualização de dados incompletos ou desatualizados</li>
              <li><strong>Anonimização ou eliminação</strong>: pedir exclusão dos seus dados</li>
              <li><strong>Portabilidade</strong>: receber seus dados em formato estruturado</li>
              <li><strong>Informação sobre compartilhamentos</strong></li>
              <li><strong>Revogação do consentimento</strong></li>
            </ul>
            <p className="mt-3">
              Pra exercer esses direitos:{" "}
              <Link href="/data-deletion" className="text-blue-400 hover:underline">use o formulário em /data-deletion</Link>{" "}
              ou escreva pra <a href="mailto:privacidade@exo.tec.br" className="text-blue-400 hover:underline">privacidade@exo.tec.br</a>.
              Respondemos em até 15 dias úteis.
            </p>
          </Section>

          <Section title="8. Cookies">
            <p>
              Usamos cookies estritamente necessários pra autenticação no painel (cookies de sessão do Supabase Auth).
              Não usamos cookies de rastreamento publicitário nem compartilhamos com terceiros pra fins de marketing.
            </p>
          </Section>

          <Section title="9. Crianças e adolescentes">
            <p>
              A plataforma EXO não é direcionada a menores de 18 anos. Não coletamos intencionalmente dados de crianças.
              Se um agente de cliente da EXO for usado num contexto que envolve menores (ex: pediatria), a empresa
              contratante é responsável por obter consentimento dos responsáveis.
            </p>
          </Section>

          <Section title="10. Alterações nesta política">
            <p>
              Podemos atualizar esta política. Quando houver mudança material, avisaremos via e-mail (clientes) e
              destacaremos no painel. A data de "última atualização" no topo é sempre a versão vigente.
            </p>
          </Section>

          <Section title="11. Encarregado de Proteção de Dados (DPO)">
            <p>
              Encarregado: <strong>Antony Guerrero</strong>
              <br />
              Contato: <a href="mailto:dpo@exo.tec.br" className="text-blue-400 hover:underline">dpo@exo.tec.br</a>
              <br />
              Endereço postal: Rua Rubens Gomes Bueno, 227, Sala 6, São Paulo/SP, CEP 04730-000
            </p>
            <p className="mt-3 text-sm text-[#888]">
              Você também pode reclamar à Autoridade Nacional de Proteção de Dados (ANPD): <a href="https://www.gov.br/anpd" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">gov.br/anpd</a>
            </p>
          </Section>
        </div>

        <div className="mt-16 pt-8 border-t border-[#1e1e1e] flex flex-wrap gap-6 text-sm">
          <Link href="/termos" className="text-[#888] hover:text-white transition-colors">Termos de Serviço</Link>
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
