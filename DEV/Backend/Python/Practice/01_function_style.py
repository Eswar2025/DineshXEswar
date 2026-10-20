# Practice 1 - LeetCode / function style
# Fill in each function (replace `pass`), then run:  python 01_function_style.py
# Every problem prints PASS or FAIL. Do not rename the functions.
# Easy ones first. The last problems are the "classic" OA ones.


# 1. Return the second largest DISTINCT value in a list. (Assume it exists.)
#    [4, 9, 2, 7] -> 7        [5, 5, 3] -> 3
def second_largest(nums):
    pass


# 2. Count the vowels (a e i o u, any case) in a string.
#    "education" -> 5
def count_vowels(s):
    pass


# 3. Return the sum of the digits of a non-negative integer.
#    1234 -> 10
def digit_sum(n):
    pass


# 4. Return True if n is a prime number. (1 is not prime.)
def is_prime(n):
    pass


# 5. Return the n-th Fibonacci number (fib(0)=0, fib(1)=1).
#    fib(10) -> 55
def fib(n):
    pass


# 6. FizzBuzz: return a list of strings for 1..n.
#    multiple of 3 -> "Fizz", of 5 -> "Buzz", of both -> "FizzBuzz", else the number as a string.
def fizz_buzz(n):
    pass


# 7. LEADERS in an array (reported in a real Accenture OA).
#    An element is a leader if it is strictly greater than every element to its right.
#    The last element is always a leader. Return leaders in the order they appear.
#    [16, 17, 4, 3, 5, 2] -> [17, 5, 2]
def leaders(nums):
    pass


# 8. LeetCode 1 - Two Sum: return the indices [i, j] (i < j) of the two numbers adding up to target.
def two_sum(nums, target):
    pass


# 9. LeetCode 217 - Contains Duplicate: True if any value appears at least twice.
def contains_duplicate(nums):
    pass


# 10. LeetCode 242 - Valid Anagram: True if t is a rearrangement of s.
def is_anagram(s, t):
    pass


# 11. LeetCode 125 - Valid Palindrome: ignore case and non-alphanumeric characters.
def is_palindrome(s):
    pass


# 12. LeetCode 344 - Reverse String: reverse the list of characters IN PLACE (return nothing).
def reverse_string(s):
    pass


# 13. LeetCode 136 - Single Number: every value appears twice except one. Return that one.
def single_number(nums):
    pass


# 14. LeetCode 283 - Move Zeroes: move all 0s to the end IN PLACE, keep the order of the others.
def move_zeroes(nums):
    pass


# 15. LeetCode 387 - First Unique Character: index of the first character that appears once, else -1.
def first_unique_char(s):
    pass


# 16. LeetCode 1480 - Running Sum: result[i] = sum of nums[0..i].
def running_sum(nums):
    pass


# 17. LeetCode 169 - Majority Element: the value that appears more than n/2 times.
def majority_element(nums):
    pass


# 18. LeetCode 20 - Valid Parentheses: brackets ()[]{} must close in the right order.
def valid_parentheses(s):
    pass


from checker import run
run(globals())
