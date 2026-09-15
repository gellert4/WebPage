# Szalai Automation

Production-oriented static landing page for a Hungarian web-development and AI-automation service.

## Source of truth

- Production source branch: `szalai-production`
- Production source directory: `szalai-automation-site/`
- Public GitHub Pages artifact branch: `gh-pages`
- Intended Pages URL: `https://gellert4.github.io/WebPage/`

The `gh-pages` branch contains only public static website files. The Laravel application and unrelated repository files are not published there.

## Production features

- responsive landing page and mobile navigation
- service packages and ROI calculator
- native lead form submission with FormSubmit, honeypot, browser validation and lightweight duplicate throttling
- privacy notice, legal notice and responsible disclosure page
- CSP meta policy and a Vercel header configuration for stricter HTTP security headers
- SEO metadata, canonical URL, JSON-LD, robots.txt and sitemap.xml
- custom 404 page, favicon, web manifest and reduced-motion accessibility support
- CI validation for required files, JavaScript syntax, JSON/XML parsing, local references and HTTP smoke tests

## Lead form activation

FormSubmit requires a one-time activation from a real browser/email flow before customer submissions are delivered. Automated activation from GitHub Actions is intentionally not used because FormSubmit/Cloudflare blocks non-browser activation attempts.

## GitHub Pages one-time repository setting

GitHub Pages must be enabled by a repository administrator. Configure `Settings → Pages → Build and deployment → Deploy from a branch`, then select `gh-pages` and `/(root)`.

## Custom domain

Before moving to a custom domain, update canonical URLs, sitemap/robots URLs, FormSubmit `_next`, security.txt canonical/policy URLs and hosting configuration. `vercel.json` is included for a future Vercel deployment with explicit security headers.
