-- Colunas pra Embedded Signup OAuth da Meta.
-- Cliente conecta o próprio WABA via FB.login() → callback grava aqui.

ALTER TABLE public.agent_provisioning
  ADD COLUMN IF NOT EXISTS waba_id text,
  ADD COLUMN IF NOT EXISTS tenant_access_token_encrypted text;

-- Índice único impede o mesmo número ser conectado em duas orgs
CREATE UNIQUE INDEX IF NOT EXISTS agent_prov_waba_phone_unique_idx
  ON public.agent_provisioning(waba_id, whatsapp_phone_number_id)
  WHERE waba_id IS NOT NULL AND whatsapp_phone_number_id IS NOT NULL;
