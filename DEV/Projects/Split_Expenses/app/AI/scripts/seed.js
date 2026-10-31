import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { openDatabase, transaction } from "../src/database.js";
import { hashPassword } from "../src/security.js";

// Demo credentials are deliberately public. Never seed them into a public deployment.
if (process.env.NODE_ENV === "production")
  throw Error("Demo seeding is disabled in production.");
const root = fileURLToPath(new URL("../", import.meta.url));
const filename = process.env.DATABASE_PATH
  ? resolve(process.env.DATABASE_PATH)
  : resolve(root, "data/split-expenses.sqlite");
const db = openDatabase(filename);
const demoPassword = "DemoExpense2026!";
const passwordHash = await hashPassword(demoPassword);
try {
  transaction(db, () => {
    const users = [
      ["demo-dinesh", "Dinesh"],
      ["demo-eswar", "Eswar"],
      ["demo-priya", "Priya"],
    ];
    for (const [id, name] of users) {
      const address = name.toLowerCase() + "@example.test";
      const existing = db
        .prepare("SELECT id FROM users WHERE email = ?")
        .get(address);
      if (existing && existing.id !== id)
        throw Error(
          `The demo email ${address} already belongs to another account. Use a separate demo database.`,
        );
      db.prepare(
        "INSERT OR IGNORE INTO users(id, name, email, password_hash) VALUES (?, ?, ?, ?)",
      ).run(id, name, address, passwordHash);
    }
    const existingGroup = db
      .prepare("SELECT 1 FROM groups WHERE id = 'demo-trip'")
      .get();
    db.prepare(
      "INSERT OR IGNORE INTO groups(id, name, owner_id) VALUES ('demo-trip', 'Weekend trip', 'demo-dinesh')",
    ).run();
    for (const [id] of users)
      db.prepare(
        "INSERT OR IGNORE INTO memberships(group_id, user_id) VALUES ('demo-trip', ?)",
      ).run(id);
    // Insert the example only when first creating this demo. Re-running never resets your edits.
    if (!existingGroup) {
      db.prepare(
        `INSERT INTO expenses(id, group_id, payer_id, creator_id, description, amount, split_mode, date)
        VALUES ('demo-dinner', 'demo-trip', 'demo-dinesh', 'demo-dinesh', 'Friday dinner', 90000, 'equal', '2026-12-01')`,
      ).run();
      for (const [id] of users)
        db.prepare(
          "INSERT INTO shares(expense_id, group_id, user_id, amount) VALUES ('demo-dinner', 'demo-trip', ?, 30000)",
        ).run(id);
    }
  });
  console.log(
    "Demo is ready. Sign in as dinesh@example.test, eswar@example.test, or priya@example.test.",
  );
  console.log("Demo password for all three accounts: " + demoPassword);
} finally {
  db.close();
}
