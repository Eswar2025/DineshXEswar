// Parse the decimal string directly: multiplying a floating-point rupee value can round incorrectly.
export function parsePaise(value) {
  const text = String(value).trim();
  if (!/^\d{1,7}(\.\d{1,2})?$/.test(text)) return null;
  const [whole, fractional = ""] = text.split(".");
  const paise = Number(whole) * 100 + Number(fractional.padEnd(2, "0"));
  return paise <= 100_000_000 ? paise : null;
}

export function formatMoney(paise, signed = false) {
  const sign = paise < 0 ? "−" : signed && paise > 0 ? "+" : "";
  return (
    sign +
    "₹" +
    (Math.abs(paise) / 100).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

// This is a preview only. The server independently validates and allocates every saved expense.
export function previewEqual(amount, userIds) {
  const ids = [...userIds].sort();
  if (!ids.length) return [];
  return ids.map((userId, i) => ({
    userId,
    amount: Math.floor(amount / ids.length) + (i < amount % ids.length ? 1 : 0),
  }));
}
