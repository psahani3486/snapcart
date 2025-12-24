## Snapcart — Local Development

Snapcart is a Next.js 13+ application (App Router) for a grocery delivery demo. It uses NextAuth for auth, MongoDB (mongoose) for persistence, Cloudinary for image uploads, and Socket.IO for real-time features.

This README explains how to configure and run the project locally.

Prerequisites
- Node.js 18+ and npm installed
- MongoDB running locally or a MongoDB Atlas connection URI

Quick start (development)

1. Install dependencies:

```bash
cd snapcart
npm install
```

2. Configure environment variables

- Copy or edit `.env.local` and set `MONGODB_URL` to either a local MongoDB URI or your Atlas URI.
- Example `.env.local` values:

```
MONGODB_URL=mongodb://127.0.0.1:27017/snapcart
AUTH_SECRET=your_secret_here
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
NEXT_PUBLIC_SOCKET_SERVER=http://localhost:4000
NEXT_BASE_URL=http://localhost:3000
```

3. Start the Socket server (optional but recommended for real-time features):

```bash
cd socketServer
npm install
npm run dev
# Socket server typically runs on port 4000
```

4. Start the Next.js dev server:

```bash
cd snapcart
npm run dev
```

Open http://localhost:3000 in your browser.

Common issues and troubleshooting

- Hydration mismatch / client component errors
  - If you see hydration warnings (SSR vs client mismatch), disable browser extensions and ensure components that use hooks or browser-only APIs include `"use client"` at the top. The project already marks many components as client.

- MongoDB connection errors
  - Ensure `MONGODB_URL` is set and reachable. For Atlas, whitelist your IP or use 0.0.0.0/0 for dev.

- 400 responses from `/api/auth/register`
  - The API includes validation; check the server console for detailed errors.

Testing the register endpoint

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"you@example.com","password":"secret123"}'
```

Useful commands

- `npm run dev` — Start Next.js dev server
- `npm run build` — Build for production
- `npm start` — Start production server after build
- `npm run lint` — Run ESLint

If you want, I can start the dev server here and show logs. Reply "start" to let me run `npm install` and `npm run dev` in the workspace.

License: MIT
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
