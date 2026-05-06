# Server Deploy Guide

Bangla-first, bilingual interactive guide for deploying apps on a VPS (manual PM2/systemd path and Docker path): SSH, security, Nginx, SSL, CI/CD, backups, and more.

- **Live site:** [https://server-deploy.mdrakib.me](https://server-deploy.mdrakib.me)
- **Live stack:** [Next.js](https://nextjs.org) (App Router), Tailwind CSS v4, [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) with **Anek Bangla** for Bengali script.
- **Content:** `src/lib/content/part0.ts` … `part4.ts` — each node has `bn` and `en` strings.

## Prerequisites

- Node.js 18+
- npm (or pnpm/yarn)

## Getting started

```bash
git clone https://github.com/rakibislam2233/server-deploy-guide.git
cd server-deploy-guide
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Copy `.env.local.example` to `.env.local` and adjust:

| Variable | Purpose |
| -------- | ------- |
| `NEXT_PUBLIC_GITHUB_REPO` | **`owner/repo` only** (e.g. `rakibislam2233/server-deploy-guide`). Used for GitHub links and the `/contributors` page. Do **not** paste `https://github.com/...` unless it contains `github.com` — the app normalizes common URLs, but the REST URL is always `https://api.github.com/repos/{owner}/{repo}/contributors`. |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for SEO: Open Graph, `sitemap.xml`, `robots.txt`, JSON-LD. Production: `https://server-deploy.mdrakib.me`. |

## Scripts

```bash
npm run dev      # development server
npm run build    # production build
npm run start    # serve production build
npm run lint     # ESLint
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Summary: fork, edit content files under `src/lib/content/`, run `npx tsc --noEmit`, open a PR.

Contributors are listed on `/contributors` when `NEXT_PUBLIC_GITHUB_REPO` is set correctly.

## License

See the repository license file (if present).
