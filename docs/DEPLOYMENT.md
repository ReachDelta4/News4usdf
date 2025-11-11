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

Single-Page App (SPA) routing on production
- The app uses client-side routing (custom Router). Direct requests to deep links like `/article/<slug>` must be served `index.html` so the client can render the route.
- Without this, users see a server 404 when they open shared URLs directly.

Configure your host to fallback to `index.html` for unknown routes:
- NGINX
  - Inside your `server {}` block, add:
    - `location / { try_files $uri /index.html; }`
  - If you serve assets from `/assets` or `/dist`, ensure they’re not rewritten.
- Apache (with .htaccess)
  - Enable `AllowOverride All` and add to your web root `.htaccess`:
    - `RewriteEngine On`
    - `RewriteBase /`
    - `RewriteRule ^index\.html$ - [L]`
    - `RewriteCond %{REQUEST_FILENAME} !-f`
    - `RewriteCond %{REQUEST_FILENAME} !-d`
    - `RewriteRule . /index.html [L]`
- Netlify
  - Create a file `public/_redirects` with:
    - `/*   /index.html   200`
- Vercel
  - Add `vercel.json` with a rewrite from `/(.*)` to `/index.html` for SPA.
- Cloudflare Pages
  - Set a catch-all route rewrite to `/index.html`.

Important: If you use a CDN or proxy in front of your origin (e.g., Cloudflare), apply the same rewrite/fallback at the edge or forward unmatched paths to your origin and let the origin serve `index.html`.

Canonical article URLs
- The app canonicalizes the URL on article load to `/article/<slug>`.
- Old slugs are preserved in the database (`article_slug_redirects`), and the client API resolves those to the current article. Keep your server SPA fallback enabled so these work on first load.
