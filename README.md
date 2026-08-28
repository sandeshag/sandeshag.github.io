# sandeshag.github.io

Personal portfolio website for **Sandesh Subedi** — Soil Scientist and Office Chief, agricultural researcher, and youth-entrepreneurship advocate based in Nepal.

Built as a single-page static site (no build step) so it deploys directly via GitHub Pages.

## Structure

```
index.html      Main page — hero, about, education, experience, projects, publications, workshops, awards, contact
css/style.css   Styling, theming (light/dark), layout, animations
js/script.js    Interactivity — theme toggle, mobile nav, scrollspy, reveal animations, experience filter, accordion, copy-to-clipboard
```

## Features

- Light/dark theme toggle (persisted via `localStorage`, respects system preference)
- Responsive layout with mobile navigation
- Scroll progress bar, scrollspy navigation, and "back to top" button
- Animated stat counters and scroll-reveal transitions
- Filterable experience timeline (Science & Research / Education & Public Service / Entrepreneurship & NGO)
- Expandable accordion for workshops & trainings
- Click-to-copy email on contact cards

## Deployment

This repo is served directly by GitHub Pages from the `main` branch — no build process required. Any push to `main` updates the live site at `https://sandeshag.github.io`.

## Local preview

```bash
python -m http.server 8000
# then open http://localhost:8000
```
