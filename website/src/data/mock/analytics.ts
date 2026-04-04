export const mockAtendimentosPorHora = [
  { hora: "00h", total: 1 }, { hora: "01h", total: 0 }, { hora: "02h", total: 0 },
  { hora: "03h", total: 0 }, { hora: "04h", total: 0 }, { hora: "05h", total: 1 },
  { hora: "06h", total: 3 }, { hora: "07h", total: 8 }, { hora: "08h", total: 15 },
  { hora: "09h", total: 22 }, { hora: "10h", total: 18 }, { hora: "11h", total: 14 },
  { hora: "12h", total: 6 }, { hora: "13h", total: 10 }, { hora: "14h", total: 16 },
  { hora: "15h", total: 19 }, { hora: "16h", total: 13 }, { hora: "17h", total: 8 },
  { hora: "18h", total: 4 }, { hora: "19h", total: 2 }, { hora: "20h", total: 1 },
  { hora: "21h", total: 1 }, { hora: "22h", total: 0 }, { hora: "23h", total: 0 },
];

export const mockVolumePorDia = [
  { dia: "28/03", total: 42 }, { dia: "29/03", total: 38 },
  { dia: "30/03", total: 15 }, { dia: "31/03", total: 48 },
  { dia: "01/04", total: 53 }, { dia: "02/04", total: 47 },
  { dia: "03/04", total: 51 }, { dia: "04/04", total: 34 },
];

export const mockDistribuicaoCanal = [
  { canal: "WhatsApp", total: 312, cor: "#25D366" },
  { canal: "Voz", total: 188, cor: "#8B5CF6" },
];

export const mockVolumePorAgente = [
  { agente: "Recepcionista", total: 210 },
  { agente: "SAC", total: 120 },
  { agente: "Cobrança", total: 95 },
  { agente: "Agendamento", total: 75 },
];

export const mockMotivosContato = [
  { motivo: "Agendar consulta", total: 145 },
  { motivo: "Confirmar horário", total: 98 },
  { motivo: "Informações sobre preços", total: 72 },
  { motivo: "Remarcar consulta", total: 65 },
  { motivo: "Dúvida sobre plano", total: 42 },
  { motivo: "Cancelar consulta", total: 38 },
  { motivo: "Cobrança / pagamento", total: 35 },
  { motivo: "Resultado de exame", total: 28 },
  { motivo: "Reclamação", total: 15 },
  { motivo: "Outros", total: 12 },
];

export const mockSentimento = {
  positivo: 62,
  neutro: 28,
  negativo: 10,
};

export const mockPalavrasFrequentes = [
  { palavra: "consulta", count: 234 },
  { palavra: "horário", count: 189 },
  { palavra: "preço", count: 145 },
  { palavra: "dor", count: 98 },
  { palavra: "plano", count: 87 },
  { palavra: "pagamento", count: 76 },
  { palavra: "limpeza", count: 72 },
  { palavra: "implante", count: 65 },
  { palavra: "clareamento", count: 58 },
  { palavra: "ortodontia", count: 45 },
];

export const mockPerguntasFrequentes = [
  "Qual o horário de funcionamento?",
  "Quanto custa a consulta?",
  "Aceitam convênio?",
  "Como agendar uma consulta?",
  "Podem remarcar minha consulta?",
  "Quanto custa um clareamento?",
  "Fazem implante?",
  "Quais formas de pagamento?",
  "Tem estacionamento?",
  "Atendem criança?",
];

export const mockSugestoesIA = [
  { id: "s1", texto: "42% das ligações perguntam sobre horário de sábado — considere atualizar o FAQ com destaque para esse horário." },
  { id: "s2", texto: "15 pacientes perguntaram sobre faceta de porcelana esta semana, mas o agente não tem essa informação. Adicione na base de conhecimento." },
  { id: "s3", texto: "Taxa de escalonamento subiu 8% esta semana. Principal motivo: negociação de dívidas. Considere ampliar opções de parcelamento." },
];

export const mockUltimosAtendimentos = [
  { id: "a1", contato: "Pedro Henrique", agente: "Recepcionista", canal: "whatsapp" as const, status: "resolvido", hora: "15:48" },
  { id: "a2", contato: "Mariana Rocha", agente: "SAC", canal: "whatsapp" as const, status: "escalonado", hora: "15:45" },
  { id: "a3", contato: "Carlos Lima", agente: "Cobrança", canal: "voz" as const, status: "escalonado", hora: "15:30" },
  { id: "a4", contato: "Ana Ferreira", agente: "Recepcionista", canal: "whatsapp" as const, status: "resolvido", hora: "15:22" },
  { id: "a5", contato: "João Oliveira", agente: "Agendamento", canal: "voz" as const, status: "resolvido", hora: "15:10" },
];

export const mockSparklines = {
  atendimentos: [42, 38, 15, 48, 53, 47, 51],
  resolucao: [88, 91, 85, 90, 87, 92, 89],
  tempoMedio: [3.2, 2.8, 3.5, 3.1, 2.9, 3.0, 2.7],
  tickets: [5, 3, 2, 6, 4, 3, 5],
};
