# 04 - Strings
# Strings are IMMUTABLE: you cannot do s[0] = "x". Build a new string instead.

s = "Hello, World"

# ---------- indexing and slicing (same as lists) ----------
assert s[0] == "H" and s[-1] == "d"
assert s[:5] == "Hello"
assert s[::-1] == "dlroW ,olleH"            # reverse a string

# ---------- common methods (each returns a NEW string) ----------
assert s.lower() == "hello, world"
assert s.upper() == "HELLO, WORLD"
assert "  hi  ".strip() == "hi"
assert "a,b,c".split(",") == ["a", "b", "c"]
assert "a b  c".split() == ["a", "b", "c"]  # split() with no arg handles any spaces
assert "-".join(["a", "b", "c"]) == "a-b-c"
assert "".join(["a", "b"]) == "ab"
assert s.replace("l", "L") == "HeLLo, WorLd"
assert s.startswith("Hello") and s.endswith("World")
assert s.find("o") == 4                     # first index, -1 if missing
assert s.find("z") == -1
assert s.count("l") == 3
assert "abc" in "xabcx"                     # substring test

# ---------- character checks ----------
assert "a".isalpha() and "5".isdigit() and "a5".isalnum()
assert " ".isspace()
assert "A".isupper() and "a".islower()

# ---------- chars <-> numbers ----------
assert ord("a") == 97
assert chr(98) == "b"
assert ord("c") - ord("a") == 2             # position in alphabet (0-based)
assert str(123) == "123" and int("123") == 123

# ---------- loop over characters ----------
vowels = 0
for ch in "education":
    if ch in "aeiou":
        vowels += 1
assert vowels == 5

# ---------- build a string (do NOT += in a huge loop; use list + join) ----------
parts = []
for ch in "abc":
    parts.append(ch.upper())
assert "".join(parts) == "ABC"

# ---------- palindrome (classic) ----------
def is_palindrome(t):
    cleaned = [c.lower() for c in t if c.isalnum()]
    return cleaned == cleaned[::-1]

assert is_palindrome("A man, a plan, a canal: Panama") is True
assert is_palindrome("race a car") is False

# ---------- comparison ----------
assert "apple" < "banana"                   # alphabetical order
assert "a" * 3 == "aaa"                     # repetition

# ---------- formatting ----------
x, y = 3, 4.5
assert f"{x} and {y}" == "3 and 4.5"
assert f"{y:.2f}" == "4.50"
assert f"{x:03d}" == "003"                  # zero pad to width 3

# ---------- converting between str and list of chars ----------
chars = list("abc")
chars[0] = "z"                              # lists CAN be changed
assert "".join(chars) == "zbc"

print("04 OK")
