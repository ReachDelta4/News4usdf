NEWS4US Backend and Supabase Audit — 2025-10-26

Summary
- The frontend is a Vite + React TS app with a UI-only CMS/Admin. There is no real data integration; most pages use static sample data.
- A Supabase client is defined (`src/lib/supabase.ts`) and typed API helpers exist (`src/lib/api.ts`), but nothing in the UI imports or uses them.
- The Supabase database connected via provided credentials existed with a custom schema that did not match the app’s expected schema. RLS was enabled with no policies, and no storage buckets were configured.

Key Findings
- Environment variables: Missing `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Without these, the app cannot connect to Supabase from the browser.
- Supabase Auth: `auth.users` exists, but the app-level tables in `public` were built around a custom `public.users` with integer PKs. The app’s code expects a `profiles` table keyed to `auth.users.id` (uuid) and uses Supabase Auth flows, which are not implemented in the UI.
- Schema mismatches (highlights):
  - App expects: `public.profiles`, `public.media_files`, `public.e_papers`, `public.site_settings`, `public.bookmarks` — missing.
  - App expects: `public.articles` with `slug`, `featured` (boolean), `featured_image_url`, `video_url`, `read_time`, `publish_date`, `scheduled_date`. DB had none of these (only `published_at`, `is_featured`).
  - App expects: `public.categories` with `slug`, `color`, `icon`, `featured`, `parent_id`, `display_order`, `article_count`. DB had none of these.
  - Tags: DB has `public.tags` + `public.article_tags (article_id, tag_id)` while the code uses a simpler `article_tags` with a `tag` text. This requires code adaptation when we wire things up.
- RPC functions: App relies on `increment_article_views` and `increment_epaper_downloads` which were missing.
- RLS: Enabled on all `public.*` tables but with zero policies, effectively blocking any access via anon/auth keys.
- Storage: No buckets existed; the code uses buckets named `media` and `e-papers`.
- Admin/CMS: `src/components/pages/AdminLoginPage.tsx`, `src/components/pages/AdminDashboard.tsx`, and all `src/components/cms/*` are demo/stub UIs storing data in component state/localStorage. No calls to `src/lib/api.ts` and no Supabase integration.

What I Changed (DB)
- Created storage buckets: `media` and `e-papers`, and added storage RLS policies for public read and authenticated write.
- Added missing app tables with minimal security policies:
  - `public.profiles` (uuid PK, FK to `auth.users.id`) with basic RLS; auto-create trigger on new auth user.
  - `public.media_files`, `public.e_papers`, `public.site_settings`, `public.bookmarks` with basic RLS.
- Altered existing tables to align with code expectations:
  - `public.categories`: added `slug`, `color`, `icon`, `featured`, `parent_id`, `display_order`, `article_count`; auto-generated `slug` and unique index.
  - `public.articles`: added `slug`, `featured`, `featured_image_url`, `video_url`, `read_time`, `publish_date`, `scheduled_date`; backfilled `publish_date` from `published_at`; unique index on `slug`.
- Added RPC functions: `public.increment_article_views(int)` and `public.increment_epaper_downloads(uuid)`.
- Added updated_at triggers to `articles`, `categories`, `profiles`.

Important Notes
- IDs: Existing `public.articles` and `public.categories` use integer IDs. The current `src/lib/database.types.ts` defines string IDs; these types must be regenerated or corrected before using the typed client in the app.
- Auth in UI: The Auth pages and Admin login are stubs. To use Supabase Auth, we need to wire login/signup/role logic and then enforce write policies using `profiles.role` (e.g., admin/editor/viewer).
- Tags: Code must adapt to the existing normalized `tags` + `article_tags` structure. PostgREST embedding can handle nested: `article_tags(tags(name))`.

What’s Left To Configure (Frontend)
- Create `.env` with:
  - `VITE_SUPABASE_URL=https://<project-ref>.supabase.co`
  - `VITE_SUPABASE_ANON_KEY=<your-anon-key>`
- Regenerate Supabase TS types from the live DB and replace `src/lib/database.types.ts` so types match the real schema (integer IDs for articles/categories, added columns, new tables).
- Update `src/lib/api.ts` to align with the real schema and relationships (e.g., replace `profiles(...)` with `users(...)` or properly use the new `profiles` table and update FKs accordingly).
- Replace CMS stubs with calls to `api`: Articles, Categories, Images, E-Papers, Users/Profiles, Settings. Start with read paths (home/category/article pages), then add write paths for Admin.

Recommended Step-by-Step Plan
1) Frontend configuration
   - Add `.env` with Supabase URL/anon key.
   - Replace placeholder demo data on Home/Category/Article with real reads from `api`. Start with `articles` of status `published` and category filters.

2) Types + API alignment
   - Regenerate `database.types.ts` from Supabase or update manually to match:
     - `articles` (integer id + new columns), `categories` (integer id + new columns), `profiles` (uuid id), `media_files`, `e_papers`, `site_settings`, `bookmarks`.
   - Update `src/lib/api.ts` relations to match FKs:
     - `articles.category_id -> categories.id` (OK)
     - `articles.author_id -> users.id` (or create/shift to `profiles` if we decide to refactor authoring).
     - Tags: switch to `article_tags(tags(name))`.

3) Admin/CMS wiring (minimal viable)
   - Replace the localStorage Admin login with Supabase Auth (email/password). On user creation, a `profiles` row auto-creates. Add a quick migration or admin tool to set your user’s `profiles.role = 'admin'`.
   - CategoriesPanel -> CRUD via `public.categories`.
   - ArticlesPanel -> Create/Update with `status` (draft/published), set `slug`, pick `category_id`, upload `featured_image` to `media` bucket and store URL in `featured_image_url`.
   - E-Papers -> Upload to `e-papers` bucket and store metadata in `public.e_papers`.
   - Image Manager -> List `storage.objects` for `media` and map to `media_files` rows.

4) Policies refinement (optional hardening)
   - Gate writes by `profiles.role in ('admin','editor')` instead of “any authenticated”.
   - Add validation checks (e.g., unique slugs enforced by DB; current unique indexes already help for `slug`).

5) Content seeding
   - Insert initial categories and at least a few published articles to light up the homepage and category pages.

Files Added
- `db/migrations/2025-10-26_initial_alignment.sql` — The SQL I applied to Supabase (for tracking).
- `docs/DEPLOYMENT.md` — Minimal checklist for configuring environment and launching.

Blocking Item
- I need `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from your Supabase project to wire the frontend. The project ref appears to be `hfymcyzedgdapbtwonwt` (from the DB user), so the URL is likely `https://hfymcyzedgdapbtwonwt.supabase.co`. Please confirm and share the anon key.

Appendix: Current Public Tables (pre-change vs expected)
- Present: app_audit_log, article_tags (join), article_views, articles, categories, comments, media_assets, notifications, sessions, tags, user_activity, user_favorites, user_preferences, user_profiles, users, youtube_*.
- Expected by code: profiles, categories (more columns), articles (more columns), article_tags (text tag), media_files, e_papers, site_settings, bookmarks.

