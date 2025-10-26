NEWS4US Deployment Notes

Environment
- Create `.env` in the project root with:
  - `VITE_SUPABASE_URL=https://hfymcyzedgdapbtwonwt.supabase.co`
  - `VITE_SUPABASE_ANON_KEY=<anon-key>`
- A `.env` has been added locally with your provided anon key.
- Start dev: `npm i && npm run dev`

Supabase
- Database alignment SQL: `db/migrations/2025-10-26_initial_alignment.sql` (already applied to your project).
- Storage buckets created: `media` (images) and `e-papers` (PDFs). Public read, authenticated write.
- Minimal RLS policies added so public can read published content and authenticated users can write. Harden later by role (`profiles.role`).

Security Keys
- Use only the anon key in the browser (`VITE_SUPABASE_ANON_KEY`).
- Never expose the service role key in client code. Keep it server-side only.

Next Steps
- Regenerate `src/lib/database.types.ts` from the live DB and update `src/lib/api.ts` accordingly.
- Replace static demo data in pages with `api` reads (articles, categories, e-papers, media).
- Swap Admin login (localStorage) for Supabase Auth and enforce admin/editor roles via `profiles.role`.
