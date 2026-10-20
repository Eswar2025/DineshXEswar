# 03 - Lists, indexing, slicing, list comprehensions, sorting
# A Python list = dynamic array (like vector<int> in C++).

nums = [5, 3, 8, 1]

# ---------- basics ----------
assert len(nums) == 4
assert nums[0] == 5
assert nums[-1] == 1           # negative index counts from the end
assert nums[-2] == 8

nums.append(9)                 # add at the end        O(1)
assert nums == [5, 3, 8, 1, 9]
nums.pop()                     # remove last           O(1)
nums.insert(0, 7)              # insert at index       O(n)
assert nums == [7, 5, 3, 8, 1]
nums.remove(8)                 # remove first VALUE 8  O(n)
assert nums == [7, 5, 3, 1]
del nums[0]                    # delete by index
assert nums == [5, 3, 1]
assert 3 in nums               # membership test       O(n) for lists
assert nums.index(3) == 1
assert nums.count(1) == 1

# ---------- slicing [start:stop:step]  (stop is EXCLUDED) ----------
a = [0, 1, 2, 3, 4, 5]
assert a[1:4] == [1, 2, 3]
assert a[:3] == [0, 1, 2]
assert a[3:] == [3, 4, 5]
assert a[-2:] == [4, 5]
assert a[::2] == [0, 2, 4]
assert a[::-1] == [5, 4, 3, 2, 1, 0]       # reversed copy
assert a[:] == a and a[:] is not a         # a[:] makes a COPY

# ---------- IMPORTANT: assignment does not copy ----------
b = a
b.append(99)
assert a[-1] == 99                          # a changed too (same list)
c = a.copy()                                # real copy
c.append(100)
assert a[-1] == 99

# ---------- list comprehension ----------
squares = [x * x for x in range(5)]
assert squares == [0, 1, 4, 9, 16]
evens = [x for x in range(10) if x % 2 == 0]
assert evens == [0, 2, 4, 6, 8]

# ---------- 2D list: build it correctly ----------
grid = [[0] * 3 for _ in range(2)]          # CORRECT: 2 separate rows
grid[0][0] = 1
assert grid == [[1, 0, 0], [0, 0, 0]]
bad = [[0] * 3] * 2                         # WRONG: same row twice
bad[0][0] = 1
assert bad == [[1, 0, 0], [1, 0, 0]]        # both rows changed!

# ---------- sorting ----------
data = [3, 1, 2]
assert sorted(data) == [1, 2, 3]            # returns a NEW list
assert data == [3, 1, 2]
data.sort()                                 # sorts IN PLACE, returns None
assert data == [1, 2, 3]
assert sorted(data, reverse=True) == [3, 2, 1]
words = ["bb", "a", "ccc"]
assert sorted(words, key=len) == ["a", "bb", "ccc"]          # key function
pairs = [(1, "b"), (1, "a"), (0, "z")]
assert sorted(pairs, key=lambda p: (p[0], p[1])) == [(0, "z"), (1, "a"), (1, "b")]

# ---------- handy built-ins ----------
assert sum([1, 2, 3]) == 6
assert max([4, 9, 2]) == 9 and min([4, 9, 2]) == 2
assert max(["a", "bbb", "cc"], key=len) == "bbb"
assert list(reversed([1, 2, 3])) == [3, 2, 1]
assert any(x > 2 for x in [1, 2, 3]) is True
assert all(x > 0 for x in [1, 2, 3]) is True

# ---------- unpacking ----------
first, *rest = [1, 2, 3, 4]
assert first == 1 and rest == [2, 3, 4]

# ---------- extend vs append ----------
l = [1]
l.append([2, 3])            # adds the list AS ONE item
assert l == [1, [2, 3]]
l = [1]
l.extend([2, 3])            # adds each item
assert l == [1, 2, 3]

print("03 OK")
