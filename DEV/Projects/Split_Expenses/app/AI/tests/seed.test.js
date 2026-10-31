import test from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { openDatabase } from "../src/database.js";

const run = promisify(execFile);
const script = fileURLToPath(new URL("../scripts/seed.js", import.meta.url));

test("seeding is repeatable, preserves edits/deletions, and refuses production", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "split-seed-test-"));
  t.after(async () => {
    assert.equal(dirname(resolve(directory)), resolve(tmpdir()));
    assert.ok(basename(directory).startsWith("split-seed-test-"));
    await rm(directory, { recursive: true, force: true });
  });
  const filename = join(directory, "demo.sqlite");
  const env = {
    ...process.env,
    DATABASE_PATH: filename,
    NODE_ENV: "development",
  };
  await run(process.execPath, [script], { env });
  await run(process.execPath, [script], { env });
  let db = openDatabase(filename);
  assert.equal(db.prepare("SELECT count(*) AS n FROM users").get().n, 3);
  assert.equal(db.prepare("SELECT count(*) AS n FROM expenses").get().n, 1);
  db.prepare("DELETE FROM expenses WHERE id = 'demo-dinner'").run();
  db.close();
  await run(process.execPath, [script], { env });
  db = openDatabase(filename);
  assert.equal(db.prepare("SELECT count(*) AS n FROM expenses").get().n, 0);
  db.close();
  await assert.rejects(
    run(process.execPath, [script], {
      env: { ...env, NODE_ENV: "production" },
    }),
    /disabled in production/,
  );
});
