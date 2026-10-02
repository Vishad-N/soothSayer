# Soothsayer Analytics — landing page

Single-page marketing site built with React 19 and Vite.

## Run locally

Requires Node.js 20.19+ (or 22.12+).

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production bundle in dist/
npm run preview   # serve the built bundle
```

## Structure

```
index.html                 document head (fonts, meta) + #root
src/
  main.jsx                 React entry
  App.jsx                  page composition, section order
  styles/global.css        all styling (design tokens on :root)
  lib/utils.js             maths helpers, seeded RNG, reduced-motion flag
  hooks/useInView.js       one-shot IntersectionObserver hook
  components/              shared pieces: Nav, Footer, Reveal, ParticleText,
                           Counter, Meter, SpectralRibbon, IntelligenceField (canvas)
  sections/                one file per page section, in page order
```

All motion respects `prefers-reduced-motion`.

## Content still to replace

- **Proof** section (`src/sections/Proof.jsx`) holds a placeholder testimonial.
- **Insights** cards and footer legal links point to `#`.

## Deploying from GitHub

The build is static (`dist/`), so it works on Vercel, Netlify or GitHub Pages.
For a GitHub Pages *project* site, set `base: '/<repo-name>/'` in `vite.config.js`.
