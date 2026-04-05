# Custom CMS Portfolio (Next.js + Supabase)

Production-ready starter for a modern, custom CMS website with:
- Public website (portfolio + blog + dynamic pages)
- Hidden CMS control panel with secure auth
- Supabase PostgreSQL + Auth + RLS
- URL-based image handling (no file upload in v1)
- Rank Math-style SEO scoring and publishing workflow

## Stack
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui-style component primitives
- Supabase Auth + PostgreSQL
- Tiptap rich text editor
- Server actions + SSR

## Hidden CMS Path
CMS routes are not exposed as `/admin`.

Set this in `.env.local`:
```bash
CMS_BASE_PATH=/secure-control-panel
```

All CMS pages will be available under:
- `/secure-control-panel/login`
- `/secure-control-panel/dashboard`
- `/secure-control-panel/posts`
- `/secure-control-panel/pages`
- `/secure-control-panel/portfolio`
- `/secure-control-panel/categories`
- `/secure-control-panel/tags`
- `/secure-control-panel/settings`
- `/secure-control-panel/seo`
- `/secure-control-panel/audit-logs`

Internally, these are rewritten to `/cms-internal/*` and blocked for direct access by `proxy.ts`.

## Project Structure
```text
app/
  (public)/
    page.tsx
    about/page.tsx
    services/page.tsx
    contact/page.tsx
    blog/page.tsx
    blog/[slug]/page.tsx
    portfolio/page.tsx
    portfolio/[slug]/page.tsx
    page/[slug]/page.tsx
    category/[slug]/page.tsx
    tag/[slug]/page.tsx
    search/page.tsx
  cms-internal/
    login/page.tsx
    (protected)/
      dashboard/page.tsx
      posts/page.tsx
      posts/new/page.tsx
      posts/[id]/edit/page.tsx
      pages/page.tsx
      pages/new/page.tsx
      pages/[id]/edit/page.tsx
      portfolio/page.tsx
      portfolio/new/page.tsx
      portfolio/[id]/edit/page.tsx
      categories/page.tsx
      tags/page.tsx
      settings/page.tsx
      seo/page.tsx
      audit-logs/page.tsx
      preview/[entity]/[id]/page.tsx
  robots.ts
  sitemap.ts

components/
  cms/
  content/
  editor/
  layout/
  seo/
  ui/

lib/
  cms/
    actions/
    auth.ts
    audit.ts
  seo/
  security/
  supabase/
    queries/
  validators/

supabase/sql/
  001_schema.sql
  002_rls_policies.sql
  003_seed.sql
```

## Database Setup (Supabase)
Run SQL files in this order:
1. `supabase/sql/001_schema.sql`
2. `supabase/sql/002_rls_policies.sql`
3. `supabase/sql/003_seed.sql`

## Admin Account Setup Flow
1. Create a user in Supabase Auth (email/password).
2. The trigger in `001_schema.sql` auto-creates a row in `public.profiles`.
3. Promote the user to admin:
```sql
update public.profiles
set role = 'admin'
where email = 'your-admin-email@example.com';
```
4. Login from `${CMS_BASE_PATH}/login`.

## Environment Variables
Copy `.env.example` to `.env.local` and set:
```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
CMS_BASE_PATH=/secure-control-panel
```

## Development
```bash
npm install
npm run dev
```

Open:
- Public site: `http://localhost:3000`
- CMS login: `http://localhost:3000/secure-control-panel/login` (if `CMS_BASE_PATH=/secure-control-panel`)

## Build / Verification
```bash
npm run typecheck
npm run build
```

## SEO System
Each post/page/portfolio item includes:
- SEO title, meta description, focus keyword
- canonical URL, OG fields, schema type, robots directive
- live SEO score `/100` in CMS forms
- actionable checklist and warnings

Frontend outputs:
- dynamic metadata
- Open Graph + Twitter tags
- JSON-LD schema
- sitemap.xml
- robots.txt with CMS disallow

## Security Model
- Hidden CMS path via env rewrite
- Supabase Auth session checks
- Role-based route protection (admin-only)
- Server-side auth guard + proxy enforcement
- Row Level Security policies in Supabase
- Generic login error messages
- Rich content sanitization before rendering
- Security headers in `next.config.ts`
- Audit logs for CMS actions

## Keep-Alive System (Database Activity)

To prevent Supabase project from pausing due to inactivity, this system automatically refreshes content daily:

### Features
- **Islamic Quotes**: Daily rotating Islamic quotes with categories
- **Educational Jokes**: Programming, math, and science jokes
- **AI Tools**: Featured AI tools with descriptions and links

### How It Works
1. Content expires after 24 hours (auto-cleanup)
2. New content is generated daily via cron job or manual refresh
3. Old data is automatically deleted to keep database clean
4. Dashboard widget shows current content and refresh status

### Setup

1. **Run the SQL migration**:
   ```bash
   # Execute supabase/sql/004_daily_content.sql in Supabase SQL Editor
   ```

2. **Configure Cron Job** (Vercel Pro required):
   ```json
   // Already configured in vercel.json
   {
     "crons": [
       {
         "path": "/api/cron/keep-alive",
         "schedule": "0 0 * * *"
       }
     ]
   }
   ```

3. **Optional - Add Secret Key**:
   ```bash
   # Add to .env.local
   CRON_SECRET_KEY=your-secret-key
   ```

### Manual Refresh
Visit `/secure-control-panel/dashboard` and use the "Keep-Alive System" widget to:
- Refresh content manually
- View current daily content
- Ping database to keep active
- Cleanup expired data

### Public Page
Daily content is displayed at `/daily` for visitors to see.
