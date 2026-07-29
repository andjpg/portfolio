# Harshdeep Singh — Portfolio

A static, no-build-step site. Three files: `index.html`, `styles.css`, `script.js`.

## Preview locally
Just double-click `index.html`, or run a tiny local server from this folder:
```
npx serve .
```

## Deploy to Vercel
**Option A — no terminal, drag and drop**
1. Go to https://vercel.com/new
2. Drag this whole folder onto the page (or "Upload" it)
3. Deploy — done, you'll get a live URL in ~10 seconds

**Option B — with the Vercel CLI**
```
npm i -g vercel
cd portfolio
vercel
```
Answer the prompts (link/create a project) and it'll deploy. Framework preset: "Other" — there's no build step needed.

**Option C — GitHub**
1. Push this folder to a new GitHub repo
2. Go to vercel.com/new, import the repo
3. Framework preset: "Other". Deploy.

## Things to swap in before you ship it
- **LinkedIn URL** — in `index.html`, find `id="linkedin-link"` and replace the `href="#"` with your real profile URL.
- **Résumé link** — currently points at your Google Drive résumé link. Swap for a hosted PDF (e.g. drop a `resume.pdf` in this folder and link to `/resume.pdf`) if you'd rather people not need Drive access.
- **Case studies link** — currently points at your Drive folder of case studies. Same deal — worth hosting these as real pages eventually, but the Drive link works fine to start.
- **Custom domain** — once deployed, Vercel lets you attach a custom domain (e.g. harshdeepsingh.com) for free under Project → Settings → Domains.

## How the "lens" works
Click a pill (Product / Consulting / Data / Engineering) in the hero. It:
- recolors the accent color site-wide
- rewrites the hero tagline to a fact from that part of your career
- highlights the matching timeline entry, project and skill group, and dims the rest

All logic lives in `script.js` — it's about 60 lines, easy to extend if you add more experience entries (just add a matching `data-mode="..."` attribute to the new block).
