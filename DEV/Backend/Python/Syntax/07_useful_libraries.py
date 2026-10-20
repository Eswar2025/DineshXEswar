# 07 - Libraries that show up in easy/medium coding questions
import math
import heapq
import bisect
from collections import deque, Counter, defaultdict
from itertools import combinations, permutations
import sys

# ---------- math ----------
assert math.sqrt(16) == 4.0
assert math.isqrt(17) == 4                 # integer sqrt (exact, no float error)
assert math.gcd(12, 18) == 6
assert math.lcm(4, 6) == 12                # Python 3.9+
assert math.ceil(2.1) == 3 and math.floor(2.9) == 2
assert math.factorial(5) == 120
assert math.inf > 10 ** 18                 # infinity, for "min so far" starts
assert float("inf") == math.inf
assert 10 ** 30 + 1 == 1000000000000000000000000000001   # ints never overflow

# ---------- deque: fast pop from the left (use for queues / BFS) ----------
q = deque([1, 2, 3])
q.append(4)
assert q.popleft() == 1                    # O(1)  (list.pop(0) would be O(n))
q.appendleft(0)
assert list(q) == [0, 2, 3, 4]

# ---------- heapq: MIN heap (priority queue) ----------
h = []
for x in [5, 1, 8, 3]:
    heapq.heappush(h, x)
assert heapq.heappop(h) == 1               # smallest first
assert h[0] == 3                           # peek at the smallest
# For a MAX heap, push negatives:
mh = []
for x in [5, 1, 8]:
    heapq.heappush(mh, -x)
assert -heapq.heappop(mh) == 8
assert heapq.nlargest(2, [4, 9, 1, 7]) == [9, 7]
assert heapq.nsmallest(2, [4, 9, 1, 7]) == [1, 4]

# ---------- bisect: binary search on a SORTED list ----------
arr = [1, 3, 3, 5, 7]
assert bisect.bisect_left(arr, 3) == 1     # first index where 3 could go
assert bisect.bisect_right(arr, 3) == 3    # index after the last 3
assert bisect.bisect_left(arr, 4) == 3

# ---------- itertools ----------
assert list(combinations([1, 2, 3], 2)) == [(1, 2), (1, 3), (2, 3)]
assert len(list(permutations([1, 2, 3]))) == 6

# ---------- sys: fast input for big inputs ----------
# input = sys.stdin.readline     # faster than input(); remember .strip() the result
# sys.setrecursionlimit(10**6)   # raise the recursion limit (default ~1000)
assert sys.maxsize > 2 ** 60

# ---------- min/max with infinity ----------
best = math.inf
for x in [7, 3, 9]:
    best = min(best, x)
assert best == 3

# ---------- string/number helpers ----------
assert bin(5) == "0b101"
assert bin(5)[2:] == "101"
assert int("101", 2) == 5                  # binary string -> int
assert 5 & 1 == 1                          # bit AND (odd check)
assert 5 ^ 5 == 0                          # XOR (cancels equal numbers)
assert 1 << 3 == 8                         # left shift
assert round(2.567, 2) == 2.57

# ---------- swap-free "sort two things together" ----------
names = ["b", "a"]
ages = [30, 20]
combined = sorted(zip(ages, names))
assert combined == [(20, "a"), (30, "b")]

print("07 OK")
