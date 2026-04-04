export interface Escalonamento {
  id: string;
  contato_nome: string;
  contato_telefone: string;
  motivo: string;
  agente_origem: string;
  canal: "voz" | "whatsapp";
  prioridade: "urgente" | "alta" | "media" | "baixa";
  status: "aguardando" | "em atendimento" | "resolvido";
  tempo_aguardando: string;
  criado_em: string;
  transcricao: string[];
}

export const mockEscalonamentos: Escalonamento[] = [
  {
    id: "e1",
    contato_nome: "Carlos Eduardo Lima",
    contato_telefone: "(11) 96543-2109",
    motivo: "Paciente recusou todas as opções de negociação. Solicitou falar com responsável.",
    agente_origem: "Cobrança",
    canal: "voz",
    prioridade: "urgente",
    status: "aguardando",
    tempo_aguardando: "45min",
    criado_em: "2026-04-04T14:15:00",
    transcricao: [
      "Agente: Bom dia, Carlos. Estou entrando em contato sobre as parcelas de fevereiro e março.",
      "Carlos: Já sei o que vão falar. Não tenho como pagar agora.",
      "Agente: Entendo. Posso oferecer um parcelamento em até 6x com desconto de 15%.",
      "Carlos: Não quero parcelamento. Quero falar com alguém de verdade, não com robô.",
      "Agente: Vou transferir seu caso para um atendente. Aguarde o retorno.",
    ],
  },
  {
    id: "e2",
    contato_nome: "Mariana Rocha",
    contato_telefone: "(11) 91234-5678",
    motivo: "Paciente relatou dor intensa após procedimento. Caso clínico urgente.",
    agente_origem: "SAC",
    canal: "whatsapp",
    prioridade: "urgente",
    status: "aguardando",
    tempo_aguardando: "12min",
    criado_em: "2026-04-04T15:48:00",
    transcricao: [
      "Mariana: Estou com muita dor no dente que fiz canal semana passada",
      "Agente: Sinto muito, Mariana. A dor é constante ou só ao morder?",
      "Mariana: Constante e pulsante. Não consigo nem dormir",
      "Agente: Isso pode requerer atenção imediata. Vou escalonar para o dentista avaliar e retornar o mais rápido possível.",
    ],
  },
  {
    id: "e3",
    contato_nome: "Fernanda Souza Costa",
    contato_telefone: "(11) 95432-1098",
    motivo: "Pergunta sobre cobertura de procedimento não listado na base de conhecimento.",
    agente_origem: "SAC",
    canal: "whatsapp",
    prioridade: "media",
    status: "em atendimento",
    tempo_aguardando: "2h 15min",
    criado_em: "2026-04-04T13:45:00",
    transcricao: [
      "Fernanda: O plano cobre faceta de porcelana?",
      "Agente: Deixe-me verificar... Não encontrei essa informação na nossa base. Vou encaminhar sua dúvida para a equipe.",
    ],
  },
  {
    id: "e4",
    contato_nome: "Paulo Mendes",
    contato_telefone: "(11) 90987-6543",
    motivo: "Cliente insatisfeito com resultado de clareamento. Quer reembolso.",
    agente_origem: "SAC",
    canal: "voz",
    prioridade: "alta",
    status: "aguardando",
    tempo_aguardando: "1h 30min",
    criado_em: "2026-04-04T14:30:00",
    transcricao: [
      "Paulo: Fiz clareamento há duas semanas e meus dentes voltaram a escurecer.",
      "Agente: Lamento ouvir isso. O resultado pode variar dependendo dos hábitos alimentares.",
      "Paulo: Paguei R$ 800 e não estou satisfeito. Quero meu dinheiro de volta.",
      "Agente: Entendo sua frustração. Vou encaminhar para nossa equipe avaliar as opções.",
    ],
  },
  {
    id: "e5",
    contato_nome: "Lúcia Helena Martins",
    contato_telefone: "(11) 93210-9876",
    motivo: "Solicitação de laudo médico para plano de saúde. Agente não tem permissão.",
    agente_origem: "Recepcionista",
    canal: "whatsapp",
    prioridade: "baixa",
    status: "resolvido",
    tempo_aguardando: "—",
    criado_em: "2026-04-04T10:00:00",
    transcricao: [
      "Lúcia: Preciso de um laudo do meu implante para enviar ao plano de saúde.",
      "Agente: Laudos médicos precisam ser emitidos pelo profissional responsável. Vou encaminhar sua solicitação.",
    ],
  },
];
