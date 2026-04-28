-- Habilita Row Level Security em todas as tabelas multi-tenant.
-- Service role (usado pelo webhook) bypassa RLS por design — não quebra nada.
-- O painel cliente-side (anon key + auth user) passa a ser blindado pelo banco,
-- não só pelos filtros app-side em organization_id.

-- Helper function: retorna organization_id do usuário logado.
-- SECURITY DEFINER + STABLE evita recursão na policy de profiles.
CREATE OR REPLACE FUNCTION auth.org_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT organization_id FROM public.profiles WHERE id = auth.uid()
$$;

-- ====================================================================
-- profiles: user só vê o próprio profile
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "self_select" ON public.profiles;
DROP POLICY IF EXISTS "self_update" ON public.profiles;

CREATE POLICY "self_select" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "self_update" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ====================================================================
-- organizations: user só vê a própria org
-- ====================================================================
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own_org" ON public.organizations;

CREATE POLICY "own_org" ON public.organizations
  FOR SELECT TO authenticated
  USING (id = auth.org_id());

-- ====================================================================
-- conversations: tenant isolation por organization_id
-- ====================================================================
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tenant_isolation" ON public.conversations;

CREATE POLICY "tenant_isolation" ON public.conversations
  FOR ALL TO authenticated
  USING (organization_id = auth.org_id())
  WITH CHECK (organization_id = auth.org_id());

-- ====================================================================
-- messages: isolamento via JOIN com conversations
-- ====================================================================
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tenant_isolation" ON public.messages;

CREATE POLICY "tenant_isolation" ON public.messages
  FOR ALL TO authenticated
  USING (
    conversation_id IN (
      SELECT id FROM public.conversations WHERE organization_id = auth.org_id()
    )
  )
  WITH CHECK (
    conversation_id IN (
      SELECT id FROM public.conversations WHERE organization_id = auth.org_id()
    )
  );

-- ====================================================================
-- agent_provisioning: tenant isolation
-- ====================================================================
ALTER TABLE public.agent_provisioning ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tenant_isolation" ON public.agent_provisioning;

CREATE POLICY "tenant_isolation" ON public.agent_provisioning
  FOR ALL TO authenticated
  USING (organization_id = auth.org_id())
  WITH CHECK (organization_id = auth.org_id());

-- ====================================================================
-- knowledge_sources: tenant isolation
-- ====================================================================
ALTER TABLE public.knowledge_sources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tenant_isolation" ON public.knowledge_sources;

CREATE POLICY "tenant_isolation" ON public.knowledge_sources
  FOR ALL TO authenticated
  USING (organization_id = auth.org_id())
  WITH CHECK (organization_id = auth.org_id());

-- ====================================================================
-- empresa_info: tenant isolation
-- ====================================================================
ALTER TABLE public.empresa_info ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tenant_isolation" ON public.empresa_info;

CREATE POLICY "tenant_isolation" ON public.empresa_info
  FOR ALL TO authenticated
  USING (organization_id = auth.org_id())
  WITH CHECK (organization_id = auth.org_id());

-- ====================================================================
-- data_deletion_requests: usuário NÃO logado pode ler por confirmation_code
-- (página pública de status). Inserções via service role (callback Meta).
-- Sem policy pra anon — vamos usar service role na página de status.
-- ====================================================================
ALTER TABLE public.data_deletion_requests ENABLE ROW LEVEL SECURITY;

-- Sem policies pra authenticated/anon: service role bypassa,
-- e nenhum cliente direto deve ler/escrever essa tabela.
