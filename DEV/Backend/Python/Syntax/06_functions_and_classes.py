# 06 - Functions, default args, the LeetCode "class Solution" format, type hints
from typing import List, Optional      # LeetCode adds these imports for you

# ---------- functions ----------
def add(a, b):
    return a + b

assert add(2, 3) == 5

def power(base, exp=2):                # default argument
    return base ** exp

assert power(3) == 9 and power(2, 5) == 32
assert power(exp=3, base=2) == 8       # keyword arguments

def min_max(nums):
    return min(nums), max(nums)        # returns a tuple, unpack on the left

lo, hi = min_max([4, 1, 9])
assert (lo, hi) == (1, 9)

# A function with no return gives None
def nothing():
    pass

assert nothing() is None

# ---------- scope: reading outer vars is fine, assigning needs `nonlocal` ----------
def counter():
    count = 0
    def inc():
        nonlocal count                 # without this, count += 1 raises an error
        count += 1
        return count
    return inc

c = counter()
c()
assert c() == 2

# ---------- the LeetCode format ----------
# LeetCode gives you a class with a method; `self` is always the first parameter.
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        seen = {}
        for i, x in enumerate(nums):
            if target - x in seen:
                return [seen[target - x], i]
            seen[x] = i
        return []

    def isPalindrome(self, x: int) -> bool:
        s = str(x)
        return s == s[::-1]

    # To call another method inside the class you MUST write self.method()
    def helper_double(self, n: int) -> int:
        return n * 2

    def useHelper(self, n: int) -> int:
        return self.helper_double(n) + 1

sol = Solution()                       # create the object, then call the method
assert sol.twoSum([3, 2, 4], 6) == [1, 2]
assert sol.isPalindrome(121) is True and sol.isPalindrome(10) is False
assert sol.useHelper(4) == 9

# Type hints (List[int], -> bool) are OPTIONAL labels. Python ignores them,
# but LeetCode shows them, so you must be able to read them.

# ---------- a tiny linked list node (LeetCode style) ----------
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

head = ListNode(1, ListNode(2, ListNode(3)))
vals = []
cur = head
while cur:                             # None is falsy
    vals.append(cur.val)
    cur = cur.next
assert vals == [1, 2, 3]

# ---------- lambda (one-line anonymous function) ----------
square = lambda x: x * x
assert square(6) == 36

# ---------- recursion (Python default depth limit ~1000) ----------
def fact(n):
    return 1 if n <= 1 else n * fact(n - 1)

assert fact(5) == 120

# ---------- truthy / falsy ----------
# Falsy: 0, 0.0, "", [], {}, set(), None, False. Everything else is truthy.
assert not []
assert not ""
assert [0]                             # non-empty list is truthy, even [0]

print("06 OK")
