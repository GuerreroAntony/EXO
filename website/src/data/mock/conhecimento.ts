export interface KnowledgeItem {
  id: string;
  pergunta: string;
  resposta: string;
  status: "publicado" | "rascunho" | "modificado";
}

export interface KnowledgeCategory {
  id: string;
  nome: string;
  items: KnowledgeItem[];
}

export const mockConhecimento: KnowledgeCategory[] = [
  {
    id: "cat1",
    nome: "Horários e Funcionamento",
    items: [
      { id: "k1", pergunta: "Qual o horário de funcionamento?", resposta: "A Clínica Sorriso funciona de segunda a sexta das 8h às 18h. Aos sábados das 8h às 12h.", status: "publicado" },
      { id: "k2", pergunta: "Atendem em feriados?", resposta: "Não atendemos em feriados nacionais. Em caso de urgência, ligue para o plantão: (11) 99999-0000.", status: "publicado" },
      { id: "k3", pergunta: "Como funciona o plantão de emergência?", resposta: "O plantão funciona 24h para pacientes cadastrados. Ligue para (11) 99999-0000 e será direcionado ao dentista de plantão.", status: "rascunho" },
    ],
  },
  {
    id: "cat2",
    nome: "Serviços e Procedimentos",
    items: [
      { id: "k4", pergunta: "Quais serviços a clínica oferece?", resposta: "Oferecemos: limpeza, restauração, canal, extração, implante, ortodontia, clareamento, facetas e próteses.", status: "publicado" },
      { id: "k5", pergunta: "Quanto custa um clareamento?", resposta: "O clareamento a laser custa R$ 800,00 (sessão única) ou R$ 500,00 (moldeira para casa). Avaliação gratuita.", status: "publicado" },
      { id: "k6", pergunta: "Quanto tempo demora um implante?", resposta: "O processo completo leva de 4 a 6 meses, incluindo cicatrização. A cirurgia em si dura cerca de 1 hora.", status: "publicado" },
      { id: "k7", pergunta: "Fazem ortodontia invisível?", resposta: "Sim, trabalhamos com alinhadores invisíveis. O tratamento dura de 6 a 18 meses. Consulte valores na avaliação.", status: "modificado" },
    ],
  },
  {
    id: "cat3",
    nome: "Preços e Pagamento",
    items: [
      { id: "k8", pergunta: "Quais formas de pagamento aceitam?", resposta: "Aceitamos dinheiro, PIX, cartão de débito e crédito (até 12x sem juros) e boleto bancário.", status: "publicado" },
      { id: "k9", pergunta: "Tem plano mensal?", resposta: "Sim! O plano individual custa R$ 89,90/mês e o familiar (até 4 pessoas) R$ 199,90/mês. Inclui limpeza semestral e descontos em procedimentos.", status: "publicado" },
      { id: "k10", pergunta: "A primeira consulta é paga?", resposta: "A avaliação inicial é gratuita para novos pacientes. Inclui exame clínico e radiografia panorâmica.", status: "publicado" },
    ],
  },
  {
    id: "cat4",
    nome: "Políticas e Cancelamento",
    items: [
      { id: "k11", pergunta: "Como cancelo uma consulta?", resposta: "Cancele com pelo menos 24h de antecedência pelo WhatsApp ou telefone. Cancelamentos em menos de 24h podem gerar taxa de R$ 50,00.", status: "publicado" },
      { id: "k12", pergunta: "Qual a política de atraso?", resposta: "Toleramos até 15 minutos de atraso. Após isso, a consulta pode ser remarcada dependendo da disponibilidade.", status: "publicado" },
      { id: "k13", pergunta: "Como funciona a garantia dos procedimentos?", resposta: "Restaurações têm garantia de 1 ano. Implantes de 5 anos. Próteses de 2 anos. Sujeito a retornos periódicos.", status: "rascunho" },
      { id: "k14", pergunta: "Atendem por convênio?", resposta: "Trabalhamos com os convênios: Amil Dental, Bradesco Saúde, SulAmérica e Odontoprev. Consulte cobertura na avaliação.", status: "publicado" },
    ],
  },
];

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export const mockChatMessages: ChatMessage[] = [
  { id: "m1", role: "user", content: "Agora atendemos aos sábados das 8h às 12h" },
  { id: "m2", role: "assistant", content: "Entendi! Atualizei a seção \"Horários e Funcionamento\" com o novo horário de sábado. Quer que eu também atualize a resposta automática sobre disponibilidade?" },
  { id: "m3", role: "user", content: "Sim, e adiciona que a primeira consulta é gratuita" },
  { id: "m4", role: "assistant", content: "Pronto! Adicionei a informação sobre avaliação gratuita na seção \"Preços e Pagamento\". A resposta agora menciona que inclui exame clínico e radiografia panorâmica. Quer revisar?" },
];
