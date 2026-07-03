# 🧠 DP DIAGNOSTIC — "How much DP do I actually know?"

**Candidate:** Eswar

**Instructions:** Answer in your own words, below each question, in the `>>>` blocks.
Don't Google, don't look anything up. Wrong answers are FINE and useful — they tell me
exactly where the gaps are. If you have *no idea*, literally write "no idea" — that's data too.
There is **no timer** on this. Think, but don't research.

When you're done, save and send it back to me.

---

## SECTION A — Conceptual (do you *understand* DP, or just memorize it?)

**A1.** In your own words: what are the *two* properties a problem must have for DP to apply?
Name them and explain each in one line.
>>>


**A2.** What is the difference between **memoization (top-down)** and **tabulation (bottom-up)**?
Give one concrete advantage of each.
>>>


**A3.** When you convert a recursive memoized solution into a bottom-up table, what determines
the **order** in which you must fill the table? (i.e., how do you know which state to compute first?)
>>>


**A4.** What does "**space optimization**" in DP usually mean, and what's the typical trick that
lets you drop a 2D table down to 1D (or two rows)? Give the intuition.
>>>


**A5.** You're given a DP where `dp[i][j]` depends on `dp[i-1][j]`, `dp[i][j-1]`, and `dp[i-1][j-1]`.
Can this be space-optimized to O(columns)? If yes, what's the one thing you must be careful about?
>>>


---

## SECTION B — Pattern Recognition (name the DP, don't solve it)

For each, just tell me: **(a)** what DP pattern/family it is, and **(b)** what your `dp` state means
(e.g. "dp[i] = longest ... ending at i"). One or two lines each. NO full solution needed.

**B1.** "Given an array of coins and a target amount, find the *minimum number of coins* to make
the amount. Each coin usable unlimited times."
>>>


**B2.** "Given a string, find the length of the *longest palindromic subsequence*."
>>>


**B3.** "You're climbing a staircase of n steps. Each time you can climb 1 or 2 steps. How many
distinct ways to reach the top?"
>>>


**B4.** "Given a grid of costs, find the minimum-cost path from top-left to bottom-right, moving
only right or down."
>>>


**B5.** "Given an array, partition it into two subsets such that the difference of their sums is
minimized."
>>>


**B6.** "Given `prices[]` for a stock, you may buy/sell at most **k** times (non-overlapping).
Maximize profit."
>>>


---

## SECTION C — The Real Test (one full OA-style problem)

Read carefully. Write your **approach in words FIRST**, then the recurrence, then code (any language).
If you can't finish the code, get as far as the recurrence — that's most of the marks.

### Problem: "Decode Ways II — Ticket Machine"

A ticket machine prints codes as digit strings. A code was encoded by mapping:
`'A' -> 1, 'B' -> 2, ..., 'Z' -> 26`. To decode a digit string back into letters, you split it into
chunks where each chunk is a number from **1 to 26**.

Given a digit string `s`, return the **number of ways** to decode it.
A chunk cannot have a leading zero (so `"06"` is NOT a valid chunk for 6; only `"6"` is).
If the string cannot be decoded at all, return 0.

**Example 1:** `s = "226"` → `3`   (ways: "2 2 6"=BBF, "22 6"=VF, "2 26"=BZ)
**Example 2:** `s = "06"`  → `0`   (leading zero, invalid)
**Example 3:** `s = "10"`  → `1`   (only "10"=J; "1 0" invalid because 0 maps to nothing)

**Constraints:** `1 ≤ s.length ≤ 10^5`, `s` contains only digits `0-9`.

--- C1. APPROACH IN WORDS ---
>>>


--- C2. STATE DEFINITION: dp[i] = ? ---
>>>


--- C3. RECURRENCE (the transition + base cases) ---
>>>


--- C4. TIME / SPACE COMPLEXITY ---
Time:
Space:


--- C5. CODE ---
>>>


--- C6. EDGE CASES you'd test ---
[ ] string starts with '0'
[ ] "0" alone
[ ] a '0' in the middle that can't pair (e.g. "100")
[ ] all valid (e.g. "111")
[ ]


---

## SECTION D — Self-Assessment (be honest, this shapes your plan)

**D1.** Rate your current DP confidence 1–10, and in one line say *why*.
>>>


**D2.** Which of these have you actually solved before (mark X)?
[ ] 1D DP (Fibonacci / climbing stairs / house robber)
[ ] 2D grid DP (unique paths / min path sum)
[ ] Subsequence DP (LIS / LCS)
[ ] Knapsack family (0/1, unbounded, subset sum, partition)
[ ] String DP (edit distance, palindrome partitioning)
[ ] Stock / buy-sell DP series
[ ] Partition DP / MCM (burst balloons style)
[ ] Digit DP
[ ] DP on trees / graphs

**D3.** When you get a DP problem in a contest and freeze, WHERE do you usually get stuck?
(pick honestly: recognizing it's DP / defining the state / writing the recurrence / base cases /
converting recursion→tabulation / space optimization / debugging)
>>>


========================================================================
END — save and send back to me when done.
========================================================================
