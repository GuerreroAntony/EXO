// ===== NAVIGATION =====
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');
const pageTitle = document.getElementById('pageTitle');
const sidebar = document.getElementById('sidebar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');

const pageTitles = {
  dashboard: 'Dashboard',
  agents: 'Agentes IA',
  calls: 'Chamadas',
  whatsapp: 'WhatsApp',
  architecture: 'Arquitetura',
  settings: 'Configuracoes'
};

navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const targetPage = item.dataset.page;

    navItems.forEach(n => n.classList.remove('active'));
    item.classList.add('active');

    pages.forEach(p => p.classList.remove('active'));
    document.getElementById(`page-${targetPage}`).classList.add('active');

    pageTitle.textContent = pageTitles[targetPage] || 'Dashboard';

    // Close mobile sidebar
    sidebar.classList.remove('open');
  });
});

// Mobile menu
mobileMenuBtn.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
  if (window.innerWidth <= 768 &&
      !sidebar.contains(e.target) &&
      !mobileMenuBtn.contains(e.target)) {
    sidebar.classList.remove('open');
  }
});

// ===== CLOCK =====
function updateClock() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = now.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });
  document.getElementById('headerTime').textContent = `${dateStr} - ${timeStr}`;
}
updateClock();
setInterval(updateClock, 1000);

// ===== AGENT STATUS =====
const agents = [
  { name: 'Recepcionista', emoji: '👋', model: 'claude-sonnet-4-6', active: 2 },
  { name: 'Cobranca', emoji: '💰', model: 'claude-sonnet-4-6', active: 1 },
  { name: 'SAC', emoji: '🎧', model: 'claude-haiku-4-5', active: 3 },
  { name: 'Agendamento', emoji: '📅', model: 'claude-haiku-4-5', active: 1 }
];

function renderAgentStatus() {
  const list = document.getElementById('agentStatusList');
  list.innerHTML = agents.map(a => `
    <div class="agent-status-item">
      <span class="agent-status-emoji">${a.emoji}</span>
      <div class="agent-status-info">
        <div class="agent-status-name">${a.name}</div>
        <div class="agent-status-model">${a.model}</div>
      </div>
      <span class="agent-status-badge online">Online</span>
      <span class="agent-active-count">${a.active} ativo${a.active > 1 ? 's' : ''}</span>
    </div>
  `).join('');
}
renderAgentStatus();

// ===== RECENT ACTIVITY =====
const activities = [
  { icon: '📞', text: 'Maria Silva ligou - encaminhada para Agendamento', time: 'agora' },
  { icon: '✅', text: 'Consulta agendada: Joao Santos - Limpeza 14h', time: '2 min atras' },
  { icon: '💬', text: 'WhatsApp: Carlos Souza perguntou sobre fatura', time: '5 min atras' },
  { icon: '🔺', text: 'Escalacao: Ana Lima solicitou reembolso de R$350', time: '8 min atras' },
  { icon: '💰', text: 'Negociacao concluida: Pedro Costa - 3x R$150', time: '12 min atras' },
  { icon: '📞', text: 'Fernanda Oliveira ligou - duvida sobre horario', time: '15 min atras' },
  { icon: '✅', text: 'Ticket #1247 resolvido pelo SAC automaticamente', time: '18 min atras' },
  { icon: '💬', text: 'Lembrete enviado: 5 pacientes com consulta amanha', time: '22 min atras' }
];

function renderActivity() {
  const list = document.getElementById('activityList');
  list.innerHTML = activities.map(a => `
    <div class="activity-item">
      <span class="activity-icon">${a.icon}</span>
      <div class="activity-content">
        <div class="activity-text">${a.text}</div>
        <div class="activity-time">${a.time}</div>
      </div>
    </div>
  `).join('');
}
renderActivity();

// ===== ACTIVE CALLS =====
const activeCalls = [
  { number: '+55 11 9****-3847', agent: 'Recepcionista → Agendamento', duration: 145, status: 'Em atendimento' },
  { number: '+55 21 9****-5521', agent: 'Cobranca', duration: 203, status: 'Negociando pagamento' },
  { number: '+55 11 9****-1199', agent: 'SAC', duration: 78, status: 'Consultando sistema' },
  { number: '+55 31 9****-8834', agent: 'Recepcionista', duration: 12, status: 'Identificando necessidade' },
  { number: '+55 11 9****-4402', agent: 'Agendamento', duration: 92, status: 'Confirmando horario' }
];

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function renderActiveCalls() {
  const grid = document.getElementById('activeCallsGrid');
  grid.innerHTML = activeCalls.map(c => `
    <div class="active-call-card">
      <div class="active-call-number">${c.number}</div>
      <div class="active-call-agent">Agente: ${c.agent}</div>
      <div class="active-call-duration">${formatDuration(c.duration)}</div>
      <div class="active-call-status">${c.status}</div>
    </div>
  `).join('');
}
renderActiveCalls();

// Update call durations every second
setInterval(() => {
  activeCalls.forEach(c => c.duration++);
  renderActiveCalls();
}, 1000);

// ===== CALL LOG =====
const callLog = [
  { time: '14:32', number: '+55 11 9****-7721', agent: 'Recepcionista → SAC', duration: '3:45', status: 'completed', summary: 'Duvida sobre horario de funcionamento - resolvida' },
  { time: '14:28', number: '+55 21 9****-3301', agent: 'Cobranca', duration: '5:12', status: 'completed', summary: 'Negociacao de parcelas - acordo em 3x' },
  { time: '14:22', number: '+55 11 9****-9987', agent: 'Agendamento', duration: '2:30', status: 'completed', summary: 'Agendou clareamento para quinta 15h' },
  { time: '14:15', number: '+55 31 9****-1122', agent: 'SAC', duration: '4:18', status: 'escalated', summary: 'Pediu cancelamento - escalado p/ humano' },
  { time: '14:08', number: '+55 11 9****-5544', agent: 'Recepcionista', duration: '0:45', status: 'completed', summary: 'Perguntou endereco - respondida direto' },
  { time: '13:55', number: '+55 21 9****-8877', agent: 'Cobranca', duration: '—', status: 'missed', summary: 'Sem atendimento - tentativa 1/2' },
  { time: '13:48', number: '+55 11 9****-2233', agent: 'SAC', duration: '6:22', status: 'escalated', summary: 'Reclamacao sobre atendimento anterior' },
  { time: '13:40', number: '+55 11 9****-6655', agent: 'Agendamento', duration: '1:58', status: 'completed', summary: 'Remarcou consulta de terca para quarta' },
  { time: '13:33', number: '+55 31 9****-4499', agent: 'Recepcionista → Cobranca', duration: '4:05', status: 'completed', summary: 'Quitou boleto atrasado via PIX' },
  { time: '13:25', number: '+55 21 9****-7788', agent: 'SAC', duration: '2:15', status: 'completed', summary: 'Solicitou 2a via de nota fiscal' }
];

function renderCallLog() {
  const tbody = document.getElementById('callLogBody');
  tbody.innerHTML = callLog.map(c => `
    <tr>
      <td>${c.time}</td>
      <td style="font-family:monospace">${c.number}</td>
      <td>${c.agent}</td>
      <td>${c.duration}</td>
      <td><span class="status-badge ${c.status}">${c.status === 'completed' ? 'Concluida' : c.status === 'escalated' ? 'Escalada' : 'Perdida'}</span></td>
      <td style="color:var(--text-secondary)">${c.summary}</td>
    </tr>
  `).join('');
}
renderCallLog();

// ===== WHATSAPP CONVERSATIONS =====
const conversations = [
  {
    id: 1, name: 'Carlos Souza', initials: 'CS', agent: 'SAC',
    preview: 'Entendi, vou verificar o status do seu pedido...', time: '14:35', unread: 2,
    messages: [
      { type: 'incoming', text: 'Oi, preciso de ajuda com meu pedido', time: '14:30' },
      { type: 'outgoing', text: 'Ola Carlos! Aqui e a assistente virtual da Clinica Sorriso. Claro, posso te ajudar! Qual o numero do seu pedido?', time: '14:31', agent: 'SAC' },
      { type: 'incoming', text: 'E o pedido #4521, fiz uma compra de kit de clareamento', time: '14:33' },
      { type: 'outgoing', text: 'Entendi, vou verificar o status do seu pedido #4521. Um momento...', time: '14:35', agent: 'SAC' }
    ]
  },
  {
    id: 2, name: 'Ana Lima', initials: 'AL', agent: 'Cobranca',
    preview: 'Posso parcelar em 3 vezes?', time: '14:20', unread: 0,
    messages: [
      { type: 'incoming', text: 'Recebi uma mensagem sobre uma fatura pendente', time: '14:10' },
      { type: 'outgoing', text: 'Ola Ana! Sim, identificamos uma fatura de R$450,00 com vencimento em 15/03. Gostaria de negociar?', time: '14:12', agent: 'Cobranca' },
      { type: 'incoming', text: 'Posso parcelar em 3 vezes?', time: '14:20' },
      { type: 'outgoing', text: 'Claro! Posso oferecer 3x de R$150,00 sem juros. Deseja prosseguir?', time: '14:21', agent: 'Cobranca' }
    ]
  },
  {
    id: 3, name: 'Fernanda Oliveira', initials: 'FO', agent: 'Agendamento',
    preview: 'Perfeito, fica marcado para quinta!', time: '14:15', unread: 1,
    messages: [
      { type: 'incoming', text: 'Quero marcar uma limpeza', time: '14:05' },
      { type: 'outgoing', text: 'Ola Fernanda! Temos horarios disponiveis para limpeza. Preferencia de dia e horario?', time: '14:06', agent: 'Agendamento' },
      { type: 'incoming', text: 'Quinta de tarde pode ser?', time: '14:10' },
      { type: 'outgoing', text: 'Temos quinta as 14h ou as 16h. Qual prefere?', time: '14:11', agent: 'Agendamento' },
      { type: 'incoming', text: '14h ta otimo', time: '14:13' },
      { type: 'outgoing', text: 'Perfeito, fica marcado para quinta as 14h - Limpeza dental. Voce recebera um lembrete na vespera!', time: '14:15', agent: 'Agendamento' }
    ]
  },
  {
    id: 4, name: 'Roberto Mendes', initials: 'RM', agent: 'SAC',
    preview: 'Ja encaminhei para nossa equipe verificar', time: '13:55', unread: 0,
    messages: [
      { type: 'incoming', text: 'Fiz um tratamento semana passada e estou com dor', time: '13:45' },
      { type: 'outgoing', text: 'Ola Roberto, sinto muito por isso! Pode me descrever melhor a dor? Em qual dente foi o tratamento?', time: '13:46', agent: 'SAC' },
      { type: 'incoming', text: 'Foi no dente de tras, lado esquerdo. Doi quando mastigo', time: '13:50' },
      { type: 'outgoing', text: 'Entendi. Isso pode ser normal nos primeiros dias apos o procedimento, mas vou encaminhar para o Dr. verificar. Ja encaminhei para nossa equipe verificar e entraremos em contato para agendar um retorno.', time: '13:55', agent: 'SAC' }
    ]
  },
  {
    id: 5, name: 'Juliana Costa', initials: 'JC', agent: 'Agendamento',
    preview: 'Remarcado! Nova data: sexta 10h', time: '13:40', unread: 0,
    messages: [
      { type: 'incoming', text: 'Preciso remarcar minha consulta de amanha', time: '13:30' },
      { type: 'outgoing', text: 'Ola Juliana! Sem problemas. Sua consulta esta marcada para amanha as 10h - Avaliacao ortodontica. Para quando gostaria de remarcar?', time: '13:32', agent: 'Agendamento' },
      { type: 'incoming', text: 'Pode ser sexta mesmo horario?', time: '13:35' },
      { type: 'outgoing', text: 'Sexta as 10h esta disponivel! Remarcado! Nova data: sexta 10h - Avaliacao ortodontica. Ate la!', time: '13:40', agent: 'Agendamento' }
    ]
  }
];

function renderConversations() {
  const list = document.getElementById('waConversationList');
  list.innerHTML = conversations.map(c => `
    <div class="wa-conversation" data-id="${c.id}" onclick="openConversation(${c.id})">
      <div class="wa-conv-avatar">${c.initials}</div>
      <div class="wa-conv-info">
        <div class="wa-conv-name">
          ${c.name}
          <span class="wa-conv-time">${c.time}</span>
        </div>
        <div class="wa-conv-preview">${c.preview}</div>
        <div class="wa-conv-agent">🤖 ${c.agent}</div>
      </div>
      ${c.unread > 0 ? `<div class="wa-unread">${c.unread}</div>` : ''}
    </div>
  `).join('');
}
renderConversations();

function openConversation(id) {
  const conv = conversations.find(c => c.id === id);
  if (!conv) return;

  // Update active state
  document.querySelectorAll('.wa-conversation').forEach(el => el.classList.remove('active'));
  document.querySelector(`.wa-conversation[data-id="${id}"]`).classList.add('active');

  // Update header
  document.getElementById('waChatHeader').innerHTML = `
    <div class="wa-contact-info">
      <span class="wa-contact-name">${conv.name}</span>
      <span class="wa-contact-agent">🤖 Agente: ${conv.agent}</span>
    </div>
  `;

  // Render messages
  const msgContainer = document.getElementById('waMessages');
  msgContainer.innerHTML = conv.messages.map(m => `
    <div class="wa-msg ${m.type}">
      ${m.agent ? `<div class="wa-msg-agent-label">🤖 ${m.agent}</div>` : ''}
      ${m.text}
      <div class="wa-msg-time">${m.time}</div>
    </div>
  `).join('');

  msgContainer.scrollTop = msgContainer.scrollHeight;
}

// ===== CHARTS =====
function initCharts() {
  // Volume Chart
  const volumeCtx = document.getElementById('chartVolume');
  if (volumeCtx) {
    const hours = [];
    const callData = [];
    const waData = [];
    for (let i = 8; i <= 18; i++) {
      hours.push(`${i}h`);
      callData.push(Math.floor(Math.random() * 30 + 10));
      waData.push(Math.floor(Math.random() * 25 + 5));
    }

    new Chart(volumeCtx, {
      type: 'bar',
      data: {
        labels: hours,
        datasets: [
          {
            label: 'Chamadas',
            data: callData,
            backgroundColor: 'rgba(116, 185, 255, 0.6)',
            borderColor: '#74b9ff',
            borderWidth: 1,
            borderRadius: 4
          },
          {
            label: 'WhatsApp',
            data: waData,
            backgroundColor: 'rgba(0, 184, 148, 0.6)',
            borderColor: '#00b894',
            borderWidth: 1,
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#8b8fa3', font: { size: 12 } }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(42, 46, 63, 0.5)' },
            ticks: { color: '#5c6078' }
          },
          y: {
            grid: { color: 'rgba(42, 46, 63, 0.5)' },
            ticks: { color: '#5c6078' }
          }
        }
      }
    });
  }

  // Agent Distribution Chart
  const agentCtx = document.getElementById('chartAgents');
  if (agentCtx) {
    new Chart(agentCtx, {
      type: 'doughnut',
      data: {
        labels: ['Recepcionista', 'Cobranca', 'SAC', 'Agendamento'],
        datasets: [{
          data: [142, 38, 89, 56],
          backgroundColor: ['#6c5ce7', '#e17055', '#00b894', '#0984e3'],
          borderColor: '#1e2130',
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#8b8fa3',
              font: { size: 12 },
              padding: 16,
              usePointStyle: true,
              pointStyleWidth: 12
            }
          }
        }
      }
    });
  }
}

// Init charts after page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCharts);
} else {
  initCharts();
}

// ===== SIMULATE LIVE UPDATES =====
function simulateKPIUpdates() {
  const kpiCalls = document.getElementById('kpiTotalCalls');
  const kpiWa = document.getElementById('kpiWhatsapp');
  const kpiActive = document.getElementById('kpiActiveCalls');

  setInterval(() => {
    const current = parseInt(kpiCalls.textContent);
    if (Math.random() > 0.7) {
      kpiCalls.textContent = current + 1;
    }
  }, 8000);

  setInterval(() => {
    const current = parseInt(kpiWa.textContent);
    if (Math.random() > 0.6) {
      kpiWa.textContent = current + 1;
    }
  }, 12000);

  setInterval(() => {
    const active = Math.floor(Math.random() * 4) + 3;
    kpiActive.textContent = active;
  }, 15000);
}
simulateKPIUpdates();

// Simulate new activity entries
function addRandomActivity() {
  const newActivities = [
    { icon: '📞', text: `Ligacao recebida de +55 ${Math.floor(Math.random()*90+10)} 9****-${Math.floor(Math.random()*9000+1000)}` },
    { icon: '💬', text: 'Nova mensagem WhatsApp recebida' },
    { icon: '✅', text: 'Consulta confirmada para amanha' },
    { icon: '💰', text: 'Pagamento registrado via PIX' },
    { icon: '📅', text: 'Novo agendamento: Limpeza dental' }
  ];

  const random = newActivities[Math.floor(Math.random() * newActivities.length)];
  activities.unshift({ ...random, time: 'agora' });
  if (activities.length > 10) activities.pop();

  // Update times
  activities.forEach((a, i) => {
    if (i === 0) a.time = 'agora';
    else if (i === 1) a.time = '2 min atras';
    else a.time = `${i * 3 + Math.floor(Math.random()*3)} min atras`;
  });

  renderActivity();
}

setInterval(addRandomActivity, 20000);
