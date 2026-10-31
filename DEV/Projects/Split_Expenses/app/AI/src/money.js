// Money stays in integer paise. Formatting into rupees happens only in the UI.
export const MAX_AMOUNT = 100_000_000; // Rs. 1,000,000 per expense or settlement.

export class AppError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function requireThat(condition, message, status = 400) {
  if (!condition) throw new AppError(status, message);
}

export function validateAmount(value, allowZero = false) {
  requireThat(
    Number.isSafeInteger(value) &&
      value >= (allowZero ? 0 : 1) &&
      value <= MAX_AMOUNT,
    `Amounts must be whole paise between ${allowZero ? 0 : 1} and ${MAX_AMOUNT}.`,
  );
  return value;
}

// Sorting IDs, rather than names or screen order, makes extra-paisa allocation repeatable.
export function allocateShares(amount, mode, participants) {
  validateAmount(amount);
  requireThat(
    ["equal", "custom"].includes(mode),
    "Choose an equal or custom split.",
  );
  requireThat(
    Array.isArray(participants) &&
      participants.length >= 1 &&
      participants.length <= 100,
    "Select between 1 and 100 participants.",
  );
  const ids = participants.map((p) => p?.userId);
  requireThat(
    ids.every(
      (id) => typeof id === "string" && id.length > 0 && id.length <= 100,
    ),
    "Invalid participant ID.",
  );
  requireThat(
    new Set(ids).size === ids.length,
    "Each participant may appear only once.",
  );
  const sorted = [...participants].sort((a, b) =>
    a.userId < b.userId ? -1 : a.userId > b.userId ? 1 : 0,
  );
  if (mode === "equal") {
    const base = Math.floor(amount / sorted.length);
    const remainder = amount % sorted.length;
    return sorted.map((p, i) => ({
      userId: p.userId,
      amount: base + (i < remainder ? 1 : 0),
    }));
  }
  const shares = sorted.map((p) => ({
    userId: p.userId,
    amount: validateAmount(p.amount, true),
  }));
  requireThat(
    shares.reduce((sum, p) => sum + p.amount, 0) === amount,
    "Custom shares must add up exactly to the expense total.",
  );
  return shares;
}

export function deriveBalances(memberIds, expenses, shares, settlements) {
  const totals = new Map(memberIds.map((id) => [id, 0]));
  function add(id, delta) {
    requireThat(
      totals.has(id),
      "A record references someone outside this group.",
      500,
    );
    const next = totals.get(id) + delta;
    requireThat(
      Number.isSafeInteger(next),
      "This group exceeds the supported balance range.",
      409,
    );
    totals.set(id, next);
  }
  for (const expense of expenses) add(expense.payerId, expense.amount);
  for (const share of shares) add(share.userId, -share.amount);
  // A sender's debt decreases; a receiver's credit decreases. The expense stays unchanged.
  for (const settlement of settlements) {
    add(settlement.senderId, settlement.amount);
    add(settlement.receiverId, -settlement.amount);
  }
  requireThat(
    [...totals.values()].reduce((sum, n) => sum + BigInt(n), 0n) === 0n,
    "The group balances are inconsistent.",
    500,
  );
  return totals;
}

// Greedy matching gives a valid plan. It does not promise the minimum transfer count.
export function suggestTransfers(balances) {
  const debtors = [...balances]
    .filter(([, n]) => n < 0)
    .map(([userId, n]) => ({ userId, remaining: -n }));
  const creditors = [...balances]
    .filter(([, n]) => n > 0)
    .map(([userId, n]) => ({ userId, remaining: n }));
  const transfers = [];
  let d = 0,
    c = 0;
  while (d < debtors.length && c < creditors.length) {
    const amount = Math.min(debtors[d].remaining, creditors[c].remaining);
    transfers.push({
      senderId: debtors[d].userId,
      receiverId: creditors[c].userId,
      amount,
    });
    debtors[d].remaining -= amount;
    creditors[c].remaining -= amount;
    if (!debtors[d].remaining) d++;
    if (!creditors[c].remaining) c++;
  }
  return transfers;
}
