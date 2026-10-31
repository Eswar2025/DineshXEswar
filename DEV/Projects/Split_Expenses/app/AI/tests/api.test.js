import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve, dirname, basename } from "node:path";
import { createApp } from "../src/app.js";
import { openDatabase } from "../src/database.js";

const demoPassword = "A-Test-Password-2026!";

async function fixture(t, options = {}) {
  const { app, db } = createApp({
    disableRateLimit: true,
    logger: { error() {} },
    ...options,
  });
  const server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  const base = "http://127.0.0.1:" + server.address().port;
  let closed = false;
  async function close() {
    if (closed) return;
    closed = true;
    await new Promise((resolve) => server.close(resolve));
    db.close();
  }
  t.after(close);
  function client() {
    return {
      cookie: "",
      csrf: "",
      user: null,
      async request(path, method = "GET", body, extra = {}) {
        const headers = {
          ...(this.cookie ? { cookie: this.cookie } : {}),
          ...(method !== "GET" ? { "Content-Type": "application/json" } : {}),
          ...(this.csrf ? { "X-CSRF-Token": this.csrf } : {}),
          ...extra,
        };
        const response = await fetch(base + "/api" + path, {
          method,
          headers,
          ...(method !== "GET" ? { body: JSON.stringify(body ?? {}) } : {}),
        });
        const cookies = response.headers.getSetCookie();
        if (cookies.length) this.cookie = cookies.at(-1).split(";")[0];
        const data = response.status === 204 ? null : await response.json();
        if (data?.csrf) {
          this.csrf = data.csrf;
          this.user = data.user;
        }
        return { status: response.status, data, headers: response.headers };
      },
    };
  }
  async function register(name) {
    const c = client();
    const result = await c.request("/auth/register", "POST", {
      name,
      email: name.toLowerCase() + "@example.test",
      password: demoPassword,
    });
    assert.equal(result.status, 201);
    return c;
  }
  async function group(owner, others = []) {
    let result = await owner.request("/groups", "POST", {
      name: "Weekend trip",
    });
    assert.equal(result.status, 201);
    const id = result.data.group.id;
    for (const c of others) {
      result = await owner.request(`/groups/${id}/members`, "POST", {
        email: c.user.email,
      });
      assert.equal(result.status, 201);
    }
    return { id, data: result.data };
  }
  const expense = (payer, participants, overrides = {}) => ({
    description: "Friday dinner",
    amount: 90000,
    date: "2026-12-01",
    payerId: payer.user.id,
    splitMode: "equal",
    participants: participants.map((c) => ({ userId: c.user.id })),
    ...overrides,
  });
  return { db, base, client, register, group, expense, close };
}

const balances = (data) =>
  Object.fromEntries(data.members.map((m) => [m.name, m.balance]));

test("authentication, hashed sessions, CSRF, origin checks, and logout", async (t) => {
  const f = await fixture(t);
  const user = await f.register("Dinesh");
  const me = await user.request("/auth/me");
  assert.equal(me.status, 200);
  assert.equal(me.headers.get("cache-control"), "no-store");
  const stored = f.db.prepare("SELECT * FROM users").get();
  assert.ok(stored.password_hash.startsWith("scrypt:32768:"));
  assert.ok(!stored.password_hash.includes(demoPassword));
  assert.notEqual(
    f.db.prepare("SELECT token_hash FROM sessions").get().token_hash,
    user.cookie.split("=")[1],
  );
  assert.equal(
    (
      await user.request(
        "/groups",
        "POST",
        { name: "Bad" },
        { "X-CSRF-Token": "" },
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await user.request(
        "/groups",
        "POST",
        { name: "Bad" },
        { Origin: "https://another.example" },
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await user.request(
        "/groups",
        "POST",
        { name: "Bad" },
        { "Content-Type": "text/plain" },
      )
    ).status,
    415,
  );
  const bad = f.client();
  assert.equal(
    (
      await bad.request("/auth/login", "POST", {
        email: "dinesh@example.test",
        password: "Wrong-password-2026",
      })
    ).status,
    401,
  );
  assert.equal(
    (
      await bad.request("/auth/login", "POST", {
        email: "nobody@example.test",
        password: demoPassword,
      })
    ).status,
    401,
  );
  const result = await bad.request("/auth/login", "POST", {
    email: "DINESH@example.test",
    password: demoPassword,
  });
  assert.equal(result.status, 200);
  assert.match(result.headers.get("set-cookie"), /HttpOnly/);
  assert.match(result.headers.get("set-cookie"), /SameSite=Lax/);
  assert.equal((await bad.request("/auth/logout", "POST")).status, 204);
  assert.equal((await bad.request("/auth/me")).status, 401);
  assert.equal((await f.client().request("/groups")).status, 401);
});

test("registration validates data, duplicate accounts, malformed JSON, and expired sessions", async (t) => {
  const f = await fixture(t),
    c = f.client();
  for (const body of [
    {},
    { name: "Dinesh", email: "bad", password: demoPassword },
    { name: "Dinesh", email: "d@example.test", password: "short" },
  ]) {
    assert.equal((await c.request("/auth/register", "POST", body)).status, 400);
  }
  const user = await f.register("Dinesh");
  assert.equal(
    (
      await c.request("/auth/register", "POST", {
        name: "Other",
        email: user.user.email,
        password: demoPassword,
      })
    ).status,
    409,
  );
  const malformed = await fetch(f.base + "/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{",
  });
  assert.equal(malformed.status, 400);
  f.db.prepare("UPDATE sessions SET expires_at = 1").run();
  assert.equal((await user.request("/auth/me")).status, 401);
});

test("group membership and resource ownership are enforced for reads and writes", async (t) => {
  const f = await fixture(t);
  const d = await f.register("Dinesh"),
    e = await f.register("Eswar"),
    p = await f.register("Priya"),
    outsider = await f.register("Outside");
  const g = await f.group(d, [e, p]);
  const other = await f.group(outsider);
  assert.equal((await outsider.request("/groups")).data.groups.length, 1);
  for (const suffix of ["", "/expenses", "/balances", "/settlements"])
    assert.equal(
      (await outsider.request(`/groups/${g.id}${suffix}`)).status,
      404,
    );
  assert.equal(
    (
      await e.request(`/groups/${g.id}/members`, "POST", {
        email: outsider.user.email,
      })
    ).status,
    403,
  );
  assert.equal(
    (
      await d.request(`/groups/${g.id}/members`, "POST", {
        email: e.user.email,
      })
    ).status,
    409,
  );
  const added = await d.request(
    `/groups/${g.id}/expenses`,
    "POST",
    f.expense(d, [d, e, p]),
  );
  const item = added.data.expenses[0];
  assert.equal(
    (
      await e.request(`/groups/${g.id}/expenses/${item.id}`, "PATCH", {
        ...f.expense(d, [d, e, p]),
        version: 1,
        creatorId: e.user.id,
      })
    ).status,
    403,
  );
  assert.equal(
    (
      await e.request(`/groups/${g.id}/expenses/${item.id}`, "DELETE", {
        version: 1,
      })
    ).status,
    403,
  );
  assert.equal(
    (
      await outsider.request(
        `/groups/${other.id}/expenses/${item.id}`,
        "DELETE",
        { version: 1 },
      )
    ).status,
    404,
  );
  const createdByMember = await e.request(
    `/groups/${g.id}/expenses`,
    "POST",
    f.expense(d, [d, e, p], {
      description: "Member created",
      creatorId: d.user.id,
    }),
  );
  const theirExpense = createdByMember.data.expenses.find(
    (x) => x.description === "Member created",
  );
  assert.equal(theirExpense.creatorId, e.user.id); // The server ignores claimed actor IDs.
  assert.equal(
    (
      await e.request(`/groups/${g.id}/expenses/${theirExpense.id}`, "DELETE", {
        version: 1,
      })
    ).status,
    200,
  );
  assert.equal((await d.request(`/groups/${other.id}`)).status, 404);
});

test("equal/custom expenses, editing, stale versions, settlements, and deletion match the workbook", async (t) => {
  const f = await fixture(t);
  const d = await f.register("Dinesh"),
    e = await f.register("Eswar"),
    p = await f.register("Priya");
  const g = await f.group(d, [e, p]),
    path = `/groups/${g.id}`;
  let result = await d.request(
    path + "/expenses",
    "POST",
    f.expense(d, [d, e, p]),
  );
  assert.equal(result.status, 201);
  assert.deepEqual(balances(result.data), {
    Dinesh: 60000,
    Eswar: -30000,
    Priya: -30000,
  });
  const id = result.data.expenses[0].id;
  result = await d.request(path + "/expenses/" + id, "PATCH", {
    ...f.expense(d, [d, e, p], { amount: 120000 }),
    version: 1,
  });
  assert.equal(result.status, 200);
  assert.deepEqual(balances(result.data), {
    Dinesh: 80000,
    Eswar: -40000,
    Priya: -40000,
  });
  assert.equal(
    (
      await d.request(path + "/expenses/" + id, "PATCH", {
        ...f.expense(d, [d, e, p]),
        version: 1,
      })
    ).status,
    409,
  );
  assert.equal(
    (await d.request(path + "/expenses/" + id, "DELETE", { version: 1 }))
      .status,
    409,
  );
  result = await d.request(path + "/expenses/" + id, "PATCH", {
    ...f.expense(d, [d, e, p]),
    version: 2,
  });
  assert.equal(result.data.expenses[0].version, 3);
  result = await e.request(path + "/settlements", "POST", {
    senderId: e.user.id,
    receiverId: d.user.id,
    amount: 10000,
    date: "2026-12-02",
  });
  assert.equal(result.status, 201);
  assert.deepEqual(balances(result.data), {
    Dinesh: 50000,
    Eswar: -20000,
    Priya: -30000,
  });
  assert.equal(
    (
      await p.request(path + "/settlements", "POST", {
        senderId: e.user.id,
        receiverId: d.user.id,
        amount: 100,
        date: "2026-12-02",
      })
    ).status,
    403,
  );
  assert.equal(
    (
      await e.request(path + "/settlements", "POST", {
        senderId: e.user.id,
        receiverId: e.user.id,
        amount: 100,
        date: "2026-12-02",
      })
    ).status,
    400,
  );
  assert.equal(
    (
      await e.request(path + "/settlements", "POST", {
        senderId: e.user.id,
        receiverId: d.user.id,
        amount: 20001,
        date: "2026-12-02",
      })
    ).status,
    409,
  );
  result = await d.request(path + "/expenses/" + id, "DELETE", { version: 3 });
  assert.deepEqual(balances(result.data), {
    Dinesh: -10000,
    Eswar: 10000,
    Priya: 0,
  });
  assert.equal(result.data.settlements.length, 1); // A delete does not erase a real repayment.
  const g2 = await f.group(d, [e, p]);
  result = await d.request(
    `/groups/${g2.id}/expenses`,
    "POST",
    f.expense(d, [d, e, p], {
      splitMode: "custom",
      participants: [
        { userId: d.user.id, amount: 20000 },
        { userId: e.user.id, amount: 30000 },
        { userId: p.user.id, amount: 40000 },
      ],
    }),
  );
  assert.deepEqual(balances(result.data), {
    Dinesh: 70000,
    Eswar: -30000,
    Priya: -40000,
  });
});

test("invalid amounts, participants, dates, and custom totals do not persist partial records", async (t) => {
  const f = await fixture(t);
  const d = await f.register("Dinesh"),
    e = await f.register("Eswar"),
    outsider = await f.register("Outside");
  const g = await f.group(d, [e]),
    path = `/groups/${g.id}/expenses`,
    valid = f.expense(d, [d, e]);
  const invalid = [
    { amount: 0 },
    { amount: -1 },
    { amount: 1.5 },
    { amount: "90000" },
    { amount: 100000001 },
    { payerId: outsider.user.id },
    { participants: [{ userId: outsider.user.id }] },
    { participants: [] },
    { participants: [{ userId: d.user.id }, { userId: d.user.id }] },
    { date: "2026-02-31" },
    { description: "" },
    {
      splitMode: "custom",
      participants: [{ userId: d.user.id, amount: 89999 }],
    },
  ];
  for (const change of invalid)
    assert.equal(
      (await d.request(path, "POST", { ...valid, ...change })).status,
      400,
      JSON.stringify(change),
    );
  assert.equal(f.db.prepare("SELECT count(*) AS n FROM expenses").get().n, 0);
  assert.equal(f.db.prepare("SELECT count(*) AS n FROM shares").get().n, 0);
  const created = await d.request(path, "POST", { ...valid, amount: 10001 });
  const old = created.data.expenses[0];
  await d.request(`/groups/${g.id}/members`, "POST", {
    email: outsider.user.email,
  });
  const after = await d.request(`/groups/${g.id}`);
  assert.deepEqual(after.data.expenses[0].shares, old.shares); // New members do not rewrite history.
  assert.equal(
    after.data.members.find((m) => m.id === outsider.user.id).balance,
    0,
  );
});

test("expense create and edit roll back all records if a share write fails", async (t) => {
  const f = await fixture(t),
    d = await f.register("Dinesh"),
    e = await f.register("Eswar");
  const g = await f.group(d, [e]),
    path = `/groups/${g.id}/expenses`;
  f.db.exec(
    "CREATE TRIGGER fail_share BEFORE INSERT ON shares BEGIN SELECT RAISE(ABORT, 'test failure'); END;",
  );
  assert.equal(
    (await d.request(path, "POST", f.expense(d, [d, e]))).status,
    500,
  );
  assert.equal(f.db.prepare("SELECT count(*) AS n FROM expenses").get().n, 0);
  f.db.exec("DROP TRIGGER fail_share;");
  const saved = await d.request(path, "POST", f.expense(d, [d, e]));
  const old = saved.data.expenses[0];
  f.db.exec(
    "CREATE TRIGGER fail_share BEFORE INSERT ON shares BEGIN SELECT RAISE(ABORT, 'test failure'); END;",
  );
  assert.equal(
    (
      await d.request(path + "/" + old.id, "PATCH", {
        ...f.expense(d, [d, e], { amount: 120000 }),
        version: 1,
      })
    ).status,
    500,
  );
  const after = await d.request(`/groups/${g.id}`);
  assert.deepEqual(after.data.expenses[0], old);
});

test("competing repayments cannot overpay and competing edits cannot lose updates", async (t) => {
  const f = await fixture(t),
    d = await f.register("Dinesh"),
    e = await f.register("Eswar");
  const g = await f.group(d, [e]),
    path = `/groups/${g.id}`;
  const saved = await d.request(
    path + "/expenses",
    "POST",
    f.expense(d, [d, e]),
  );
  const id = saved.data.expenses[0].id;
  const changed = await Promise.all(
    [120000, 150000].map((amount) =>
      d.request(path + "/expenses/" + id, "PATCH", {
        ...f.expense(d, [d, e], { amount }),
        version: 1,
      }),
    ),
  );
  assert.deepEqual(changed.map((r) => r.status).sort(), [200, 409]);
  const snapshot = (await d.request(path)).data;
  const debt = -snapshot.members.find((m) => m.id === e.user.id).balance;
  const paid = await Promise.all(
    [1, 2].map(() =>
      e.request(path + "/settlements", "POST", {
        senderId: e.user.id,
        receiverId: d.user.id,
        amount: debt,
        date: "2026-12-02",
      }),
    ),
  );
  assert.deepEqual(paid.map((r) => r.status).sort(), [201, 409]);
  assert.deepEqual(balances((await d.request(path)).data), {
    Dinesh: 0,
    Eswar: 0,
  });
});

test("production session cookies are secure and origin is explicit", async (t) => {
  const f = await fixture(t, {
    production: true,
    origin: "https://split.example",
  });
  const c = f.client();
  const result = await c.request(
    "/auth/register",
    "POST",
    { name: "Dinesh", email: "d@example.test", password: demoPassword },
    { Origin: "https://split.example" },
  );
  assert.equal(result.status, 201);
  assert.match(result.headers.get("set-cookie"), /Secure/);
  assert.ok(
    result.headers.get("content-security-policy").includes("script-src 'self'"),
  );
});

test("SQLite records survive closing and reopening the database", async (t) => {
  const directory = await mkdtemp(join(tmpdir(), "split-expenses-test-"));
  const file = join(directory, "test.sqlite");
  const f = await fixture(t, { databasePath: file });
  const d = await f.register("Dinesh");
  const group = await f.group(d);
  await f.close();
  const other = openDatabase(file);
  assert.equal(other.prepare("SELECT count(*) AS n FROM groups").get().n, 1);
  other.close();
  const restarted = await fixture(t, { databasePath: file });
  const resumed = restarted.client();
  resumed.cookie = d.cookie;
  assert.equal((await resumed.request("/auth/me")).status, 200);
  assert.equal(
    (await resumed.request("/groups/" + group.id)).data.group.name,
    "Weekend trip",
  );
  // Explicit cleanup is registered after fixture teardown; no repository files are used.
  t.after(async () => {
    assert.equal(dirname(resolve(directory)), resolve(tmpdir()));
    assert.ok(basename(directory).startsWith("split-expenses-test-"));
    await rm(directory, { recursive: true, force: true });
  });
});
