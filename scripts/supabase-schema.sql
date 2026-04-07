-- ============================================
-- Clínica Sorriso — Call Center IA
-- Schema completo para Supabase
-- ============================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PACIENTES
-- ============================================
CREATE TABLE pacientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  cpf VARCHAR(14) UNIQUE NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  email TEXT,
  data_nascimento DATE,
  endereco TEXT,
  convenio TEXT,
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pacientes_cpf ON pacientes(cpf);
CREATE INDEX idx_pacientes_telefone ON pacientes(telefone);
CREATE INDEX idx_pacientes_nome ON pacientes(nome);

-- ============================================
-- 2. AGENDAMENTOS
-- ============================================
CREATE TABLE agendamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  servico TEXT NOT NULL,
  profissional TEXT NOT NULL,
  data_hora TIMESTAMPTZ NOT NULL,
  duracao_min INT NOT NULL DEFAULT 30,
  status VARCHAR(20) NOT NULL DEFAULT 'agendado'
    CHECK (status IN ('agendado', 'confirmado', 'cancelado', 'realizado', 'no_show')),
  canal_origem VARCHAR(10) DEFAULT 'voz'
    CHECK (canal_origem IN ('voz', 'whatsapp', 'presencial', 'site')),
  observacoes TEXT,
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_agendamentos_paciente ON agendamentos(paciente_id);
CREATE INDEX idx_agendamentos_data ON agendamentos(data_hora);
CREATE INDEX idx_agendamentos_status ON agendamentos(status);
CREATE INDEX idx_agendamentos_profissional ON agendamentos(profissional, data_hora);

-- ============================================
-- 3. FATURAS
-- ============================================
CREATE TABLE faturas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  valor_total NUMERIC(10,2) NOT NULL,
  desconto NUMERIC(10,2) DEFAULT 0,
  valor_final NUMERIC(10,2) NOT NULL,
  parcelas INT DEFAULT 1,
  status VARCHAR(20) NOT NULL DEFAULT 'pendente'
    CHECK (status IN ('pendente', 'pago', 'atrasado', 'negociando', 'cancelado')),
  vencimento DATE NOT NULL,
  pago_em TIMESTAMPTZ,
  forma_pagamento VARCHAR(20)
    CHECK (forma_pagamento IN ('pix', 'dinheiro', 'credito', 'debito', 'boleto', 'convenio')),
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_faturas_paciente ON faturas(paciente_id);
CREATE INDEX idx_faturas_status ON faturas(status);
CREATE INDEX idx_faturas_vencimento ON faturas(vencimento);

-- ============================================
-- 4. PAGAMENTOS
-- ============================================
CREATE TABLE pagamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fatura_id UUID NOT NULL REFERENCES faturas(id) ON DELETE CASCADE,
  valor NUMERIC(10,2) NOT NULL,
  forma_pagamento VARCHAR(20) NOT NULL
    CHECK (forma_pagamento IN ('pix', 'dinheiro', 'credito', 'debito', 'boleto', 'convenio')),
  data_pagamento TIMESTAMPTZ DEFAULT NOW(),
  comprovante_url TEXT,
  observacoes TEXT
);

CREATE INDEX idx_pagamentos_fatura ON pagamentos(fatura_id);

-- ============================================
-- 5. ATENDIMENTOS (LOG)
-- ============================================
CREATE TABLE atendimentos_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paciente_id UUID REFERENCES pacientes(id) ON DELETE SET NULL,
  agente VARCHAR(20) NOT NULL
    CHECK (agente IN ('recepcionista', 'sac', 'cobranca', 'agendamento')),
  canal VARCHAR(10) NOT NULL
    CHECK (canal IN ('voz', 'whatsapp')),
  direcao VARCHAR(10) DEFAULT 'inbound'
    CHECK (direcao IN ('inbound', 'outbound')),
  resumo TEXT,
  resultado TEXT,
  duracao_segundos INT,
  escalou_humano BOOLEAN DEFAULT false,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_atendimentos_paciente ON atendimentos_log(paciente_id);
CREATE INDEX idx_atendimentos_agente ON atendimentos_log(agente);
CREATE INDEX idx_atendimentos_criado ON atendimentos_log(criado_em);

-- ============================================
-- 6. TICKETS
-- ============================================
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  atendimento_id UUID REFERENCES atendimentos_log(id) ON DELETE SET NULL,
  tipo VARCHAR(20) NOT NULL
    CHECK (tipo IN ('reclamacao', 'duvida', 'solicitacao', 'cancelamento', 'reembolso')),
  prioridade VARCHAR(10) NOT NULL DEFAULT 'media'
    CHECK (prioridade IN ('baixa', 'media', 'alta', 'urgente')),
  status VARCHAR(20) NOT NULL DEFAULT 'aberto'
    CHECK (status IN ('aberto', 'em_andamento', 'resolvido', 'fechado')),
  descricao TEXT NOT NULL,
  resolucao TEXT,
  responsavel TEXT,
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW(),
  fechado_em TIMESTAMPTZ
);

CREATE INDEX idx_tickets_paciente ON tickets(paciente_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_prioridade ON tickets(prioridade);

-- ============================================
-- 7. OPT-OUTS (não me ligue mais)
-- ============================================
CREATE TABLE opt_outs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  canal VARCHAR(10) NOT NULL
    CHECK (canal IN ('voz', 'whatsapp', 'sms', 'todos')),
  motivo TEXT,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_opt_outs_paciente_canal ON opt_outs(paciente_id, canal);

-- ============================================
-- 8. LISTA DE ESPERA
-- ============================================
CREATE TABLE lista_espera (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  servico TEXT NOT NULL,
  preferencia_horario TEXT,
  status VARCHAR(15) NOT NULL DEFAULT 'aguardando'
    CHECK (status IN ('aguardando', 'notificado', 'agendado', 'expirado')),
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  notificado_em TIMESTAMPTZ
);

CREATE INDEX idx_lista_espera_status ON lista_espera(status);

-- ============================================
-- TRIGGER: atualizar atualizado_em automaticamente
-- ============================================
CREATE OR REPLACE FUNCTION atualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_pacientes_updated
  BEFORE UPDATE ON pacientes
  FOR EACH ROW EXECUTE FUNCTION atualizar_timestamp();

CREATE TRIGGER trg_agendamentos_updated
  BEFORE UPDATE ON agendamentos
  FOR EACH ROW EXECUTE FUNCTION atualizar_timestamp();

CREATE TRIGGER trg_tickets_updated
  BEFORE UPDATE ON tickets
  FOR EACH ROW EXECUTE FUNCTION atualizar_timestamp();

-- ============================================
-- RLS (Row Level Security) — habilitar
-- ============================================
ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE faturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE atendimentos_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE opt_outs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lista_espera ENABLE ROW LEVEL SECURITY;

-- Policy: service_role tem acesso total (para o backend/OpenClaw)
CREATE POLICY "service_role_all" ON pacientes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON agendamentos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON faturas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON pagamentos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON atendimentos_log FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON tickets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON opt_outs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all" ON lista_espera FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- DADOS DE EXEMPLO (Clínica Sorriso)
-- ============================================
INSERT INTO pacientes (nome, cpf, telefone, email, data_nascimento, endereco, convenio) VALUES
  ('Maria Silva Santos', '123.456.789-00', '(11) 98765-4321', 'maria.silva@email.com', '1985-03-15', 'Rua Augusta, 456, São Paulo - SP', 'Amil Dental'),
  ('João Pedro Oliveira', '987.654.321-00', '(11) 91234-5678', 'joao.oliveira@email.com', '1990-07-22', 'Av. Paulista, 789, São Paulo - SP', NULL),
  ('Ana Carolina Souza', '456.789.123-00', '(11) 99876-5432', 'ana.souza@email.com', '1978-11-30', 'Rua da Consolação, 321, São Paulo - SP', 'Bradesco Dental'),
  ('Carlos Eduardo Lima', '321.654.987-00', '(11) 94567-8901', 'carlos.lima@email.com', '1995-01-10', 'Rua Oscar Freire, 654, São Paulo - SP', 'Odontoprev'),
  ('Fernanda Rodrigues', '654.321.987-00', '(11) 93456-7890', 'fernanda.rod@email.com', '1988-06-25', 'Rua Haddock Lobo, 987, São Paulo - SP', NULL);

-- Agendamentos de exemplo
INSERT INTO agendamentos (paciente_id, servico, profissional, data_hora, duracao_min, status, canal_origem) VALUES
  ((SELECT id FROM pacientes WHERE cpf = '123.456.789-00'), 'Limpeza', 'Dr. Ricardo Mendes', NOW() + INTERVAL '2 days', 40, 'agendado', 'voz'),
  ((SELECT id FROM pacientes WHERE cpf = '987.654.321-00'), 'Consulta ortodôntica', 'Dra. Fernanda Lima', NOW() + INTERVAL '3 days', 30, 'confirmado', 'whatsapp'),
  ((SELECT id FROM pacientes WHERE cpf = '456.789.123-00'), 'Clareamento a laser', 'Dr. André Oliveira', NOW() + INTERVAL '5 days', 90, 'agendado', 'voz');

-- Faturas de exemplo
INSERT INTO faturas (paciente_id, descricao, valor_total, desconto, valor_final, parcelas, status, vencimento) VALUES
  ((SELECT id FROM pacientes WHERE cpf = '987.654.321-00'), 'Tratamento ortodôntico - mês 3/12', 180.00, 0, 180.00, 1, 'pendente', CURRENT_DATE + INTERVAL '5 days'),
  ((SELECT id FROM pacientes WHERE cpf = '654.321.987-00'), 'Implante unitário - parcela 2/6', 500.00, 0, 500.00, 6, 'atrasado', CURRENT_DATE - INTERVAL '10 days'),
  ((SELECT id FROM pacientes WHERE cpf = '456.789.123-00'), 'Limpeza + restauração', 350.00, 52.50, 297.50, 1, 'pago', CURRENT_DATE - INTERVAL '15 days');

-- Log de atendimento de exemplo
INSERT INTO atendimentos_log (paciente_id, agente, canal, direcao, resumo, resultado, duracao_segundos, escalou_humano) VALUES
  ((SELECT id FROM pacientes WHERE cpf = '123.456.789-00'), 'recepcionista', 'voz', 'inbound', 'Paciente ligou para agendar limpeza', 'Transferida para agendamento', 45, false),
  ((SELECT id FROM pacientes WHERE cpf = '654.321.987-00'), 'cobranca', 'voz', 'outbound', 'Contato sobre parcela atrasada do implante', 'Paciente prometeu pagar até sexta', 180, false);

-- ============================================
-- FIM DO SCHEMA
-- ============================================
