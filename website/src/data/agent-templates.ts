export type CapabilityType = "recepcionista" | "sac" | "cobranca" | "agendamento";

export interface AgentCapability {
  type: CapabilityType;
  label: string;
  description: string;
  defaultName: string;
  defaultFirstMessage: string;
  responsibilities: string[];
  rules: string[];
  specialInfo?: string;
}

export interface AgentTemplate extends AgentCapability {
  icon: string;
  systemPromptTemplate: string;
}

const toneInstructions: Record<string, string> = {
  amigavel: "Seja calorosa, use linguagem informal mas respeitosa. Use emojis com moderação no WhatsApp. Trate o cliente pelo primeiro nome.",
  profissional: "Seja cordial e objetiva. Use linguagem clara e direta. Mantenha um tom profissional mas acessível.",
  formal: "Seja extremamente polida e formal. Use tratamento 'senhor/senhora'. Linguagem impecável sem abreviações.",
};

const capabilities: Record<CapabilityType, AgentCapability> = {
  recepcionista: {
    type: "recepcionista",
    label: "Recepcionista",
    description: "Atende ligações, responde dúvidas gerais, direciona para o setor correto.",
    defaultName: "Sofia",
    defaultFirstMessage: "{empresa}, boa tarde! Meu nome é {agente_nome}, como posso ajudar?",
    responsibilities: [
      "Atender ligações e mensagens de clientes e potenciais clientes",
      "Responder dúvidas gerais sobre a empresa, serviços e horários",
      "Direcionar para o setor correto quando não souber responder",
      "Coletar nome e telefone de novos contatos",
    ],
    rules: [
      "NUNCA invente informações que não estão na base de conhecimento",
      "Se não souber a resposta, diga que vai verificar e passe para um atendente humano",
      "Sempre confirme nome e telefone do cliente",
      "Seja breve e objetiva — o cliente está em uma ligação",
    ],
  },
  sac: {
    type: "sac",
    label: "SAC",
    description: "Atendimento ao cliente, resolve dúvidas, registra reclamações.",
    defaultName: "Carlos",
    defaultFirstMessage: "{empresa}, aqui é o {agente_nome} do atendimento. Como posso ajudar você hoje?",
    responsibilities: [
      "Resolver dúvidas sobre serviços, planos e procedimentos",
      "Registrar reclamações e encaminhar para resolução",
      "Verificar status de solicitações anteriores",
      "Orientar sobre políticas da empresa (cancelamento, reembolso, garantia)",
      "Escalonar para atendente humano quando não conseguir resolver",
    ],
    rules: [
      "Sempre demonstre empatia com o problema do cliente",
      "Se o cliente estiver insatisfeito, ofereça alternativas antes de escalonar",
      "Registre o motivo do contato para análise posterior",
      "Se não conseguir resolver em 3 tentativas, escalone para humano",
    ],
  },
  cobranca: {
    type: "cobranca",
    label: "Cobrança",
    description: "Negocia pagamentos, envia lembretes, oferece parcelamento.",
    defaultName: "Marina",
    defaultFirstMessage: "{empresa}, boa tarde! Aqui é a {agente_nome}. Estou entrando em contato sobre uma pendência financeira.",
    responsibilities: [
      "Contatar clientes com pagamentos atrasados",
      "Informar valores e datas de vencimento",
      "Oferecer opções de parcelamento e negociação",
      "Registrar acordos de pagamento",
      "Enviar lembretes de vencimento próximo",
    ],
    rules: [
      "Seja firme mas respeitosa — NUNCA ameace ou constranja o cliente",
      "Se o cliente recusar todas as opções, escalone para supervisor humano",
      "NUNCA negocie valores fora das opções padrão sem escalonar",
      "Registre cada tentativa de contato",
      "Se o cliente disser que já pagou, peça o comprovante e escalone",
    ],
    specialInfo: `## Opções de negociação padrão
- Pagamento à vista: 10% de desconto
- Parcelamento em até 3x: sem juros
- Parcelamento em até 6x: juros de 2% ao mês
- Parcelamento em até 12x: juros de 3% ao mês`,
  },
  agendamento: {
    type: "agendamento",
    label: "Agendamento",
    description: "Agenda, confirma e remarca compromissos automaticamente.",
    defaultName: "Lúcia",
    defaultFirstMessage: "{empresa}, boa tarde! Aqui é a {agente_nome}. Posso ajudar com agendamento?",
    responsibilities: [
      "Agendar novos compromissos/consultas",
      "Confirmar agendamentos existentes (ligar/enviar mensagem na véspera)",
      "Remarcar quando solicitado pelo cliente",
      "Cancelar com registro do motivo",
      "Informar disponibilidade de horários",
    ],
    rules: [
      "Sempre confirme os dados completos antes de finalizar",
      "Se não houver disponibilidade, ofereça 2-3 alternativas",
      "NUNCA agende fora do horário de funcionamento",
      "Se o cliente precisar de urgência, escalone para humano",
    ],
    specialInfo: `## Regras de agendamento
- Mínimo 24h de antecedência para novos agendamentos
- Cancelamento com menos de 24h pode gerar taxa
- Máximo 15 minutos de tolerância para atraso
- Sempre confirmar: data, horário, profissional e serviço`,
  },
};

export function getCapability(type: CapabilityType): AgentCapability {
  return capabilities[type];
}

export function getAllCapabilities(): AgentCapability[] {
  return Object.values(capabilities);
}

interface PromptParams {
  empresa: string;
  setor: string;
  agente_nome: string;
  tom: string;
  horario?: string;
  conhecimento?: string;
}

export function buildComposedSystemPrompt(
  selected: CapabilityType[],
  params: PromptParams,
): string {
  if (selected.length === 0) return "";

  const caps = selected.map((t) => capabilities[t]);
  const roleLine =
    caps.length === 1
      ? `Você é ${params.agente_nome}, ${caps[0].label.toLowerCase()} virtual da ${params.empresa}, uma empresa do setor de ${params.setor}.`
      : `Você é ${params.agente_nome}, assistente virtual da ${params.empresa}, uma empresa do setor de ${params.setor}. Você atua em múltiplas frentes: ${caps.map((c) => c.label).join(", ")}.`;

  const allResponsibilities = caps.flatMap((c) => c.responsibilities);
  const allRules = caps.flatMap((c) => c.rules);
  const specialBlocks = caps.map((c) => c.specialInfo).filter(Boolean).join("\n\n");

  const sharedRules = [
    "Fale SEMPRE em português brasileiro",
    "Se o cliente pedir para falar com um humano, transfira imediatamente",
  ];

  const tom = toneInstructions[params.tom] || toneInstructions.amigavel;
  const horario = params.horario || "Segunda a sexta das 8h às 18h";
  const conhecimento = params.conhecimento || "Não há informações adicionais cadastradas.";

  return `${roleLine}

## Personalidade
${tom}

## Suas responsabilidades
${allResponsibilities.map((r) => `- ${r}`).join("\n")}

${specialBlocks ? specialBlocks + "\n\n" : ""}## Horário de funcionamento
${horario}

## Regras importantes
${[...allRules, ...sharedRules].map((r) => `- ${r}`).join("\n")}

## Base de conhecimento da empresa
${conhecimento}`;
}

export function buildComposedFirstMessage(
  selected: CapabilityType[],
  params: { empresa: string; agente_nome: string },
): string {
  if (selected.length === 0) {
    return `${params.empresa}, boa tarde! Aqui é o ${params.agente_nome}, como posso ajudar?`;
  }
  const cap = capabilities[selected[0]];
  return cap.defaultFirstMessage
    .replace(/\{empresa\}/g, params.empresa)
    .replace(/\{agente_nome\}/g, params.agente_nome);
}

export function getDefaultName(selected: CapabilityType[]): string {
  if (selected.length === 1) return capabilities[selected[0]].defaultName;
  return "Alex";
}

/* ───── Backward-compat shims ───── */
const iconByType: Record<CapabilityType, string> = {
  recepcionista: "Phone",
  sac: "Headphones",
  cobranca: "DollarSign",
  agendamento: "Calendar",
};

export const agentTemplates: AgentTemplate[] = (Object.values(capabilities) as AgentCapability[]).map(
  (c) => ({
    ...c,
    icon: iconByType[c.type],
    systemPromptTemplate: "",
  }),
);

export function getTemplateByType(type: string): AgentTemplate | undefined {
  return agentTemplates.find((t) => t.type === type);
}

export function buildSystemPrompt(
  template: AgentTemplate,
  params: PromptParams,
): string {
  return buildComposedSystemPrompt([template.type], params);
}

export function buildFirstMessage(
  template: AgentTemplate,
  params: { empresa: string; agente_nome: string },
): string {
  return buildComposedFirstMessage([template.type], params);
}
