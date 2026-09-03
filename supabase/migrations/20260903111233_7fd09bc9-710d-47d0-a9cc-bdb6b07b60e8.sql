CREATE TYPE public.lead_classification AS ENUM ('business_buyer', 'individual_buyer', 'importer', 'distributor', 'wholesaler', 'retailer');
CREATE TYPE public.lead_priority AS ENUM ('high', 'low');
CREATE TYPE public.validation_status AS ENUM ('valid', 'invalid', 'incomplete', 'duplicate', 'already_contacted');
CREATE TYPE public.contact_status AS ENUM ('not_contacted', 'queued', 'sending', 'sent', 'failed', 'skipped');
CREATE TYPE public.campaign_status AS ENUM ('draft', 'ready', 'running', 'completed', 'paused', 'failed');
CREATE TYPE public.email_status AS ENUM ('queued', 'sending', 'sent', 'failed', 'skipped', 'already_contacted');

CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  export_availability TEXT,
  customization_options TEXT,
  minimum_order_quantity TEXT,
  shipping_availability TEXT,
  is_demo BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own products" ON public.products FOR ALL TO authenticated USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

CREATE TABLE public.buyers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  buyer_name TEXT,
  company_name TEXT,
  email TEXT,
  normalized_email TEXT,
  website TEXT,
  country TEXT,
  source_platform TEXT,
  profile_url TEXT,
  product TEXT,
  product_category TEXT,
  business_type TEXT,
  classification public.lead_classification,
  priority public.lead_priority,
  validation_status public.validation_status NOT NULL DEFAULT 'incomplete',
  contact_status public.contact_status NOT NULL DEFAULT 'not_contacted',
  validation_notes TEXT,
  is_demo BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_contacted_at TIMESTAMPTZ
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.buyers TO authenticated;
GRANT ALL ON public.buyers TO service_role;
ALTER TABLE public.buyers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own buyers" ON public.buyers FOR ALL TO authenticated USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());
CREATE UNIQUE INDEX buyers_owner_normalized_email_unique ON public.buyers(owner_id, normalized_email) WHERE normalized_email IS NOT NULL AND normalized_email <> '';
CREATE INDEX buyers_owner_country_idx ON public.buyers(owner_id, country);
CREATE INDEX buyers_owner_status_idx ON public.buyers(owner_id, validation_status, contact_status);

CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  name TEXT NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_category TEXT,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  target_audience TEXT[] NOT NULL DEFAULT '{}',
  target_countries TEXT[] NOT NULL DEFAULT '{}',
  sending_limit INTEGER NOT NULL DEFAULT 25,
  delay_seconds INTEGER NOT NULL DEFAULT 30,
  status public.campaign_status NOT NULL DEFAULT 'draft',
  is_demo BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaigns TO authenticated;
GRANT ALL ON public.campaigns TO service_role;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own campaigns" ON public.campaigns FOR ALL TO authenticated USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());
CREATE INDEX campaigns_owner_status_idx ON public.campaigns(owner_id, status);

CREATE TABLE public.campaign_targets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.buyers(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(campaign_id, buyer_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.campaign_targets TO authenticated;
GRANT ALL ON public.campaign_targets TO service_role;
ALTER TABLE public.campaign_targets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own campaign targets" ON public.campaign_targets FOR ALL TO authenticated USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

CREATE TABLE public.attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  storage_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.attachments TO authenticated;
GRANT ALL ON public.attachments TO service_role;
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own attachments" ON public.attachments FOR ALL TO authenticated USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

CREATE TABLE public.ai_classifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  buyer_id UUID NOT NULL REFERENCES public.buyers(id) ON DELETE CASCADE,
  classification public.lead_classification NOT NULL,
  priority public.lead_priority NOT NULL,
  reason TEXT NOT NULL,
  model TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_classifications TO authenticated;
GRANT ALL ON public.ai_classifications TO service_role;
ALTER TABLE public.ai_classifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own AI classifications" ON public.ai_classifications FOR ALL TO authenticated USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());
CREATE INDEX ai_classifications_buyer_idx ON public.ai_classifications(buyer_id, created_at DESC);

CREATE TABLE public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  buyer_id UUID REFERENCES public.buyers(id) ON DELETE SET NULL,
  buyer_name TEXT,
  company_name TEXT,
  email TEXT,
  country TEXT,
  product TEXT,
  source_platform TEXT,
  classification public.lead_classification,
  status public.email_status NOT NULL,
  attachment_used BOOLEAN NOT NULL DEFAULT false,
  error_message TEXT,
  subject TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_logs TO authenticated;
GRANT ALL ON public.email_logs TO service_role;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own email logs" ON public.email_logs FOR ALL TO authenticated USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());
CREATE UNIQUE INDEX email_logs_campaign_buyer_unique ON public.email_logs(campaign_id, buyer_id) WHERE campaign_id IS NOT NULL AND buyer_id IS NOT NULL;
CREATE INDEX email_logs_owner_status_idx ON public.email_logs(owner_id, status, created_at DESC);

CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER buyers_updated_at BEFORE UPDATE ON public.buyers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER campaigns_updated_at BEFORE UPDATE ON public.campaigns FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();