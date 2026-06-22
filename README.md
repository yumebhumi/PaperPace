# PaperPace

PaperPace is a habit-first reading tracker built as “Strava for readers.” The current MVP focuses on:

- adding and tracking books
- running reading sessions with a timer
- logging pages read and pace
- visualizing streaks and book-route progress
- showing lightweight analytics in a premium, warm UI

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion
- Next.js API Routes
- PostgreSQL (Neon)
- Prisma
- Clerk
- Cloudinary
- Recharts
- next-pwa
- Vercel

## Local setup

1. Install dependencies: `npm install`
2. Copy envs from `.env.example`
3. Generate Prisma client: `npx prisma generate`
4. Start the app: `npm run dev`

## Current implementation note

This repo ships with a demo-data fallback so the UI can render before auth and database credentials are configured. The Prisma schema is in place for moving to Neon-backed persistence next.
