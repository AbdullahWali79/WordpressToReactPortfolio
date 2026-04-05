-- Daily Content Tables for Keep-Alive System
-- These tables store rotating daily content and are cleaned up automatically

-- Islamic Quotes Table
CREATE TABLE IF NOT EXISTS public.daily_islamic_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote TEXT NOT NULL,
  author TEXT,
  source TEXT,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours')
);

-- Educational Jokes Table
CREATE TABLE IF NOT EXISTS public.daily_educational_jokes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setup TEXT NOT NULL,
  punchline TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours')
);

-- AI Tools Table
CREATE TABLE IF NOT EXISTS public.daily_ai_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  website_url TEXT,
  category TEXT DEFAULT 'general',
  pricing TEXT,
  features TEXT[],
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours')
);

-- Keep-Alive Activity Log
CREATE TABLE IF NOT EXISTS public.keep_alive_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_islamic_quotes_expires ON public.daily_islamic_quotes(expires_at);
CREATE INDEX IF NOT EXISTS idx_educational_jokes_expires ON public.daily_educational_jokes(expires_at);
CREATE INDEX IF NOT EXISTS idx_ai_tools_expires ON public.daily_ai_tools(expires_at);
CREATE INDEX IF NOT EXISTS idx_keep_alive_created ON public.keep_alive_logs(created_at);

-- Enable RLS
ALTER TABLE public.daily_islamic_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_educational_jokes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_ai_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keep_alive_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Public can read, Only admin can write
CREATE POLICY "Public can view Islamic quotes" 
  ON public.daily_islamic_quotes FOR SELECT TO public USING (NOW() < expires_at);

CREATE POLICY "Public can view educational jokes" 
  ON public.daily_educational_jokes FOR SELECT TO public USING (NOW() < expires_at);

CREATE POLICY "Public can view AI tools" 
  ON public.daily_ai_tools FOR SELECT TO public USING (NOW() < expires_at);

-- Admin policies
CREATE POLICY "Admin full access Islamic quotes" 
  ON public.daily_islamic_quotes FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin full access jokes" 
  ON public.daily_educational_jokes FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin full access AI tools" 
  ON public.daily_ai_tools FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin full access keep-alive logs" 
  ON public.keep_alive_logs FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Function to cleanup expired content
CREATE OR REPLACE FUNCTION public.cleanup_expired_daily_content()
RETURNS void AS $$
BEGIN
  -- Log the cleanup
  INSERT INTO public.keep_alive_logs (action_type, details)
  VALUES ('cleanup_start', jsonb_build_object('started_at', NOW()));

  -- Delete expired Islamic quotes
  DELETE FROM public.daily_islamic_quotes WHERE expires_at < NOW();
  
  -- Delete expired jokes
  DELETE FROM public.daily_educational_jokes WHERE expires_at < NOW();
  
  -- Delete expired AI tools
  DELETE FROM public.daily_ai_tools WHERE expires_at < NOW();
  
  -- Delete old logs (keep last 30 days)
  DELETE FROM public.keep_alive_logs WHERE created_at < NOW() - INTERVAL '30 days';

  -- Log completion
  INSERT INTO public.keep_alive_logs (action_type, details)
  VALUES ('cleanup_complete', jsonb_build_object('completed_at', NOW()));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check database activity (for dashboard)
CREATE OR REPLACE FUNCTION public.get_database_activity()
RETURNS TABLE (
  table_name TEXT,
  record_count BIGINT,
  last_activity TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    'daily_islamic_quotes'::TEXT,
    COUNT(*)::BIGINT,
    MAX(created_at)
  FROM public.daily_islamic_quotes
  UNION ALL
  SELECT 
    'daily_educational_jokes'::TEXT,
    COUNT(*)::BIGINT,
    MAX(created_at)
  FROM public.daily_educational_jokes
  UNION ALL
  SELECT 
    'daily_ai_tools'::TEXT,
    COUNT(*)::BIGINT,
    MAX(created_at)
  FROM public.daily_ai_tools
  UNION ALL
  SELECT 
    'keep_alive_logs'::TEXT,
    COUNT(*)::BIGINT,
    MAX(created_at)
  FROM public.keep_alive_logs;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
