# 01 - Variables, types, printing, and reading input
# Run: python 01_basics_and_io.py        (no input needed; input examples are simulated)

# ---------- variables and types (no declaration, no semicolons) ----------
a = 10            # int
b = 3.5           # float
name = "Eswar"    # str
flag = True       # bool (capital T)
nothing = None    # like null

print(type(a), type(b), type(name), type(flag), type(nothing))

# ---------- arithmetic ----------
assert 7 / 2 == 3.5        # / is ALWAYS float division
assert 7 // 2 == 3         # // is floor (integer) division
assert -7 // 2 == -4       # floor rounds DOWN, not toward zero (differs from C++/Java)
assert 7 % 3 == 1
assert 2 ** 10 == 1024     # power
assert abs(-5) == 5
assert divmod(17, 5) == (3, 2)   # quotient and remainder together

# ---------- swapping and multiple assignment ----------
x, y = 1, 2
x, y = y, x                # swap without temp
assert (x, y) == (2, 1)

# ---------- type conversion ----------
assert int("42") == 42
assert float("2.5") == 2.5
assert str(99) == "99"
assert int(7.9) == 7       # truncates

# ---------- print ----------
print("Hello", "World")                 # Hello World   (space between)
print("a", "b", sep="-")                # a-b
print("no newline", end="")             # stays on same line
print()                                 # newline
print(f"{name} is {a} years, pi~{3.14159:.2f}")   # f-string, 2 decimals -> 3.14

# ---------- reading input (OA style) ----------
# input() ALWAYS returns a string.
#   n = int(input())                          one integer
#   a, b = map(int, input().split())          two ints on one line
#   arr = list(map(int, input().split()))     a list of ints on one line
#   s = input().strip()                       one string, spaces around removed
#
# Simulating the same parsing with fixed strings so this file runs without typing:
line = "5 8"
p, q = map(int, line.split())
assert p + q == 13

line = "3 1 4 1 5"
arr = list(map(int, line.split()))
assert arr == [3, 1, 4, 1, 5]

# To read many lines:
#   for _ in range(int(input())):
#       row = list(map(int, input().split()))

print("01 OK")
