# Grill Me

A full-stack developer news forum built with Next.js, PostgreSQL, Prisma, NextAuth credentials authentication, Tailwind, and shadcn/ui-compatible configuration.

## Run locally

```bash
cp .env.example .env
npm install
npx prisma generate
docker compose up -d
npx prisma migrate dev --name init
npm run seed
npm run dev
```

Open http://localhost:3000. Demo login: `demo@grillme.local` / `password123`.

## Useful commands

```bash
npm run build
npm test
npx prisma studio
docker compose down
```

The seed posts are demonstration fixtures. The application supports registration, credentials login, link/text submissions, categories, search, sorting, comments, nested-comment data, and persistent post voting. The current MVP keeps moderation/report management as the next extension point.

## Environment

Copy `.env.example` to `.env`. Use a long random `NEXTAUTH_SECRET` outside local development. PostgreSQL can be moved to AWS RDS by changing `DATABASE_URL`; keep the application server and database credentials private.
# grill-me
