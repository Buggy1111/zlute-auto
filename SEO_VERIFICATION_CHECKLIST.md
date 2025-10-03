# SEO Verification Checklist - Žluté Auto
## Post-Deployment Verification Steps

Use this checklist after deploying to production to ensure all SEO elements are working correctly.

---

## 1. Technical SEO Verification

### Meta Tags (Homepage)
- [ ] Open https://zlute-auto.vercel.app in browser
- [ ] View page source (Ctrl+U / Cmd+U)
- [ ] Verify `<title>` tag: "Žluté Auto - Online Multiplayer Hra Zdarma | Roadtrip Hra 2025"
- [ ] Verify `<meta name="description">` exists and is 160 chars
- [ ] Verify `<html lang="cs">` attribute
- [ ] Verify `<meta property="og:title">` exists
- [ ] Verify `<meta property="og:image">` points to /porsche.webp
- [ ] Verify `<meta name="twitter:card">` is "summary_large_image"

### Structured Data (JSON-LD)
- [ ] View page source
- [ ] Find `<script type="application/ld+json">` tag
- [ ] Copy JSON-LD content
- [ ] Paste into https://validator.schema.org/
- [ ] Verify no errors
- [ ] Check for WebApplication, Organization, Game, BreadcrumbList schemas

### Robots.txt
- [ ] Visit https://zlute-auto.vercel.app/robots.txt
- [ ] Verify file loads correctly
- [ ] Check for "User-agent: *" entry
- [ ] Check for "Sitemap: https://zlute-auto.vercel.app/sitemap.xml"
- [ ] Verify AI crawlers (GPTBot, anthropic-ai, PerplexityBot) are allowed
- [ ] Verify /game/ is disallowed

### Sitemap.xml
- [ ] Visit https://zlute-auto.vercel.app/sitemap.xml
- [ ] Verify XML format is correct
- [ ] Check homepage entry exists
- [ ] Verify priority="1.0" for homepage
- [ ] Verify changeFrequency="daily"
- [ ] Check lastmod date is current

---

## 2. Google Search Console Setup

### Initial Setup
- [ ] Go to https://search.google.com/search-console
- [ ] Click "Add Property"
- [ ] Enter URL: https://zlute-auto.vercel.app
- [ ] Choose verification method (HTML file or meta tag)
- [ ] Complete verification
- [ ] Replace "pending" in `app/layout.tsx` with actual verification code

### Submit Sitemap
- [ ] In Google Search Console, go to "Sitemaps"
- [ ] Enter sitemap URL: https://zlute-auto.vercel.app/sitemap.xml
- [ ] Click "Submit"
- [ ] Wait for indexing (usually 24-48 hours)

### Check Coverage
- [ ] Go to "Coverage" section
- [ ] Verify homepage is indexed
- [ ] Check for errors (should be 0)
- [ ] Check excluded pages (/game/* should be excluded)

### Check Enhancements
- [ ] Go to "Enhancements" section
- [ ] Check for "Rich Results" or "Structured Data"
- [ ] Verify no errors in structured data
- [ ] Look for Game, WebApplication rich results

---

## 3. Bing Webmaster Tools Setup

### Initial Setup
- [ ] Go to https://www.bing.com/webmasters
- [ ] Sign in with Microsoft account
- [ ] Add site: https://zlute-auto.vercel.app
- [ ] Choose verification method
- [ ] Complete verification
- [ ] Replace "pending" in `app/layout.tsx` with verification code

### Submit Sitemap
- [ ] Go to "Sitemaps" section
- [ ] Submit: https://zlute-auto.vercel.app/sitemap.xml
- [ ] Wait for processing

---

## 4. Rich Results Testing

### Google Rich Results Test
- [ ] Go to https://search.google.com/test/rich-results
- [ ] Enter URL: https://zlute-auto.vercel.app
- [ ] Click "Test URL"
- [ ] Wait for results
- [ ] Verify "WebApplication" is detected
- [ ] Verify "Game" is detected
- [ ] Verify "Organization" is detected
- [ ] Check for 0 errors, 0 warnings

### Schema Markup Validator
- [ ] Go to https://validator.schema.org/
- [ ] Choose "Fetch URL" tab
- [ ] Enter: https://zlute-auto.vercel.app
- [ ] Click "Run Test"
- [ ] Verify all schemas are valid
- [ ] Check for 0 errors

---

## 5. Social Media Testing

### Facebook Sharing Debugger
- [ ] Go to https://developers.facebook.com/tools/debug/
- [ ] Enter URL: https://zlute-auto.vercel.app
- [ ] Click "Debug"
- [ ] Verify title: "Žluté Auto - Online Multiplayer Hra Zdarma | Roadtrip Hra 2025"
- [ ] Verify description appears
- [ ] Verify image shows (porsche.webp, 1200x630)
- [ ] Click "Scrape Again" if needed
- [ ] Test sharing on Facebook

### Twitter Card Validator
- [ ] Go to https://cards-dev.twitter.com/validator
- [ ] Enter URL: https://zlute-auto.vercel.app
- [ ] Click "Preview card"
- [ ] Verify "summary_large_image" card type
- [ ] Verify title and description
- [ ] Verify image displays correctly
- [ ] Test sharing on Twitter/X

### LinkedIn Post Inspector
- [ ] Go to https://www.linkedin.com/post-inspector/
- [ ] Enter URL: https://zlute-auto.vercel.app
- [ ] Click "Inspect"
- [ ] Verify preview looks correct
- [ ] Test sharing on LinkedIn

---

## 6. Mobile & Performance Testing

### Google Mobile-Friendly Test
- [ ] Go to https://search.google.com/test/mobile-friendly
- [ ] Enter URL: https://zlute-auto.vercel.app
- [ ] Click "Test URL"
- [ ] Verify "Page is mobile-friendly"
- [ ] Check for any mobile usability issues

### PageSpeed Insights
- [ ] Go to https://pagespeed.web.dev/
- [ ] Enter URL: https://zlute-auto.vercel.app
- [ ] Click "Analyze"
- [ ] Check Mobile score (target: 90+)
- [ ] Check Desktop score (target: 95+)
- [ ] Review Core Web Vitals:
  - [ ] LCP (Largest Contentful Paint) < 2.5s
  - [ ] FID (First Input Delay) < 100ms
  - [ ] CLS (Cumulative Layout Shift) < 0.1

### Lighthouse Audit
- [ ] Open site in Chrome
- [ ] Open DevTools (F12)
- [ ] Go to "Lighthouse" tab
- [ ] Select "Performance", "Accessibility", "Best Practices", "SEO"
- [ ] Select "Mobile" or "Desktop"
- [ ] Click "Generate report"
- [ ] Target scores:
  - [ ] Performance: 90+
  - [ ] Accessibility: 95+
  - [ ] Best Practices: 95+
  - [ ] SEO: 100

---

## 7. Indexing Verification

### Google Search (Week 1)
- [ ] Search: `site:zlute-auto.vercel.app`
- [ ] Verify homepage appears
- [ ] Check if indexed within 48 hours

### Google Search (Week 2-4)
- [ ] Search: "žluté auto hra"
- [ ] Note ranking position
- [ ] Search: "hra žluté auto"
- [ ] Note ranking position
- [ ] Search: "online hra zdarma"
- [ ] Note ranking position

### Bing Search
- [ ] Search: `site:zlute-auto.vercel.app`
- [ ] Verify indexing
- [ ] Search primary keywords
- [ ] Note positions

---

## 8. Analytics Setup

### Google Analytics 4
- [ ] Go to https://analytics.google.com/
- [ ] Create GA4 property
- [ ] Get Measurement ID (G-XXXXXXXXXX)
- [ ] Add tracking code to app
- [ ] Verify real-time data works
- [ ] Set up conversions:
  - [ ] Game created
  - [ ] Game shared
  - [ ] 5+ minute session

### Search Console Integration
- [ ] In GA4, go to Admin
- [ ] Link Google Search Console
- [ ] Verify integration works
- [ ] Check search query data

---

## 9. Czech Market Verification

### Google.cz Specific
- [ ] Use VPN or browser with Czech IP
- [ ] Go to https://www.google.cz
- [ ] Search: "žluté auto hra"
- [ ] Check ranking position
- [ ] Search: "online hra zdarma"
- [ ] Verify site appears in results

### Seznam.cz (Czech Search Engine)
- [ ] Go to https://www.seznam.cz
- [ ] Search: "žluté auto hra"
- [ ] Check if site appears
- [ ] Consider adding to Seznam Webmaster tools

---

## 10. AI Search Engine Verification

### ChatGPT Test
- [ ] Open ChatGPT
- [ ] Enable browsing mode
- [ ] Ask: "What is the best online žluté auto game in Czech?"
- [ ] Check if your site is mentioned
- [ ] Ask: "Find me a Czech roadtrip multiplayer game"
- [ ] Verify site appears in results

### Perplexity Test
- [ ] Go to https://www.perplexity.ai
- [ ] Search: "žluté auto online hra"
- [ ] Check if site appears
- [ ] Search: "Czech multiplayer road trip game"
- [ ] Verify mention

### Google Gemini Test
- [ ] Use Gemini (Bard)
- [ ] Ask about Czech online games
- [ ] Check for site mention

---

## 11. Backlink & Citation Building

### Czech Directories (Submit Site)
- [ ] Najisto.cz (Czech web directory)
- [ ] Centrum.cz (Czech portal)
- [ ] Czech gaming forums
- [ ] Czech family/travel blogs

### Social Media Presence
- [ ] Create Facebook page
- [ ] Create Twitter/X account (@zlute_auto)
- [ ] Create Instagram account
- [ ] Post regularly with #žlutéauto

### Community Engagement
- [ ] Reddit r/czech - introduce game
- [ ] Czech Facebook groups (travel, families)
- [ ] Czech gaming communities
- [ ] Travel forums (Turistika.cz)

---

## 12. Ongoing Monitoring (Weekly)

### Rankings
- [ ] Check Google Search Console for queries
- [ ] Track "žluté auto hra" position
- [ ] Track "online hra zdarma" position
- [ ] Monitor click-through rate (CTR)

### Traffic
- [ ] Check Google Analytics
- [ ] Review organic search traffic
- [ ] Check top landing pages
- [ ] Review user behavior

### Technical
- [ ] Check for crawl errors in GSC
- [ ] Review Core Web Vitals
- [ ] Check mobile usability
- [ ] Verify sitemap is up-to-date

### Competitors
- [ ] Search primary keywords
- [ ] Check competitor positions
- [ ] Analyze their content
- [ ] Look for link opportunities

---

## 13. Quick Wins Checklist

### Content Additions
- [ ] Add FAQ section (Často kladené otázky)
- [ ] Add user testimonials
- [ ] Create "How to Play" video
- [ ] Write blog post: "Historie hry Žluté Auto"

### Link Building
- [ ] Reach out to Czech travel bloggers
- [ ] Comment on relevant Czech forums
- [ ] Submit to Czech game aggregators
- [ ] Guest post on family/travel blogs

### Social Signals
- [ ] Share on Facebook groups
- [ ] Post on Reddit r/czech
- [ ] Tweet with Czech hashtags
- [ ] Create TikTok/Reels content

---

## 14. Red Flags to Watch

### Common Issues
- [ ] Homepage not indexed after 7 days → Request indexing in GSC
- [ ] Structured data errors → Fix in validator
- [ ] Mobile usability issues → Fix responsive design
- [ ] Slow page speed → Optimize images/code
- [ ] High bounce rate → Improve UX/content

### Critical Errors
- [ ] Site not accessible → Check hosting
- [ ] robots.txt blocking all → Fix robots.txt
- [ ] Duplicate content → Add canonical tags
- [ ] 404 errors → Fix broken links
- [ ] Security issues → Add HTTPS, fix vulnerabilities

---

## 15. Success Metrics (Month 1-6)

### Month 1 Goals
- [ ] Indexed by Google
- [ ] 100+ organic visitors
- [ ] 10+ games created
- [ ] 0 critical SEO errors

### Month 2 Goals
- [ ] Page 2-3 for "žluté auto hra"
- [ ] 500+ organic visitors
- [ ] 50+ games created
- [ ] 5+ backlinks

### Month 3 Goals
- [ ] Page 1 for "žluté auto hra" (positions 5-10)
- [ ] 1,000+ organic visitors
- [ ] 100+ games created
- [ ] 10+ backlinks

### Month 6 Goals
- [ ] Top 3 for "žluté auto hra"
- [ ] 5,000+ organic visitors
- [ ] 500+ games created
- [ ] 25+ quality backlinks
- [ ] Featured in AI search results

---

## Tools Quick Reference

| Tool | URL | Purpose |
|------|-----|---------|
| Google Search Console | https://search.google.com/search-console | Indexing, rankings |
| Bing Webmaster Tools | https://www.bing.com/webmasters | Bing indexing |
| Rich Results Test | https://search.google.com/test/rich-results | Schema validation |
| Schema Validator | https://validator.schema.org/ | JSON-LD validation |
| Facebook Debugger | https://developers.facebook.com/tools/debug/ | OG tags test |
| Twitter Card Validator | https://cards-dev.twitter.com/validator | Twitter cards |
| PageSpeed Insights | https://pagespeed.web.dev/ | Performance |
| Mobile-Friendly Test | https://search.google.com/test/mobile-friendly | Mobile UX |
| Google Analytics | https://analytics.google.com/ | Traffic analytics |

---

## Contact & Support

**Website:** https://zlute-auto.vercel.app
**Twitter:** @zlute_auto
**SEO Report:** See SEO_IMPLEMENTATION_REPORT.md

---

**Last Updated:** October 3, 2025
**Status:** Ready for deployment ✅
