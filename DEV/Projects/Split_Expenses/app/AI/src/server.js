import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createApp } from "./app.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const production = process.env.NODE_ENV === "production";
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "127.0.0.1";
const origin = process.env.APP_ORIGIN || null;
if (!Number.isInteger(port) || port < 1 || port > 65535)
  throw Error("PORT must be between 1 and 65535.");
if (origin && new URL(origin).origin !== origin)
  throw Error("APP_ORIGIN must be an origin without a path or trailing slash.");
if (production && (!origin || !origin.startsWith("https://")))
  throw Error("Production requires an HTTPS APP_ORIGIN.");

const { app, db } = createApp({
  databasePath: process.env.DATABASE_PATH
    ? resolve(process.env.DATABASE_PATH)
    : resolve(root, "data/split-expenses.sqlite"),
  production,
  origin,
  trustProxy: process.env.TRUST_PROXY === "1",
});
const server = app.listen(port, host, () =>
  console.log(`Split Expenses is running at http://${host}:${port}`),
);
server.on("error", (error) => {
  console.error(error.message);
  db.close();
  process.exitCode = 1;
});

// Stop accepting requests first; close the database after in-flight requests finish.
let stopping = false;
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => {
    if (stopping) return;
    stopping = true;
    server.close(() => {
      db.close();
    });
  });
