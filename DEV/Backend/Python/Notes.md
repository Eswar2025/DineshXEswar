# Python for the Backend Question (Accenture OA) – Notes

For Eswar. Goal: write correct Python for LeetCode-Easy style questions without losing time on syntax.

## 1. What the backend question looks like

What your friends reported (Dinesh's notes from the OA):
- One backend/coding question, rated **easy** (LeetCode Easy level).
- Languages offered: **Python, Java**, and sometimes JavaScript.
- Sometimes a LeetCode-style function is given, sometimes you **write the whole program** with `input()` and `print()`.
- The task is usually "calculate something and return or print it".

What a web search added (anecdotal, only a few anonymous posts; treat it as a guide, not a fact):
- Recent reports mention 2 or 3 coding-type questions in total, easy to easy-medium. For the AASE role one report listed one DSA question, one HTML/CSS edit and one SQL join.
- Reported problems: **Leaders in an array**, Two Sum, reverse a string, Fibonacci, second largest, smallest element, and one circular linked list question.
- Test cases decide the score, so partial credit is possible.
- Nothing official was found. The formats conflict between sources, so **practise both the function style and the input()/print() style**.

Likely topics, ranked: arrays, strings, hashing (dict/Counter/set), math (prime, gcd, digits, Fibonacci), simple simulation and output formatting, sorting with a key, two pointers and prefix/suffix scans, basic matrix, basic stack (brackets). Do not plan for DP or hard graphs.

## 2. How to use the files

| File | What it is |
|---|---|
| `Syntax/01` to `Syntax/08` | Runnable syntax tests. Read a file, run it (`python 03_lists_and_slicing.py`), and change things to see what breaks. Each prints `NN OK` when all its `assert` lines pass. |
| `Practice/01_function_style.py` | 18 problems with empty functions. Fill them in and run the file: every problem prints PASS or FAIL. |
| `Practice/02_stdin_style.py` | 6 "write the whole program" problems. Test with the files in `Practice/tests/`. |
| `Practice/checker.py` | The test runner. Don't edit it. |

Suggested order: read this file, run `Syntax/01` to `08` one by one, then do `Practice/01`, then `Practice/02`.

Run any file with `python <file>.py` from its own folder.

## 3. C++ to Python quick map (you already know C++)

| C++ | Python |
|---|---|
| `{ }` blocks, `;` | indentation (4 spaces), `:` after the header, no `;` |
| `int x = 5;` | `x = 5` (no types) |
| `&&`, `||`, `!` | `and`, `or`, `not` |
| `i++` | `i += 1` (there is **no** `++`) |
| `for (int i=0;i<n;i++)` | `for i in range(n):` |
| `vector<int>` | `list` |
| `unordered_map<int,int>` | `dict` |
| `unordered_set<int>` | `set` |
| `pair<int,int>` / `tuple` | `tuple` |
| `string` (mutable) | `str` (**immutable**) |
| `7 / 2 == 3` | `7 // 2 == 3`, and `7 / 2 == 3.5` |
| `cout << x << endl;` | `print(x)` |
| `cin >> n;` | `n = int(input())` |
| `nullptr` | `None` |
| `INT_MAX` | `float("inf")` or `math.inf` (ints never overflow) |
| `-7 / 2 == -3` | `-7 // 2 == -4` (floor division rounds down) |
| `stack<int>` | a `list` (`append`, `pop`) |
| `queue<int>` | `collections.deque` (`append`, `popleft`) |
| `priority_queue` (max-heap) | `heapq` (**min**-heap; push negatives for max) |

## 4. Input and output (very important in the OA)

`input()` returns a **string**, always.

```python
n = int(input())                          # one integer
a, b = map(int, input().split())          # two ints on one line
arr = list(map(int, input().split()))     # list of ints on one line
s = input().strip()                       # one string, spaces around removed

t = int(input())                          # many test cases
for _ in range(t):
    n = int(input())
    arr = list(map(int, input().split()))
    print(sum(arr))
```

Printing:

```python
print(x)                      # one value per line
print(a, b)                   # a b
print(*arr)                   # elements separated by spaces  (1 2 3)
print(" ".join(map(str, arr)))# same thing
print(x, end=" ")             # no newline
print(f"{x:.2f}")             # 2 decimals
```

Edge case: if the expected output has "no spaces at the end" or a specific separator, copy it exactly. Output format mistakes fail test cases even when the logic is right.

## 5. The core data structures

| Structure | Make | Add | Check membership | Notes |
|---|---|---|---|---|
| list | `[1, 2]` | `.append(x)` O(1) | `x in lst` O(n) | `lst[-1]` is the last item; `lst.pop()` removes it |
| dict | `{"a": 1}` | `d[k] = v` | `k in d` O(1) | `d.get(k, 0)` never errors |
| set | `{1, 2}` / `set()` | `.add(x)` | `x in s` O(1) | `{}` is an empty **dict**, not a set |
| tuple | `(1, 2)` | cannot change | | can be used as a dict key |
| deque | `deque([1])` | `.append`, `.popleft()` O(1) | | for queues and BFS |
| heap | `heapq.heappush(h, x)` | `heapq.heappop(h)` | | `h[0]` is the smallest |

Slicing, which works for lists and strings: `a[start:stop:step]` (stop excluded).
`a[::-1]` = reversed copy, `a[-3:]` = last three, `a[:3]` = first three.

## 6. The five patterns that cover most easy questions

**1. Frequency map**
```python
from collections import Counter
freq = Counter(s)              # or: freq[ch] = freq.get(ch, 0) + 1
```
Used by: anagram, first unique character, majority element, duplicates.

**2. "Have I seen this?" set/dict**
```python
seen = {}
for i, x in enumerate(nums):
    if target - x in seen:
        return [seen[target - x], i]
    seen[x] = i
```
Used by: Two Sum, contains duplicate.

**3. Two pointers**
```python
l, r = 0, len(s) - 1
while l < r:
    # compare / swap s[l], s[r]
    l += 1
    r -= 1
```
Used by: palindrome, reverse, sorted-array pair sum.

**4. Scan from the right (suffix scan)**
```python
best = float("-inf")
for x in reversed(nums):
    if x > best:               # x is a leader
        best = x
```
Used by: leaders in an array, "next greater" ideas.

**5. Stack**
```python
stack = []
for ch in s:
    if ch in "([{":
        stack.append(ch)
    else:
        ...                    # compare with stack.pop()
```
Used by: valid parentheses.

Also common: running total (`running_sum`), XOR to cancel pairs (`single_number`), `sorted(..., key=...)`, digit loops with `% 10` and `// 10`.

## 7. Mistakes that cost the most time

1. Forgetting `int(...)` on `input()` (`"5" + 1` is a `TypeError`).
2. Using `/` where `//` is needed.
3. `a = a.sort()` makes `a` become `None`. `.sort()` and `.reverse()` change in place and return nothing. Use `sorted(a)` to get a new list.
4. `b = a` does **not** copy a list. Use `a.copy()` or `a[:]`.
5. Changing a list while looping over it.
6. `[[0] * n] * m` creates rows that share memory. Use `[[0] * n for _ in range(m)]`.
7. Writing `s[0] = "x"` on a string. Strings can't be changed.
8. Inside a class method, calling another method as `helper()` instead of `self.helper()`.
9. Mixing tabs and spaces. Use 4 spaces.
10. `range(a, b)` excludes `b`.
11. `max([])` raises an error. Handle empty input.
12. Comparing floats with `==`.

`Syntax/08_common_mistakes.py` proves each of these.

## 8. LeetCode format

```python
from typing import List

class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        ...
```
- `self` is always the first parameter. Type hints (`List[int]`, `-> bool`) are labels only.
- Return the answer, do not print it (unless the question says print).
- "In place" problems (`reverse_string`, `move_zeroes`) return nothing: change the argument itself.

## 9. How to attack an OA coding question

1. Read the whole statement and the sample input/output twice.
2. Check the input format first: one line or many? How many test cases?
3. Write down 3 test cases yourself: a normal one, the smallest one (empty, one element) and a tricky one (duplicates, negatives, all equal).
4. Say the approach in one sentence before typing.
5. Write the simple correct version first. Optimise only if the limits need it.
6. Run all the sample cases. Submit only after the edge cases pass.
7. If time is short, a version that passes some test cases beats an unfinished one.

## 10. Practice plan

- Day 1: `Syntax/01` to `04`, then problems 1 to 6 of `Practice/01`.
- Day 2: `Syntax/05` to `08`, then problems 7 to 12.
- Day 3: problems 13 to 18, then `Practice/02` problems A to D.
- Day 4: `Practice/02` problems E and F, then solve 5 LeetCode Easy questions from the list below, timing yourself (15 minutes each).
- After that: mix in the DSA topics from the main `DSA/` folders (Arrays and Hashing, Strings, Two Pointers).

LeetCode Easy list: 1 Two Sum, 217 Contains Duplicate, 242 Valid Anagram, 125 Valid Palindrome, 344 Reverse String, 412 Fizz Buzz, 136 Single Number, 283 Move Zeroes, 387 First Unique Character, 1480 Running Sum, 169 Majority Element, 20 Valid Parentheses, 509 Fibonacci Number, 1295 Find Numbers with Even Number of Digits, 189 Rotate Array (easy-medium).

## 11. Doubts

Ask Dinesh first. Write the doubt down with the exact code and the error message, so it is quick to clear.
