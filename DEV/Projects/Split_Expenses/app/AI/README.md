# Split Expenses reference implementation

This application exists only on the `ai/split-expenses` branch, inside `app/AI/`. The shared HTML guides and Dinesh/Eswar workspaces are unchanged. The common starting commit is `d0347b2`, which adds the two personal READMEs on `master`.

For the independent December build, use your own folder and the HTML workbook. Compare this implementation after you finish your own approach.

## Run locally

Use **Node.js 22.13 or later** and npm. This app uses Node's built-in SQLite driver, so no separate database server, compiler, frontend bundler, or account keys are required. Node 22.13 prints an experimental SQLite warning; that is expected.

From the repo root:

```powershell
cd DEV/Projects/Split_Expenses/app/AI
npm ci
npm run seed
npm start
```

Open **http://127.0.0.1:3000**. `npm run seed` is optional: without it, register an account and create a group yourself. `npm run dev` restarts the server when its files change. Refresh the browser after changing frontend files.

The local demo has a group called **Weekend trip**, three members, and a Rs. 900 dinner paid by Dinesh. Sign in with any of these demo accounts:

| Email                 | Demo password      |
| --------------------- | ------------------ |
| `dinesh@example.test` | `DemoExpense2026!` |
| `eswar@example.test`  | `DemoExpense2026!` |
| `priya@example.test`  | `DemoExpense2026!` |

These are public sample credentials for local use. The seed command refuses to run with `NODE_ENV=production`. Running it again keeps existing demo expenses, edits, repayments, and deletions; it does not reset the database. Use a separate `DATABASE_PATH` if you want a fresh demo.

## What works

- Register, sign in, restore a session after refresh, and sign out.
- Create groups, list only your own groups, and add existing registered users by email as an owner.
- Create expenses with one payer and any selected group participants, including expenses that exclude the payer.
- Equal splits conserve paise and use stable user-ID order for the remainder. Custom amounts support zero shares and must sum exactly to the expense total.
- View expense history, search descriptions/payers, and read each member's signed balance.
- Edit or delete an expense as its creator or group owner. Edits replace all old shares atomically; stale versions are rejected. The edit dialog can reload the latest version explicitly.
- Record partial/full repayments as the sender or owner, validate them against current balances, and keep repayment history even after expense edits or deletion.
- Suggest a valid group-net repayment plan. Suggestions do not record a payment or claim a minimum number of transfers.
- Use the interface on desktop and phone, including keyboard-accessible native dialogs and labeled form controls.

This is the workbook's core scope. Email invitations, membership removal, password recovery, email verification, real payment processing, receipts, multi-currency support, advanced history/audit trails, and pagination are not implemented.

## Read the code in this order

| File                                       | What to understand                                                                    |
| ------------------------------------------ | ------------------------------------------------------------------------------------- |
| [src/money.js](src/money.js)               | The exact money rules, invariants, and suggested transfers. No HTTP or database code. |
| [tests/money.test.js](tests/money.test.js) | The workbook examples as exact integer assertions.                                    |
| [src/database.js](src/database.js)         | Tables, relationships, constraints, and `BEGIN IMMEDIATE` transactions.               |
| [src/security.js](src/security.js)         | Password hashing, hashed session tokens, cookies, and CSRF tokens.                    |
| [src/app.js](src/app.js)                   | Validation, authentication, permissions, atomic operations, and API responses.        |
| [public/index.html](public/index.html)     | The screens and forms before any rendering logic.                                     |
| [public/app.js](public/app.js)             | Requests, state, forms, rendering, error handling, and share previews.                |
| [public/money.js](public/money.js)         | Strict decimal parsing and browser-only display/preview helpers.                      |
| [public/styles.css](public/styles.css)     | Responsive layout, visible focus states, and the visual design.                       |
| [tests/api.test.js](tests/api.test.js)     | Persistence, access checks, rollback, concurrent requests, and stale edits.           |
| [src/server.js](src/server.js)             | Runtime configuration and graceful shutdown.                                          |

Comments explain the decisions that are easy to get wrong: sign direction, deterministic rounding, replacing shares, session storage, CSRF, conditional updates, and SQLite locking.

The main flow is:

```text
Form input → decimal string parsed to integer paise → JSON request
    → verified session + permission checks → validated money operation
    → one database transaction → refreshed group snapshot → rendered UI
```

The browser's preview is a convenience. The server independently calculates and validates every stored share. Balances are derived from current expense shares and settlement records; there is no cached balance column to drift out of sync.

## Data and concurrency decisions

- Currency is INR. Individual expenses and repayments are limited to **100,000,000 paise (Rs. 1,000,000)**. Group totals are checked for JavaScript safe-integer overflow.
- A group has at most 100 members. Membership is retained so historical shares never change when another person joins.
- Composite foreign keys ensure payers, creators, participants, and repayment parties belong to the right group. Unique expense/member pairs prevent duplicate shares.
- All balance-changing writes acquire the SQLite write lock **before** reading current balances. `BEGIN IMMEDIATE` plus rollback protects expense/share replacement and concurrent repayment caps. The callbacks contain no asynchronous waits.
- Edits carry an expected version, and the version comparison is included in the update itself. Deletes require the expected version too.
- Expense deletion is a hard delete with cascading share deletion. Repayments remain; the resulting balance may reverse who owes whom.
- Group snapshots also use a transaction to read one consistent view. All group history is currently loaded at once; this implementation is intended for small groups and a single server, not high-throughput traffic.

## API shape

Except registration/login and health, every API operation needs the session cookie. Mutations need `Content-Type: application/json` and `X-CSRF-Token`, obtained from login, registration, or `GET /api/auth/me`. Requests from another origin are rejected. IDs for the acting user always come from the verified session.

| Method and route                             | Purpose                                                |
| -------------------------------------------- | ------------------------------------------------------ |
| `GET /api/health`                            | Health response                                        |
| `POST /api/auth/register`                    | `{name, email, password}`; returns user and CSRF token |
| `POST /api/auth/login`                       | `{email, password}`; returns user and CSRF token       |
| `GET /api/auth/me`                           | Restore the current session and CSRF token             |
| `POST /api/auth/logout`                      | Invalidate the current session                         |
| `GET/POST /api/groups`                       | List your groups or create `{name}`                    |
| `GET /api/groups/:id`                        | Consistent group snapshot                              |
| `POST /api/groups/:id/members`               | Owner adds `{email}` of an existing user               |
| `GET/POST /api/groups/:id/expenses`          | Read history or create an expense                      |
| `PATCH /api/groups/:id/expenses/:expenseId`  | Replace the expense using its expected `version`       |
| `DELETE /api/groups/:id/expenses/:expenseId` | Delete using `{version}`                               |
| `GET /api/groups/:id/balances`               | Member balances and suggested transfers                |
| `GET/POST /api/groups/:id/settlements`       | Read or record repayments                              |

An equal expense uses:

```json
{
  "description": "Friday dinner",
  "amount": 90000,
  "date": "2026-12-01",
  "payerId": "a-member-id",
  "splitMode": "equal",
  "participants": [
    { "userId": "a-member-id" },
    { "userId": "another-member-id" }
  ]
}
```

For custom splits, use `"splitMode": "custom"` and supply integer `amount` paise on each participant. An edit adds `"version": 1` (or the currently opened version). A repayment uses `{senderId, receiverId, amount, date}`.

Successful group mutations return the updated group snapshot, including members with balances, expenses with stored shares, settlements, suggestions, and total spending. Errors use `{ "error": "A useful message" }`. `401` means sign-in is needed, `403` rejects an action, `404` hides unavailable resources, `409` indicates stale/conflicting data, and `429` indicates rate limiting.

## Checks

```powershell
npm run check
npm test
npm audit
```

The test suite uses temporary databases and local HTTP servers; it does not touch your app's saved records. It covers arithmetic/rounding, custom totals, invalid requests, permissions, malformed JSON, CSRF, logout/expiry, secure production cookies, rollback after a failed share insert, competing edits/repayments, restarting with saved sessions/data, and repeatable demo seeding.

For a manual browser check:

1. Sign in as Dinesh in the local demo. Expect +Rs. 600, -Rs. 300, -Rs. 300.
2. Edit dinner to Rs. 1,200. Expect +800, -400, -400. Refresh and confirm it remains saved.
3. Edit back to Rs. 900, then change shares to 200/300/400. Expect +700, -300, -400.
4. Record Eswar paying Dinesh Rs. 100. Expect +600, -200, -400.
5. Open an expense in two tabs. Save one, then try saving the other. Expect a conflict and an explicit reload option.
6. Sign in as a different group member and verify the creator/owner restrictions. Register an outsider and confirm they cannot read the group by guessing its ID.
7. Stop the backend during a save; verify the form remains available with an error. Test again at phone width.

The UI prevents repeat clicks while a request is pending. A network timeout after a successful server write can still leave an ambiguous outcome; inspect history before manually retrying. Server-side idempotency keys remain an optional extension.

## Configuration and deployment

| Variable        | Default                         | Meaning                                                                                     |
| --------------- | ------------------------------- | ------------------------------------------------------------------------------------------- |
| `PORT`          | `3000`                          | Listening port                                                                              |
| `HOST`          | `127.0.0.1`                     | Bind address; use `0.0.0.0` on a host/container                                             |
| `DATABASE_PATH` | `AI/data/split-expenses.sqlite` | SQLite file; relative overrides resolve from your current working directory                 |
| `NODE_ENV`      | Development                     | Set to `production` for secure cookies and production headers                               |
| `APP_ORIGIN`    | Local request origin            | Required HTTPS origin in production, without a trailing slash                               |
| `TRUST_PROXY`   | Off                             | Set to `1` only behind exactly one controlled reverse proxy with no direct untrusted access |

Configuration comes from the process environment; this app does not automatically load `.env` files. For example, these PowerShell assignments configure a deployment process (replace the origin and persistent path for your host):

```powershell
$env:NODE_ENV = 'production'
$env:HOST = '0.0.0.0'
$env:APP_ORIGIN = 'https://split.your-domain.example'
$env:DATABASE_PATH = 'C:/persistent-data/split-expenses.sqlite'
npm ci --omit=dev
npm start
```

Use a Node host with a persistent disk and HTTPS termination. Configure its environment, install with `npm ci`, and start with `npm start`. There is no separate frontend build. Check `/api/health`, register real accounts, and verify the deployed flow. Do not run the public demo seed in production. This repository includes run instructions; no external deployment is created automatically.

Only enable `TRUST_PROXY=1` when the deployment topology matches that setting. The rate limiter uses an in-memory per-IP store and resets with the process; a multi-instance deployment needs a shared limiter store. SQLite reads/writes here are synchronous and share one writer lock. For larger workloads, migrate the database and query strategy deliberately.

Back up the database with SQLite's online backup mechanism or stop the app before copying the database files. WAL mode can keep recent data in a separate `-wal` file while the server runs. The local `data/` folder, SQLite files, environment files, and dependencies are ignored by Git.

Authentication deliberately has no email verification, account recovery, or multi-factor flow. Add those features and operational monitoring before treating this as a general public account service.

## References behind the choices

- [Node SQLite documentation](https://nodejs.org/api/sqlite.html) for the built-in database API.
- [Node crypto documentation](https://nodejs.org/api/crypto.html) for scrypt, secure randomness, and timing-safe comparisons.
- [OWASP password storage guidance](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) for the scrypt cost choice (`N=32768`, `r=8`, `p=3`).
- [Express production security guidance](https://expressjs.com/en/advanced/best-practice-security/) and [Helmet](https://helmet.js.org/) for HTTP headers and deployment settings.
- [express-rate-limit configuration](https://express-rate-limit.mintlify.app/reference/configuration) for rate-limit behavior and store limitations.
