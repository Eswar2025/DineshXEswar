# StudySync — Complete Clone & Build Guide
### AI-Assisted Development with GitHub Copilot / OpenAI Codex

> **Who this is for:** A developer who wants to clone StudySync, understand every architectural decision, and use AI coding tools (GitHub Copilot, Codex, Cursor, etc.) to rebuild it faster with professional-grade code.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack at a Glance](#2-tech-stack-at-a-glance)
3. [Phase-by-Phase Build Plan](#3-phase-by-phase-build-plan)
4. [Environment Setup](#4-environment-setup)
5. [Supabase Database Setup](#5-supabase-database-setup)
6. [Architecture Deep Dive](#6-architecture-deep-dive)
7. [Feature-by-Feature Codex Prompts](#7-feature-by-feature-codex-prompts)
8. [Folder Structure Explained](#8-folder-structure-explained)
9. [State Management Patterns](#9-state-management-patterns)
10. [Real-Time with Supabase](#10-real-time-with-supabase)
11. [Row Level Security (RLS)](#11-row-level-security-rls)
12. [Design System Reference](#12-design-system-reference)
13. [Common Gotchas & Fixes](#13-common-gotchas--fixes)
14. [Deployment Checklist](#14-deployment-checklist)
15. [Codex Cheat Sheet](#15-codex-cheat-sheet)

---

## 1. Project Overview

StudySync is a **real-time social study tracker** for students. The core idea:

```
Start Timer → Study a subject → Pause → Name subject → 
Friends see your session live → Compare who studied more at end of day
```

**What makes it more than a Pomodoro timer:**
- Social visibility — friends see your active sessions live
- Gamification — streaks, leaderboards, head-to-head comparisons
- Segment history — every study block saved with subject name
- PWA — installable on mobile like a native app

**Launch result:** 50+ users within 2 weeks, built by students for students.

---

## 2. Tech Stack at a Glance

| Layer | Tool | Why |
|---|---|---|
| Framework | **Next.js 14 App Router** | SSR, file-based routing, API routes |
| Language | **TypeScript (strict)** | Type safety, better Codex completions |
| Styling | **Tailwind CSS** | Utility-first, no CSS file juggling |
| UI Components | **shadcn/ui + Radix UI** | Accessible, unstyled, customizable |
| Backend / DB | **Supabase** | Auth + PostgreSQL + Realtime in one |
| State | **Zustand** | Simple, no boilerplate |
| Animations | **Framer Motion** | Declarative, easy with Codex |
| Drag & Drop | **@dnd-kit** | Modern, accessible DnD |
| Icons | **Lucide React** | Clean, consistent icon set |
| Dates | **date-fns** | Lightweight date utilities |
| Toasts | **Sonner** | Zero-config notifications |
| Confetti | **canvas-confetti** | Celebration effects |
| PWA | **@ducanh2912/next-pwa** | Service worker + install prompt |

---

## 3. Phase-by-Phase Build Plan

Build in this exact order to avoid blockers. Each phase is independently testable.

```
Phase 1 — Foundation (Days 1–2)
├── Next.js 14 + TypeScript project setup
├── Tailwind CSS + shadcn/ui installation
├── Supabase project + schema
└── Auth (login, signup, email verification)

Phase 2 — Core Timer (Days 3–4)
├── Zustand timer store
├── Timer UI (start/pause/resume)
├── Session segment saving to Supabase
├── Subject naming dialog after pause
└── Tab-close safety (sendBeacon)

Phase 3 — Dashboard (Days 5–6)
├── Session segment history table
├── Daily todo list with drag-to-reorder
├── Real-time subscriptions (timer + todos)
└── Floating popup timer overlay

Phase 4 — Friends System (Days 7–8)
├── Referral code generation
├── Send / accept / decline friend requests
├── Friends grid with live status
└── RLS policies for friend data

Phase 5 — Gamification (Days 9–10)
├── Head-to-head comparison view
├── Activity heatmap (history page)
├── Streak counter and badge
└── Subject breakdown donut chart

Phase 6 — Polish (Days 11–12)
├── Segment editing with honesty modal
├── Ambient sounds board
├── PWA install prompt
├── Email templates (Supabase Auth)
└── Settings & account deletion
```

---

## 4. Environment Setup

### Step 1 — Create the Next.js project

```bash
npx create-next-app@latest studysync --typescript --tailwind --eslint --app
cd studysync
```

### Step 2 — Install all dependencies at once

```bash
npm install \
  @supabase/ssr @supabase/supabase-js \
  zustand \
  framer-motion \
  @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities \
  lucide-react \
  date-fns \
  sonner \
  canvas-confetti \
  @types/canvas-confetti \
  @ducanh2912/next-pwa

# shadcn/ui init (follow prompts — choose "New York" style, slate base color)
npx shadcn-ui@latest init

# Add shadcn components you'll need
npx shadcn-ui@latest add card dialog select popover tabs dropdown-menu button input label badge separator
```

### Step 3 — Environment variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here   # Never expose this to the client
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Where to find these:** Supabase Dashboard → Project Settings → API

### Step 4 — Supabase client helpers

Create `lib/supabase/client.ts` (browser-side):

```typescript
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

Create `lib/supabase/server.ts` (server-side, for API routes and Server Components):

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return cookieStore.get(name)?.value },
        set(name, value, options) { cookieStore.set({ name, value, ...options }) },
        remove(name, options) { cookieStore.set({ name, value: '', ...options }) },
      },
    }
  )
}
```

---

## 5. Supabase Database Setup

Run this entire SQL in **Supabase Dashboard → SQL Editor**.

### Tables

```sql
-- Profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_emoji TEXT DEFAULT '🦊',
  initials TEXT,
  referral_code TEXT UNIQUE,
  streak_count INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Study sessions (one per day per user)
CREATE TABLE study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_duration_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Individual timer segments (each start→pause cycle)
CREATE TABLE session_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES study_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subject TEXT,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,                  -- NULL = currently active
  duration_seconds INTEGER,              -- Computed on pause
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily todos
CREATE TABLE todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  linked_segment_id UUID REFERENCES session_segments(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Friend requests
CREATE TABLE friend_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(sender_id, receiver_id)
);

-- Accepted friendships (bidirectional)
CREATE TABLE friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a UUID REFERENCES profiles(id) ON DELETE CASCADE,
  user_b UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_a, user_b)
);
```

### Functions & Triggers

```sql
-- Auto-generate 8-char referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
  SELECT upper(substring(replace(gen_random_uuid()::text, '-', '') FROM 1 FOR 8));
$$ LANGUAGE SQL;

-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, referral_code)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    generate_referral_code()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Accept a friend request and create bidirectional friendship
CREATE OR REPLACE FUNCTION accept_friend_request(request_id UUID)
RETURNS VOID AS $$
DECLARE
  req friend_requests;
BEGIN
  SELECT * INTO req FROM friend_requests WHERE id = request_id;
  UPDATE friend_requests SET status = 'accepted' WHERE id = request_id;
  INSERT INTO friendships (user_a, user_b)
  VALUES (LEAST(req.sender_id, req.receiver_id), GREATEST(req.sender_id, req.receiver_id))
  ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Enable Row Level Security

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE friend_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

-- Helper: is this user a friend of mine?
CREATE OR REPLACE FUNCTION are_friends(user_a UUID, user_b UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM friendships
    WHERE (friendships.user_a = LEAST(user_a, user_b)
      AND  friendships.user_b = GREATEST(user_a, user_b))
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Profiles: own full access, friends read-only
CREATE POLICY "own_profile" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "friends_read_profile" ON profiles FOR SELECT
  USING (are_friends(auth.uid(), id));

-- Session segments: own full, friends read
CREATE POLICY "own_segments" ON session_segments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "friends_read_segments" ON session_segments FOR SELECT
  USING (are_friends(auth.uid(), user_id));

-- Todos: own full, friends read
CREATE POLICY "own_todos" ON todos FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "friends_read_todos" ON todos FOR SELECT
  USING (are_friends(auth.uid(), user_id));

-- Friend requests: participants only
CREATE POLICY "own_requests" ON friend_requests FOR ALL
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Friendships: participants only
CREATE POLICY "own_friendships" ON friendships FOR SELECT
  USING (auth.uid() = user_a OR auth.uid() = user_b);
```

### Enable Realtime

```sql
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE
    session_segments, todos, friend_requests;
COMMIT;
```

### Performance Indexes

```sql
CREATE INDEX idx_segments_user_date ON session_segments(user_id, started_at DESC);
CREATE INDEX idx_todos_user_date ON todos(user_id, date);
CREATE INDEX idx_friendships_lookup ON friendships(user_a, user_b);
```

---

## 6. Architecture Deep Dive

### 6.1 Timer System

This is the most complex feature. Here is how every layer connects:

```
User clicks "Start"
      │
      ▼
TimerProvider.tsx
  ├── INSERT session_segments { started_at: NOW(), ended_at: null }
  ├── localStorage.set('active_segment_id', newId)
  ├── setInterval(tick, 1000) → dispatch to Zustand
  └── registers beforeunload handler (sendBeacon fallback)
      │
      ▼
useTimerStore (Zustand)
  ├── elapsed: number          ← seconds since start
  ├── isRunning: boolean
  ├── activeSegmentId: string | null
  └── segments: Segment[]      ← today's history
      │
      ├── TimerPanel.tsx        ← formats elapsed as HH:MM:SS
      └── TimerPopup.tsx        ← same store, floating UI

User clicks "Pause"
      │
      ▼
TimerProvider.tsx
  ├── clearInterval(tickerId)
  ├── UPDATE session_segments SET ended_at = NOW(), duration_seconds = X
  ├── localStorage.remove('active_segment_id')
  └── Opens SubjectNameModal → user names the subject
        └── UPDATE session_segments SET subject = 'Math'
```

**Crash recovery on page load:**
```typescript
// In TimerProvider useEffect
const savedId = localStorage.getItem('active_segment_id')
if (savedId) {
  const { data: segment } = await supabase
    .from('session_segments')
    .select('*')
    .eq('id', savedId)
    .single()

  if (segment && !segment.ended_at) {
    // Browser crashed with timer running — auto-finalize it
    await supabase
      .from('session_segments')
      .update({ ended_at: new Date().toISOString() })
      .eq('id', savedId)

    toast.info('Your timer was automatically paused.')
    localStorage.removeItem('active_segment_id')
  }
}
```

**Tab-close safety:**
```typescript
// In TimerProvider
window.addEventListener('beforeunload', () => {
  if (activeSegmentId) {
    navigator.sendBeacon('/api/timer/pause', JSON.stringify({
      segmentId: activeSegmentId,
      endedAt: new Date().toISOString()
    }))
  }
})
```

```typescript
// app/api/timer/pause/route.ts
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const { segmentId, endedAt } = await request.json()
  const supabase = createClient()
  await supabase
    .from('session_segments')
    .update({ ended_at: endedAt })
    .eq('id', segmentId)
  return new Response('OK')
}
```

### 6.2 Friends System

Friends are stored as a bidirectional pair. The key rule: always store `(LEAST(a,b), GREATEST(a,b))` so there's only one row per friendship.

```
User A adds User B via referral code
      │
      ▼
INSERT friend_requests { sender_id: A, receiver_id: B, status: 'pending' }
                                    │
                        Realtime → User B sees notification
                                    │
                        User B clicks "Accept"
                                    │
                        accept_friend_request(request_id)
                          ├── UPDATE friend_requests SET status = 'accepted'
                          └── INSERT friendships (LEAST(A,B), GREATEST(A,B))
```

### 6.3 Real-Time Subscriptions

All subscriptions live in `hooks/useRealtime.ts`:

```typescript
export function useRealtime(userId: string) {
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel('app-realtime')
      
      // Friends' timer updates
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'session_segments',
      }, (payload) => {
        // Update friend's live status in useFriendStore
      })
      
      // Friends' todo updates
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'todos',
      }, (payload) => {
        // Update friend's todos in useFriendStore
      })
      
      // Incoming friend requests
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'friend_requests',
        filter: `receiver_id=eq.${userId}`,
      }, (payload) => {
        toast.info('New friend request received!')
      })
      
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId])
}
```

---

## 7. Feature-by-Feature Codex Prompts

Use these exact prompts in GitHub Copilot Chat, Cursor, or Claude to generate boilerplate quickly. Always review and adapt the output.

### 7.1 Timer Store (Zustand)

**Codex prompt:**
```
Create a Zustand store called useTimerStore in TypeScript with these fields:
- isRunning: boolean
- elapsed: number (seconds)
- activeSegmentId: string | null
- segments: array of { id, subject, startedAt, endedAt, durationSeconds }
- actions: startTimer, pauseTimer, resumeTimer, tick (increment elapsed by 1), 
  addSegment, updateSegment, setActiveSegmentId
Use immer middleware for immutable updates. Export the store and its types.
```

### 7.2 Floating Timer Popup

**Codex prompt:**
```
Create a React component called TimerPopup that:
- Is draggable using CSS transform and onMouseDown event listeners
- Shows elapsed time in HH:MM:SS format from a Zustand store
- Has a start/pause button, minimize button, close button
- Renders as a fixed-position overlay above all content (z-index: 9999)
- Persists drag position in localStorage
- Is resizable between small (compact pill) and large (full widget) via a toggle button
- Uses Tailwind CSS and Framer Motion for animations
```

### 7.3 Subject Naming Dialog

**Codex prompt:**
```
Create a shadcn/ui Dialog component called SubjectNameModal in TypeScript that:
- Opens automatically when the timer is paused (controlled by a boolean prop)
- Has a text input for the subject name with a list of 8 quick-select chips
  (Math, Physics, Chemistry, Biology, English, History, CS, Other)
- On submit, calls an async onSave(subject: string) prop
- Has a skip button that saves with subject = 'General'
- Shows character count (max 50 chars)
- Auto-focuses the input on open
```

### 7.4 Activity Heatmap

**Codex prompt:**
```
Create a React component called StreakHeatmap in TypeScript that:
- Accepts an array of { date: string, totalSeconds: number } as props
- Renders a calendar month grid with 7 columns (Mon–Sun)
- Each cell shows an animated flame emoji (🔥) if studied > 0 seconds that day,
  or a cloud icon (☁️) if no study logged
- Uses CSS keyframe animation 'flame-organic' for the fire (scale, rotate, skewX)
- Each cell's animation has a unique delay using (index * 137) % 1000 formula
- Shows current streak and personal best below the calendar
- Has prev/next month navigation buttons
- Uses Tailwind CSS with amber for active days and slate for inactive
```

### 7.5 Head-to-Head Comparison

**Codex prompt:**
```
Create a React component called ComparisonView in TypeScript that:
- Accepts myData and friendData props, each with { totalSeconds, completedTodos }
- Shows two side-by-side cards with the user's and friend's stats
- Has a toggle for metric: "Study Time" vs "Tasks Completed"
- Computes a winner and shows a golden-glow banner with the winner's name
- Uses Framer Motion to animate the winning card with a pulsing glow effect
- Has a date picker (using a shadcn Popover + calendar) to browse historical comparisons
```

### 7.6 Friends Grid

**Codex prompt:**
```
Create a React component called FriendsGrid in TypeScript that:
- Accepts an array of friend objects with { id, name, avatarEmoji, isStudyingNow, 
  totalSecondsToday, completedTodosCount, activeSubject }
- Renders a responsive grid (2 cols mobile, 3 cols tablet, 4 cols desktop)
- Each card shows: avatar emoji, name, "Studying now 🟢" or "Offline 🔴" badge,
  total study hours, completed tasks count
- If friend is studying, shows animated pulsing green dot + active subject name
- Clicking a card navigates to /friends/[friendId]
- Uses Tailwind CSS and Framer Motion for card hover effects
```

### 7.7 Drag-and-Drop Todo List

**Codex prompt:**
```
Create a React TodoList component using @dnd-kit/sortable in TypeScript that:
- Accepts an array of todos { id, text, completed, sortOrder } and a date prop
- Supports drag-to-reorder using SortableContext and useSortable hook
- Each todo has: drag handle icon, checkbox, text, delete button
- On reorder, persists new sort_order values to Supabase in a single batch update
- Limits to 20 todos per day, showing a disabled "max reached" state after 20
- Shows a character count on the input (max 100 chars)
- New todos are added at the bottom with auto-focus
- Uses Tailwind CSS for styling
```

### 7.8 Auth Middleware

**Codex prompt:**
```
Create a Next.js middleware.ts file that:
- Protects all routes under /dashboard, /friends, /history, /settings
- Redirects unauthenticated users to /login
- Uses @supabase/ssr createServerClient to check session from cookies
- Passes through all public routes: /, /login, /signup, /forgot-password, 
  /auth/callback, /auth/update-password, and Next.js static assets
- Refreshes the Supabase session token on each request using updateSession
```

### 7.9 Account Deletion API Route

**Codex prompt:**
```
Create a Next.js API route at app/api/account/delete/route.ts that:
- Verifies the user is authenticated using the Supabase server client
- Uses the Supabase service role client to call auth.admin.deleteUser(userId)
- This cascades delete all database rows due to ON DELETE CASCADE foreign keys
- Returns 200 on success, 401 if not authenticated, 500 on error
- After deletion, the client should sign out and redirect to the landing page
```

### 7.10 PWA Setup

**Codex prompt:**
```
Configure @ducanh2912/next-pwa in next.config.js for a Next.js 14 app.
The service worker should:
- Cache app shell pages for offline access
- Use 'NetworkFirst' strategy for API calls
- Use 'CacheFirst' for static assets and fonts
Create a manifest.json with: name "StudySync", short_name "StudySync",
theme_color "#6c63ff", background_color "#0a0a0f", display "standalone",
icons at 192x192 and 512x512.
Also create a React component called InstallPrompt that:
- Shows a banner on the landing page only (not on app routes)
- Uses the beforeinstallprompt event to trigger the native install dialog
- Stores a 'pwa-prompt-dismissed' flag in localStorage to never show again after dismiss
```

---

## 8. Folder Structure Explained

```
studysync/
│
├── app/                          ← Next.js App Router root
│   │
│   ├── (auth)/                   ← Route group: NO app shell/sidebar
│   │   ├── login/page.tsx        ← Public
│   │   ├── signup/page.tsx       ← Public
│   │   ├── forgot-password/page.tsx
│   │   └── auth/
│   │       ├── callback/route.ts ← Supabase PKCE token exchange
│   │       └── update-password/page.tsx
│   │
│   ├── (app)/                    ← Route group: protected, has sidebar
│   │   ├── layout.tsx            ← AppShell with sidebar nav
│   │   ├── dashboard/page.tsx    ← Timer + todos + segments
│   │   ├── friends/
│   │   │   ├── page.tsx          ← Friends grid
│   │   │   └── [friendId]/page.tsx ← Head-to-head comparison
│   │   ├── history/page.tsx      ← Activity heatmap calendar
│   │   └── settings/page.tsx     ← Profile + account deletion
│   │
│   ├── api/
│   │   ├── timer/pause/route.ts  ← sendBeacon handler
│   │   └── account/delete/route.ts
│   │
│   ├── page.tsx                  ← Public landing page
│   ├── layout.tsx                ← Root layout (providers, fonts)
│   └── globals.css               ← CSS variables + animations
│
├── components/
│   ├── timer/
│   │   ├── TimerPanel.tsx        ← Main timer widget on dashboard
│   │   ├── TimerPopup.tsx        ← Draggable floating overlay
│   │   ├── SessionSegmentList.tsx
│   │   └── EditSegmentModal.tsx
│   ├── todos/
│   │   ├── TodoList.tsx
│   │   └── TodoItem.tsx
│   ├── friends/
│   │   ├── FriendCard.tsx
│   │   ├── AddFriendDialog.tsx
│   │   └── ComparisonView.tsx
│   ├── stats/
│   │   ├── StreakHeatmap.tsx
│   │   ├── StreakBadge.tsx
│   │   └── SubjectChart.tsx      ← Donut chart (use recharts)
│   ├── layout/
│   │   └── AppShell.tsx          ← Sidebar + mobile bottom nav
│   ├── modals/
│   │   ├── OnboardingModal.tsx   ← First-time setup (name + avatar)
│   │   └── SubjectNameModal.tsx
│   ├── providers/
│   │   ├── SupabaseProvider.tsx  ← Supabase client context
│   │   └── TimerProvider.tsx     ← Timer lifecycle (ticking, recovery)
│   ├── sounds/
│   │   └── AmbientSoundBoard.tsx ← Lo-fi / rain / café sounds
│   ├── pwa/
│   │   └── InstallPrompt.tsx
│   └── ui/                       ← shadcn/ui components (auto-generated)
│
├── hooks/
│   ├── useTimer.ts               ← Timer actions with Supabase side effects
│   ├── useFriends.ts             ← Fetch + subscribe to friends' data
│   └── useRealtime.ts            ← All Supabase realtime subscriptions
│
├── stores/
│   ├── useTimerStore.ts          ← Zustand: elapsed, isRunning, segments
│   ├── useUserStore.ts           ← Zustand: profile, avatar, streak
│   └── useFriendStore.ts         ← Zustand: friends list + live status
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts             ← createBrowserClient()
│   │   └── server.ts             ← createServerClient()
│   ├── avatars.ts                ← 12 emoji avatar definitions
│   ├── timer.ts                  ← secondsToHHMMSS(), formatDuration()
│   └── utils.ts                  ← cn(), todayLocalDate()
│
├── types/
│   └── database.ts               ← Supabase type gen output
│
├── supabase/
│   └── schema.sql                ← Full DB schema (one-time run)
│
├── emails/                       ← HTML email templates
│   ├── welcome.html
│   ├── verification.html
│   ├── password_reset.html
│   ├── streak.html
│   └── weekly_summary.html
│
└── middleware.ts                  ← Auth guard
```

---

## 9. State Management Patterns

### Timer Store

```typescript
// stores/useTimerStore.ts
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface Segment {
  id: string
  subject: string | null
  startedAt: string
  endedAt: string | null
  durationSeconds: number | null
}

interface TimerState {
  isRunning: boolean
  elapsed: number
  activeSegmentId: string | null
  segments: Segment[]
  // Actions
  setRunning: (val: boolean) => void
  tick: () => void
  setActiveSegmentId: (id: string | null) => void
  addSegment: (seg: Segment) => void
  updateSegment: (id: string, patch: Partial<Segment>) => void
  resetDay: () => void
}

export const useTimerStore = create<TimerState>()(
  immer((set) => ({
    isRunning: false,
    elapsed: 0,
    activeSegmentId: null,
    segments: [],
    setRunning: (val) => set((s) => { s.isRunning = val }),
    tick: () => set((s) => { s.elapsed += 1 }),
    setActiveSegmentId: (id) => set((s) => { s.activeSegmentId = id }),
    addSegment: (seg) => set((s) => { s.segments.unshift(seg) }),
    updateSegment: (id, patch) => set((s) => {
      const i = s.segments.findIndex(seg => seg.id === id)
      if (i !== -1) Object.assign(s.segments[i], patch)
    }),
    resetDay: () => set((s) => { s.segments = []; s.elapsed = 0 }),
  }))
)
```

### User Store

```typescript
// stores/useUserStore.ts
import { create } from 'zustand'

interface UserState {
  id: string | null
  fullName: string | null
  avatarEmoji: string
  referralCode: string | null
  streakCount: number
  setUser: (user: Partial<UserState>) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>((set) => ({
  id: null,
  fullName: null,
  avatarEmoji: '🦊',
  referralCode: null,
  streakCount: 0,
  setUser: (user) => set((s) => ({ ...s, ...user })),
  clearUser: () => set({ id: null, fullName: null, referralCode: null }),
}))
```

---

## 10. Real-Time with Supabase

### Key pattern: subscribe after auth, clean up on logout

```typescript
// hooks/useRealtime.ts
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useFriendStore } from '@/stores/useFriendStore'

export function useRealtime(userId: string | null) {
  const supabase = createClient()
  const { updateFriendSegment, updateFriendTodo } = useFriendStore()

  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel(`realtime-${userId}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'session_segments'
      }, (payload) => {
        // Only process friends' changes (RLS filters out strangers already)
        if (payload.new && 'user_id' in payload.new) {
          updateFriendSegment(payload.new as any)
        }
      })
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'todos'
      }, (payload) => {
        if (payload.new && 'user_id' in payload.new) {
          updateFriendTodo(payload.new as any)
        }
      })
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'friend_requests',
        filter: `receiver_id=eq.${userId}`
      }, () => {
        toast.info('You have a new friend request!')
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId])
}
```

---

## 11. Row Level Security (RLS)

### The Core Principle

> Every table row is only readable/writable by the **owner** or their **confirmed friends**. No exceptions.

### Key RLS patterns

```sql
-- Pattern 1: Own data only
CREATE POLICY "own" ON todos FOR ALL USING (auth.uid() = user_id);

-- Pattern 2: Friends can read
CREATE POLICY "friends_read" ON todos FOR SELECT
  USING (are_friends(auth.uid(), user_id));

-- Pattern 3: Participants only (for friend_requests)
CREATE POLICY "participants" ON friend_requests FOR ALL
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
```

### Testing RLS in SQL Editor

Always test your policies directly in the SQL editor using:

```sql
-- Test as a specific user
SET request.jwt.claims TO '{"sub": "user-uuid-here"}';
SET role TO authenticated;

SELECT * FROM todos;  -- Should only return that user's todos + friends' todos
```

---

## 12. Design System Reference

### CSS Variables (in `globals.css`)

```css
:root {
  --background: #0a0a0f;       /* Page background */
  --surface: #12121a;          /* Card backgrounds */
  --surface-strong: #1a1a27;   /* Elevated cards */
  --border: #2a2a3d;           /* All borders */
  --text-primary: #e2e8f0;     /* Main text */
  --text-muted: #64748b;       /* Secondary text */
  
  /* Accent colors */
  --primary: #6c63ff;          /* Violet — buttons, active states */
  --teal: #2dd4bf;             /* Heatmap, success, links */
  --amber: #f59e0b;            /* Streaks, gamification */
  --destructive: #ef4444;      /* Delete, error */
}
```

### Flame Animation (for heatmap)

```css
/* globals.css */
@keyframes flame-organic {
  0%   { transform: scale(1)    rotate(-1deg) skewX(0deg);   }
  15%  { transform: scale(1.05) rotate(1.5deg) skewX(1deg);  }
  30%  { transform: scale(0.97) rotate(-2deg) skewX(-1deg);  }
  50%  { transform: scale(1.08) rotate(1deg)  skewX(2deg);   }
  70%  { transform: scale(0.95) rotate(-1.5deg) skewX(-1deg); }
  85%  { transform: scale(1.03) rotate(2deg)  skewX(1deg);   }
  100% { transform: scale(1)    rotate(-1deg) skewX(0deg);   }
}

@keyframes flame-glow-pulse-amber {
  0%, 100% { filter: drop-shadow(0 0 4px #f59e0b80); }
  50%       { filter: drop-shadow(0 0 10px #f59e0bcc); }
}

.flame {
  animation: flame-organic 2s ease-in-out infinite,
             flame-glow-pulse-amber 2s ease-in-out infinite;
  transform-origin: bottom center;
  display: inline-block;
}
```

### Applying staggered delays (for heatmap cells)

```typescript
// In StreakHeatmap.tsx
{cells.map((cell, index) => (
  <div
    key={cell.date}
    style={{ animationDelay: `${(index * 137) % 1000}ms` }}
    className={cell.hasStudy ? 'flame' : ''}
  >
    {cell.hasStudy ? '🔥' : '☁️'}
  </div>
))}
```

### Typography

```typescript
// app/layout.tsx — import from Google Fonts
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-heading' })
const inter = Inter({ subsets: ['latin'], variable: '--font-body' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })
```

### Emoji Avatar System

```typescript
// lib/avatars.ts
export const AVATARS = [
  { emoji: '🦊', label: 'Fox' },
  { emoji: '🚀', label: 'Rocket' },
  { emoji: '🦉', label: 'Owl' },
  { emoji: '🐉', label: 'Dragon' },
  { emoji: '🤖', label: 'Robot' },
  { emoji: '🥷', label: 'Ninja' },
  { emoji: '👨‍🚀', label: 'Astronaut' },
  { emoji: '🧙', label: 'Wizard' },
  { emoji: '🐼', label: 'Panda' },
  { emoji: '🐯', label: 'Tiger' },
  { emoji: '🔥', label: 'Fire' },
  { emoji: '👻', label: 'Ghost' },
] as const
```

---

## 13. Common Gotchas & Fixes

| Problem | Root Cause | Fix |
|---|---|---|
| Timer resets on navigation | `elapsed` state lost on remount | Keep timer state in Zustand + `TimerProvider` at root layout |
| RLS blocking friend data reads | Missing friendship row | Always insert friendship via `accept_friend_request()` function — never manually |
| `sendBeacon` not firing | Called too early before unload | Register the `beforeunload` handler inside `useEffect` in `TimerProvider` |
| Supabase realtime not firing | Table not added to publication | Run the `CREATE PUBLICATION` SQL and enable replication in dashboard |
| PWA not installing | `manifest.json` not found | Ensure `next-pwa` config points to correct public folder; check `start_url` matches |
| Todos exceed 20 in DB | No DB-level constraint | Add `CHECK` constraint: `ALTER TABLE todos ADD CONSTRAINT max_todos ...` or handle via RLS function |
| Auth session lost on hard refresh | Missing `updateSession` in middleware | Call `supabase.auth.updateSession()` in `middleware.ts` on every request |
| TypeScript errors from Supabase types | Stale generated types | Re-run: `npx supabase gen types typescript --project-id YOUR_ID > types/database.ts` |
| Hydration mismatch on timer | Server renders "00:00:00", client has real value | Use `suppressHydrationWarning` on the timer span, or only render timer client-side |
| Drag-and-drop broken on mobile | Missing touch sensors | Add `TouchSensor` from `@dnd-kit/core` alongside `PointerSensor` |

---

## 14. Deployment Checklist

### Pre-deployment

```bash
npm run typecheck    # Must show 0 errors
npm run build        # Must exit code 0 — check for any build-time errors
npm run lint         # Fix all ESLint warnings
```

### Supabase Production Setup

- [ ] Set `Site URL` to production domain in Auth settings
- [ ] Add production domain to `Redirect URLs` whitelist
- [ ] Enable email confirmations
- [ ] Paste HTML email templates (from `emails/` folder) into Supabase Auth templates
- [ ] Verify RLS is enabled on all tables
- [ ] Confirm realtime publication includes `session_segments`, `todos`, `friend_requests`

### Vercel Deployment

```bash
# 1. Push to GitHub
git push origin main

# 2. Import on vercel.com → New Project → Import from GitHub

# 3. Set environment variables in Vercel dashboard:
#    NEXT_PUBLIC_SUPABASE_URL
#    NEXT_PUBLIC_SUPABASE_ANON_KEY
#    SUPABASE_SERVICE_ROLE_KEY
#    NEXT_PUBLIC_APP_URL   ← set to https://yourdomain.com

# 4. Deploy → check build logs
```

### Post-deployment verification

- [ ] Sign up creates a profile (check `profiles` table in Supabase)
- [ ] Timer saves segments to `session_segments`
- [ ] Friend add via referral code works end-to-end
- [ ] Real-time updates fire on a second browser window
- [ ] PWA install prompt appears on landing page on mobile
- [ ] `sendBeacon` finalizes segment when tab is closed (check `ended_at` is not null)

---

## 15. Codex Cheat Sheet

Quick-reference prompts for the trickiest parts. Paste directly into Copilot Chat or Cursor.

### Generate Supabase types

```bash
npx supabase gen types typescript \
  --project-id YOUR_SUPABASE_PROJECT_ID \
  --schema public > types/database.ts
```

### Format seconds as HH:MM:SS

```typescript
// Prompt: "Write a TypeScript function secondsToHHMMSS(seconds: number): string"
export function secondsToHHMMSS(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':')
}
```

### Today's date in local timezone (avoid UTC off-by-one)

```typescript
// Prompt: "Get today's date as YYYY-MM-DD in the user's local timezone"
export function todayLocalDate(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
```

### Batch update todo sort order

```typescript
// Prompt: "Update sort_order for multiple todos in Supabase after drag-reorder"
async function saveSortOrder(todos: { id: string; sortOrder: number }[]) {
  const updates = todos.map(t =>
    supabase.from('todos').update({ sort_order: t.sortOrder }).eq('id', t.id)
  )
  await Promise.all(updates)
}
```

### Confetti on segment edit honesty

```typescript
import confetti from 'canvas-confetti'

// Prompt: "Fire confetti with school-pride colors (violet + teal)"
function fireHonestyConfetti() {
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.6 },
    colors: ['#6c63ff', '#2dd4bf', '#f59e0b'],
  })
}
```

### Ambient sound toggle (HTML5 Audio)

```typescript
// Prompt: "React hook to toggle an ambient sound loop with volume control"
function useAmbientSound(url: string) {
  const audio = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    audio.current = new Audio(url)
    audio.current.loop = true
    audio.current.volume = 0.4
    return () => { audio.current?.pause() }
  }, [url])

  const toggle = () => {
    if (!audio.current) return
    if (playing) { audio.current.pause() }
    else { audio.current.play() }
    setPlaying(p => !p)
  }

  return { playing, toggle }
}
```

---

## Final Tips for Building with AI

1. **Write types first.** Define your `database.ts` types and Zustand store types before writing any component. Codex completions are dramatically better with full TypeScript context.

2. **Break prompts into single responsibilities.** "Build the entire timer system" gives mediocre output. "Create the Zustand timer store" → "Create the TimerProvider that uses the store" → "Create the TimerPanel UI that reads the store" gives excellent output for each piece.

3. **Always review RLS.** AI-generated SQL policies often miss edge cases. Test every policy manually in the Supabase SQL editor before going to production.

4. **Use Cursor's `@codebase` for context.** If you're using Cursor, referencing `@useTimerStore` when prompting for `TimerPanel.tsx` gives the AI the exact types it needs.

5. **Commit after each phase.** The build plan above has 6 phases. Commit a working version at the end of each one. It's much easier to debug one feature at a time than a broken everything.

---

*Built on the StudySync README by Dinesh YDK — [github.com/DINESHYDK/Study_Sync](https://github.com/DINESHYDK/Study_Sync)*