# Tech Stack Document

This document explains the technology choices for the “Book Barter” full-stack web application starter. It’s written in everyday language so that anyone—technical or not—can understand why each tool was chosen and how it helps deliver a great user experience.

## 1. Frontend Technologies

These are the building blocks for everything your eyes see and interact with in the browser.

- **Next.js (App Router)**  
  A modern framework on top of React that helps us:
  • Render pages quickly on the server for faster load times  
  • Organize routes and layouts (e.g. `/dashboard`, `/library`) without complex setup  
  • Create API endpoints alongside pages, simplifying how data moves between client and server

- **React**  
  The core library for building interactive UI pieces (buttons, forms, lists). It lets us split the interface into reusable components.

- **Tailwind CSS**  
  A utility-first styling tool that:
  • Speeds up design by using small, reusable CSS classes  
  • Automatically removes unused styles in production for leaner downloads  
  • Works together with custom CSS variables for easy theming (light/dark modes)

- **shadcn/ui** (Radix UI primitives)  
  A set of accessible, unstyled components that we style with Tailwind to match our brand. Examples:
  • Modals, dropdowns, tabs, sliders  
  • Focus-management and keyboard support baked in for accessibility

- **Zustand**  
  A lightweight state management library for local UI state (e.g. open/close modals, theme toggle).

- **React Query (TanStack Query)**  
  Handles server-data fetching and caching so lists of books, user data, and search results stay fresh without manual loading states.

- **react-hook-form** + **Zod**  
  Makes building and validating forms (e.g. sign-up, book upload) easy and type-safe:
  • `react-hook-form` manages form state and validation triggers  
  • `Zod` defines clear rules (required fields, photo counts) and shows user-friendly error messages

- **uploadthing**  
  Simplifies uploading and storing book photos to a cloud bucket (Cloudflare R2 or Amazon S3), including client-side previews and server-side validation of file size/type.

- **TypeScript**  
  Ensures consistent data shapes across the entire frontend codebase, reducing bugs by checking types at compile time.

## 2. Backend Technologies

These tools power the server side of the application—data storage, authentication, and real-time messaging.

- **Next.js API Routes / Route Handlers + Server Actions**  
  Let us define HTTP endpoints (e.g. `POST /api/trades`) and server-side form handlers in the same project, streamlining both server and client logic.

- **Auth.js**  
  Provides secure user authentication out of the box, supporting:
  • Email/password login  
  • Google OAuth sign-in  
  • Session management and easy integration with Next.js

- **Drizzle ORM** + **PostgreSQL**  
  A type-safe database layer that lets us:
  • Define the schema first (users, books, trades, ratings, messages)  
  • Run migrations to keep the database in sync  
  • Use PostGIS extension for location data (latitude/longitude) and distance queries

- **Real-Time Provider** (Pusher or Ably)  
  Powers the chat feature so users can negotiate trades instantly without refreshing the page.

- **Background Job Runner** (Inngest or Trigger.dev)  
  Handles tasks that run outside the main request cycle, such as:
  • Sending email notifications when a trade is requested  
  • Scanning uploaded images for safety asynchronously

- **Zod (Shared Validators)**  
  Validates incoming API requests on the server to ensure data integrity and give clear error messages back to the client.

## 3. Infrastructure and Deployment

How we host, build, and deploy the application so it’s reliable and easy to update.

- **Docker & Docker Compose**  
  Containerizes the application and its services (PostgreSQL with PostGIS), ensuring every developer has the same local setup.

- **Version Control (Git + GitHub)**  
  Tracks code changes, enables collaboration via pull requests, and serves as the source of truth for the CI/CD pipeline.

- **CI/CD Pipeline (Vercel)**  
  Automatically builds and deploys your Next.js application on every commit:
  • Preview environments for each pull request  
  • Production deployments on merge to `main`

- **drizzle-kit**  
  Manages database migrations in sync with your schema definitions, making it safe to evolve the data model over time.

- **Path Aliases (@/…)**  
  Simplifies imports (e.g. `import Button from '@/components/ui/Button'`) for cleaner, more maintainable code.

## 4. Third-Party Integrations

External services that add key features without building everything from scratch.

- **Open Library API**  
  Auto-fills book metadata (title, author, cover image) when users add new books by ISBN or title.

- **Pusher / Ably**  
  Provides a robust, low-latency real-time messaging layer for the trade chat interface.

- **Uploadthing** + **Cloudflare R2 or S3**  
  Handles reliable, scalable storage of user-uploaded photos, complete with URL signing and access control.

- **Inngest / Trigger.dev**  
  Runs background jobs such as email notifications and image moderation in a managed environment.

- **Sentry**  
  Captures and reports runtime errors on both client and server, helping you spot and fix issues quickly.

- **Upstash** (Optional)  
  Provides a managed Redis layer for rate limiting (e.g., login attempts) and fast caching of session data.

## 5. Security and Performance Considerations

Measures we’ve put in place to keep user data safe and make the app feel fast.

- **Authentication & Authorization**  
  • **Auth.js** for secure sign-in flows and session cookies  
  • Role checks to protect admin routes and sensitive API endpoints

- **Input Validation**  
  • **Zod** on both client and server to prevent invalid or malicious data  
  • Strict type checks via TypeScript end-to-end

- **Rate Limiting & CSP**  
  • Upstash Redis for throttling repeated requests (e.g., login attempts)  
  • Content Security Policy headers to block unwanted scripts and resources

- **File Scanning**  
  • Background image moderation via Inngest or Trigger.dev  
  • File size/type checks before upload with uploadthing

- **Performance Optimizations**  
  • **Next.js** server-side rendering (SSR) and incremental static regeneration (ISR) for fast first loads  
  • **React Query** caching and automatic background refetch  
  • Tailwind CSS purge to remove unused styles  
  • Next.js Image Optimization for responsive, lazy-loaded photos

## 6. Conclusion and Overall Tech Stack Summary

This technology stack was chosen to align perfectly with the goals of the Book Barter platform:

- **Speed of Development**: Next.js, shadcn/ui, and Tailwind let us build polished interfaces quickly.
- **Type Safety & Reliability**: TypeScript, Drizzle ORM, and Zod ensure data consistency and reduce bugs.
- **Scalability**: A containerized setup (Docker) plus managed services (Vercel, Postgres with PostGIS) make it easy to grow with user demand.
- **Extensibility**: Modular domains in `/app`, `/components`, and `/lib` keep features organized and ready for future enhancements (e.g., multi-factor auth, admin analytics).

By combining these carefully selected tools, the Book Barter starter repository provides a solid, maintainable foundation for creating a secure, fast, and feature-rich book-trading platform.