-- Adiciona colunas pra suportar callback de data deletion da Meta (signed_request)
-- Mantém o form web atual (source = 'web_form') funcionando.

ALTER TABLE public.data_deletion_requests
  ADD COLUMN IF NOT EXISTS meta_user_id text,
  ADD COLUMN IF NOT EXISTS confirmation_code uuid DEFAULT gen_random_uuid() UNIQUE NOT NULL;

-- Recria o CHECK de source pra incluir 'meta_callback'.
-- Se já existir constraint, dropar antes.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = 'data_deletion_requests'
      AND constraint_name = 'data_deletion_requests_source_check'
  ) THEN
    ALTER TABLE public.data_deletion_requests
      DROP CONSTRAINT data_deletion_requests_source_check;
  END IF;
END $$;

ALTER TABLE public.data_deletion_requests
  ADD CONSTRAINT data_deletion_requests_source_check
  CHECK (source IN ('web_form', 'meta_callback'));

-- Index pra lookup por confirmation_code (página pública de status)
CREATE INDEX IF NOT EXISTS data_deletion_requests_confirmation_code_idx
  ON public.data_deletion_requests(confirmation_code);

CREATE INDEX IF NOT EXISTS data_deletion_requests_meta_user_id_idx
  ON public.data_deletion_requests(meta_user_id)
  WHERE meta_user_id IS NOT NULL;
