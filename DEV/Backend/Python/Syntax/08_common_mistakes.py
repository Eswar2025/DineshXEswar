# 08 - The mistakes that cost the most time in an online assessment.
# Each block shows the WRONG way (as a comment) and proves the RIGHT way.

# 1. input() gives a string
#    n = input(); n + 1          -> TypeError
n = int("5")
assert n + 1 == 6

# 2. Integer vs float division
assert 7 // 2 == 3                          # not 7 / 2 (that is 3.5)

# 3. Changing a list while looping over it
nums = [1, 2, 3, 4]
#    for x in nums: if x % 2 == 0: nums.remove(x)    -> skips elements
nums = [x for x in nums if x % 2 != 0]      # build a new list instead
assert nums == [1, 3]

# 4. Mutable default argument
#    def f(x, acc=[]): acc.append(x)         -> the SAME list is reused
def f(x, acc=None):
    if acc is None:
        acc = []
    acc.append(x)
    return acc

assert f(1) == [1] and f(2) == [2]

# 5. list.sort() and list.reverse() return None
a = [3, 1, 2]
#    a = a.sort()                            -> a becomes None
a.sort()
assert a == [1, 2, 3]

# 6. Strings can't be changed in place
s = "abc"
#    s[0] = "z"                              -> TypeError
s = "z" + s[1:]
assert s == "zbc"

# 7. Copying a list
b = [1, 2]
c = b                                        # same list, not a copy
c.append(3)
assert b == [1, 2, 3]
d = b[:]                                     # real copy (or b.copy())
d.append(4)
assert b == [1, 2, 3]

# 8. 2D list creation
bad = [[0] * 2] * 2                          # rows share memory
good = [[0] * 2 for _ in range(2)]
good[0][0] = 1
assert good == [[1, 0], [0, 0]]

# 9. Indentation: a mix of tabs and spaces is an error. Use 4 spaces everywhere.

# 10. range() end is EXCLUDED
assert list(range(1, 4)) == [1, 2, 3]

# 11. Empty-input edge cases (LeetCode loves these)
def safe_max(nums):
    if not nums:                             # handles []
        return 0
    return max(nums)

assert safe_max([]) == 0
#    max([]) raises ValueError

# 12. Equality of floats
assert abs((0.1 + 0.2) - 0.3) < 1e-9         # never use == on floats

# 13. Negative index in slicing
assert [1, 2, 3, 4][-2:] == [3, 4]

# 14. `is` vs `==`
assert [1] == [1]                            # same value
assert ([1] is [1]) is False                 # different objects

# 15. Variables inside a function don't leak out, and assigning to an
#     outer variable inside a function creates a NEW local one.
total = 0
def wrong():
    total = 5                                # local, outer total unchanged
wrong()
assert total == 0

print("08 OK")
