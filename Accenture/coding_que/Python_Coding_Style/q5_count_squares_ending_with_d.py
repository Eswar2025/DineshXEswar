"""
================================================================================
Accenture Coding Assessment Practice
Problem 5: Count Squares Ending with Digit D
================================================================================

PROBLEM STATEMENT:
Given two integer inputs `n` and `d`, iterate through all numbers from 1 to `n`, 
calculate the square of each number, and determine whether the last digit 
(unit digit) of the square is equal to `d`. 

Count and return the total number of integers in the range 1 to `n` whose 
square ends with the digit `d`.

ASSESSMENT PATTERN & CONSTRAINTS:
- Topic: Loops, Basic Math, Number Theory, Modulo Arithmetic
- Difficulty: Easy (Accenture Standard Section)
- Time Limit: 1.0 second
- Constraints:
    * 1 <= n <= 10^5
    * 0 <= d <= 9

EXAMPLES:
Example 1:
    Input: n = 5, d = 9
    Squares:
        1^2 = 1   (unit digit 1)
        2^2 = 4   (unit digit 4)
        3^2 = 9   (unit digit 9) -> Matches d!
        4^2 = 16  (unit digit 6)
        5^2 = 25  (unit digit 5)
    Output: 1

Example 2:
    Input: n = 10, d = 9
    Numbers: 3 (3^2 = 9) and 7 (7^2 = 49) both end in 9.
    Output: 2

Example 3:
    Input: n = 10, d = 2
    Explanation: No square of an integer ever ends in 2, 3, 7, or 8.
    Output: 0
================================================================================
"""


class Solution:
    def countSquaresEndingWithD(self, n: int, d: int) -> int:
        """
        Counts integers from 1 to n whose square ends with digit d.

        Args:
            n (int): Upper bound of the range [1, n].
            d (int): Target last digit (0-9).

        Returns:
            int: Total count of integers.
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
            "name": "Sample Test Case 1 (n=5, d=9)",
            "n": 5,
            "d": 9,
            "expected": 1,
        },
        {
            "name": "Sample Test Case 2 (n=10, d=9)",
            "n": 10,
            "d": 9,
            "expected": 2,
        },
        {
            "name": "Edge Case: Impossible Digit (d=2)",
            "n": 10,
            "d": 2,
            "expected": 0,
        },
        {
            "name": "Test Case: d=4 (ends in 2 or 8)",
            "n": 10,
            "d": 4,
            "expected": 2,
        },
        {
            "name": "Test Case: d=5 (ends in 5)",
            "n": 15,
            "d": 5,
            "expected": 2,  # 5, 15
        },
        {
            "name": "Test Case: d=0 (multiples of 10)",
            "n": 20,
            "d": 0,
            "expected": 2,  # 10, 20
        },
        {
            "name": "Minimal Boundary (n=1, d=1)",
            "n": 1,
            "d": 1,
            "expected": 1,  # 1^2 = 1
        },
        {
            "name": "Larger Range (n=100, d=9)",
            "n": 100,
            "d": 9,
            "expected": 20,  # 2 per decade * 10
        },
    ]

    print("=" * 70)
    print(" Running Accenture Assessment Test Harness: Problem 5")
    print("=" * 70)

    passed_count = 0
    not_implemented = False

    for idx, tc in enumerate(test_cases, start=1):
        n = tc["n"]
        d = tc["d"]
        expected = tc["expected"]
        
        actual = solution.countSquaresEndingWithD(n, d)
        
        if actual is None:
            not_implemented = True
            print(f"[{idx}/{len(test_cases)}] {tc['name']}: NOT IMPLEMENTED")
            continue

        if actual == expected:
            print(f"[{idx}/{len(test_cases)}] [PASS] {tc['name']} -> Output: {actual}")
            passed_count += 1
        else:
            print(f"[{idx}/{len(test_cases)}] [FAIL] {tc['name']}")
            print(f"        Input:    n = {n}, d = {d}")
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
