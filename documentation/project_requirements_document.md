# Project Requirements Document (PRD)

## 1. Project Overview

The Book Barter platform is a full-stack web application that enables book lovers to trade physical books with others nearby. Instead of buying or selling, users can list books they own, browse available titles within a configurable radius, and negotiate trades through a real-time chat interface. By leveraging geospatial search and a peer-to-peer barter model, the platform solves the problem of unused books collecting dust and high shipping costs, while building a community around reading.

We are building this application to create a seamless, type-safe, and scalable marketplace for book trading. Key objectives for the MVP are: secure user authentication (email/password + Google OAuth), CRUD operations on personal libraries, location-aware search (PostGIS), real-time trade negotiations, and a simple admin interface for moderation and analytics. Success is measured by performance (sub-200 ms API responses), a clean user experience across devices, and robust data integrity with zero critical bugs in core flows (sign-up, listing a book, completing a trade).

## 2. In-Scope vs. Out-of-Scope

**In-Scope (MVP v1)**
- User authentication with email/password and Google OAuth (Auth.js).
- Personal dashboard: add/edit/delete books (4 photos mandatory), view trades, manage wishlist.
- Geospatial discovery: search and filter books by title, author, and distance (PostGIS/ST_DWithin).
- Barter flow: request a trade, real-time chat (Pusher or Ably), two-party confirmation.
- Ratings system: submit and display ratings after completed trades.
- Admin panel: view key metrics (trade volume, new users), moderate listings.
- Containerized development (Docker + docker-compose) and Vercel deployment.
- Basic automated tests: Vitest for units, Playwright for end-to-end.

**Out-of-Scope (Phase 2+)**
- Multi-factor authentication (MFA) or single sign-on (SSO) integrations.
- AI-powered book recommendations or chat bots.
- Map-based UI with draggable pins (only list and filter by distance for now).
- Social features (friends lists, feeds) or complex analytics (A/B testing).
- Mobile-only UI or native mobile apps (React Native/SwiftUI).
- Advanced moderation workflows (automated content scanning beyond basic image checks).

## 3. User Flow

A new user lands on the marketing homepage, clicks “Sign Up,” and chooses either email/password or Google OAuth. After confirming their email, they’re redirected to a personalized dashboard. Here they see an empty library prompt and a call-to-action to list their first book. The user fills out a form with book details (integrated with the Open Library API for metadata), uploads four photos via Uploadthing, and submits. The newly listed book appears instantly in their library view.

Next, the user navigates to Discover and enters a search term or adjusts the distance slider. A list of BookCard components renders matching titles, each showing cover images, owner location distance, and a “Request Trade” button. Clicking that opens a modal to confirm trade request. Upon confirmation, a Server Action or API call creates a trade record, and the user is redirected to the Trade page, where a live chat window (Pusher/Ably) appears. After negotiating, both parties click “Confirm Trade,” triggering rating prompts. The admin can later review trade metrics and moderate content via the `/admin` route.

## 4. Core Features

- **Authentication & Security**: Email/password + Google OAuth via Auth.js; sessions with secure cookies; rate limiting; CSP headers.
- **Personal Dashboard & Library**: CRUD operations on books; 4-photo requirement; Open Library API integration for metadata enrichment.
- **Search & Geospatial Filtering**: Full-text search on title/author; PostGIS distance queries; distance slider.
- **Barter & Real-Time Chat**: Trade request flow; chat component using Pusher or Ably; two-party trade completion and rating triggers.
- **Ratings & Wishlists**: Post-trade rating form; display average ratings; simple wishlist management.
- **Admin Panel**: Metrics dashboard (charts for trades, sign-ups); listing moderation tools; role-based access control.
- **Background Jobs & Notifications**: Inngest or Trigger.dev for email notifications, basic image moderation.
- **Testing & Deployment**: Unit tests with Vitest; E2E tests with Playwright; Dockerized local setup; Vercel CI/CD.

## 5. Tech Stack & Tools

- **Frontend**
  - Next.js (App Router) with React
  - Tailwind CSS & shadcn/ui (Radix UI primitives)
  - React Query (TanStack Query) for server state
  - Zustand for local UI state
  - React Hook Form + Zod for type-safe forms
  - Uploadthing for file uploads

- **Backend**
  - Next.js API Routes / Route Handlers
  - Auth.js for authentication
  - Drizzle ORM with PostgreSQL (PostGIS extension enabled)
  - Pusher or Ably for real-time messaging
  - Inngest or Trigger.dev for background jobs
  - Sentry for error monitoring

- **Deployment & Dev Tools**
  - Docker & docker-compose
  - Vercel for Production & Preview deployments
  - VS Code with ESLint & Prettier; optional Cursor AI extension

## 6. Non-Functional Requirements

- **Performance**: API routes respond within 200 ms under typical load; page hydration under 1 s.
- **Security**: OWASP Top 10 mitigations; HTTPS everywhere; secure cookies; Content Security Policy.
- **Scalability**: Modular monolith structure; database connection pooling; stateless API servers.
- **Reliability**: 99.9% uptime; monitoring with Sentry; retry logic for background jobs.
- **Usability**: 100% Lighthouse accessibility score; mobile-responsive design; clear error messages.

## 7. Constraints & Assumptions

- PostgreSQL provider supports PostGIS (e.g., Supabase, Neon).
- Auth.js and Drizzle ORM stable APIs assumed.
- Real-time provider (Pusher/Ably) rate limits considered—upgrade plan if necessary.
- Email delivery via Inngest uses a functioning SMTP or transactional email service.
- Users have modern browsers; legacy IE11 support is not required.

## 8. Known Issues & Potential Pitfalls

- **API Rate Limits**: Pusher/Ably free tiers have low rate limits—plan upgrade or back-off strategy needed.
- **Geospatial Queries**: ST_DWithin performance can degrade on large datasets—index geography column and paginate results.
- **Image Upload Size**: Four high-res photos per book could slow uplink—implement client-side resizing and server-side validation.
- **Session Management**: Next.js route handlers require consistent cookie parsing—use the same Auth.js helpers across routes.
- **Background Job Failures**: If Inngest/Trigger.dev retries fail, notifications might never send—implement dead-letter logging in Sentry.

**Mitigations:**
- Add indexes on geospatial fields; cache popular queries.
- Throttle client uploads; enforce image size limits in the Uploadthing middleware.
- Centralize Auth.js logic in `/lib/auth.ts` and reuse across API and Server Actions.
- Monitor job runner failures and alert via a Slack webhook or Sentry integration.

---

This PRD lays out clear, unambiguous requirements for the Book Barter platform’s MVP. It serves as the single source of truth for subsequent technical documents and implementation guidelines.