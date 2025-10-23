# Security Guidelines for book-barter-fullstack

## Introduction
This document defines the security best practices and controls for the **book-barter-fullstack** repository. It is intended to guide developers and operators through secure design, implementation, and deployment of the Book Barter platform.

---

## Threat Model and Scope
- **Assets**: User credentials, PII, book listings, trade messages, uploaded images.
- **Actors**: End users (buyers, sellers), administrators, external attackers (unauthenticated, authenticated malicious users).
- **Threats**: Credential theft, injection attacks, broken access control, data leakage, malware-laden uploads, DoS.

---

## 1. Security by Design
- Embed security reviews at each milestone: design, code review, testing, release.
- Use threat modeling to identify and mitigate risks early.
- Adopt consistent linting and static analysis (ESLint, TypeScript strict mode).

## 2. Authentication & Access Control

### 2.1 Authentication
- Use **Auth.js** with Email/Password and Google OAuth.
  - Enforce strong password policy: minimum 12 characters, complexity rules, unique salt + bcrypt or Argon2.
  - Enable Multi-Factor Authentication (e.g., TOTP) for sensitive accounts.
- Secure session management:
  - Store session cookies with `Secure`, `HttpOnly`, `SameSite=Strict`.
  - Rotate session identifiers upon privilege change.
  - Implement idle (15 min) and absolute (24 h) session timeouts.
  - Provide explicit logout that destroys server-side session.

### 2.2 Authorization
- Enforce Role-Based Access Control (RBAC) on every API route and Server Action.
- Verify user identity and permissions in Next.js Route Handlers (`app/api/*/route.ts`) before performing operations.
- Never trust client-provided role claims; always re-validate server-side.

---

## 3. Input Handling & Processing
- **Server-Side Validation**: Use **Zod** schemas in `validators.ts` for all API inputs and form data.
- **Prevent Injection**:
  - Use parameterized queries via **Drizzle ORM** for all database access.
  - Validate and sanitize JSON/XML payloads.
- **Output Encoding**:
  - Escape or encode any user content before rendering in React components.
- **Redirects**:
  - Validate any dynamic URLs against a whitelist to prevent open redirect.

---

## 4. Secure File Uploads
- Enforce strict checks on each uploaded image:
  - Validate file type (MIME) and extension against allow-list (`.jpg`, `.png`).
  - Limit file size (e.g., 5 MB each).
  - Scan for malware with a background job (e.g., Inngest + ClamAV).
- Store images in S3/Cloudflare R2 with private ACL, serve via signed URLs.
- Strip metadata (EXIF) from uploads to prevent PII leakage.
- Store outside webroot; never execute or serve files from an unvetted directory.

---

## 5. Data Protection & Privacy
- **Encryption in Transit**: Enforce HTTPS (TLS 1.2+) for all endpoints and assets.
- **Encryption at Rest**: Enable database encryption and encrypt backups.
- **Secret Management**: Do not hardcode secrets. Use environment variables or a vault (AWS Secrets Manager, HashiCorp Vault).
- **Logging**:
  - Avoid logging PII or sensitive tokens.
  - Sanitize logs and implement log rotation.
- **GDPR/CCPA**: Provide data-export and deletion endpoints for user data.

---

## 6. API & Service Security
- **Rate Limiting**: Use Upstash or a middleware to throttle abusive endpoints (e.g., login, trade requests).
- **CORS**: Restrict origins to your front-end domain(s) only.
- **HTTP Methods**: Enforce correct verbs; reject unexpected methods with 405.
- **API Versioning**: Prefix routes (e.g., `/api/v1/...`) to manage changes.

---

## 7. Web Application Security Hygiene
- **Security Headers** (via Next.js middleware):
  - Content-Security-Policy: restrict scripts, styles, frames.
  - Strict-Transport-Security: `max-age=31536000; includeSubDomains; preload`.
  - X-Content-Type-Options: `nosniff`.
  - X-Frame-Options: `DENY`.
  - Referrer-Policy: `no-referrer-when-downgrade`.
- **CSRF Protection**: Implement anti-CSRF tokens for state-changing forms and API calls.
- **Subresource Integrity (SRI)**: Add `integrity` attributes to CDN-loaded scripts and styles.
- **Client Storage**: Do not store tokens or PII in `localStorage`/`sessionStorage`.

---

## 8. Infrastructure & Configuration Management
- **Docker Hardening**:
  - Use minimal base images (e.g., `node:slim`).
  - Drop unnecessary Linux capabilities, run as non-root user.
- **Database Hardening**:
  - Create least-privilege roles for migrations vs. app queries.
  - Enable PostGIS extension only if required; restrict direct access.
- **Environment Separation**: Keep dev/test/prod configurations and secrets isolated.
- **Disable Debug in Prod**: Set `NODE_ENV=production`, remove stack traces from user-facing errors.
- **Patch Management**: Regularly update system packages and npm dependencies.

---

## 9. Dependency Management
- Use a lockfile (`package-lock.json`) to pin versions.
- Integrate SCA tools (e.g., GitHub Dependabot, `npm audit`, Snyk) in CI.
- Review and prune unused dependencies periodically.

---

## 10. Monitoring & Incident Response
- **Error Tracking**: Integrate Sentry (or similar) to capture exceptions, performance metrics.
- **Audit Logging**: Log security events (login failures, role changes, file-scan results) to an append-only store.
- **Alerting**: Configure alerts for anomalous rates of failed logins, high error rates.
- **Incident Plan**: Define roles, communication channels, and recovery procedures for breaches.

---

## Conclusion
Adherence to these guidelines will enforce a defense-in-depth posture, ensuring that **book-barter-fullstack** remains secure throughout its development and production lifecycle. Regular security reviews, automated scanning, and ongoing monitoring are essential to maintain and improve this posture over time.