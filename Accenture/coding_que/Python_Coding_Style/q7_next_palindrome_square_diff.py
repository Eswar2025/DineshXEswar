"""
================================================================================
Accenture Coding Assessment Practice
Problem 7: Next Palindromic Perfect Square Difference
================================================================================

PROBLEM STATEMENT:
Given an integer `n`, find the next integer `x` strictly greater than `n` (x > n) 
such that `x` is both a perfect square and a palindrome. 

Return the absolute difference: `x - n`.

DEFINITIONS:
- A perfect square is an integer that is the square of an integer (e.g., 1, 4, 9, 16, 121, 484).
- A palindromic number reads the same forwards and backwards (e.g., 9, 121, 484, 676).

ASSESSMENT PATTERN & CONSTRAINTS:
- Topic: Math, Number Theory, Palindrome, Search
- Difficulty: Easy-Medium (Accenture Advanced / Slot Variant)
- Time Limit: 1.0 second
- Constraints:
    * 0 <= n <= 10^5

EXAMPLES:
Example 1:
    Input: n = 404
    Squares greater than 404:
        21^2 = 441 -> Not a palindrome
        22^2 = 484 -> Palindrome!
    Next palindromic perfect square x = 484
    Difference: x - n = 484 - 404 = 80
    Output: 80

Example 2:
    Input: n = 0
    Next square > 0 is 1^2 = 1 (palindrome).
    Difference: 1 - 0 = 1
    Output: 1

Example 3:
    Input: n = 9
    Squares: 16, 25, 36, 49, 64, 81, 100 are not palindromes.
    11^2 = 121 is a palindrome.
    Difference: 121 - 9 = 112
    Output: 112

Example 4:
    Input: n = 121
    Explanation: Since x must be strictly GREATER than n, 121 itself cannot be used.
                 The next palindromic square is 22^2 = 484.
    Difference: 484 - 121 = 363
    Output: 363
================================================================================
"""


class Solution:
    def nextPalindromeSquareDiff(self, n: int) -> int:
        """
        Finds the next integer x > n that is both a perfect square and a palindrome,
        and returns x - n.

        Args:
            n (int): The baseline integer.

        Returns:
            int: The difference (x - n).
        """
        # ======================================================================
        # >>> WRITE YOUR CODE BELOW THIS LINE <<<
        # ======================================================================
        
        pass  # Replace with your code
        
        # ======================================================================
        # >>> WRITE YOUR CODE ABOVE THIS LINE <<<
        # ======================================================================


# ==============================================================================
# TEST RUNNER & TEST SCENARIOS (Accenture Assessment Test Harness)
# ==============================================================================
def run_tests():
    solution = Solution()
    
    test_cases = [
        {
            "name": "Sample Test Case 1 (n = 404)",
            "n": 404,
            "expected": 80,  # 484 - 404
        },
        {
            "name": "Edge Case: Zero (n = 0)",
            "n": 0,
            "expected": 1,  # 1 - 0
        },
        {
            "name": "Edge Case: Single Digit (n = 4)",
            "n": 4,
            "expected": 5,  # 9 - 4
        },
        {
            "name": "Jump to 3-digit Palindromic Square (n = 9)",
            "n": 9,
            "expected": 112,  # 121 - 9
        },
        {
            "name": "Strictly Greater than existing square (n = 121)",
            "n": 121,
            "expected": 363,  # 484 - 121
        },
        {
            "name": "Intermediate Value (n = 500)",
            "n": 500,
            "expected": 176,  # 26^2 = 676 -> 676 - 500 = 176
        },
        {
            "name": "Test Case (n = 20)",
            "n": 20,
            "expected": 101,  # 121 - 20 = 101
        },
    ]

    print("=" * 70)
    print(" Running Accenture Assessment Test Harness: Problem 7")
    print("=" * 70)

    passed_count = 0
    not_implemented = False

    for idx, tc in enumerate(test_cases, start=1):
        n = tc["n"]
        expected = tc["expected"]
        
        actual = solution.nextPalindromeSquareDiff(n)
        
        if actual is None:
            not_implemented = True
            print(f"[{idx}/{len(test_cases)}] {tc['name']}: NOT IMPLEMENTED")
            continue

        if actual == expected:
            print(f"[{idx}/{len(test_cases)}] [PASS] {tc['name']} -> Output: {actual}")
            passed_count += 1
        else:
            print(f"[{idx}/{len(test_cases)}] [FAIL] {tc['name']}")
            print(f"        Input:    n = {n}")
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
