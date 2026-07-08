# 🏗️ DP FOUNDATIONS — Read this cold before July 4th OA

> **Dinesh — this is your single most important file for tomorrow.**
> It fixes every gap from your diagnostic, then teaches the 6 patterns that cover ~90% of
> OA/OLT DP questions. Read top to bottom ONCE slowly, then re-skim the "🎯 OA RECIPE" boxes.
> Everything here is written to be *recalled under exam pressure*, not to be academically complete.

---

# PART 0 — THE MENTAL MODEL (this is everything)

**DP = Recursion + Memory.** That's the whole idea. You write a brute-force recursion that tries all
choices, then you *cache* repeated subproblems so you don't recompute them.

### The 2 properties (A1 — corrected)
A problem is DP **only if** it has BOTH:
1. **Optimal Substructure** — the optimal answer to the big problem is built from optimal answers to
   smaller subproblems. (e.g. shortest path A→C through B = shortest A→B + shortest B→C)
2. **Overlapping Subproblems** — the same subproblem shows up again and again. (This is *why* caching
   helps. If subproblems never repeat — like in merge sort — DP gives you nothing; that's just
   divide & conquer.)

> Merge sort has optimal substructure but NO overlapping subproblems → not DP.
> Fibonacci has both → DP.

### The universal 5-step recipe (MEMORIZE THIS — use it on every problem tomorrow)
```
1. EXPRESS everything in terms of an INDEX (or two).      → "what does dp[i] / dp[i][j] mean?"
2. Do ALL possible choices at that index.                  → the transitions
3. Take the best (max/min) OR sum of those choices.        → depends on "count ways" vs "optimize"
4. Write the BASE CASE (smallest valid subproblem).
5. Add memoization (top-down) OR build a table (bottom-up).
```
If you can do steps 1–4, you've solved 80% of any DP. Code is mechanical after that.

---

# PART 1 — TOP-DOWN vs BOTTOM-UP (A2/A3 — refined)

|                     | Memoization (Top-Down)              | Tabulation (Bottom-Up)                  |
|---------------------|-------------------------------------|-----------------------------------------|
| **How**             | Recursion + a cache array           | Iterative loops filling a table         |
| **Direction**       | Big problem → base case             | Base case → big problem                 |
| **Advantage**       | Easy to write (just add cache to recursion); only computes reachable states | No recursion stack (safe at n=10⁵); easy to space-optimize |
| **Danger**          | **Stack overflow** if depth ~10⁵    | Must get the fill-order right           |

**⚠️ Correction to your A2:** Both have the SAME time complexity = `O(number of states × work per state)`.
Memoization is NOT slower. And tabulation isn't "always less space" — it's just *easier* to optimize space.

**Fill order (A3):** Fill a state only *after* everything it depends on is already filled.
If `dp[i]` needs `dp[i-1]`, loop `i` upward. If `dp[i][j]` needs `dp[i+1][j]`, loop `i` downward.
**Rule of thumb: look at the recurrence's indices — the ones being subtracted must already exist.**

---

# PART 2 — SPACE OPTIMIZATION (A4/A5 — the diagonal trap explained)

### The simple case (A4, you got this right)
If `dp[i]` only depends on `dp[i-1]` and `dp[i-2]` → keep 2 variables, not an array. O(1) space.

### The 2D → 1D case (A5 — YOU MUST UNDERSTAND THIS)
You have: `dp[i][j] = f(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])`

- `dp[i-1][j]`   = "cell directly above"   = `prevRow[j]`
- `dp[i][j-1]`   = "cell to the left"      = `curRow[j-1]` (already computed this row)
- `dp[i-1][j-1]` = "diagonal"              = `prevRow[j-1]`

**YES it optimizes to O(columns)** — keep 2 rows (`prev`, `cur`), OR even 1 row + 1 temp.

**THE TRAP (this is the "one thing to be careful about"):**
With a single 1D array `dp[]`, when you write `dp[j] = f(dp[j], dp[j-1], dp[j-1_OLD])`:
- `dp[j]` still holds the OLD row's value (the "above") ✅
- `dp[j-1]` already holds the NEW row's value (the "left") ✅
- but the **diagonal** `dp[i-1][j-1]` was ALREADY OVERWRITTEN when you computed `dp[j-1]` this row! ❌

**Fix:** before overwriting `dp[j]`, stash it:
```cpp
int prevDiag = dp[0];               // dp[i-1][0]
for (int j = 1; j <= n; j++) {
    int temp = dp[j];               // save old dp[i-1][j] BEFORE overwrite
    dp[j] = f(dp[j] /*above*/, dp[j-1] /*left*/, prevDiag /*diagonal*/);
    prevDiag = temp;                // old dp[i-1][j] becomes next diagonal
}
```
Your "O(3m+3n)" guess was wrong — the answer is **O(n) columns with one temp var.** This exact pattern
shows up in **LCS, Edit Distance, and grid DP** — all three.

---

# PART 3 — THE 6 PATTERNS THAT COVER ~90% OF OA DP

For each: how to RECOGNIZE it, the STATE, the RECURRENCE, and a canonical problem.

## Pattern 1 — Linear / 1D DP ("decisions along a sequence")
**Recognize:** "ways to reach step n", "max sum with no two adjacent", answer depends on previous
few positions.
- **Climbing Stairs (B3 corrected):** `dp[i] = dp[i-1] + dp[i-2]`, **base `dp[0]=1, dp[1]=1`.**
  (You wrote dp[0]=2 — WRONG. dp[0]=1: exactly one way to be at the ground = take no step.)
- **House Robber:** `dp[i] = max(dp[i-1], dp[i-2] + a[i])` → "skip this house, or rob it + best up to i-2".

## Pattern 2 — Grid / 2D DP ("move through a matrix")
**Recognize:** "top-left to bottom-right", "only right/down", "count paths / min cost path".
- **Min Path Sum (B4 corrected):** you come FROM top or FROM left:
  `dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])`
- **Unique Paths:** `dp[i][j] = dp[i-1][j] + dp[i][j-1]` (sum, because we COUNT ways not optimize).
- First row/col are base cases (only one way in).

## Pattern 3 — Knapsack Family ("pick a subset under a constraint")  ← YOUR BIGGEST GAP
**Recognize:** "subset", "choose items", "reach a target sum", "at most capacity W". Anytime each
element has a **take / don't-take** choice.
- **0/1 Knapsack:** each item once. `dp[i][w] = max(dp[i-1][w], val[i] + dp[i-1][w-wt[i]])`
- **Unbounded (Coin Change, B1):** item reusable → transition from `dp[i]` (same item), not `dp[i-1]`.
- **Subset Sum:** `dp[i][s]` = can we make sum `s` using first i items? (boolean)
- **⭐ Min Subset Diff (B5 corrected — THIS WAS WRONG IN YOUR ANSWER):**
  This is **NOT prefix sum.** total = sum(all). Find all achievable subset sums `s ≤ total/2`
  using subset-sum DP. Answer = `min over achievable s of (total - 2*s)`.
  **Greedy/prefix gives WRONG answers.** Example: [1,6,11,5] → greedy fails, DP gives diff=1.
  Burn this in: **"partition / two subsets / minimize difference" → SUBSET SUM DP, never greedy.**

## Pattern 4 — Subsequence DP (LIS / LCS)
**Recognize:** "longest ... subsequence", "common between two strings", "not necessarily contiguous".
- **LCS:** `dp[i][j]` = LCS of `s1[0..i-1], s2[0..j-1]`.
  match → `1 + dp[i-1][j-1]`; else → `max(dp[i-1][j], dp[i][j-1])`.
- **Longest Palindromic Subsequence (B2 corrected — you left blank):**
  **LPS(s) = LCS(s, reverse(s)).** That's the whole trick. Memorize it.
- **LIS:** `dp[i]` = longest increasing subseq ending at i; O(n²) DP or O(n log n) with tails array.

## Pattern 5 — String / Partition DP
**Recognize:** "edit distance", "decode", "partition string into valid pieces", "min cuts".
- **Edit Distance / Decode Ways** live here (see Section C solution below).
- **MCM / Burst Balloons:** `dp[i][j]` over an interval, try every split point k. O(n³). (Lower priority.)

## Pattern 6 — Buy/Sell Stock DP (B6)
**Recognize:** "buy/sell", "at most k transactions", "cooldown", "holding or not".
- **State:** `dp[day][transactionsLeft][holding?]`.
- Transition each day: do nothing, or buy (if not holding), or sell (if holding).
- (Advanced — understand the STATE idea for tomorrow, don't over-invest.)

---

# PART 4 — SECTION C SOLVED (Decode Ways — worked end to end)

This is a **Pattern 1 (linear DP)** problem. Study this as your template for "count ways" DP.

### C1. Approach
At each position i, a decode "way" is formed by consuming either **1 digit** (if it's 1–9) or
**2 digits** (if those two form 10–26). Number of ways to decode `s[0..i]` = ways ending with a
1-digit chunk + ways ending with a 2-digit chunk. Classic Fibonacci-shaped recurrence with digit
validity guards.

### C2. State
`dp[i]` = number of ways to decode the **first `i` characters** `s[0..i-1]`.
(Length-based indexing — cleaner base case. dp has size n+1.)

### C3. Recurrence
```
Base: dp[0] = 1   (empty string: one way — decode nothing)
      dp[1] = (s[0] != '0') ? 1 : 0

For i from 2..n:
    dp[i] = 0
    // take ONE digit s[i-1]
    if (s[i-1] != '0')            dp[i] += dp[i-1]
    // take TWO digits s[i-2..i-1]
    int two = (s[i-2]-'0')*10 + (s[i-1]-'0')
    if (two >= 10 && two <= 26)   dp[i] += dp[i-2]
```
The two guards handle ALL the zero-traps:
- `"06"` → s[1]='6' single is fine BUT it's reached via dp[1] which... actually leading '0' kills dp[1]=0, propagates 0. ✅
- `"10"` → single '0' fails (dp adds nothing from dp[i-1]), but "10"=10∈[10,26] so dp[2]=dp[0]=1. ✅
- `"100"` → the trailing '0' can't be a single AND '00' isn't in [10,26] → dp becomes 0. ✅

### C4. Complexity
Time **O(n)**, Space **O(n)** → **O(1) optimizable** (only dp[i-1], dp[i-2] needed — two variables).

### C5. Code
```cpp
int numDecodings(string s) {
    int n = s.size();
    if (n == 0 || s[0] == '0') return 0;
    long long prev2 = 1;                 // dp[0]
    long long prev1 = 1;                 // dp[1] (s[0] != '0' guaranteed above)
    for (int i = 2; i <= n; i++) {
        long long cur = 0;
        if (s[i-1] != '0') cur += prev1;                       // one digit
        int two = (s[i-2]-'0')*10 + (s[i-1]-'0');
        if (two >= 10 && two <= 26) cur += prev2;              // two digits
        prev2 = prev1;
        prev1 = cur;
    }
    return (int)prev1;
}
```

### C6. Edge cases
[x] starts with '0' → return 0 immediately
[x] "0" alone → 0
[x] middle '0' that can't pair ("100") → 0
[x] all valid ("111" → 3)

---

# PART 5 — SECTION D (your self-assessment, answered FOR you as a plan)

Based on your diagnostic, here's the honest inventory:
- ✅ **Own it:** 1D DP (stairs/rob), 2D grid DP.
- ⚠️ **Shaky:** LIS/LCS (know names, fuzzy on recurrence), Coin Change.
- ❌ **Gap (fix TODAY):** Knapsack family, Subset-Sum/Partition, String DP, Palindrome DP.
- 🔜 **Later (not for tomorrow):** Stock-k, Partition/MCM, Digit DP, Tree DP.

**Where you freeze:** DEFINING THE STATE. That's the diagnosis. Your fix is the 5-step recipe in
Part 0 — force step 1 ("what does dp[i] mean, in English?") in writing before anything else.

---

# 🎯 TOMORROW'S OA SURVIVAL KIT (the 60-second triage)

When a DP-looking problem appears, ask IN THIS ORDER:
1. **"Choose a subset / take-or-skip / reach a target?"** → Knapsack. dp[i][capacity].
2. **"Two strings / longest common / palindrome?"** → LCS family. dp[i][j].
3. **"Grid, move right/down?"** → Grid DP. dp[i][j] = grid + min/sum of (up, left).
4. **"Ways to reach n / no two adjacent / along a line?"** → 1D DP. dp[i] from dp[i-1], dp[i-2].
5. **"Partition array into two / minimize diff?"** → Subset Sum (NOT greedy!).
6. **"Count ways" → SUM the transitions. "Best/min/max" → take min/max.** ← never confuse these.

**Golden rules:**
- Write `dp[i] = ______` in plain English BEFORE coding. Always.
- `n ≤ 20-ish` and "subset/all combinations"? Might be bitmask DP or just brute force.
- Overflow: "count ways" answers explode → use `long long`, watch for a modulo in the statement.
- If stuck on tabulation, write the RECURSION + memo first. Same marks, less bug surface.

---

> **Do this now:** re-read Part 0 + Part 3 + the triage box. Then tell me "ready" and I'll drill you
> with 3 rapid-fire "name the pattern + state" questions to lock it in before tomorrow.
