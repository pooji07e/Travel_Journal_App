# 📖 Vintage Travel Journal

A vintage, cozy travel journal web application. Keep trips as **"volumes"** and write entries as **"pages"** with rich text, photos, short video clips, tags, moods, places on a map, and Spotify soundtracks — crafted to feel like opening a worn leather journal, not a social feed.

---

## 🧭 Tech Stack & Architecture

| Layer | Choice | Details |
| :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | TypeScript in strict mode |
| **Database** | PostgreSQL on Supabase | Row Level Security (RLS) + Full-text search index |
| **ORM** | Prisma | Schema models, relational queries & migrations |
| **Authentication** | Supabase Auth | Email + Google sign-in with cookie sessions (`@supabase/ssr`) |
| **File Storage** | Supabase Storage | Private bucket (`media`) with signed direct-to-storage uploads |
| **Rich Text** | Tiptap | Headings, lists, blockquotes, bold/italic, saved as JSON |
| **Maps & Places** | MapLibre GL JS + MapTiler | Vintage/outdoor vector tiles & geocoding search |
| **Music** | Spotify Embed | Official iframe player from pasted track, album, or playlist links |
| **Styling** | Tailwind CSS | CSS-variable theme tokens (Sepia & Midnight) |
| **Validation** | Zod | Strictly validated inputs on every server action and route handler |

---

## 🎨 Vintage Design System

The visual identity simulates aged parchment, leather bindings, typewriter labels, and analog travel ephemera.

### Color Tokens

All colors are controlled via CSS custom properties mapped directly into Tailwind utility classes:

| Token | Sepia (Default) | Midnight (Dark) | Description |
| :--- | :--- | :--- | :--- |
| `--paper` | `#F4ECD8` | `#1B1815` | Worn parchment base background |
| `--ink` | `#5B4636` | `#F2E8DC` | Warm mahogany / glowing night text |
| `--teal` | `#5F7F7A` | `#6C928C` | Botanical field notes accent / Primary buttons |
| `--rose` | `#C48B8B` | `#D19A9A` | Wax stamp / warning accent |
| `--mustard` | `#C9A24B` | `#D8B25C` | Antique gold gilding & highlights |

### Typography & Motifs
- **Headings**: *Playfair Display*
- **Body Text**: *Lora*
- **Labels & Metadata**: *Special Elite* / *Courier Prime*
- **Handwritten Captions**: *Caveat*
- **Atmospheric Textures**: Paper grain overlay, soft edge vignette, torn-edge dividers, washi tape headers, mood postage stamps, and polaroid cards with slight analog rotations.

---

## 📦 Features

1. **Authentication**: Secure email/password and Google OAuth via Supabase Auth with server-side cookie sessions.
2. **Volumes (Trips)**: Create, view, edit, and organize trips with dates and cover photos.
3. **Pages (Entries)**: Full CRUD with rich text (Tiptap), automatic autosave with conflict resolution (`updatedAt`), and draft/published statuses.
4. **Polaroid Photo Cards**: Multi-upload, browser-side compression (max 1600px WebP), captions, reordering, and vintage photo tilt.
5. **Short Video Clips**: Up to 60 seconds / 100 MB per clip with client-side first-frame thumbnail generation.
6. **Mood Stamps**: Vintage postage stamp chips representing moods (*Joyful, Calm, Nostalgic, Tired, Adventurous, Romantic, Homesick*).
7. **Cartography**: MapLibre GL interactive map with vintage vector tiles, location search, and pin previews.
8. **Spotify Soundtracks**: Embed music players for songs, albums, and playlists attached to memories.
9. **Search & Filters**: Full-text search across titles and body text combined with filters by trip, mood, tag, and date.
10. **Storage Meter**: Real-time visualization of used storage against the 1 GB quota.

---

## ⚙️ Media Limits & Rules

| Rule | Value |
| :--- | :--- |
| **Photo Formats** | JPG, PNG, WebP, HEIC (converted to WebP in browser) |
| **Photo Max Size** | 10 MB before compression (compressed to ~1600px width) |
| **Video Formats** | MP4, MOV, WebM |
| **Video Max Size** | 100 MB per video |
| **Video Max Length** | 60 seconds |
| **Videos Per Entry** | Maximum 3 |
| **Photos Per Entry** | Maximum 20 |
| **Per-User Quota** | 1 GB total (warning above 80%) |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ (tested on Node v22)
- npm or pnpm
- A Supabase account and project

### 2. Environment Setup
Copy the sample environment variables:
```bash
cp .env.example .env.local
```

Configure the following variables in `.env.local`:
```env
DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
NEXT_PUBLIC_MAPTILER_API_KEY="your-maptiler-api-key"
```

### 3. Database Setup
Generate Prisma client and run migrations:
```bash
npm run prisma:generate
npx prisma migrate dev --name init
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
/src
  /app
    /(auth)/login, /signup        # Authentication pages
    /(app)/trips, /trips/[id]     # Volumes & Pages views
    /(app)/entries/new, /[id]     # Entry editor & reader
    /(app)/settings               # Storage meter & theme preferences
    /api/...                      # Route handlers
  /components
    /layout                       # AppShell, navigation
    /theme                        # ThemeProvider, ThemeSwitcher
    /entries                      # EntryCard, MoodChip, Polaroid
  /lib
    prisma.ts                     # Prisma client singleton
    supabase.ts                   # Browser & server Supabase client
    auth.ts                       # Server auth & session helpers
    limits.ts                     # Central media and quota limits
  /styles
    globals.css                   # Vintage theme variables & textures
/prisma
  schema.prisma                   # Database schema
  migrations/                     # SQL migrations (including RLS & FTS)
```
