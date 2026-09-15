# Szalai Automation

Production-oriented static landing page for a Hungarian web-development and AI-automation service.

## Live target

GitHub Pages: `https://gellert4.github.io/WebPage/`

## What is included

- responsive landing page
- three service packages
- ROI calculator
- accessible mobile navigation and reduced-motion support
- real lead form via FormSubmit with honeypot spam protection and mail fallback
- SEO metadata, canonical URL, JSON-LD, robots.txt and sitemap.xml
- privacy and legal notice pages
- custom 404 page and favicon
- GitHub Pages deployment workflow

## Lead flow

Submissions are sent to `szalai2003@gmail.com` through FormSubmit. FormSubmit requires one-time email activation before live leads are delivered.

## Deployment

The branch `szalai-automation` is deployed by GitHub Actions. The workflow uploads only this directory, so the existing Laravel app in the repository is not included in the Pages artifact.

## Before using a custom domain

Update the canonical and sitemap URLs in `index.html`, `privacy.html`, `terms.html`, `robots.txt` and `sitemap.xml`, then configure the custom domain in GitHub Pages or the selected hosting provider.
