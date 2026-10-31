import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

export function openDatabase(filename) {
  if (filename !== ":memory:")
    mkdirSync(dirname(filename), { recursive: true });
  const db = new DatabaseSync(filename);
  db.exec(
    "PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000;",
  );
  // Version 1 is intentionally small. Future schema changes belong in ordered migrations.
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_version (version INTEGER PRIMARY KEY);
    INSERT OR IGNORE INTO schema_version VALUES (1);
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) STRICT;
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id),
      csrf TEXT NOT NULL, expires_at INTEGER NOT NULL
    ) STRICT;
    CREATE INDEX IF NOT EXISTS sessions_expiry ON sessions(expires_at);
    CREATE TABLE IF NOT EXISTS groups (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, owner_id TEXT NOT NULL REFERENCES users(id),
      currency TEXT NOT NULL DEFAULT 'INR' CHECK(currency = 'INR'),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) STRICT;
    CREATE TABLE IF NOT EXISTS memberships (
      group_id TEXT NOT NULL REFERENCES groups(id), user_id TEXT NOT NULL REFERENCES users(id),
      joined_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (group_id, user_id)
    ) STRICT;
    CREATE INDEX IF NOT EXISTS memberships_user ON memberships(user_id);
    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY, group_id TEXT NOT NULL REFERENCES groups(id),
      payer_id TEXT NOT NULL, creator_id TEXT NOT NULL,
      description TEXT NOT NULL CHECK(length(description) BETWEEN 1 AND 160),
      amount INTEGER NOT NULL CHECK(amount BETWEEN 1 AND 100000000),
      split_mode TEXT NOT NULL CHECK(split_mode IN ('equal', 'custom')),
      date TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1 CHECK(version > 0),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(id, group_id),
      FOREIGN KEY(group_id, payer_id) REFERENCES memberships(group_id, user_id),
      FOREIGN KEY(group_id, creator_id) REFERENCES memberships(group_id, user_id)
    ) STRICT;
    CREATE INDEX IF NOT EXISTS expenses_group ON expenses(group_id, date DESC, id);
    CREATE TABLE IF NOT EXISTS shares (
      expense_id TEXT NOT NULL, group_id TEXT NOT NULL, user_id TEXT NOT NULL,
      amount INTEGER NOT NULL CHECK(amount BETWEEN 0 AND 100000000),
      PRIMARY KEY(expense_id, user_id),
      FOREIGN KEY(expense_id, group_id) REFERENCES expenses(id, group_id) ON DELETE CASCADE,
      FOREIGN KEY(group_id, user_id) REFERENCES memberships(group_id, user_id)
    ) STRICT;
    CREATE TABLE IF NOT EXISTS settlements (
      id TEXT PRIMARY KEY, group_id TEXT NOT NULL REFERENCES groups(id),
      sender_id TEXT NOT NULL, receiver_id TEXT NOT NULL, recorder_id TEXT NOT NULL,
      amount INTEGER NOT NULL CHECK(amount BETWEEN 1 AND 100000000), date TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, CHECK(sender_id != receiver_id),
      FOREIGN KEY(group_id, sender_id) REFERENCES memberships(group_id, user_id),
      FOREIGN KEY(group_id, receiver_id) REFERENCES memberships(group_id, user_id),
      FOREIGN KEY(group_id, recorder_id) REFERENCES memberships(group_id, user_id)
    ) STRICT;
    CREATE INDEX IF NOT EXISTS settlements_group ON settlements(group_id, date DESC, id);
  `);
  return db;
}

// No await is allowed inside this callback. Every balance-changing operation takes
// the SQLite write lock before reading current balances, even across server processes.
export function transaction(db, work) {
  db.exec("BEGIN IMMEDIATE");
  try {
    const result = work();
    db.exec("COMMIT");
    return result;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export const publicUser = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
});

export function membersFor(db, groupId) {
  return db
    .prepare(
      `SELECT u.id, u.name, u.email FROM memberships m
    JOIN users u ON u.id = m.user_id WHERE m.group_id = ? ORDER BY u.id`,
    )
    .all(groupId);
}

export function recordsFor(db, groupId) {
  const expenses = db
    .prepare(
      `SELECT id, group_id AS groupId, payer_id AS payerId,
    creator_id AS creatorId, description, amount, split_mode AS splitMode, date, version,
    created_at AS createdAt FROM expenses WHERE group_id = ? ORDER BY date DESC, created_at DESC, id DESC`,
    )
    .all(groupId);
  const shares = db
    .prepare(
      `SELECT expense_id AS expenseId, user_id AS userId, amount
    FROM shares WHERE group_id = ? ORDER BY expense_id, user_id`,
    )
    .all(groupId);
  const settlements = db
    .prepare(
      `SELECT id, sender_id AS senderId, receiver_id AS receiverId,
    recorder_id AS recorderId, amount, date, created_at AS createdAt FROM settlements
    WHERE group_id = ? ORDER BY date DESC, created_at DESC, id DESC`,
    )
    .all(groupId);
  return { expenses, shares, settlements };
}
