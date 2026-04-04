export interface Contato {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  documento: string;
  canal_preferido: "whatsapp" | "voz";
  tags: string[];
  criado_em: string;
  ultima_interacao: string;
  total_atendimentos: number;
  notas: Nota[];
  timeline: TimelineItem[];
}

export interface Nota {
  id: string;
  texto: string;
  autor: string;
  criado_em: string;
}

export interface TimelineItem {
  id: string;
  tipo: "atendimento" | "agendamento" | "fatura" | "ticket";
  data: string;
  agente: string;
  resumo: string;
  status: string;
  canal?: "voz" | "whatsapp";
}

export const mockContatos: Contato[] = [
  {
    id: "c1",
    nome: "Maria Silva Santos",
    telefone: "(11) 99876-5432",
    email: "maria.silva@email.com",
    documento: "123.456.789-00",
    canal_preferido: "whatsapp",
    tags: ["VIP", "plano mensal"],
    criado_em: "2026-01-15T10:30:00",
    ultima_interacao: "2026-04-03T14:20:00",
    total_atendimentos: 12,
    notas: [
      { id: "n1", texto: "Paciente prefere atendimento no período da manhã. Tem alergia a látex.", autor: "Dr. Ricardo", criado_em: "2026-03-20T09:00:00" },
      { id: "n2", texto: "Solicitou orçamento para implante dentário.", autor: "Recepcionista IA", criado_em: "2026-04-01T11:15:00" },
    ],
    timeline: [
      { id: "t1", tipo: "atendimento", data: "2026-04-03T14:20:00", agente: "Recepcionista", resumo: "Confirmação de consulta para 07/04", status: "resolvido", canal: "whatsapp" },
      { id: "t2", tipo: "agendamento", data: "2026-04-07T09:00:00", agente: "Agendamento", resumo: "Limpeza dental - Dr. Ricardo", status: "agendado" },
      { id: "t3", tipo: "fatura", data: "2026-03-15T00:00:00", agente: "Cobrança", resumo: "Mensalidade março - R$ 350,00", status: "pago" },
      { id: "t4", tipo: "atendimento", data: "2026-03-10T16:45:00", agente: "SAC", resumo: "Dúvida sobre cobertura do plano", status: "resolvido", canal: "voz" },
      { id: "t5", tipo: "ticket", data: "2026-02-28T11:00:00", agente: "SAC", resumo: "Reclamação sobre tempo de espera", status: "fechado" },
    ],
  },
  {
    id: "c2",
    nome: "João Pedro Oliveira",
    telefone: "(11) 98765-4321",
    email: "joao.oliveira@empresa.com",
    documento: "987.654.321-00",
    canal_preferido: "voz",
    tags: ["novo"],
    criado_em: "2026-03-28T09:15:00",
    ultima_interacao: "2026-04-02T10:30:00",
    total_atendimentos: 2,
    notas: [],
    timeline: [
      { id: "t6", tipo: "atendimento", data: "2026-04-02T10:30:00", agente: "Recepcionista", resumo: "Primeiro contato - agendou avaliação", status: "resolvido", canal: "voz" },
      { id: "t7", tipo: "agendamento", data: "2026-04-10T14:00:00", agente: "Agendamento", resumo: "Avaliação geral - Dra. Ana", status: "agendado" },
    ],
  },
  {
    id: "c3",
    nome: "Ana Carolina Ferreira",
    telefone: "(11) 97654-3210",
    email: "ana.ferreira@gmail.com",
    documento: "456.789.123-00",
    canal_preferido: "whatsapp",
    tags: ["VIP", "ortodontia"],
    criado_em: "2025-08-10T14:00:00",
    ultima_interacao: "2026-04-04T08:45:00",
    total_atendimentos: 24,
    notas: [
      { id: "n3", texto: "Tratamento ortodôntico em andamento. Próxima troca de arco em maio.", autor: "Dra. Ana", criado_em: "2026-03-15T10:00:00" },
    ],
    timeline: [
      { id: "t8", tipo: "atendimento", data: "2026-04-04T08:45:00", agente: "Recepcionista", resumo: "Remarcou consulta de abril para dia 12", status: "resolvido", canal: "whatsapp" },
      { id: "t9", tipo: "agendamento", data: "2026-04-12T10:00:00", agente: "Agendamento", resumo: "Ajuste ortodôntico - Dra. Ana", status: "confirmado" },
      { id: "t10", tipo: "fatura", data: "2026-04-01T00:00:00", agente: "Cobrança", resumo: "Parcela 8/24 ortodontia - R$ 450,00", status: "pendente" },
    ],
  },
  {
    id: "c4",
    nome: "Carlos Eduardo Lima",
    telefone: "(11) 96543-2109",
    email: "carlos.lima@hotmail.com",
    documento: "789.123.456-00",
    canal_preferido: "voz",
    tags: ["inadimplente"],
    criado_em: "2025-11-20T16:30:00",
    ultima_interacao: "2026-04-01T15:00:00",
    total_atendimentos: 8,
    notas: [
      { id: "n4", texto: "Parcelas atrasadas desde fevereiro. Negociação em andamento.", autor: "Cobrança IA", criado_em: "2026-03-25T14:00:00" },
    ],
    timeline: [
      { id: "t11", tipo: "atendimento", data: "2026-04-01T15:00:00", agente: "Cobrança", resumo: "Tentativa de negociação - sem acordo", status: "escalonado", canal: "voz" },
      { id: "t12", tipo: "fatura", data: "2026-03-01T00:00:00", agente: "Cobrança", resumo: "Mensalidade março - R$ 350,00", status: "atrasado" },
      { id: "t13", tipo: "fatura", data: "2026-02-01T00:00:00", agente: "Cobrança", resumo: "Mensalidade fevereiro - R$ 350,00", status: "atrasado" },
    ],
  },
  {
    id: "c5",
    nome: "Fernanda Souza Costa",
    telefone: "(11) 95432-1098",
    email: "fernanda.costa@email.com",
    documento: "321.654.987-00",
    canal_preferido: "whatsapp",
    tags: ["plano familiar"],
    criado_em: "2025-06-05T11:00:00",
    ultima_interacao: "2026-03-30T09:20:00",
    total_atendimentos: 15,
    notas: [],
    timeline: [
      { id: "t14", tipo: "atendimento", data: "2026-03-30T09:20:00", agente: "SAC", resumo: "Dúvida sobre inclusão de dependente no plano", status: "resolvido", canal: "whatsapp" },
      { id: "t15", tipo: "agendamento", data: "2026-04-05T11:00:00", agente: "Agendamento", resumo: "Limpeza - filho Lucas (8 anos)", status: "agendado" },
    ],
  },
  {
    id: "c6",
    nome: "Roberto Almeida Jr.",
    telefone: "(11) 94321-0987",
    email: "roberto.jr@empresa.com",
    documento: "654.987.321-00",
    canal_preferido: "voz",
    tags: [],
    criado_em: "2026-02-14T13:45:00",
    ultima_interacao: "2026-03-28T17:10:00",
    total_atendimentos: 5,
    notas: [
      { id: "n5", texto: "Paciente ansioso. Necessita sedação para procedimentos.", autor: "Dr. Ricardo", criado_em: "2026-02-20T15:00:00" },
    ],
    timeline: [
      { id: "t16", tipo: "atendimento", data: "2026-03-28T17:10:00", agente: "Recepcionista", resumo: "Cancelou consulta por motivos pessoais", status: "resolvido", canal: "voz" },
      { id: "t17", tipo: "ticket", data: "2026-03-15T10:00:00", agente: "SAC", resumo: "Solicitação de histórico de tratamento", status: "resolvido" },
    ],
  },
  {
    id: "c7",
    nome: "Lúcia Helena Martins",
    telefone: "(11) 93210-9876",
    email: "lucia.martins@gmail.com",
    documento: "147.258.369-00",
    canal_preferido: "whatsapp",
    tags: ["VIP", "implante"],
    criado_em: "2025-04-01T10:00:00",
    ultima_interacao: "2026-04-04T11:30:00",
    total_atendimentos: 30,
    notas: [
      { id: "n6", texto: "Finalizou implante superior. Acompanhamento semestral a partir de julho.", autor: "Dr. Ricardo", criado_em: "2026-04-02T16:00:00" },
    ],
    timeline: [
      { id: "t18", tipo: "atendimento", data: "2026-04-04T11:30:00", agente: "Recepcionista", resumo: "Agendou retorno pós-implante", status: "resolvido", canal: "whatsapp" },
      { id: "t19", tipo: "agendamento", data: "2026-04-15T09:00:00", agente: "Agendamento", resumo: "Retorno implante - Dr. Ricardo", status: "confirmado" },
      { id: "t20", tipo: "fatura", data: "2026-04-01T00:00:00", agente: "Cobrança", resumo: "Parcela final implante - R$ 1.200,00", status: "pago" },
    ],
  },
  {
    id: "c8",
    nome: "Pedro Henrique Dias",
    telefone: "(11) 92109-8765",
    email: "pedro.dias@outlook.com",
    documento: "258.369.147-00",
    canal_preferido: "whatsapp",
    tags: ["novo"],
    criado_em: "2026-04-03T16:00:00",
    ultima_interacao: "2026-04-03T16:00:00",
    total_atendimentos: 1,
    notas: [],
    timeline: [
      { id: "t21", tipo: "atendimento", data: "2026-04-03T16:00:00", agente: "Recepcionista", resumo: "Primeiro contato via WhatsApp - pediu informações sobre clareamento", status: "resolvido", canal: "whatsapp" },
    ],
  },
];
