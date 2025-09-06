# Blood Bank Management (Next.js + Prisma) — Render-ready

## Tech
- Next.js 14 (App Router) + Tailwind
- Prisma (PostgreSQL)
- JWT cookie auth (roles: ADMIN, HOSPITAL, PATIENT)

## Local Dev
```bash
cp .env.example .env
# set DATABASE_URL (Postgres) + JWT_SECRET
npm install
npx prisma migrate dev --name init
npm run seed
npm run dev
# login: admin@bb.com / admin123
```

## Deploy to Render
See the steps provided in the chat.
