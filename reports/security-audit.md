# Security Audit — Perfect AI Agent Website

**Date:** 2026-03-14
**Target:** https://perfect-ai-agent-umber.vercel.app
**Source:** /home/laurentperello/coding/perfect-ai-agent/
**Auditor:** Claude Code (automated)

---

## Executive Summary

**Overall Risk: LOW-MEDIUM**

The site is a static-first Next.js book website with one dynamic API endpoint (`/api/subscribe`). The attack surface is small. Most security headers are properly configured. Two findings require immediate attention: a **XSS vector in GatedContent** and **missing rate limiting on the subscribe endpoint**.

---

## Findings by Severity

### CRITICAL (0)

None.

### HIGH (1)

#### H1 — XSS via `dangerouslySetInnerHTML` in GatedContent.tsx

- **File:** `components/GatedContent.tsx:41`
- **Code:** `<div dangerouslySetInnerHTML={{ __html: lines.replace(/\n\n/g, '</p><p>') }} />`
- **Risk:** The `preview` prop is MDX content sliced from the chapter file (`content.slice(0, 800)`). While the content is author-controlled today (local `.mdx` files), this pattern injects raw strings as HTML without sanitization. If MDX content ever contains user-generated data, HTML entities, or is loaded from an external source, this becomes a direct XSS vector.
- **Fix:** Use a text-only rendering approach (split on `\n\n`, map to `<p>` elements as React nodes) instead of `dangerouslySetInnerHTML`. Or sanitize with DOMPurify before injection.

### MEDIUM (3)

#### M1 — No rate limiting on `/api/subscribe`

- **File:** `app/api/subscribe/route.ts`
- **Verified:** 5 rapid POST requests all returned 200 with no throttling.
- **Risk:** An attacker can spam the Systeme.io API with thousands of fake signups, polluting the mailing list and potentially exhausting API quotas. Also enables email enumeration (422 = existing contact).
- **Fix:** Add rate limiting. Options:
  - Vercel Edge Middleware with `@vercel/ratelimit` (recommended, no infra needed)
  - IP-based in-memory limiter (e.g., `limiter` package)
  - At minimum, add a honeypot field or CAPTCHA

#### M2 — No Content-Security-Policy (CSP) header

- **Verified via `curl -sI`:** No `Content-Security-Policy` header present in response.
- **Config:** `next.config.ts` sets `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and `X-XSS-Protection` — but no CSP.
- **Risk:** Without CSP, any injected script (see H1) executes unrestricted. CSP is the strongest defense-in-depth against XSS.
- **Fix:** Add a CSP header in `next.config.ts`:
  ```
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';
  ```
  Then tighten `script-src` with nonces once `unsafe-inline` is eliminated.

#### M3 — CORS wildcard on `/api/chapters`

- **File:** `app/api/chapters/route.ts:33`
- **Code:** `'Access-Control-Allow-Origin': '*'`
- **Verified:** Response header confirms `access-control-allow-origin: *`
- **Risk:** Any website can read all chapter content programmatically. This is a read-only API serving public book content, so the risk is low — but it enables mass scraping without restriction.
- **Fix:** If this API is meant for specific consumers only, restrict the origin. If intentionally public (headless CMS pattern), acceptable as-is but document the decision.

### LOW (4)

#### L1 — Cookie missing `Secure` flag

- **File:** `app/api/subscribe/route.ts:46-50`
- **Code:**
  ```ts
  response.cookies.set('email_captured', 'true', {
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
    sameSite: 'lax',
  })
  ```
- **Risk:** The `Secure` flag is missing. On HTTP connections (unlikely with Vercel HSTS but possible in dev), the cookie would be sent in cleartext.
- **Fix:** Add `secure: true` to the cookie options.

#### L2 — `NEXT_LOCALE` cookie lacks `HttpOnly` and `Secure` flags

- **Verified via `curl -sI`:** `set-cookie: NEXT_LOCALE=en; Path=/; ... SameSite=lax` — no `HttpOnly`, no `Secure`.
- **Risk:** This is a next-intl framework cookie. Low sensitivity (just stores locale preference), but accessible to client-side JS.
- **Fix:** This is controlled by the `next-intl` library. Low priority — the cookie contains no sensitive data.

#### L3 — Weak email validation

- **File:** `app/api/subscribe/route.ts:6`
- **Code:** `if (!email || !email.includes('@'))`
- **Risk:** Accepts `@`, `a@`, `@b` as valid emails. Not a security vulnerability per se, but allows garbage data into the Systeme.io contact list.
- **Fix:** Use a proper regex or validate with a library. The client-side `<input type="email">` provides better validation than the server-side check.

#### L4 — `X-Powered-By: Next.js` header exposed

- **Verified via `curl -sI`:** `x-powered-by: Next.js`
- **Risk:** Information disclosure. Attackers can target Next.js-specific vulnerabilities.
- **Fix:** Add `poweredByHeader: false` to `next.config.ts`.

---

## Passed Checks

| Check | Status | Notes |
|-------|--------|-------|
| **Dependency vulnerabilities** | PASS | `npm audit` returns 0 vulnerabilities |
| **Secrets in source code** | PASS | `SYSTEME_API_KEY` accessed via `process.env` only, never hardcoded |
| **.env.local in .gitignore** | PASS | `.env*` and `.env.local` both in `.gitignore` |
| **.env never committed** | PASS | No `.env` files in git history |
| **NEXT_PUBLIC_ env leakage** | PASS | No `NEXT_PUBLIC_*` variables used anywhere |
| **Path traversal in /api/chapters** | PASS | Slug validated against allowlist (`CHAPTER_FILES.includes(slug)`) before any filesystem access |
| **X-Frame-Options** | PASS | `DENY` — prevents clickjacking |
| **X-Content-Type-Options** | PASS | `nosniff` |
| **Referrer-Policy** | PASS | `strict-origin-when-cross-origin` |
| **Permissions-Policy** | PASS | Camera, microphone, geolocation disabled |
| **HSTS** | PASS | `max-age=63072000; includeSubDomains; preload` (Vercel default) |
| **MDXRemote XSS** | PASS | Uses `next-mdx-remote/rsc` (server-side only). Content is local `.mdx` files, not user input. No custom components passed that could introduce XSS. |
| **JSON-LD injection** | PASS | Uses `JSON.stringify()` on controlled objects — safe pattern |
| **Locale validation** | PASS | Both middleware and API validate locale against allowlist |
| **API key server-side only** | PASS | `SYSTEME_API_KEY` is not prefixed with `NEXT_PUBLIC_`, never exposed to client |

---

## Recommendations (Priority Order)

1. **Fix H1** — Replace `dangerouslySetInnerHTML` in `GatedContent.tsx` with React element mapping
2. **Fix M1** — Add rate limiting to `/api/subscribe` (Vercel Edge rate limiter recommended)
3. **Fix M2** — Add `Content-Security-Policy` header in `next.config.ts`
4. **Fix L1** — Add `secure: true` to the `email_captured` cookie
5. **Fix L4** — Add `poweredByHeader: false` to `next.config.ts`
6. **Fix L3** — Improve server-side email validation regex
7. **Consider M3** — Restrict CORS origin on `/api/chapters` if not intentionally public

---

## OWASP Top 10 Coverage

| Category | Status | Notes |
|----------|--------|-------|
| A01 Broken Access Control | LOW RISK | Content gating relies on a client-side cookie — trivially bypassable (delete cookie, call API directly). But this is by design for a free book with email gate. |
| A02 Cryptographic Failures | PASS | No sensitive data stored. HSTS enforced. |
| A03 Injection | MEDIUM | H1 (XSS via dangerouslySetInnerHTML). Path traversal mitigated by allowlist. |
| A04 Insecure Design | PASS | Simple architecture, minimal attack surface. |
| A05 Security Misconfiguration | LOW | Missing CSP (M2), X-Powered-By exposed (L4). |
| A06 Vulnerable Components | PASS | 0 npm audit vulnerabilities. |
| A07 Auth Failures | N/A | No authentication system. |
| A08 Data Integrity Failures | PASS | No deserialization, no CI/CD exposed. |
| A09 Logging Failures | LOW | Console.log of email addresses in server logs. Consider redacting. |
| A10 SSRF | PASS | Only outbound call is to hardcoded Systeme.io URL. |
