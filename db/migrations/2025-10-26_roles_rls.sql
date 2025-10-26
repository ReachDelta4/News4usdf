BEGIN;

-- Tighten write access to admin/editor roles via profiles.role

-- Helper condition
-- We will inline EXISTS checks in each policy

-- categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  -- Drop broad write policies if present
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='categories' AND policyname='Categories write for authenticated') THEN
    DROP POLICY "Categories write for authenticated" ON public.categories;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='categories' AND policyname='Categories update for authenticated') THEN
    DROP POLICY "Categories update for authenticated" ON public.categories;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='categories' AND policyname='Categories delete for authenticated') THEN
    DROP POLICY "Categories delete for authenticated" ON public.categories;
  END IF;
  -- Create role-gated policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='categories' AND policyname='Categories insert editors') THEN
    CREATE POLICY "Categories insert editors" ON public.categories
      FOR INSERT TO authenticated WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','editor'))
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='categories' AND policyname='Categories update editors') THEN
    CREATE POLICY "Categories update editors" ON public.categories
      FOR UPDATE TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','editor'))
      ) WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','editor'))
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='categories' AND policyname='Categories delete editors') THEN
    CREATE POLICY "Categories delete editors" ON public.categories
      FOR DELETE TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','editor'))
      );
  END IF;
END $$;

-- articles
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='articles' AND policyname='Articles write for authenticated') THEN
    DROP POLICY "Articles write for authenticated" ON public.articles;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='articles' AND policyname='Articles update for authenticated') THEN
    DROP POLICY "Articles update for authenticated" ON public.articles;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='articles' AND policyname='Articles delete for authenticated') THEN
    DROP POLICY "Articles delete for authenticated" ON public.articles;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='articles' AND policyname='Articles insert editors') THEN
    CREATE POLICY "Articles insert editors" ON public.articles
      FOR INSERT TO authenticated WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','editor'))
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='articles' AND policyname='Articles update editors') THEN
    CREATE POLICY "Articles update editors" ON public.articles
      FOR UPDATE TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','editor'))
      ) WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','editor'))
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='articles' AND policyname='Articles delete editors') THEN
    CREATE POLICY "Articles delete editors" ON public.articles
      FOR DELETE TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','editor'))
      );
  END IF;
END $$;

-- e_papers
ALTER TABLE public.e_papers ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='e_papers' AND policyname='EPapers write for authenticated') THEN
    DROP POLICY "EPapers write for authenticated" ON public.e_papers;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='e_papers' AND policyname='EPapers update for authenticated') THEN
    DROP POLICY "EPapers update for authenticated" ON public.e_papers;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='e_papers' AND policyname='EPapers delete for authenticated') THEN
    DROP POLICY "EPapers delete for authenticated" ON public.e_papers;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='e_papers' AND policyname='EPapers insert editors') THEN
    CREATE POLICY "EPapers insert editors" ON public.e_papers
      FOR INSERT TO authenticated WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','editor'))
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='e_papers' AND policyname='EPapers update editors') THEN
    CREATE POLICY "EPapers update editors" ON public.e_papers
      FOR UPDATE TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','editor'))
      ) WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','editor'))
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='e_papers' AND policyname='EPapers delete editors') THEN
    CREATE POLICY "EPapers delete editors" ON public.e_papers
      FOR DELETE TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','editor'))
      );
  END IF;
END $$;

-- media_files
ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='media_files' AND policyname='Media files write for authenticated') THEN
    DROP POLICY "Media files write for authenticated" ON public.media_files;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='media_files' AND policyname='Media files update for authenticated') THEN
    DROP POLICY "Media files update for authenticated" ON public.media_files;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='media_files' AND policyname='Media files delete for authenticated') THEN
    DROP POLICY "Media files delete for authenticated" ON public.media_files;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='media_files' AND policyname='Media files insert editors') THEN
    CREATE POLICY "Media files insert editors" ON public.media_files
      FOR INSERT TO authenticated WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','editor'))
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='media_files' AND policyname='Media files update editors') THEN
    CREATE POLICY "Media files update editors" ON public.media_files
      FOR UPDATE TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','editor'))
      ) WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','editor'))
      );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='media_files' AND policyname='Media files delete editors') THEN
    CREATE POLICY "Media files delete editors" ON public.media_files
      FOR DELETE TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','editor'))
      );
  END IF;
END $$;

-- site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='site_settings' AND policyname='Settings write for authenticated') THEN
    DROP POLICY "Settings write for authenticated" ON public.site_settings;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='site_settings' AND policyname='Settings write editors') THEN
    CREATE POLICY "Settings write editors" ON public.site_settings
      FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','editor'))
      ) WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','editor'))
      );
  END IF;
END $$;

COMMIT;

