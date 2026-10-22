# # 02 - if/elif/else, for, while, range, enumerate, break/continue
# # Python uses INDENTATION (4 spaces) instead of { } and a COLON after the header.

# # ---------- if / elif / else ----------
# # cpp function syntax of taking score as input
# # string grade(int score){ 
# # }

# # function grade(score){
# # }
# def grade(score):
#     if score >= 90:
#         return "A"
#     elif score >= 75:
#         return "B"
#     else:
#         return "C"

# assert grade(95) == "A" and grade(80) == "B" and grade(10) == "C"

# # ---------- boolean operators are WORDS ----------
# assert (True and False) is False
# assert (True or False) is True
# assert (not True) is False
# assert 1 < 5 < 10              # chained comparison works!

# # ---------- == vs is ----------
# # == compares values, `is` compares identity. Use `is` only for None.
# x = None
# assert x is None

# # ---------- ternary ----------
# age = 20
# # int c = (a > b) ? a : b;
# status = "adult" if age >= 18 else "minor"
# assert status == "adult"

# # ---------- for + range ----------
# total = 0
# for i in range(5):             # 0,1,2,3,4  (end is EXCLUDED)
#     total += i
# assert total == 10

# assert list(range(2, 8)) == [2, 3, 4, 5, 6, 7]
# assert list(range(10, 0, -3)) == [10, 7, 4, 1]      # start, stop, step
# assert list(range(len("abc") - 1, -1, -1)) == [2, 1, 0]   # reverse indices

# # ---------- for over a list directly ----------
# words = ["a", "bb", "ccc"]
# lengths = []
# for w in words:
#     lengths.append(len(w))
# assert lengths == [1, 2, 3]

# # ---------- enumerate: index AND value ----------
# pairs = []
# for idx, w in enumerate(words):
#     pairs.append((idx, w))
# assert pairs == [(0, "a"), (1, "bb"), (2, "ccc")]

# # ---------- zip: walk two lists together ----------
# assert list(zip([1, 2], ["x", "y"])) == [(1, "x"), (2, "y")]

# # ---------- while, break, continue ----------
# n = 0
# found = None
# while True:
#     n += 1
#     if n % 2 == 0:
#         continue               # skip even numbers
#     if n > 6:
#         found = n
#         break                  # leave the loop
# assert found == 7

# # ---------- for/else (runs else only if loop did NOT break) ----------
# for i in range(3):
#     if i == 99:
#         break
# else:
#     reached_else = True
# assert reached_else

# # ---------- there is NO i++ in Python ----------
# i = 0
# i += 1                         # use += 1
# assert i == 1

# # ---------- pass = empty body placeholder ----------
# if False:
#     pass

# print("02 OK")
for i in range(3):
    print(i)