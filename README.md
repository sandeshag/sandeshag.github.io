# sandeshag.github.io

Personal portfolio website for **Sandesh Subedi**: soil scientist and Office Chief, agricultural researcher and youth-entrepreneurship advocate based in Nepal.

Live at **https://sandesh3.com.np**

Built with React, TypeScript and Vite. All written content lives in plain data files, so you can update the site without touching any component code.

## Quick start

```bash
npm install
npm run dev        # local dev server with hot reload
npm run build      # type-check and build to dist/
npm run preview    # serve the production build locally
npm run lint       # oxlint
```

Requires Node.js 20 or newer.

## Project structure

```
index.html              Page shell, SEO / social meta tags, fonts
public/                 Files copied as-is to the site root (favicons, CNAME, images)
  CNAME                 Custom domain for GitHub Pages
  images/               profile.png, and training/ photos (see below)
src/
  App.tsx               Section order
  index.css             Design tokens (colours, fonts) and global styles
  components/           One component + CSS module per section
  data/                 All site content (edit these)
  hooks/                Scroll-reveal and active-section hooks
```

Page sections, in order: Hero, Research focus, About, Education, Journey (experience and trainings), Research, Publications, Recognition, Contact.

## Editing content

Each section reads from a file in `src/data/` (with a matching `.d.ts` describing its shape).

| To change... | Edit |
| --- | --- |
| Name, email, phone, location, nav links, NGO link, hero worm links | `src/data/site.js` |
| Hero headline, intro, buttons | `src/data/hero.js` |
| About text | `src/data/about.js` |
| Degrees | `src/data/education.js` |
| Jobs and roles (with optional links) | `src/data/experience.js` |
| Workshops and trainings | `src/data/training.js` |
| Research projects | `src/data/research.js` |
| Articles and papers | `src/data/publications.js` |
| Awards and media | `src/data/recognition.js` |
| Contact section text | `src/data/contact.js` |

### The earthworms in the hero

Each entry in `socials` in `src/data/site.js` becomes one earthworm in the hero's soil scene. Visitors can pull a worm and let go (or simply click or tap it) to open the link.

```js
socials: [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/your-handle' },
  // add or remove entries freely
],
```

Five to seven worms looks best. Beyond about eight the bodies start to overlap.

> LinkedIn, ResearchGate and Google Scholar are currently placeholder URLs. Replace them with real profile links.

### Training photos

Training cards show a patterned header with the year by default. To show a photo instead:

1. Put the image in `public/images/training/`, for example `seed-inspectors-2023.jpg`. Use lowercase names with hyphens.
2. Add an `image` line to that entry in `src/data/training.js`:

   ```js
   image: '/images/training/seed-inspectors-2023.jpg',
   ```

Landscape photos around 1000 x 560 px and under about 150 KB work best. Keep the main subject toward the middle, because the topic tag covers the top-left corner. Cards without an `image` keep the pattern.

### Contact links

The phone number opens a WhatsApp chat (`wa.me`) and the email opens a Gmail compose window. Both are built from `email` and `phone` in `src/data/site.js`, so changing them there updates every link.

## Theming

Colours and fonts are CSS variables at the top of `src/index.css` (earthy dark brown background, green primary, cream text, DM Serif Display and Inter). Change them there to re-theme the whole site.

## Deployment

This is a build-based site, so GitHub Pages cannot serve the repo's files directly. It has to publish the built `dist/` folder.

1. In the repository, go to **Settings > Pages** and set **Source** to **GitHub Actions**.
2. Add the file `.github/workflows/deploy.yml` (it is included in this repo) with exactly this content. YAML is sensitive to indentation, so copy it as-is:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

3. Every push to `main` now rebuilds and publishes the site.

The custom domain `sandesh3.com.np` is configured in **Settings > Pages > Custom domain**. With Actions deployments GitHub ignores the `CNAME` file, so check that setting still shows the domain after your first deploy. `public/CNAME` is kept as a harmless record of it.

## Features

- Interactive hero: a soil cross-section where each earthworm is a link you can pull, click or tap
- First screen fits the viewport exactly on laptops and phones, ending right above Research focus
- Navbar with scroll progress bar, active-section underline and hover effects
- Fanned, overlapping training cards with sideways scrolling and optional photos
- Scroll-reveal animations that respect `prefers-reduced-motion`
- Responsive layout with a mobile menu
- Structured data (JSON-LD), canonical URL and Open Graph tags for search and sharing