# Exponent Marketing & AI — Blog

Automated blog system for [exponentmarketing.com/blog/](https://exponentmarketing.com/blog/).

## How It Works

1. **Topics** are queued in a Google Sheet with status "Pending"
2. **n8n workflow** runs every Monday at 8 AM CST:
   - Reads the next pending topic
   - Sends it to Claude API to generate a full SEO/AISO-optimized blog post
   - Fetches a stock photo from Pexels
   - Generates an SVG header graphic
   - Commits the HTML, image, and SVG to this repo
3. **GitHub Actions** detects the push and deploys `./blog/` to Bluehost via FTP
4. **Manifest** (`blog/posts.json`) is auto-generated on each deploy
5. **LinkedIn post** is published automatically via the Community Management API

## Repository Structure

```
blog/
  index.html          — Blog listing page (card grid, fetches posts.json)
  post.css            — Shared stylesheet for all posts
  posts.json          — Auto-generated manifest of all posts
  posts/
    {slug}.html       — Individual blog posts
    images/
      {slug}.jpg      — Stock photos
      {slug}.svg      — SVG header graphics
      default.jpg     — Fallback image
scripts/
  generate-manifest.js — Reads post HTML files, outputs posts.json
.github/workflows/
  deploy.yml          — FTP deploy to Bluehost on push to main
```

## Required GitHub Secrets

| Secret | Value |
|--------|-------|
| `FTP_SERVER` | Bluehost FTP hostname |
| `FTP_USERNAME` | FTP username |
| `FTP_PASSWORD` | FTP password |

## Local-Only Files (not in repo)

- `n8n-blog-workflow.json` — Full n8n workflow, imported into n8n directly

## Setup

1. Clone this repo
2. Set the three FTP secrets in GitHub → Settings → Secrets
3. Import `n8n-blog-workflow.json` into your n8n instance
4. Configure n8n credentials (Google Sheets, Anthropic, Pexels, GitHub PAT, LinkedIn)
5. Populate the Google Sheet with topics
6. Enable the n8n workflow — posts will publish every Monday at 8 AM CST
