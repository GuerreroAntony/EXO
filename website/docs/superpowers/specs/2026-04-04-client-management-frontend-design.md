# EXO Client Management — Frontend Shell Design

## Scope

Frontend-only ("casca"). All data is mock. Zero backend, zero Supabase queries for new features. Existing pages that already query Supabase keep working — we only ADD new pages/components with mock data.

Voice infrastructure (Twilio, Vapi, ElevenLabs) is out of scope.

---

## Technical Decisions

- **Charts:** Install `recharts` as dependency. Lightweight, React-native, dark theme support.
- **Mock data:** All mock data lives in `src/data/mock/` as exported arrays/objects. Pages import from there. Makes future Supabase swap trivial.
- **File structure:** New pages go in `src/app/(dashboard)/dashboard/{slug}/page.tsx`. New shared components go in `src/components/dashboard/`.
- **Responsive:** New complex layouts (split panels, drawers) stack single-column below `lg:` breakpoint. Drawers go full-screen on mobile.
- **Loading states:** Mock pages render instantly (no fake loading). Only real Supabase pages show loading states.
- **StatusBadge multi-word:** Use space-separated keys (e.g., `"em atendimento"`, not `"em_atendimento"`). Update StatusBadge to handle display via simple capitalize logic.
- **DataTable row clicks:** Extend DataTable with optional `onRowClick?: (row: T) => void` prop. When provided, rows get `cursor-pointer` and hover highlight.
- **KPICard sparklines:** Add optional `sparklineData?: number[]` prop. Render as inline SVG polyline (no extra dependency needed).

---

## What Already Exists (keep as-is)

### Dashboard Pages (all use real Supabase)
- `/dashboard` — KPIs overview (atendimentos, resolucao, tempo medio, tickets)
- `/dashboard/agentes` — Agent list cards
- `/dashboard/atendimentos` — Attendance log table with filters
- `/dashboard/agendamentos` — Appointment table
- `/dashboard/financeiro` — Invoice table + KPI aggregation
- `/dashboard/tickets` — Ticket table
- `/dashboard/configuracoes` — Settings form (mock state, no save)

### Admin Pages (all use real Supabase)
- `/admin` — Overview KPIs
- `/admin/organizacoes` — Org table
- `/admin/agentes` — All agents cross-org
- `/admin/leads` — Demo requests
- `/admin/usuarios` — User table
- `/admin/atendimentos` — All attendances
- `/admin/financeiro` — Global billing

### Shared Components
- `DataTable`, `KPICard`, `PageHeader`, `StatusBadge`, `Sidebar`, `Topbar`

---

## New Pages to Build

### 1. `/dashboard/contatos` — Contact CRM

**Purpose:** Caderno de contatos inteligente. Lista todos os clientes/pacientes com historico unificado.

**Layout:**
- PageHeader: "Contatos" + botao "Novo Contato"
- Search bar + filter chips (tag, canal, data)
- DataTable columns: Nome, Telefone, Email, Canal Preferido, Tags, Ultima Interacao, Total Atendimentos
- Clicking a row opens a **detail panel** (slide-over from right, not new page)

**Detail Panel (ContactDrawer) — scrollable single panel, no tabs:**
- Header: Nome, telefone, email, documento
- Tags row (chips editaveis)
- Section "Notas": textarea + lista de notas com data
- Section "Timeline": lista cronologica de todas interacoes (atendimentos, agendamentos, faturas, tickets) com icones por tipo
- Each timeline item shows: data, tipo, agente, resumo, status
- On mobile: drawer goes full-screen

**Mock Data:** 8-10 contacts with varied data (some with many interactions, some new)

---

### 2. `/dashboard/analytics` — Analytics & Insights

**Purpose:** Visualizacoes e insights sobre operacao dos agentes.

**Layout — 3 tabs:**

**Tab "Tempo Real":**
- KPI row: Atendimentos Hoje, Em Andamento Agora, Taxa Resolucao Hoje, Tempo Medio Hoje
- Grafico de barras: Atendimentos por hora (ultimas 24h) — usar recharts ou chart placeholder
- Lista: Ultimos 5 atendimentos com status live

**Tab "Relatorios":**
- Period selector (Hoje, 7 dias, 30 dias, Custom)
- KPI row: Total Atendimentos, Resolucao %, Tempo Medio, Satisfacao Media
- Grafico de linha: Volume por dia no periodo
- Grafico de pizza: Distribuicao por canal (Voz vs WhatsApp)
- Grafico de barras: Volume por agente
- Tabela: Top 10 motivos de contato

**Tab "Insights":**
- Card: Sentimento geral (positivo/neutro/negativo com %)
- Word cloud placeholder (ou lista de palavras-chave mais frequentes)
- Card: Perguntas mais frequentes (top 10 list)
- Card: Sugestoes da IA (ex: "42% das ligacoes perguntam sobre horario de sabado — considere atualizar o FAQ")

**Mock Data:** Numeros realistas para clinica odontologica com ~50 atendimentos/dia.

---

### 3. `/dashboard/conhecimento` — Knowledge Base Editor

**Purpose:** Onde o cliente edita FAQs, scripts e politicas dos agentes.

**Layout — 2 panels:**

**Left Panel (60%):**
- Tree/accordion por categoria (ex: "Horarios", "Servicos", "Precos", "Politicas")
- Each item: pergunta + resposta editavel (textarea)
- Botoes: Adicionar Item, Adicionar Categoria
- Status badges: "Publicado", "Rascunho", "Modificado"

**Right Panel (40%) — Assistente IA:**
- Chat interface simples
- Placeholder messages showing interaction:
  - User: "Agora atendemos aos sabados das 8h as 12h"
  - Assistant: "Entendi! Atualizei a secao 'Horarios' com o novo horario de sabado. Quer que eu tambem atualize a resposta automatica sobre disponibilidade?"
- Input field + send button (non-functional, just UI)
- Header: "Assistente de Conhecimento" com icone de IA

**Important:** The two panels are entirely static and independent. The AI chat messages are hardcoded placeholder text — no cross-panel state changes. On mobile, panels stack vertically (editor on top, chat below).

**Mock Data:** 4 categorias com 3-5 items cada, conteudo realista de clinica.

---

### 4. `/dashboard/escalonamentos` — Escalation Queue

**Purpose:** Casos que o agente IA nao resolveu e precisam de atencao humana.

**Layout:**
- PageHeader: "Escalonamentos" + badge com count de pendentes
- KPI row: Pendentes, Resolvidos Hoje, Tempo Medio de Resposta
- DataTable columns: Prioridade (icon), Contato, Motivo, Agente Origem, Canal, Tempo Aguardando, Status
- Status: "Aguardando", "Em Atendimento", "Resolvido"
- Prioridade com cores: Urgente (vermelho), Alta (laranja), Media (amarelo), Baixa (cinza)
- Clicking a row opens a **detail drawer** showing:
  - Transcricao resumida da conversa com o agente IA
  - Motivo do escalonamento
  - Dados do contato
  - Botoes: "Ligar de Volta", "Enviar WhatsApp", "Marcar Resolvido" (todos non-functional)

**Mock Data:** 5-6 escalations, 2 urgentes, mix de canais.

---

### 5. Enhanced `/dashboard/configuracoes` — Settings (expand existing)

**Convert to tabbed layout with 4 tabs:**

**Tab "Perfil" (existing content):**
- Profile info, company info, plan display (keep as-is)

**Tab "Canais":**
- Toggle cards para Voz e WhatsApp com status (Ativo/Inativo), numero vinculado, config placeholder

**Tab "Notificacoes":**
- Notification toggles (existing) + Escalonamento notifications: canal (email, WhatsApp, ambos) + campo de numero/email
- Horario de Funcionamento: Grid de dias da semana com hora inicio/fim + toggle ativo

**Tab "Integracoes":**
- Cards desabilitados para HubSpot, Pipedrive, Zapier, Google Calendar com badge "Em breve"

---

### 6. Enhanced `/dashboard` — Overview (improve existing)

**Add to existing page:**
- Mini chart sparklines nos KPICards (trend dos ultimos 7 dias)
- Section "Escalonamentos Pendentes" com os 3 mais recentes + link "Ver todos"
- Section "Agentes" melhorada: mostrar status real-time (Online, Atendendo, Offline) com dot indicator

---

### 7. Sidebar Updates

**Dashboard Sidebar — add new items with Lucide icons:**

**Reorder:**
1. Visao Geral — `LayoutDashboard`
2. Agentes — `Bot`
3. Contatos (NEW) — `Users`
4. Atendimentos — `Headphones`
5. Agendamentos — `Calendar`
6. Financeiro — `DollarSign`
7. Analytics (NEW) — `BarChart3`
8. Tickets — `Ticket`
9. Escalonamentos (NEW) — `AlertTriangle` + EscalationBadge with pending count
10. Conhecimento (NEW) — `BookOpen`
11. Configuracoes — `Settings`

**Topbar:** Add page title mappings for new routes.

---

## New Shared Components

### ContactDrawer
- Slide-over panel from right (w-[480px], full-screen on mobile)
- Glassmorphism style consistent with existing cards
- Close button + header with contact info
- Scrollable single panel: contact data, tags, notas, timeline (no tabs)
- `role="dialog"` with focus trap

### ChartPlaceholder
- Reusable component that renders a styled container with a chart mockup
- Props: title, type (bar/line/pie), height
- Uses recharts with mock data arrays
- Consistent dark theme styling

### EscalationBadge
- Small badge component for sidebar item showing pending count
- Animated pulse when count > 0

### KnowledgeItem
- Expandable accordion item for knowledge base
- Shows question, expandable answer textarea
- Status badge + edit/delete actions

### AIChat
- Simple chat bubble interface
- Message list + input field
- User vs assistant message styling
- Non-functional (display only)

---

## Styling Rules

- Follow existing patterns: `bg-white/[0.04]`, `border-white/[0.08]`, `backdrop-blur`
- Accent blue: `#5B9BF3` (dashboard)
- Dark background: `bg-black`
- Use existing `DataTable`, `KPICard`, `PageHeader`, `StatusBadge` components
- Add new statuses to StatusBadge: "aguardando", "em atendimento", "publicado", "rascunho", "modificado" (space-separated, not underscores)
- All animations via framer-motion, consistent with existing pages
- All new pages are "use client" with useState for mock data (same pattern as existing)

---

## Out of Scope (v2)

- Live chat takeover (real-time human assumes conversation)
- External integrations (HubSpot, Pipedrive, Zapier)
- Real-time WebSocket updates
- Backend API routes
- Supabase queries for new pages
- Voice/telephony configuration (Twilio, Vapi, ElevenLabs)
- File upload for knowledge base
- Email/WhatsApp notification sending
