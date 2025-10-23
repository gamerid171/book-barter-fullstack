# Backend Structure Document for Book Barter

## 1. Backend Architecture

This section outlines the overall design and key patterns of the backend.

### Architecture Overview
- The backend is built as a modular monolith using **Next.js** (App Router). All business logic, API routes, and server actions live under the `/app` directory.  
- We follow a **domain-driven** folder structure. Key domains are:  
  • `library` (books management)  
  • `trades` (trade negotiation and messaging)  
  • `search` (full-text and geospatial discovery)  
  • `admin` (analytics and moderation)  

### Design Patterns and Frameworks
- **API Routes & Server Actions** (Next.js): Provide RESTful endpoints alongside server-side data mutations without client-only code.  
- **Drizzle ORM**: A schema-first ORM for type-safe database access.  
- **Auth.js**: Handles Email/Password and Google OAuth flows.  
- **Real-time Provider**: Pusher or Ably for live chat.  
- **Background Jobs**: Inngest or Trigger.dev for email notifications and file scanning.  

### Scalability, Maintainability, and Performance
- **Scalability**:  
  • Modular domains can be scaled or extracted as services in the future.  
  • Cloud hosting (Vercel) auto-scales serverless functions.  
- **Maintainability**:  
  • Clear separation of concerns: UI components (`/components`), business logic (`/lib`), data layer (`/db`).  
  • TypeScript end-to-end ensures consistency.  
- **Performance**:  
  • Server-side rendering (SSR) and incremental static regeneration (ISR) for key pages.  
  • Caching of API responses via CDN (Cloudflare).  
  • Database indexes on frequently queried fields (e.g., book titles, geolocation).  

## 2. Database Management

### Technologies Used
- **PostgreSQL** (SQL) with the **PostGIS** extension for geospatial data  
- **Drizzle ORM** for type-safe schema definitions and queries  
- **drizzle-kit** for migrations and schema versioning

### Data Structure and Access
- Data is defined in `/db/schema.ts` using Drizzle’s schema API.  
- **Tables**: `users`, `books`, `trades`, `messages`, `ratings`, plus join tables for wishlists.  
- **Geospatial**: The `users` and `books` tables include a `location` column of type `geography(Point,4326)`.  
- **Access Patterns**:  
  • CRUD operations via Drizzle queries.  
  • Full-text and proximity searches using PostgreSQL’s `GIN` indexes and `ST_DWithin`.  
  • Transactions for trade creation and completion.  

### Data Management Practices
- **Migrations**: Managed via `drizzle-kit migrate` commands.  
- **Backups**: Scheduled daily snapshots of the database.  
- **Connection Pooling**: Recommended provider (Neon, Supabase) handles pooling automatically.  

## 3. Database Schema

### Human-Readable Schema
- **users**: id, name, email, password_hash, avatar_url, location (latitude & longitude), created_at  
- **books**: id, owner_id (FK to users), title, author, description, photos (array of URLs), trade_visibility (enum: public, private), location (geography Point), created_at  
- **trades**: id, requester_id (FK to users), owner_id (FK to users), book_id (FK to books), status (enum: pending, accepted, completed, cancelled), created_at, updated_at  
- **messages**: id, trade_id (FK to trades), sender_id (FK to users), content, timestamp  
- **ratings**: id, trade_id (FK to trades), rater_id (FK to users), ratee_id (FK to users), score (1–5), comment, created_at  
- **wishlists**: user_id (FK), book_id (FK)  

### SQL Schema (PostgreSQL)
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  avatar_url TEXT,
  location GEOGRAPHY(Point,4326),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Books table
CREATE TABLE books (
  id UUID PRIMARY KEY,
  owner_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT,
  photos TEXT[],
  trade_visibility TEXT CHECK (trade_visibility IN ('public','private')) DEFAULT 'public',
  location GEOGRAPHY(Point,4326),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Trades table
CREATE TABLE trades (
  id UUID PRIMARY KEY,
  requester_id UUID REFERENCES users(id),
  owner_id UUID REFERENCES users(id),
  book_id UUID REFERENCES books(id),
  status TEXT CHECK (status IN ('pending','accepted','completed','cancelled')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  trade_id UUID REFERENCES trades(id),
  sender_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Ratings table
CREATE TABLE ratings (
  id UUID PRIMARY KEY,
  trade_id UUID REFERENCES trades(id),
  rater_id UUID REFERENCES users(id),
  ratee_id UUID REFERENCES users(id),
  score INTEGER CHECK (score BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Wishlists table
CREATE TABLE wishlists (
  user_id UUID REFERENCES users(id),
  book_id UUID REFERENCES books(id),
  PRIMARY KEY (user_id, book_id)
);
```

## 4. API Design and Endpoints

We follow a RESTful design under `/app/api`. All endpoints return JSON and use standard HTTP status codes.

### Authentication
- `POST /api/auth/signup` — Create a new user account.  
- `POST /api/auth/signin` — Sign in with email/password or Google OAuth.  
- `POST /api/auth/signout` — Invalidate the session.  

### Users
- `GET /api/users/me` — Get current user profile.  
- `PATCH /api/users/me` — Update profile or location.  

### Books
- `GET /api/books` — List books with optional filters (title, author, proximity).  
- `GET /api/books/:id` — Get book details.  
- `POST /api/books` — Add a new book (includes 4 photos).  
- `PATCH /api/books/:id` — Update book info.  
- `DELETE /api/books/:id` — Remove a book.  

### Trades & Messages
- `POST /api/trades` — Initiate a trade request.  
- `GET /api/trades/:id` — Get trade details.  
- `PATCH /api/trades/:id` — Update status (accept, complete, cancel).  
- `GET /api/trades/:id/messages` — List messages in a trade chat.  
- `POST /api/trades/:id/messages` — Send a new message.  

### Ratings & Wishlist
- `POST /api/ratings` — Submit a rating for a completed trade.  
- `GET /api/ratings/:userId` — Get ratings for a user.  
- `POST /api/wishlist` — Add a book to wishlist.  
- `DELETE /api/wishlist/:bookId` — Remove from wishlist.  

## 5. Hosting Solutions

### Cloud Provider
- **Vercel** hosts the Next.js app as serverless functions and static assets.  
- Database hosted on **Neon** or **Supabase** (PostgreSQL with PostGIS).  
- File storage via **Cloudflare R2** or **AWS S3** (for book photos).  

### Benefits
- **Reliability**: Vercel SLAs ensure high uptime for API routes.  
- **Scalability**: Automatic scaling of serverless functions.  
- **Cost-Effectiveness**: Pay-as-you-go for compute, storage, and bandwidth.  
- **CDN**: Vercel integrates a global CDN for static assets.

## 6. Infrastructure Components

- **Load Balancer**: Vercel’s built-in edge network distributes traffic.  
- **Caching**:  
  • **Cloudflare CDN** for static assets and API response caching.  
  • **Upstash Redis** for rate limiting and short-term caches (e.g., search results).  
- **Content Delivery Network (CDN)**: Global caching of JS, CSS, images.  
- **Background Workers**: Inngest or Trigger.dev run on-demand jobs (emails, scans).  
- **Real-time Layer**: Pusher or Ably websockets for live chat.  

## 7. Security Measures

- **Authentication & Authorization**:  
  • **Auth.js** for secure sessions (HTTP-only cookies).  
  • Role-based access control for admin routes.  
- **Data Encryption**:  
  • In-transit: TLS everywhere (frontend, APIs, DB connections).  
  • At-rest: Database provider’s encryption of disks.  
- **Input Validation**:  
  • **Zod** schemas on every endpoint and server action.  
- **Rate Limiting**:  
  • Upstash Redis enforces per-IP or per-user limits on endpoints.  
- **Security Headers**:  
  • CSP, HSTS, X-Frame-Options in Next.js middleware.  
- **File Scanning**:  
  • Background job to scan uploaded images for malware.  
- **Monitoring & Auditing**:  
  • Sentry for error tracking and performance monitoring.  

## 8. Monitoring and Maintenance

### Monitoring Tools
- **Sentry**: Captures exceptions and performance traces.  
- **Vercel Analytics**: Tracks request latencies and error rates.  
- **Database Metrics**: CPU, connections, slow queries in Neon/Supabase dashboard.  

### Maintenance Strategies
- **Automated Migrations**: `drizzle-kit` runs in CI to apply new schema changes.  
- **Dependency Updates**: Dependabot or Renovate for package upgrades.  
- **Testing**:  
  • **Vitest** for unit tests on business logic.  
  • **Playwright** for end-to-end flows (signup, book listing, trade).  
- **Onboarding**: Docker Compose script spins up Next.js, Postgres+PostGIS, and Redis locally.  

## 9. Conclusion and Overall Backend Summary

The Book Barter backend is a modern, type-safe, and scalable monolith powered by Next.js. Its modular domain structure keeps code organized while allowing future growth into microservices if needed. Key highlights:

- **Type-Safe ORM** with Drizzle and PostgreSQL/PostGIS for robust data management.  
- **Secure Authentication** via Auth.js and strict security practices.  
- **Real-Time Chat** and **Background Jobs** support seamless trade negotiations and notifications.  
- **Serverless Hosting** on Vercel provides auto-scaling, global CDN, and cost efficiency.  
- **Monitoring & Testing** ensure reliability and fast issue resolution.  

This backend structure aligns perfectly with the project goals: enabling rapid development of book trading, geospatial discovery, and user collaboration, all on a solid, maintainable foundation.