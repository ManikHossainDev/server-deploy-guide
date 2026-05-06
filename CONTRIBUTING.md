# Contributing to Server Deploy Guide

এই গাইডে অবদান রাখার জন্য ধন্যবাদ!  
Thank you for contributing to this guide!

---

## কীভাবে অবদান রাখবেন / How to contribute

### ১. Fork ও Clone

```bash
# GitHub-এ Fork করুন, তারপর:
git clone https://github.com/rakibislam2233/server-deploy-guide
cd server-deploy-guide
npm install
npm run dev
```

### ২. Content ফাইল খুঁজুন

সব guide content এখানে আছে:

```
src/lib/content/
├── part0.ts   # Section 0  — SSH & server access
├── part1.ts   # Section 1–5 — Security, DB, App, Env
├── part2.ts   # Section 6–10 — Nginx, SSL, Cloudflare, Monitoring, Staging
├── part3.ts   # Section 11–15 — CI/CD, Rollback, Backup, DR, Security checklist
└── part4.ts   # Section 16  — Command reference
```

প্রতিটি section-এ `bn` (বাংলা) ও `en` (English) field আলাদা। যেকোনো একটি বা দুটোই edit করা যাবে।

### ৩. কী ধরনের contribution welcome

| ধরন | উদাহরণ |
|---|---|
| **Command fix** | ভুল command ঠিক করা (deprecated, wrong flag, missing step) |
| **New section/subsection** | নতুন টপিক যোগ করা যা এখনও cover হয়নি |
| **Translation improvement** | বাংলা বা ইংরেজি অনুবাদ আরও স্পষ্ট করা |
| **Typo / clarity** | ভুল বানান বা confusing sentence ঠিক করা |
| **Bug report** | Section structure বা type error |

### ৪. Content Node structure

```typescript
// Text paragraph
{ type: "p", bn: "বাংলা টেক্সট", en: "English text" }

// Code block
{ type: "code", lang: "bash", code: `your command here` }

// Warning/info box
{ type: "infobox", variant: "warning", titleBn: "...", titleEn: "...", bodyBn: "...", bodyEn: "..." }

// Ordered list
{ type: "ol", items: [{ bn: "...", en: "..." }] }

// Table
{ type: "table", headers: { bn: [...], en: [...] }, rows: [{ bn: [...], en: [...] }] }
```

### Environment / Contributors page

Contributors তালিকা দেখতে `.env.local`-এ `NEXT_PUBLIC_GITHUB_REPO` সেট করুন — শুধু **`owner/repo`** (যেমন `rakibislam2233/server-deploy-guide`)।  
সঠিক API লিঙ্কের রূপ: `https://api.github.com/repos/OWNER/REPO/contributors` — `OWNER/REPO`-এর পরিবর্তে সম্পূর্ণ অন্য URL বসালে `404 Not Found` পাবেন।

For the contributors API use **`owner/repo` only** (example: `rakibislam2233/server-deploy-guide`). Full URLs containing `github.com` are normalized in the app; paths like `repos/https:/owner/repo` happen when the value is wrong.

---

### ৫. Pull Request দেওয়ার আগে

```bash
# TypeScript check
npx tsc --noEmit

# Local preview
npm run dev
```

PR description-এ সংক্ষেপে লিখুন:
- কী পরিবর্তন করলেন
- কেন এটা ঠিক বা উন্নত

---

## What NOT to change

- `src/types/guide.ts` — type definitions (আগে issue খুলুন)
- `src/components/` — UI components (আগে issue খুলুন)
- Design, layout, fonts

---

## Questions?

GitHub Issues খুলুন অথবা existing issues দেখুন।
