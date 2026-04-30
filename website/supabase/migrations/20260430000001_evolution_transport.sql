-- Evolution API (WhatsApp Web não-oficial) como transporte paralelo ao Meta Cloud API.
-- Coexiste com Meta — agent_provisioning.transport discrimina entre 'meta' e 'evolution'.

ALTER TABLE public.agent_provisioning
  ADD COLUMN IF NOT EXISTS transport text NOT NULL DEFAULT 'meta',
  ADD COLUMN IF NOT EXISTS evolution_instance_name text,
  ADD COLUMN IF NOT EXISTS evolution_jid text,
  ADD COLUMN IF NOT EXISTS evolution_pairing_code text,
  ADD COLUMN IF NOT EXISTS evolution_pairing_expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS evolution_connection_state text;

ALTER TABLE public.agent_provisioning
  DROP CONSTRAINT IF EXISTS agent_provisioning_transport_check;
ALTER TABLE public.agent_provisioning
  ADD CONSTRAINT agent_provisioning_transport_check
    CHECK (transport IN ('meta','evolution'));

-- 'draft' é novo: linha criada quando o usuário pede pairing code,
-- antes de finalizar o wizard. Cron diário limpa drafts > 24h.
ALTER TABLE public.agent_provisioning
  DROP CONSTRAINT IF EXISTS agent_provisioning_status_check;
ALTER TABLE public.agent_provisioning
  ADD CONSTRAINT agent_provisioning_status_check
    CHECK (status IN ('draft','pending','provisioning','active','error'));

CREATE UNIQUE INDEX IF NOT EXISTS agent_prov_evolution_instance_unique_idx
  ON public.agent_provisioning(evolution_instance_name)
  WHERE evolution_instance_name IS NOT NULL;

-- Identificador genérico de mensagem externa.
-- Meta usa wamid (mantido para back-compat). Evolution usa key.id (Baileys).
-- Novo código deduplica por (transport, external_message_id).
ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS external_message_id text,
  ADD COLUMN IF NOT EXISTS transport text;

CREATE UNIQUE INDEX IF NOT EXISTS messages_external_id_unique_idx
  ON public.messages(transport, external_message_id)
  WHERE external_message_id IS NOT NULL;
