import { randomBytes, scrypt, timingSafeEqual, createHash } from "node:crypto";
import { promisify } from "node:util";
import { requireThat } from "./money.js";

const deriveKey = promisify(scrypt);
// The cost is encoded with each password so it can be upgraded in a later migration.
const cost = 32768;
const options = { N: cost, r: 8, p: 3, maxmem: 64 * 1024 * 1024 };
const cookieName = "split_session";

export async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const key = await deriveKey(password, salt, 64, options);
  return `scrypt:${cost}:8:3:${salt}:${key.toString("hex")}`;
}

export async function verifyPassword(password, encoded) {
  const [algorithm, n, r, p, salt, hex] = encoded.split(":");
  if (
    algorithm !== "scrypt" ||
    Number(n) !== cost ||
    r !== "8" ||
    p !== "3" ||
    !salt ||
    !hex
  )
    return false;
  const expected = Buffer.from(hex, "hex");
  const actual = await deriveKey(password, salt, 64, options);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export const digest = (token) =>
  createHash("sha256").update(token).digest("hex");

export function readSessionToken(req) {
  const part = (req.headers.cookie || "")
    .split(";")
    .map((s) => s.trim())
    .find((s) => s.startsWith(cookieName + "="));
  if (!part) return null;
  const token = part.slice(cookieName.length + 1);
  return /^[a-f0-9]{64}$/.test(token) ? token : null;
}

export function createSession(db, userId, res, production) {
  const token = randomBytes(32).toString("hex");
  const csrf = randomBytes(32).toString("hex");
  const expires = Date.now() + 7 * 24 * 60 * 60 * 1000;
  db.prepare("DELETE FROM sessions WHERE expires_at <= ?").run(Date.now());
  db.prepare(
    "INSERT INTO sessions(token_hash, user_id, csrf, expires_at) VALUES (?, ?, ?, ?)",
  ).run(digest(token), userId, csrf, expires);
  // Only a hash of the opaque session token is stored in the database.
  res.cookie(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: production,
    path: "/",
    maxAge: expires - Date.now(),
  });
  return csrf;
}

export function clearSession(db, req, res, production) {
  const token = readSessionToken(req);
  if (token)
    db.prepare("DELETE FROM sessions WHERE token_hash = ?").run(digest(token));
  res.clearCookie(cookieName, {
    httpOnly: true,
    sameSite: "lax",
    secure: production,
    path: "/",
  });
}

export function requireCsrf(req) {
  // JSON + a custom header prevents a cross-site HTML form from acting as this user.
  const supplied = req.get("x-csrf-token") || "";
  requireThat(
    supplied.length === 64 && supplied === req.session.csrf,
    "Your session changed. Refresh the page and try again.",
    403,
  );
}
