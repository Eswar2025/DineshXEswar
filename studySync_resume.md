# StudySync — Resume Bullet Points

> Full-stack collaborative study platform · **Next.js 14 (App Router) · TypeScript · Supabase (PostgreSQL + Realtime + Auth) · Zustand · Framer Motion · PWA**

---

> [!NOTE]
> Each bullet is structured to answer **six questions** (per Google engineer advice):
> ❶ What difficult engineering problem did I solve? · ❷ What CS concepts did I implement? · ❸ Why is this technically challenging? · ❹ How did I make it reliable and scalable? · ❺ What technologies enabled it? · ❻ What measurable impact did it have?

---

## Bullet Points

### 1. Real-Time Collaboration Engine

> Solved the problem of **enabling live collaboration between concurrent study sessions without polling** by implementing a **pub/sub event-driven architecture** using **Supabase Realtime (Postgres Changes over WebSocket channels)** — subscribing to `INSERT`/`UPDATE`/`DELETE` events across 4 PostgreSQL tables (`session_segments`, `todos`, `friend_requests`, `session_comments`) via **channel multiplexing on a single persistent connection**. The core challenge was maintaining **UI consistency under network uncertainty**: addressed this through **optimistic concurrency control** in the comment system (instant local insert with temp ID → server confirmation replaces ID → automatic rollback on failure) and **auto-reconnection with full state rehydration** from the database to recover missed events. This architecture delivered **near-zero perceived latency** for live friend-activity feeds, threaded session comments, and interactive friend-request notifications — contributing to **50+ user sign-ups in the first week**.

### 2. Fault-Tolerant Timer with Auto-Pause & Crash Recovery

> Addressed the **distributed-state persistence problem** of ensuring study-timer accuracy across unpredictable browser exits (tab close, navigation, laptop lid-shut, crash, network loss) by implementing a **heartbeat-based failure detection and state-reconciliation system**. On page unload, the timer fires a **`navigator.sendBeacon()` fire-and-forget HTTP request** to the server — chosen over `fetch` because the browser **guarantees delivery even during teardown** while cancelling regular async requests. For cases where even `sendBeacon` fails (no network, browser crash), an **abandoned-segment recovery algorithm** runs on next load: it reads the last heartbeat timestamp from `localStorage`, and if the heartbeat is **>15 seconds stale** (threshold tuned to balance false-positive pauses vs. data drift), it **auto-closes the orphaned segment** using the heartbeat as `ended_at`. Additionally, a **midnight date-boundary splitter** polls every 60 seconds and **atomically closes segments at 23:59:59 and opens new ones at 00:00:00** to maintain per-day session integrity, with a **12-hour runaway detector** as a final safety net. This triple-layer failsafe (**beacon → heartbeat recovery → runaway detection**) achieved **zero study-time data loss on unexpected exits** across **50+ active users**.

### 3. Defense-in-Depth Authentication & Authorization

> Tackled the **granular access-control problem** — friends must read each other's study data but never modify it, while all other users are fully isolated — by implementing **defense-in-depth across three enforcement layers**. At the **network layer**, a **PKCE (Proof Key for Code Exchange) auth flow** prevents authorization-code interception in the SPA, with sessions managed via **HTTP-only cookies** (`@supabase/ssr`) to eliminate XSS token-theft vectors. At the **application layer**, **Next.js middleware** intercepts every request and validates session tokens server-side before rendering, enforcing route-prefix guards (`/dashboard`, `/friends`, `/settings`) and redirecting unauthenticated users. At the **database layer** — the critical enforcement point because client-side and API-layer checks can theoretically be bypassed — **Row-Level Security (RLS) policies on all 6 PostgreSQL tables** evaluate access rules on every query: `self → read-write`, `friends → read-only`, `authenticated → profile read`. Privileged operations (account deletion) are isolated to a **service-role client** on server-only Route Handlers, applying the **principle of least privilege**. This architecture ensures **zero unauthorized data access even if the API layer is compromised**, with **complete password-reset and email verification flows** securing the account lifecycle.

### 4. Production PWA with Database-Enforced Invariants & Rich UX

> Solved the **data-integrity-at-scale problem** — preventing application-level bugs from creating inconsistent state — by **pushing invariants into the PostgreSQL layer**: `duration_secs` is a **`GENERATED ALWAYS AS STORED` computed column** that derives duration from `started_at` and `ended_at` (impossible to drift from source values, and indexable for query performance), a **trigger-based constraint** enforces a **max 20 todos per user per day** at the database level (tamper-proof even under race conditions or direct API calls), and a **server-side function** atomically generates 8-character referral codes. On the client, managed complex state across **4 Zustand stores** (timer, user, friends, sound) with **selective `localStorage` persistence** for the sound mixer, implemented **`@dnd-kit` drag-and-drop** with keyboard accessibility for todo reordering, and built a **5-channel ambient sound mixer** synced to the study timer. Shipped as an **installable Progressive Web App** with service-worker caching (`next-pwa`), cross-platform install prompts, and **Framer Motion + GSAP** page transitions — deployed on **Vercel** (frontend) and **Supabase** (backend) as a production-grade application serving **50+ users**.

---

## Six-Question Breakdown Per Bullet

> [!TIP]
> Use this table to verify coverage and prepare for follow-ups — interviewers may probe any dimension.

| Dimension | Bullet 1 (Real-Time) | Bullet 2 (Auto-Pause) | Bullet 3 (Auth) | Bullet 4 (Architecture) |
|---|---|---|---|---|
| **❶ Hard Problem** | Live collaboration without polling | Timer accuracy across unpredictable exits | Granular friend-graph access control | Data integrity at scale |
| **❷ CS Concepts** | Pub/sub, event-driven architecture, optimistic concurrency, channel multiplexing | Heartbeat failure detection, state reconciliation, fire-and-forget messaging | PKCE, defense-in-depth, row-level authorization, least privilege | Computed columns, database triggers, state machines, progressive enhancement |
| **❸ Why Challenging** | UI consistency under network uncertainty; eventual consistency with rollback | Browser teardown cancels async requests; crash leaves orphaned state; date boundaries split segments | Client-side SPAs are inherently untrusted; API bypass can leak data | Application bugs can drift computed values; race conditions bypass app-layer validation |
| **❹ Reliable/Scalable** | Optimistic updates + rollback; auto-reconnect + full rehydration | Triple-layer failsafe (beacon → heartbeat → runaway); tuned 15s threshold | Three enforcement layers (network → app → database); RLS is tamper-proof | Database-level invariants can't drift; triggers are race-condition-proof |
| **❺ Technologies** | Supabase Realtime, PostgreSQL, WebSocket channels, Zustand | `sendBeacon()`, `visibilitychange`, localStorage, Next.js API Routes | Supabase Auth, `@supabase/ssr`, Next.js middleware, PostgreSQL RLS | Next.js 14, TypeScript, PostgreSQL, Zustand, `@dnd-kit`, Framer Motion, `next-pwa` |
| **❻ Impact** | Near-zero latency; 50+ users week one | Zero data-loss on unexpected exits; 50+ users | Zero unauthorized access even if API is compromised | Production PWA; 20-todo DB-enforced limit; 50+ users served |

---

## Short-Form Variants (Space-Constrained Resumes)

| # | Bullet |
|---|--------|
| 1 | Engineered a **pub/sub real-time collaboration engine** using Supabase Realtime WebSocket channels with **optimistic concurrency control** (instant insert → server confirm → rollback on failure) across 4 PostgreSQL tables — delivering near-zero latency for live comments, friend-activity feeds, and notifications to **50+ first-week users**. |
| 2 | Built a **fault-tolerant timer** using **`navigator.sendBeacon()`** for guaranteed-delivery pause on tab close, **heartbeat-based crash recovery** (15s staleness threshold), and **atomic midnight segment splitting** — achieving **zero study-time data loss** across all browser exit scenarios. |
| 3 | Implemented **defense-in-depth auth** with PKCE flow, HTTP-only cookie sessions, Next.js middleware route guards, and **PostgreSQL Row-Level Security on all 6 tables** — ensuring zero unauthorized data access even if the API layer is bypassed. |
| 4 | Shipped a **production PWA** on Next.js 14 / TypeScript with **database-enforced invariants** (computed columns, trigger constraints), 4 Zustand stores, drag-and-drop UX, and Framer Motion animations — serving **50+ users** on Vercel + Supabase. |

---

## 🎯 Interview Prep — Deep-Dive Questions & Answers

> [!IMPORTANT]
> **Every bullet will be probed.** Here's exactly what they'll ask and how to answer:

### Real-Time (Bullet 1)

| Question | Answer |
|----------|--------|
| **Why Supabase Realtime over raw WebSockets / Socket.IO?** | Postgres Changes gives database-level event sourcing with zero custom pub/sub infrastructure — the DB itself is the event source. Channel multiplexing lets me subscribe to 4 tables on one connection. Trade-off: less flexible than raw WS for custom protocols, but perfect for CRUD-event-driven UIs. |
| **Explain optimistic concurrency control in your comments.** | Insert locally with a temp UUID immediately (user sees instant feedback). Subscribe to the Realtime `INSERT` event. On server confirmation, replace the temp ID with the real server ID. On error, remove the optimistic entry and show an error toast. The key invariant: the UI never shows stale state for more than one network round-trip. |
| **How would you scale past Supabase's connection limits?** | Horizontally: Redis pub/sub adapter (like Socket.IO's Redis adapter) to fan out events across multiple Supabase Realtime instances. Or migrate to a dedicated WebSocket gateway (Soketi, Centrifugo) backed by a message queue (Kafka, NATS) for true horizontal scaling. |
| **What happens if a user misses events during a disconnection?** | Supabase Realtime auto-reconnects, but doesn't replay missed events. On reconnect, I re-fetch the latest state from PostgreSQL to reconcile — effectively a "read-repair" pattern. |

### Auto-Pause Timer (Bullet 2)

| Question | Answer |
|----------|--------|
| **Why `sendBeacon` over `fetch` with `keepalive`?** | `sendBeacon` is purpose-built for unload — the browser guarantees delivery and doesn't block teardown. `fetch` with `keepalive` is similar but has a 64KB payload limit and less consistent browser support for unload scenarios. `sendBeacon` is the right tool for fire-and-forget telemetry/state-sync. |
| **What if both `sendBeacon` AND heartbeat fail?** | The 12-hour runaway detector is the final safety net — if a segment exceeds 43,200 seconds, it shows a warning toast. On next load, the recovery algorithm detects the stale heartbeat and auto-pauses. Worst case: the segment is slightly inaccurate (off by the heartbeat interval), but never lost. |
| **How does midnight splitting handle timezones?** | Uses the client's `new Date()` for local-time boundary detection. Polls every 60s. On date change: closes old segment at `23:59:59.999`, creates new `study_session` for the new date, inserts new segment at `00:00:00.000`, carries the subject name forward. All in a single async sequence with error handling. |
| **Why 15 seconds for heartbeat staleness?** | Tuned empirically. <10s causes false positives (slow page loads trigger recovery). >30s loses too much study time on actual crashes. 15s is the sweet spot — accounts for slow network round-trips without significant data drift. |

### Auth & Security (Bullet 3)

| Question | Answer |
|----------|--------|
| **What is PKCE and why does it matter for SPAs?** | Proof Key for Code Exchange. The client generates a random `code_verifier`, hashes it to a `code_challenge`, sends the challenge with the auth request. The server verifies the verifier on code exchange. This prevents authorization-code interception attacks because even if an attacker intercepts the code, they can't exchange it without the verifier. |
| **Why cookies over localStorage for tokens?** | HTTP-only cookies are inaccessible to JavaScript — XSS can't steal them. Combined with `SameSite` attributes, they mitigate CSRF too. Trade-off: requires server-side middleware to refresh sessions, but `@supabase/ssr` handles this automatically. |
| **Why is RLS the critical layer?** | Client-side validation is bypassable (devtools). API validation can have bugs. But RLS policies execute inside PostgreSQL on every query — even a direct SQL injection or API bypass hits the RLS wall. It's the last line of defense and the most trustworthy one. |
| **How do you prevent privilege escalation with the service-role client?** | Service-role bypasses RLS, so it's only instantiated in server-side Route Handlers (never in client components). A `isServiceRoleConfigured` guard prevents accidental use when the key isn't set. Only used for admin ops (account deletion) where RLS would block the needed cross-table cascades. |

---

## 🏢 Company-Specific Tailoring

> [!TIP]
> ### For **Google**
> - Lead with **Bullets 1 and 2** — they demonstrate systems-thinking (pub/sub architecture, failure detection, state reconciliation).
> - Emphasize **trade-off awareness**: why Supabase Realtime over raw WS, why 15s over 10s/30s, why cookies over localStorage.
> - Be ready to whiteboard the **timer state machine** (running → paused → abandoned → recovered).

> [!TIP]
> ### For **Microsoft**
> - Lead with **Bullets 3 and 4** — they demonstrate security depth (defense-in-depth, least privilege) and end-to-end product ownership.
> - Draw Azure analogies: Supabase Auth → Azure AD B2C, Supabase Realtime → Azure SignalR, RLS → Azure RBAC, Vercel → Azure Static Web Apps.
> - Highlight **TypeScript strict mode** — Microsoft created TypeScript and values strong typing discipline.
