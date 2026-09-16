# Szalai Automation

Production-oriented static landing page for a Hungarian web-development and AI-automation service.

## Production source

- Main source: `main/szalai-automation-site/`
- Production working branch: `szalai-production`
- Publish artifact branch: `gh-pages` (site files at repository root)
- Intended public URL: `https://gellert4.github.io/WebPage/`

## Included

- responsive landing page and mobile navigation
- three service packages and ROI calculator
- lead form with native HTML POST fallback + AJAX enhancement
- honeypot spam protection and input validation
- email fallback
- privacy and legal notice pages
- SEO metadata, canonical URL and JSON-LD
- robots.txt and sitemap.xml
- favicon and web manifest
- custom 404 page
- `.nojekyll`
- `/.well-known/security.txt`
- Content Security Policy meta protection
- reduced-motion and accessibility support
- production CI with JS syntax checks, manifest/sitemap parsing, local-link validation and HTTP smoke tests

## GitHub Pages activation

The static production artifact is already published to the `gh-pages` branch. GitHub Pages must be enabled once at repository level:

1. Open `Settings -> Pages`.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Choose branch `gh-pages` and folder `/(root)`.
4. Save.

The previous Actions-based Pages deployment was intentionally replaced because the Actions integration could not create/enable the repository Pages site (`Resource not accessible by integration`).

## Lead form activation

Form submissions are routed to `szalai2003@gmail.com` through FormSubmit. On the first real submission, FormSubmit requires a one-time email activation. Until that activation is complete, visitors can still use the direct email fallback.

## Privacy / analytics

No marketing or analytics tracker is loaded in the current version. If analytics, advertising pixels, a CRM embed or other tracking is added later, update the privacy notice and consent/cookie handling before enabling it.

## Commercial launch checklist

Before publicly marketing the site as a business service, add the exact legally required provider identification details to `terms.html` (for example address/registered office and applicable registration/tax identifiers). Do not add guessed values.

## Custom domain

When a custom domain is selected, update canonical URLs, Open Graph URL, JSON-LD URL, `robots.txt`, `sitemap.xml`, `security.txt` and the provider/hosting configuration before switching DNS.
