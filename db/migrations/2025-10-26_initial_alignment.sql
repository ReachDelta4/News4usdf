BEGIN;

-- Ensure pgcrypto for gen_random_uuid
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- Alter categories to match app expectations
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS color text DEFAULT '#ef4444',
  ADD COLUMN IF NOT EXISTS icon text,
  ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS parent_id integer REFERENCES public.categories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS article_count integer DEFAULT 0;

-- Ensure slug is populated for existing categories
UPDATE public.categories
SET slug = COALESCE(slug, lower(regexp_replace(name, '\s+', '-', 'g')))
WHERE slug IS NULL;

-- Add unique index on slug
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname='public' AND tablename='categories' AND indexname='categories_slug_key'
  ) THEN
    CREATE UNIQUE INDEX categories_slug_key ON public.categories(slug);
  END IF;
END $$;

-- Alter articles to add expected fields
ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS featured_image_url text,
  ADD COLUMN IF NOT EXISTS video_url text,
  ADD COLUMN IF NOT EXISTS read_time integer,
  ADD COLUMN IF NOT EXISTS publish_date timestamp with time zone,
  ADD COLUMN IF NOT EXISTS scheduled_date timestamp with time zone;

-- Backfill publish_date from published_at when present
UPDATE public.articles
SET publish_date = COALESCE(publish_date, published_at)
WHERE published_at IS NOT NULL AND publish_date IS NULL;

-- Add unique index on article slug
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname='public' AND tablename='articles' AND indexname='articles_slug_key'
  ) THEN
    CREATE UNIQUE INDEX articles_slug_key ON public.articles(slug);
  END IF;
END $$;

-- Profiles table expected by app
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  role text NOT NULL DEFAULT 'viewer',
  status text NOT NULL DEFAULT 'active',
  email_verified boolean NOT NULL DEFAULT false,
  phone_verified boolean NOT NULL DEFAULT false,
  two_factor_enabled boolean NOT NULL DEFAULT false,
  avatar_url text,
  bio text,
  last_login timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname='public' AND tablename='profiles' AND indexname='profiles_email_key'
  ) THEN
    CREATE UNIQUE INDEX profiles_email_key ON public.profiles(email);
  END IF;
END $$;

-- Updated at trigger function (idempotent)
CREATE OR REPLACE FUNCTION public.set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach updated_at triggers if missing
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='set_timestamp_articles') THEN
    CREATE TRIGGER set_timestamp_articles BEFORE UPDATE ON public.articles
    FOR EACH ROW EXECUTE FUNCTION public.set_timestamp();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='set_timestamp_categories') THEN
    CREATE TRIGGER set_timestamp_categories BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION public.set_timestamp();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='set_timestamp_profiles') THEN
    CREATE TRIGGER set_timestamp_profiles BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_timestamp();
  END IF;
END $$;

-- Auto-create profile on new auth user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (NEW.id,
          COALESCE(NEW.raw_user_meta_data->>'name', split_part(COALESCE(NEW.email, ''), '@', 1)),
          COALESCE(NEW.email, ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='on_auth_user_created') THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;

-- Media files table
CREATE TABLE IF NOT EXISTS public.media_files (
  id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  title text NOT NULL,
  alt_text text,
  file_url text NOT NULL,
  storage_path text,
  file_type text NOT NULL CHECK (file_type IN ('leadership','banner','article','category','logo','general')),
  mime_type text,
  file_size integer,
  width integer,
  height integer,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- E-papers table
CREATE TABLE IF NOT EXISTS public.e_papers (
  id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  title text NOT NULL,
  description text,
  publication_date date NOT NULL,
  file_url text NOT NULL,
  storage_path text,
  file_name text NOT NULL,
  file_size integer,
  visible boolean NOT NULL DEFAULT true,
  downloads integer NOT NULL DEFAULT 0,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Site settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Bookmarks table
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id uuid PRIMARY KEY DEFAULT extensions.gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id integer REFERENCES public.articles(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- RPC: increment article views
CREATE OR REPLACE FUNCTION public.increment_article_views(article_id integer)
RETURNS void AS $$
BEGIN
  UPDATE public.articles
  SET views = COALESCE(views, 0) + 1
  WHERE id = article_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC: increment epaper downloads
CREATE OR REPLACE FUNCTION public.increment_epaper_downloads(epaper_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.e_papers
  SET downloads = COALESCE(downloads, 0) + 1
  WHERE id = epaper_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS policies (basic)
-- profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='profiles' AND policyname='Profiles select for all auth'
  ) THEN
    CREATE POLICY "Profiles select for all auth" ON public.profiles
      FOR SELECT TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='profiles' AND policyname='Profiles select for anon'
  ) THEN
    CREATE POLICY "Profiles select for anon" ON public.profiles
      FOR SELECT TO anon USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='profiles' AND policyname='Profiles modify own'
  ) THEN
    CREATE POLICY "Profiles modify own" ON public.profiles
      FOR ALL TO authenticated
      USING (id = auth.uid())
      WITH CHECK (id = auth.uid());
  END IF;
END $$;

-- categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='categories' AND policyname='Categories readable by all'
  ) THEN
    CREATE POLICY "Categories readable by all" ON public.categories
      FOR SELECT TO anon, authenticated USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='categories' AND policyname='Categories write for authenticated'
  ) THEN
    CREATE POLICY "Categories write for authenticated" ON public.categories
      FOR INSERT TO authenticated WITH CHECK (true);
    CREATE POLICY "Categories update for authenticated" ON public.categories
      FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
    CREATE POLICY "Categories delete for authenticated" ON public.categories
      FOR DELETE TO authenticated USING (true);
  END IF;
END $$;

-- articles
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='articles' AND policyname='Articles published readable by all'
  ) THEN
    CREATE POLICY "Articles published readable by all" ON public.articles
      FOR SELECT TO anon, authenticated USING (status = 'published');
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='articles' AND policyname='Articles write for authenticated'
  ) THEN
    CREATE POLICY "Articles write for authenticated" ON public.articles
      FOR INSERT TO authenticated WITH CHECK (true);
    CREATE POLICY "Articles update for authenticated" ON public.articles
      FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
    CREATE POLICY "Articles delete for authenticated" ON public.articles
      FOR DELETE TO authenticated USING (true);
  END IF;
END $$;

-- e_papers
ALTER TABLE public.e_papers ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='e_papers' AND policyname='EPapers visible readable by all'
  ) THEN
    CREATE POLICY "EPapers visible readable by all" ON public.e_papers
      FOR SELECT TO anon, authenticated USING (visible = true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='e_papers' AND policyname='EPapers write for authenticated'
  ) THEN
    CREATE POLICY "EPapers write for authenticated" ON public.e_papers
      FOR INSERT TO authenticated WITH CHECK (true);
    CREATE POLICY "EPapers update for authenticated" ON public.e_papers
      FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
    CREATE POLICY "EPapers delete for authenticated" ON public.e_papers
      FOR DELETE TO authenticated USING (true);
  END IF;
END $$;

-- media_files
ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='media_files' AND policyname='Media files read for all'
  ) THEN
    CREATE POLICY "Media files read for all" ON public.media_files
      FOR SELECT TO anon, authenticated USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='media_files' AND policyname='Media files write for authenticated'
  ) THEN
    CREATE POLICY "Media files write for authenticated" ON public.media_files
      FOR INSERT TO authenticated WITH CHECK (true);
    CREATE POLICY "Media files update for authenticated" ON public.media_files
      FOR UPDATE TO authenticated USING (uploaded_by = auth.uid() OR uploaded_by IS NULL) WITH CHECK (true);
    CREATE POLICY "Media files delete for authenticated" ON public.media_files
      FOR DELETE TO authenticated USING (uploaded_by = auth.uid() OR uploaded_by IS NULL);
  END IF;
END $$;

-- site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='site_settings' AND policyname='Settings read for all'
  ) THEN
    CREATE POLICY "Settings read for all" ON public.site_settings
      FOR SELECT TO anon, authenticated USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='site_settings' AND policyname='Settings write for authenticated'
  ) THEN
    CREATE POLICY "Settings write for authenticated" ON public.site_settings
      FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

-- bookmarks
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='bookmarks' AND policyname='Bookmarks read own'
  ) THEN
    CREATE POLICY "Bookmarks read own" ON public.bookmarks
      FOR SELECT TO authenticated USING (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='bookmarks' AND policyname='Bookmarks write own'
  ) THEN
    CREATE POLICY "Bookmarks write own" ON public.bookmarks
      FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
    CREATE POLICY "Bookmarks delete own" ON public.bookmarks
      FOR DELETE TO authenticated USING (user_id = auth.uid());
  END IF;
END $$;

-- Storage policies for public read and authenticated write
DO $$ BEGIN
  -- media bucket
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Public read media'
  ) THEN
    CREATE POLICY "Public read media" ON storage.objects
      FOR SELECT TO anon, authenticated USING (bucket_id = 'media');
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Authenticated write media'
  ) THEN
    CREATE POLICY "Authenticated write media" ON storage.objects
      FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media');
    CREATE POLICY "Authenticated update media" ON storage.objects
      FOR UPDATE TO authenticated USING (bucket_id = 'media') WITH CHECK (bucket_id = 'media');
    CREATE POLICY "Authenticated delete media" ON storage.objects
      FOR DELETE TO authenticated USING (bucket_id = 'media');
  END IF;
  -- e-papers bucket
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Public read e-papers'
  ) THEN
    CREATE POLICY "Public read e-papers" ON storage.objects
      FOR SELECT TO anon, authenticated USING (bucket_id = 'e-papers');
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Authenticated write e-papers'
  ) THEN
    CREATE POLICY "Authenticated write e-papers" ON storage.objects
      FOR INSERT TO authenticated WITH CHECK (bucket_id = 'e-papers');
    CREATE POLICY "Authenticated update e-papers" ON storage.objects
      FOR UPDATE TO authenticated USING (bucket_id = 'e-papers') WITH CHECK (bucket_id = 'e-papers');
    CREATE POLICY "Authenticated delete e-papers" ON storage.objects
      FOR DELETE TO authenticated USING (bucket_id = 'e-papers');
  END IF;
END $$;

COMMIT;

