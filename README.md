# Museum Time Machine

Pick a year from 1000 to 2000 and the page transforms into that era with real museum artwork, period-matched poetry, ambient radio, historical context, a magnifying art lens, poem reading mode, and a random walk through time.

## APIs

- `/api/artwork` tries The Met, Art Institute Chicago, Harvard Art Museums, then a curated fallback.
- `/api/poem` fetches era-matched public poetry from PoetryDB, then a curated fallback.
- `/api/audio` looks for a quiet HTTPS Radio Browser station for the active era.

## Development

```bash
npm install
npm run dev
```

Open the local URL printed by Next.js.

## Verification

```bash
npm test
npm run typecheck
npm run lint
npm run build
npm run e2e
```

## Deploy

The app is Vercel-ready as a standard Next.js App Router project:

```bash
npx vercel --prod
```

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
