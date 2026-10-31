import express from "express";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import {
  openDatabase,
  transaction,
  publicUser,
  membersFor,
  recordsFor,
} from "./database.js";
import {
  AppError,
  requireThat,
  validateAmount,
  allocateShares,
  deriveBalances,
  suggestTransfers,
} from "./money.js";
import {
  hashPassword,
  verifyPassword,
  digest,
  readSessionToken,
  createSession,
  clearSession,
  requireCsrf,
} from "./security.js";

function text(value, label, max) {
  requireThat(
    typeof value === "string" &&
      value.trim().length >= 1 &&
      value.trim().length <= max,
    `${label} must contain between 1 and ${max} characters.`,
  );
  return value.trim();
}

function email(value) {
  const normalized = text(value, "Email", 254).toLowerCase();
  requireThat(
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized),
    "Enter a valid email address.",
  );
  return normalized;
}

function password(value) {
  requireThat(
    typeof value === "string" && value.length >= 12 && value.length <= 128,
    "Use a password between 12 and 128 characters.",
  );
  return value;
}

function date(value) {
  requireThat(
    typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value),
    "Choose a date in YYYY-MM-DD format.",
  );
  const parsed = new Date(value + "T00:00:00.000Z");
  requireThat(
    Number.isFinite(parsed.getTime()) &&
      parsed.toISOString().slice(0, 10) === value,
    "Choose a real calendar date.",
  );
  return value;
}

function version(value) {
  requireThat(
    Number.isSafeInteger(value) && value >= 1,
    "Include the version of the expense you opened.",
  );
  return value;
}

export function createApp({
  databasePath = ":memory:",
  production = false,
  origin = null,
  trustProxy = false,
  disableRateLimit = false,
  logger = console,
} = {}) {
  const db = openDatabase(databasePath);
  const app = express();
  app.disable("x-powered-by");
  if (trustProxy) app.set("trust proxy", 1);
  app.use(
    helmet({
      // All assets are local. Local HTTP development must not be upgraded to HTTPS.
      contentSecurityPolicy: {
        directives: {
          upgradeInsecureRequests: production ? [] : null,
          styleSrc: ["'self'"],
          scriptSrc: ["'self'"],
          connectSrc: ["'self'"],
          frameAncestors: ["'none'"],
        },
      },
      strictTransportSecurity: production ? undefined : false,
    }),
  );
  app.use(express.json({ limit: "32kb" }));
  app.use("/api", (req, res, next) => {
    res.set("Cache-Control", "no-store");
    // Same-origin JSON requests also protect sign-in/register from login CSRF.
    if (!["GET", "HEAD", "OPTIONS"].includes(req.method)) {
      const expectedOrigin = origin || `${req.protocol}://${req.get("host")}`;
      requireThat(
        !req.get("origin") || req.get("origin") === expectedOrigin,
        "Cross-origin changes are not allowed.",
        403,
      );
      requireThat(
        req.get("sec-fetch-site") !== "cross-site",
        "Cross-site changes are not allowed.",
        403,
      );
      requireThat(
        req.is("application/json"),
        "Send changes as application/json.",
        415,
      );
    }
    const token = readSessionToken(req);
    if (token) {
      const row = db
        .prepare(
          `SELECT u.id, u.name, u.email, s.csrf, s.expires_at AS expiresAt
        FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > ?`,
        )
        .get(digest(token), Date.now());
      if (row) {
        req.user = publicUser(row);
        req.session = { csrf: row.csrf };
      }
    }
    next();
  });
  if (!disableRateLimit) {
    const makeLimiter = (limit, message) =>
      rateLimit({
        windowMs: 15 * 60 * 1000,
        limit,
        standardHeaders: "draft-8",
        legacyHeaders: false,
        handler: (_req, res) => res.status(429).json({ error: message }),
      });
    app.use(
      "/api",
      makeLimiter(1000, "Too many requests. Please try again later."),
    );
    app.use(
      ["/api/auth/login", "/api/auth/register"],
      makeLimiter(30, "Too many sign-in attempts. Please try again later."),
    );
  }

  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
  app.get("/api/auth/me", (req, res) => {
    requireThat(req.user, "Sign in to continue.", 401);
    res.json({ user: req.user, csrf: req.session.csrf });
  });
  app.post("/api/auth/register", async (req, res) => {
    const name = text(req.body?.name, "Name", 60);
    const address = email(req.body?.email);
    const plain = password(req.body?.password);
    requireThat(
      !db.prepare("SELECT id FROM users WHERE email = ?").get(address),
      "An account with this email already exists.",
      409,
    );
    const passwordHash = await hashPassword(plain);
    const id = randomUUID();
    // Recheck after the asynchronous password hash: another request may have registered meanwhile.
    transaction(db, () => {
      requireThat(
        !db.prepare("SELECT id FROM users WHERE email = ?").get(address),
        "An account with this email already exists.",
        409,
      );
      db.prepare(
        "INSERT INTO users(id, name, email, password_hash) VALUES (?, ?, ?, ?)",
      ).run(id, name, address, passwordHash);
    });
    clearSession(db, req, res, production);
    const csrf = createSession(db, id, res, production);
    res.status(201).json({ user: { id, name, email: address }, csrf });
  });
  app.post("/api/auth/login", async (req, res) => {
    const address = email(req.body?.email);
    const plain = password(req.body?.password);
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(address);
    // Run the same costly hash path for an unknown address to reduce account timing differences.
    const dummy =
      "scrypt:32768:8:3:00000000000000000000000000000000:" + "00".repeat(64);
    const correct = await verifyPassword(plain, user?.password_hash || dummy);
    requireThat(user && correct, "Email or password is incorrect.", 401);
    clearSession(db, req, res, production);
    const csrf = createSession(db, user.id, res, production);
    res.json({ user: publicUser(user), csrf });
  });

  // Every route below this line requires a verified session; mutations also require its CSRF token.
  app.use("/api", (req, _res, next) => {
    requireThat(req.user, "Sign in to continue.", 401);
    if (!["GET", "HEAD", "OPTIONS"].includes(req.method)) requireCsrf(req);
    next();
  });
  app.post("/api/auth/logout", (req, res) => {
    clearSession(db, req, res, production);
    res.status(204).end();
  });

  function getGroup(id, userId) {
    const group = db
      .prepare(
        `SELECT g.id, g.name, g.owner_id AS ownerId, g.currency,
      g.created_at AS createdAt FROM groups g JOIN memberships m ON m.group_id = g.id
      WHERE g.id = ? AND m.user_id = ?`,
      )
      .get(id, userId);
    // A nonmember gets the same result as a nonexistent group, including nested resource reads.
    requireThat(group, "Group not found.", 404);
    return group;
  }

  function snapshot(groupId, userId) {
    const group = getGroup(groupId, userId);
    const members = membersFor(db, groupId);
    const records = recordsFor(db, groupId);
    const balances = deriveBalances(
      members.map((m) => m.id),
      records.expenses,
      records.shares,
      records.settlements,
    );
    const total = records.expenses.reduce(
      (sum, e) => sum + BigInt(e.amount),
      0n,
    );
    requireThat(
      total <= BigInt(Number.MAX_SAFE_INTEGER),
      "This group exceeds the supported spending range.",
      409,
    );
    return {
      group,
      members: members.map((m) => ({ ...m, balance: balances.get(m.id) })),
      expenses: records.expenses.map((e) => ({
        ...e,
        shares: records.shares.filter((s) => s.expenseId === e.id),
      })),
      settlements: records.settlements,
      suggestions: suggestTransfers(balances),
      totalSpent: Number(total),
    };
  }

  function expenseInput(body, groupId) {
    const description = text(body?.description, "Description", 160);
    const expenseDate = date(body?.date);
    const payerId = text(body?.payerId, "Payer", 100);
    const shares = allocateShares(
      body?.amount,
      body?.splitMode,
      body?.participants,
    );
    const ids = new Set(membersFor(db, groupId).map((m) => m.id));
    requireThat(
      ids.has(payerId) && shares.every((s) => ids.has(s.userId)),
      "Payer and participants must belong to this group.",
    );
    return {
      description,
      date: expenseDate,
      payerId,
      amount: body.amount,
      splitMode: body.splitMode,
      shares,
    };
  }

  function writeShares(expenseId, groupId, shares) {
    const insert = db.prepare(
      "INSERT INTO shares(expense_id, group_id, user_id, amount) VALUES (?, ?, ?, ?)",
    );
    for (const share of shares)
      insert.run(expenseId, groupId, share.userId, share.amount);
  }

  app.get("/api/groups", (req, res) => {
    const groups = db
      .prepare(
        `SELECT g.id, g.name, g.owner_id AS ownerId, g.currency,
      g.created_at AS createdAt, (SELECT count(*) FROM memberships WHERE group_id = g.id) AS memberCount
      FROM groups g JOIN memberships m ON m.group_id = g.id
      WHERE m.user_id = ? ORDER BY g.created_at DESC, g.id`,
      )
      .all(req.user.id);
    res.json({ groups });
  });
  app.post("/api/groups", (req, res) => {
    const name = text(req.body?.name, "Group name", 80);
    const id = randomUUID();
    transaction(db, () => {
      db.prepare("INSERT INTO groups(id, name, owner_id) VALUES (?, ?, ?)").run(
        id,
        name,
        req.user.id,
      );
      db.prepare(
        "INSERT INTO memberships(group_id, user_id) VALUES (?, ?)",
      ).run(id, req.user.id);
    });
    res.status(201).json(transaction(db, () => snapshot(id, req.user.id)));
  });
  app.get("/api/groups/:groupId", (req, res) =>
    res.json(transaction(db, () => snapshot(req.params.groupId, req.user.id))),
  );
  app.get("/api/groups/:groupId/balances", (req, res) => {
    const data = transaction(db, () =>
      snapshot(req.params.groupId, req.user.id),
    );
    res.json({ members: data.members, suggestions: data.suggestions });
  });
  app.get("/api/groups/:groupId/expenses", (req, res) => {
    const data = transaction(db, () =>
      snapshot(req.params.groupId, req.user.id),
    );
    res.json({ expenses: data.expenses });
  });
  app.get("/api/groups/:groupId/settlements", (req, res) => {
    const data = transaction(db, () =>
      snapshot(req.params.groupId, req.user.id),
    );
    res.json({ settlements: data.settlements });
  });
  app.post("/api/groups/:groupId/members", (req, res) => {
    const address = email(req.body?.email);
    const result = transaction(db, () => {
      const group = getGroup(req.params.groupId, req.user.id);
      requireThat(
        group.ownerId === req.user.id,
        "Only the group owner can add members.",
        403,
      );
      const user = db
        .prepare("SELECT id FROM users WHERE email = ?")
        .get(address);
      requireThat(
        user,
        "No account with this email. Ask your friend to register first.",
        404,
      );
      const members = membersFor(db, group.id);
      requireThat(
        !members.some((m) => m.id === user.id),
        "This person is already a member.",
        409,
      );
      requireThat(
        members.length < 100,
        "A group can contain at most 100 members.",
      );
      db.prepare(
        "INSERT INTO memberships(group_id, user_id) VALUES (?, ?)",
      ).run(group.id, user.id);
      return snapshot(group.id, req.user.id);
    });
    res.status(201).json(result);
  });
  app.post("/api/groups/:groupId/expenses", (req, res) => {
    const result = transaction(db, () => {
      const group = getGroup(req.params.groupId, req.user.id);
      const e = expenseInput(req.body, group.id);
      const id = randomUUID();
      db.prepare(
        `INSERT INTO expenses(id, group_id, payer_id, creator_id, description, amount, split_mode, date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      ).run(
        id,
        group.id,
        e.payerId,
        req.user.id,
        e.description,
        e.amount,
        e.splitMode,
        e.date,
      );
      writeShares(id, group.id, e.shares);
      return snapshot(group.id, req.user.id);
    });
    res.status(201).json(result);
  });
  for (const method of ["patch", "delete"]) {
    app[method]("/api/groups/:groupId/expenses/:expenseId", (req, res) => {
      const result = transaction(db, () => {
        const group = getGroup(req.params.groupId, req.user.id);
        const old = db
          .prepare("SELECT * FROM expenses WHERE id = ? AND group_id = ?")
          .get(req.params.expenseId, group.id);
        requireThat(old, "Expense not found.", 404);
        requireThat(
          old.creator_id === req.user.id || group.ownerId === req.user.id,
          "Only the creator or owner can change this expense.",
          403,
        );
        const expected = version(req.body?.version);
        requireThat(
          old.version === expected,
          "This expense changed in another tab. Reload it before trying again.",
          409,
        );
        if (method === "delete") {
          db.prepare("DELETE FROM expenses WHERE id = ? AND version = ?").run(
            old.id,
            expected,
          );
        } else {
          const e = expenseInput(req.body, group.id);
          // Version is included in the write itself, not just the preceding check.
          const changed = db
            .prepare(
              `UPDATE expenses SET description = ?, amount = ?, payer_id = ?,
            split_mode = ?, date = ?, version = version + 1 WHERE id = ? AND version = ?`,
            )
            .run(
              e.description,
              e.amount,
              e.payerId,
              e.splitMode,
              e.date,
              old.id,
              expected,
            );
          requireThat(
            changed.changes === 1,
            "The expense changed. Reload it.",
            409,
          );
          db.prepare("DELETE FROM shares WHERE expense_id = ?").run(old.id);
          writeShares(old.id, group.id, e.shares);
        }
        // A successful edit never rewrites settlements or adds the old expense effect again.
        return snapshot(group.id, req.user.id);
      });
      res.json(result);
    });
  }
  app.post("/api/groups/:groupId/settlements", (req, res) => {
    const result = transaction(db, () => {
      const group = getGroup(req.params.groupId, req.user.id);
      const senderId = text(req.body?.senderId, "Sender", 100);
      const receiverId = text(req.body?.receiverId, "Receiver", 100);
      const amount = validateAmount(req.body?.amount);
      const settlementDate = date(req.body?.date);
      requireThat(senderId !== receiverId, "Choose two different members.");
      const current = snapshot(group.id, req.user.id);
      const balances = new Map(current.members.map((m) => [m.id, m.balance]));
      requireThat(
        balances.has(senderId) && balances.has(receiverId),
        "Both people must belong to this group.",
      );
      requireThat(
        senderId === req.user.id || group.ownerId === req.user.id,
        "Only the sender or group owner can record this repayment.",
        403,
      );
      const cap = Math.min(-balances.get(senderId), balances.get(receiverId));
      requireThat(
        amount <= cap,
        "The repayment exceeds the current debt or credit. Refresh balances and try again.",
        409,
      );
      db.prepare(
        `INSERT INTO settlements(id, group_id, sender_id, receiver_id, recorder_id, amount, date)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ).run(
        randomUUID(),
        group.id,
        senderId,
        receiverId,
        req.user.id,
        amount,
        settlementDate,
      );
      return snapshot(group.id, req.user.id);
    });
    res.status(201).json(result);
  });

  app.use("/api", (_req, _res, next) =>
    next(new AppError(404, "API route not found.")),
  );
  app.use(
    express.static(fileURLToPath(new URL("../public/", import.meta.url)), {
      etag: true,
      maxAge: 0,
    }),
  );
  app.use((_req, res) => res.status(404).type("text").send("Page not found."));
  app.use((error, _req, res, _next) => {
    let status = error.status || 500;
    if (
      error.code === "ERR_SQLITE_ERROR" &&
      /database is locked/.test(error.message)
    )
      status = 503;
    if (status >= 500) logger.error(error);
    const message =
      error.type === "entity.parse.failed"
        ? "Invalid JSON request."
        : status === 413
          ? "The request is too large."
          : status === 503
            ? "The database is busy. Please try again."
            : status >= 500
              ? "Something went wrong. Please try again."
              : error.message;
    res.status(status).json({ error: message });
  });
  return { app, db };
}
