# 05 - dict (hash map), set (hash set), tuple
# dict ~ unordered_map in C++, HashMap in Java. Average O(1) lookup/insert.

# ---------- dict basics ----------
d = {"a": 1, "b": 2}
d["c"] = 3                         # insert / update
assert d["a"] == 1
assert "b" in d                    # checks KEYS, O(1)
assert d.get("z") is None          # safe lookup (no error)
assert d.get("z", 0) == 0          # default value
del d["c"]
assert len(d) == 2
# d["missing"]                     # would raise KeyError

# ---------- looping ----------
keys = []
for k in d:                        # keys by default
    keys.append(k)
assert keys == ["a", "b"]          # dicts keep insertion order (Python 3.7+)

total = 0
for k, v in d.items():             # key and value
    total += v
assert total == 3
assert list(d.keys()) == ["a", "b"]
assert list(d.values()) == [1, 2]

# ---------- THE frequency-count pattern ----------
freq = {}
for ch in "banana":
    freq[ch] = freq.get(ch, 0) + 1
assert freq == {"b": 1, "a": 3, "n": 2}

# ---------- defaultdict and Counter (shortcuts) ----------
from collections import defaultdict, Counter

dd = defaultdict(int)              # missing keys start at 0
for ch in "banana":
    dd[ch] += 1
assert dd["a"] == 3

groups = defaultdict(list)         # missing keys start as []
for w in ["eat", "tea", "tan"]:
    groups["".join(sorted(w))].append(w)
assert groups["aet"] == ["eat", "tea"]

c = Counter("banana")
assert c["a"] == 3
assert c["zzz"] == 0               # missing -> 0, no error
assert c.most_common(1) == [("a", 3)]
assert Counter([1, 1, 2]) == Counter([2, 1, 1])   # anagram check idea

# ---------- find key with max value ----------
best = max(freq, key=freq.get)
assert best == "a"

# ---------- sort a dict by value ----------
by_value = sorted(freq.items(), key=lambda kv: kv[1], reverse=True)
assert by_value[0] == ("a", 3)

# ---------- set: unique values, O(1) membership ----------
s = {1, 2, 3}
s.add(4)
s.add(2)                           # duplicates ignored
assert s == {1, 2, 3, 4}
s.discard(10)                      # no error if missing (remove() raises)
assert 3 in s
assert set([1, 1, 2, 2, 3]) == {1, 2, 3}      # dedupe a list
assert len(set("hello")) == 4
empty_set = set()                  # {} would make an empty DICT, not a set
assert type(empty_set) is set and type({}) is dict
assert {1, 2, 3} & {2, 3, 4} == {2, 3}        # intersection
assert {1, 2} | {2, 3} == {1, 2, 3}           # union
assert {1, 2, 3} - {2} == {1, 3}              # difference

# ---------- Two Sum with a dict (most famous easy problem) ----------
def two_sum(nums, target):
    seen = {}                      # value -> index
    for i, x in enumerate(nums):
        need = target - x
        if need in seen:
            return [seen[need], i]
        seen[x] = i
    return []

assert two_sum([2, 7, 11, 15], 9) == [0, 1]

# ---------- tuple: immutable list, can be a dict key ----------
t = (1, 2)
assert t[0] == 1
a, b = t                           # unpacking
assert (a, b) == (1, 2)
grid_seen = {(0, 0): "start"}
assert grid_seen[(0, 0)] == "start"
single = (5,)                      # one-element tuple needs the comma
assert type(single) is tuple

print("05 OK")
