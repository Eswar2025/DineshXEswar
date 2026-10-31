import test from "node:test";
import assert from "node:assert/strict";
import {
  allocateShares,
  deriveBalances,
  suggestTransfers,
  validateAmount,
} from "../src/money.js";
import { parsePaise, previewEqual } from "../public/money.js";

const ids = ["dinesh", "eswar", "priya"];
const equal = (amount) =>
  allocateShares(
    amount,
    "equal",
    ids.map((userId) => ({ userId })),
  );
function balance(
  amount,
  { payerId = "dinesh", shares = equal(amount), settlements = [] } = {},
) {
  return [
    ...deriveBalances(ids, [{ payerId, amount }], shares, settlements).values(),
  ];
}

test("the workbook examples have exact signed balances", () => {
  assert.deepEqual([...deriveBalances(ids, [], [], []).values()], [0, 0, 0]);
  assert.deepEqual(balance(90000), [60000, -30000, -30000]);
  assert.deepEqual(balance(10000), [6666, -3333, -3333]);
  assert.deepEqual(balance(120000), [80000, -40000, -40000]);
  assert.deepEqual(
    balance(90000, { payerId: "eswar" }),
    [-30000, 60000, -30000],
  );
  assert.deepEqual(
    balance(90000, {
      shares: allocateShares(90000, "equal", [
        { userId: "eswar" },
        { userId: "priya" },
      ]),
    }),
    [90000, -45000, -45000],
  );
  assert.deepEqual(
    balance(90000, {
      shares: allocateShares(90000, "equal", [{ userId: "dinesh" }]),
    }),
    [0, 0, 0],
  );
  const custom = allocateShares(
    90000,
    "custom",
    ids.map((userId, i) => ({ userId, amount: (i + 2) * 10000 })),
  );
  assert.deepEqual(balance(90000, { shares: custom }), [70000, -30000, -40000]);
  assert.deepEqual(
    balance(90000, {
      settlements: [{ senderId: "eswar", receiverId: "dinesh", amount: 10000 }],
    }),
    [50000, -20000, -30000],
  );
  const both = ["eswar", "priya"].map((senderId) => ({
    senderId,
    receiverId: "dinesh",
    amount: 30000,
  }));
  assert.deepEqual(balance(90000, { settlements: both }), [0, 0, 0]);
  assert.deepEqual(
    [...deriveBalances(ids, [], [], [both[0]]).values()],
    [-30000, 30000, 0],
  );
  assert.deepEqual(
    [
      ...deriveBalances(
        ids,
        [
          { payerId: "dinesh", amount: 90000 },
          { payerId: "eswar", amount: 30000 },
        ],
        [...equal(90000), ...equal(30000)],
        [],
      ).values(),
    ],
    [50000, -10000, -40000],
  );
});

test("equal allocation conserves every paisa and is independent of input order", () => {
  for (const count of [1, 2, 3, 7, 100]) {
    const participants = Array.from({ length: count }, (_, i) => ({
      userId: "member-" + String(i).padStart(3, "0"),
    }));
    for (const amount of [1, 2, 99, 10000, 90000, 100000000]) {
      const shares = allocateShares(amount, "equal", participants);
      assert.equal(
        shares.reduce((sum, p) => sum + p.amount, 0),
        amount,
      );
      assert.ok(
        Math.max(...shares.map((p) => p.amount)) -
          Math.min(...shares.map((p) => p.amount)) <=
          1,
      );
      assert.deepEqual(
        allocateShares(amount, "equal", [...participants].reverse()),
        shares,
      );
      assert.deepEqual(
        previewEqual(
          amount,
          participants.map((p) => p.userId),
        ),
        shares,
      );
    }
  }
});

test("invalid allocations fail and valid zero custom shares are preserved", () => {
  for (const value of [-1, 0, 1.1, NaN, Infinity, "90000", 100000001])
    assert.throws(() => validateAmount(value));
  for (const participants of [
    [],
    null,
    [{ userId: "a" }, { userId: "a" }],
    [{ userId: "" }],
  ]) {
    assert.throws(() => allocateShares(100, "equal", participants));
  }
  assert.throws(() => allocateShares(100, "percentage", [{ userId: "a" }]));
  assert.throws(() =>
    allocateShares(100, "custom", [{ userId: "a", amount: 99 }]),
  );
  assert.throws(() =>
    allocateShares(100, "custom", [
      { userId: "a", amount: -1 },
      { userId: "b", amount: 101 },
    ]),
  );
  assert.deepEqual(
    allocateShares(100, "custom", [
      { userId: "a", amount: 0 },
      { userId: "b", amount: 100 },
    ]),
    [
      { userId: "a", amount: 0 },
      { userId: "b", amount: 100 },
    ],
  );
});

test("suggestions settle balances exactly without changing their input", () => {
  for (const values of [
    [60000, -30000, -30000],
    [50000, -10000, -40000],
    [-30000, 30000, 0],
    [0, 0, 0],
  ]) {
    const input = new Map(ids.map((id, i) => [id, values[i]]));
    const result = new Map(input);
    for (const s of suggestTransfers(input)) {
      result.set(s.senderId, result.get(s.senderId) + s.amount);
      result.set(s.receiverId, result.get(s.receiverId) - s.amount);
    }
    assert.deepEqual([...result.values()], [0, 0, 0]);
    assert.deepEqual([...input.values()], values);
  }
});

test("decimal input parsing never silently accepts partial or overprecise values", () => {
  for (const [value, expected] of [
    ["0.01", 1],
    ["10.10", 1010],
    ["900", 90000],
    [" 0 ", 0],
    ["1000000", 100000000],
  ])
    assert.equal(parsePaise(value), expected);
  for (const invalid of [
    "",
    "1.001",
    "-1",
    "1e3",
    "1.2x",
    "1,000",
    "1000000.01",
    "Infinity",
    ".50",
  ])
    assert.equal(parsePaise(invalid), null);
});

test("corrupt records and unsupported totals fail instead of hiding an imbalance", () => {
  assert.throws(() =>
    deriveBalances(ids, [{ payerId: "outsider", amount: 1 }], [], []),
  );
  assert.throws(() =>
    deriveBalances(ids, [{ payerId: "dinesh", amount: 1 }], [], []),
  );
  assert.throws(() =>
    deriveBalances(
      ids,
      [
        { payerId: "dinesh", amount: Number.MAX_SAFE_INTEGER },
        { payerId: "dinesh", amount: 1 },
      ],
      [],
      [],
    ),
  );
});
