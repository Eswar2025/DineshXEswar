"""
================================================================================
Accenture Coding Assessment Practice
Problem 4: Conditional Digit-Length Sum
================================================================================

PROBLEM STATEMENT:
Given an array of integers `a` of length `n`, inspect the number of digits 
(digit length) of each element and compute a total sum based on the following rules:

1. If the digit length of an element is EVEN:
   Add the SQUARE of the element's digit length to the total:
   contribution = (digit_length)^2

2. If the digit length of an element is ODD:
   Add the SUM OF THE INDIVIDUAL DIGITS of that element to the total:
   contribution = sum(digits)

Task:
Return the final total accumulated sum across all n elements.

ASSESSMENT PATTERN & CONSTRAINTS:
- Topic: Math, Strings, Array Traversal, Digit Extraction
- Difficulty: Easy (Accenture Standard Question 1 style)
- Time Limit: 1.0s
- Constraints:
    * 0 <= n <= 10^5
    * 0 <= a[i] <= 10^9

EXAMPLES:
Example 1:
    Input: n = 4, a = [12, 345, 7, 8888]
    Step-by-step trace:
    - 12:   digit length = 2 (Even) -> add 2^2 = 4
    - 345:  digit length = 3 (Odd)  -> add (3 + 4 + 5) = 12
    - 7:    digit length = 1 (Odd)  -> add 7 = 7
    - 8888: digit length = 4 (Even) -> add 4^2 = 16
    Total = 4 + 12 + 7 + 16 = 39
    Output: 39

Example 2:
    Input: n = 2, a = [10, 99]
    Step-by-step trace:
    - 10: digit length = 2 (Even) -> add 2^2 = 4
    - 99: digit length = 2 (Even) -> add 2^2 = 4
    Total = 4 + 4 = 8
    Output: 8

Example 3:
    Input: n = 1, a = [0]
    Explanation: 0 has 1 digit (Odd) -> sum of digits = 0.
    Output: 0
================================================================================
"""

from typing import List


def digitLen(n):
    len = 0
    while n > 0:
        n = n // 10
        len = len + 1
    return len

def numberSum(n) :
    sum = 0
    while n > 0:
        sum += n%10
        n = n//10
    return sum
    
class Solution:
    def calculateDigitRuleSum(self, n: int, a: List[int]) -> int:
        totalSum = 0
        for i in range(n) :
            if digitLen(a[i]) % 2 == 0 :
                totalSum = totalSum + digitLen(a[i])**2
            else: 
                totalSum = totalSum + numberSum(a[i])
        return totalSum


# ==============================================================================
# TEST RUNNER & TEST SCENARIOS (Accenture Assessment Test Harness)
# ==============================================================================
def run_tests():
    solution = Solution()
    
    test_cases = [
        {
            "name": "Sample Test Case 1 (Mixed Even/Odd Lengths)",
            "n": 4,
            "a": [12, 345, 7, 8888],
            "expected": 39,
        },
        {
            "name": "Sample Test Case 2 (All Even Lengths)",
            "n": 2,
            "a": [10, 99],
            "expected": 8,
        },
        {
            "name": "Edge Case: Single Zero",
            "n": 1,
            "a": [0],
            "expected": 0,
        },
        {
            "name": "Edge Case: Empty Array (n = 0)",
            "n": 0,
            "a": [],
            "expected": 0,
        },
        {
            "name": "All Odd Lengths (Check Sum of Digits)",
            "n": 3,
            "a": [101, 202, 303],
            # 101: 1+0+1 = 2
            # 202: 2+0+2 = 4
            # 303: 3+0+3 = 6
            # Total = 12
            "expected": 12,
        },
        {
            "name": "Boundary Test: Large Digits",
            "n": 4,
            "a": [1000, 25, 11111, 9],
            # 1000:  len 4 (even) -> 4^2 = 16
            # 25:    len 2 (even) -> 2^2 = 4
            # 11111: len 5 (odd)  -> 1+1+1+1+1 = 5
            # 9:     len 1 (odd)  -> 9
            # Total = 16 + 4 + 5 + 9 = 34
            "expected": 34,
        },
    ]

    print("=" * 70)
    print(" Running Accenture Assessment Test Harness: Problem 4")
    print("=" * 70)

    passed_count = 0
    not_implemented = False

    for idx, tc in enumerate(test_cases, start=1):
        n = tc["n"]
        a = tc["a"]
        expected = tc["expected"]
        
        actual = solution.calculateDigitRuleSum(n, a)
        
        if actual is None:
            not_implemented = True
            print(f"[{idx}/{len(test_cases)}] {tc['name']}: NOT IMPLEMENTED")
            continue

        if actual == expected:
            print(f"[{idx}/{len(test_cases)}] [PASS] {tc['name']} -> Output: {actual}")
            passed_count += 1
        else:
            print(f"[{idx}/{len(test_cases)}] [FAIL] {tc['name']}")
            print(f"        Input:    a = {a}")
            print(f"        Expected: {expected}")
            print(f"        Actual:   {actual}")

    print("=" * 70)
    if not_implemented:
        print("STATUS: Function returned None. Complete the function in Solution and re-run!")
    else:
        print(f"TEST RESULT: {passed_count}/{len(test_cases)} Passed ({passed_count / len(test_cases) * 100:.1f}%)")
    print("=" * 70)


if __name__ == "__main__":
    run_tests()
