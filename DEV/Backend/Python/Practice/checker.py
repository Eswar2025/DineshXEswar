"""Tiny test runner for the practice files. You do not need to edit this file.

Each practice file ends with:
    from checker import run
    run(globals())
which calls your functions with the test cases below and prints PASS / FAIL.
"""
import copy

# name -> list of (arguments tuple, expected result)
TESTS = {
    "second_largest": [(([4, 9, 2, 7],), 7), (([5, 5, 3],), 3), (([10, 20],), 10)],
    "count_vowels": [(("education",), 5), (("rhythm",), 0), (("AEIOU",), 5)],
    "digit_sum": [((1234,), 10), ((0,), 0), ((999,), 27)],
    "is_prime": [((2,), True), ((1,), False), ((17,), True), ((21,), False)],
    "fib": [((0,), 0), ((1,), 1), ((10,), 55)],
    "fizz_buzz": [
        ((5,), ["1", "2", "Fizz", "4", "Buzz"]),
        ((15,), ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz",
                 "11", "Fizz", "13", "14", "FizzBuzz"]),
    ],
    "leaders": [
        (([16, 17, 4, 3, 5, 2],), [17, 5, 2]),
        (([1, 2, 3, 4, 0],), [4, 0]),
        (([5, 4, 3],), [5, 4, 3]),
    ],
    "two_sum": [(([2, 7, 11, 15], 9), [0, 1]), (([3, 2, 4], 6), [1, 2]), (([3, 3], 6), [0, 1])],
    "contains_duplicate": [(([1, 2, 3, 1],), True), (([1, 2, 3],), False), (([],), False)],
    "is_anagram": [(("anagram", "nagaram"), True), (("rat", "car"), False), (("a", "ab"), False)],
    "is_palindrome": [
        (("A man, a plan, a canal: Panama",), True),
        (("race a car",), False),
        ((" ",), True),
    ],
    "reverse_string": [((["h", "e", "l", "l", "o"],), ["o", "l", "l", "e", "h"]), ((["a"],), ["a"])],
    "single_number": [(([2, 2, 1],), 1), (([4, 1, 2, 1, 2],), 4), (([7],), 7)],
    "move_zeroes": [(([0, 1, 0, 3, 12],), [1, 3, 12, 0, 0]), (([0],), [0]), (([1, 2],), [1, 2])],
    "first_unique_char": [(("leetcode",), 0), (("loveleetcode",), 2), (("aabb",), -1)],
    "running_sum": [(([1, 2, 3, 4],), [1, 3, 6, 10]), (([3, 1, 2, 10, 1],), [3, 4, 6, 16, 17])],
    "majority_element": [(([3, 2, 3],), 3), (([2, 2, 1, 1, 1, 2, 2],), 2)],
    "valid_parentheses": [(("()[]{}",), True), (("(]",), False), (("([)]",), False), (("{[]}",), True)],
}

# These functions change their argument in place (like LeetCode) instead of returning.
IN_PLACE = {"reverse_string", "move_zeroes"}


def run(namespace):
    passed = 0
    total = 0
    for name, cases in TESTS.items():
        func = namespace.get(name)
        if func is None:
            continue                        # problem not in this file
        ok = True
        for args, expected in cases:
            args = copy.deepcopy(args)
            try:
                if name in IN_PLACE:
                    func(*args)
                    got = args[0]
                else:
                    got = func(*args)
            except Exception as e:           # a crash counts as a fail
                got = f"ERROR {type(e).__name__}: {e}"
            if got != expected:
                ok = False
                print(f"  FAIL {name}{args}: expected {expected!r}, got {got!r}")
                break
        total += 1
        passed += ok
        print(f"{'PASS' if ok else 'FAIL'}  {name}")
    print(f"\n{passed}/{total} problems passed")
