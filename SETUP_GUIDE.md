# The Firefly Jar — setup guide (Vite + React + Supabase)

## Project layout

```
firefly-jar-app/
  src/
    components/       Jar, Firefly, AddMemoryModal, ViewMemoryModal, AuthScreen, Background
    hooks/useFireflies.js   all the Supabase reads/writes for a jar
    supabaseClient.js       Supabase client, reads config from .env
    App.jsx, main.jsx, styles.css
  supabase/functions/notify-fireflies/   the daily "a firefly lit up" email job
  schema.sql               database table + row-level security
  .env.example              copy to .env and fill in your project's values
```

## 1. Install dependencies

You'll need [Node.js](https://nodejs.org) (18+) installed. Then, inside the project folder:

```
npm install
```

## 2. Create the Supabase project

1. [supabase.com](https://supabase.com) → **New project**. Pick a name, a database password (save it), a region.
2. Wait ~2 minutes for it to spin up.
3. **SQL Editor → New query** → paste in the entire contents of `schema.sql` → **Run**.
4. Check **Table Editor** — you should see a `fireflies` table. Row Level Security is already on, so every person's jar stays private to them.
5. **Authentication → Providers** — confirm Email is enabled (it is by default). This project uses magic-link sign-in, no passwords.

## 3. Connect the app to your project

1. In Supabase: **Project Settings → API** → copy the **Project URL** and the **anon public key**.
2. In the project folder:
   ```
   cp .env.example .env
   ```
3. Open `.env` and fill in both values:
   ```
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
   `.env` is already in `.gitignore` — it won't get committed or pushed anywhere.

## 4. Run it locally

```
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`). Sign in with your email, check your inbox for the magic link, and you should land back in the app signed in.

Add `http://localhost:5173` to Supabase's **Authentication → URL Configuration → Redirect URLs** so the magic link works locally.

## 5. Deploy it

```
npm run build
```

This produces a `dist/` folder — that's the entire deployable site.

**Vercel** (easiest): create a free account, **Add New Project**, import this folder/repo. Vercel auto-detects Vite — build command `npm run build`, output directory `dist`. Before the first deploy, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under **Project Settings → Environment Variables** (same values as your `.env`).

**Netlify** works the same way — same build command and output directory, same environment variables screen.

Once deployed, copy the live URL and add it to Supabase's **Redirect URLs** too, or magic links won't return you to the right place.

## 6. Email notifications (fireflies lighting up)

This part is unchanged from before — it lives in Supabase, not in the React app.

**a. Get a Resend API key** (free tier: 100 emails/day)
1. [resend.com](https://resend.com) → **API Keys → Create API Key**.
2. For quick testing, send from `onboarding@resend.dev` (already verified). Add your own domain under **Domains** when you're ready.

**b. Deploy the Edge Function**
```
npm install -g supabase
supabase login
supabase link --project-ref YOUR-PROJECT-REF
supabase secrets set RESEND_API_KEY=your_resend_key
supabase secrets set NOTIFY_FROM_EMAIL=onboarding@resend.dev
supabase functions deploy notify-fireflies
```
(The function code is already in `supabase/functions/notify-fireflies/index.ts` — nothing to write, just deploy.)

**c. Schedule it**
Supabase dashboard → **Integrations → Cron** → **Create a new job** → type **Supabase Edge Function** → pick `notify-fireflies` → schedule `0 9 * * *` (9am UTC daily, adjust as you like) → save.

## What this costs

Free tier covers all of it: Supabase (500MB DB, 50k monthly active users), Resend (100 emails/day), Vercel/Netlify (static hosting). You likely won't pay anything unless this grows a lot.

## Where to go from here

- **Per-firefly delete**, not just "clear the whole jar" — small addition to `useFireflies.js` + a button in `ViewMemoryModal`.
- **Editing a sealed memory** before its date arrives.
- **Invite-only jars** — restrict signups in Supabase's auth settings if you don't want this public.
- **Custom domain** — point one at Vercel/Netlify once you're happy with it.
