# Our Date Planner — Setup Guide

## Step 1: Create a Supabase project (free)

1. Go to https://supabase.com and sign up / log in
2. Click **New project** — choose a name, set a database password, pick the closest region
3. Once created, go to **Settings → API**
4. Copy **Project URL** and **anon / public key**

## Step 2: Set up the database

1. In your Supabase project, go to **SQL Editor**
2. Paste the contents of `supabase/migration.sql` and click **Run**

## Step 3: Configure environment variables

1. Copy the example file:
   ```
   cp .env.local.example .env.local
   ```
2. Open `.env.local` and fill in your values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 4: Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 — sign up with your email, then have your girlfriend sign up with hers.

## Step 5: Deploy to Vercel (free, so she can install the app)

1. Push this folder to a GitHub repository
2. Go to https://vercel.com, click **Add New Project**, import the repo
3. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy** — you'll get a URL like `your-app.vercel.app`

## Step 6: Install on your phones (PWA)

**Android:**
- Open the app URL in Chrome
- Tap the 3-dot menu → "Add to Home screen"

**iPhone:**
- Open the app URL in Safari
- Tap the Share button → "Add to Home Screen"

The app will open like a native app from your home screen — no app store needed!

---

## App features

- **Dashboard** — see all plans with Wishlist / Planned / Done filters
- **New plan** — add a title, date, description, and status
- **Plan detail** — add locations with any URL (Google Maps, Instagram, TikTok, Yelp, etc.)
- **Real-time sync** — changes appear instantly on the other person's screen
- **Installable** — works on iPhone and Android as a home screen app
