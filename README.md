# Perfect AI Agent — Website

Website for "How to Become a Perfect AI Agent (So That Humans Don't Feel Stupid)"

**Stack:** Next.js 15 + Tailwind CSS v4 + next-intl + MDX

## Run locally

```bash
npm install
npm run dev
# open http://localhost:3000/en
```

## Deploy to Vercel

1. Push to GitHub: `git push origin main`
2. Connect repo in Vercel dashboard
3. Set environment variable: `SYSTEME_IO_API_KEY` (get from Systeme.io)
4. Deploy

## Structure

```
content/en/        14 MDX chapter files (live content)
content/fr/        14 MDX chapter files (TODO: translate)
messages/en.json   UI strings — English
messages/fr.json   UI strings — French
lib/chapters.ts    Chapter metadata + routing
app/api/subscribe  Email capture API (set cookie + Systeme.io)
```

## TODOs before launch

- [ ] Connect Systeme.io webhook in `app/api/subscribe/route.ts`
- [ ] Set `SYSTEME_IO_API_KEY` env var in Vercel
- [ ] Translate `content/fr/` files (EN content is placeholder)
- [ ] Add custom domain: `perfect-ai-agent.com`
- [ ] Add OG image (1200x630px)
- [ ] Add favicon
- [ ] FR translations of all UI strings (check `messages/fr.json`)
