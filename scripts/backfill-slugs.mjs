import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function loadEnv() {
  const envPath = path.join(rootDir, '.env');
  let supabaseUrl = process.env.VITE_SUPABASE_URL;
  let supabaseAnon = process.env.VITE_SUPABASE_ANON_KEY;
  try {
    const raw = fs.readFileSync(envPath, 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      const key = m[1];
      let val = m[2];
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (key === 'VITE_SUPABASE_URL' && !supabaseUrl) supabaseUrl = val;
      if (key === 'VITE_SUPABASE_ANON_KEY' && !supabaseAnon) supabaseAnon = val;
    }
  } catch {}
  if (!supabaseUrl || !supabaseAnon) {
    throw new Error('Missing Supabase config. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
  }
  return { supabaseUrl, supabaseAnon };
}

function slugify(input, fallback) {
  try {
    const base = (input || '').toString().toLowerCase()
      .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
    if (base && base.length >= 3) return base;
    return fallback;
  } catch {
    return fallback;
  }
}

async function main() {
  const { supabaseUrl, supabaseAnon } = loadEnv();
  const supabase = createClient(supabaseUrl, supabaseAnon);

  // Fetch up to 10k articles (adjust if needed)
  const { data: rows, error } = await supabase
    .from('articles')
    .select('id,title,slug')
    .order('id', { ascending: true })
    .range(0, 9999);
  if (error) throw error;

  const existing = new Set();
  for (const r of rows) {
    const s = (r.slug || '').trim();
    if (s) existing.add(s);
  }

  const updates = [];
  for (const r of rows) {
    const cur = (r.slug || '').trim();
    if (cur) continue;
    const base = slugify(r.title, `article-${r.id}`);
    let candidate = base;
    if (existing.has(candidate)) candidate = `${base}-${r.id}`;
    if (!existing.has(candidate)) {
      existing.add(candidate);
      updates.push({ id: r.id, slug: candidate });
    }
  }

  let ok = 0, fail = 0;
  for (const u of updates) {
    const { error: upErr } = await supabase
      .from('articles')
      .update({ slug: u.slug })
      .eq('id', u.id);
    if (upErr) {
      fail++;
      console.error(`Failed updating id=${u.id} -> ${u.slug}:`, upErr.message);
    } else {
      ok++;
    }
  }

  console.log(`Backfill complete. Updated: ${ok}, Failed: ${fail}, Skipped (already had slug): ${rows.length - updates.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

