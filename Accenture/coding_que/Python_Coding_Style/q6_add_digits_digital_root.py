"""
================================================================================
Accenture Coding Assessment Practice
Problem 6: Add Digits (Digital Root)
================================================================================

PROBLEM STATEMENT:
Given an integer `num`, repeatedly add all its digits until the result has 
only one digit, and return it.

ASSESSMENT PATTERN & CONSTRAINTS:
- Topic: Math, Simulation, Digital Root, Modulo Arithmetic
- Difficulty: Easy (Accenture Standard Section / LeetCode 258)
- Time Limit: 1.0 second
- Space Limit: O(1)
- Constraints:
    * 0 <= num <= 2^31 - 1

EXAMPLES:
Example 1:
    Input: num = 38
    Step-by-step trace:
        38 -> 3 + 8 = 11
        11 -> 1 + 1 = 2
        Since 2 has only one digit, return 2.
    Output: 2

Example 2:
    Input: num = 0
    Explanation: 0 is already a single digit.
    Output: 0

Example 3:
    Input: num = 9
    Explanation: 9 is already a single digit.
    Output: 9

Example 4:
    Input: num = 9999
    Step-by-step trace:
        9 + 9 + 9 + 9 = 36
        3 + 6 = 9
    Output: 9
================================================================================
"""


class Solution:
    def addDigits(self, num: int) -> int:
        """
        Continuously adds digits of num until a single-digit number is reached.

        Args:
            num (int): A non-negative integer.

        Returns:
            int: The single-digit digital root.
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
            "name": "Sample Test Case 1 (num = 38)",
            "num": 38,
            "expected": 2,
        },
        {
            "name": "Edge Case: Zero (num = 0)",
            "num": 0,
            "expected": 0,
        },
        {
            "name": "Single Digit (num = 9)",
            "num": 9,
            "expected": 9,
        },
        {
            "name": "Single Digit (num = 7)",
            "num": 7,
            "expected": 7,
        },
        {
            "name": "Two Digits: Boundary 10",
            "num": 10,
            "expected": 1,
        },
        {
            "name": "All Nines (num = 9999)",
            "num": 9999,
            "expected": 9,
        },
        {
            "name": "Standard Number (num = 12345)",
            # 1+2+3+4+5 = 15 -> 1+5 = 6
            "num": 12345,
            "expected": 6,
        },
        {
            "name": "Large Value (num = 2147483647)",
            # Sum = 46 -> 4+6 = 10 -> 1+0 = 1
            "num": 2147483647,
            "expected": 1,
        },
    ]

    print("=" * 70)
    print(" Running Accenture Assessment Test Harness: Problem 6")
    print("=" * 70)

    passed_count = 0
    not_implemented = False

    for idx, tc in enumerate(test_cases, start=1):
        num = tc["num"]
        expected = tc["expected"]
        
        actual = solution.addDigits(num)
        
        if actual is None:
            not_implemented = True
            print(f"[{idx}/{len(test_cases)}] {tc['name']}: NOT IMPLEMENTED")
            continue

        if actual == expected:
            print(f"[{idx}/{len(test_cases)}] [PASS] {tc['name']} -> Output: {actual}")
            passed_count += 1
        else:
            print(f"[{idx}/{len(test_cases)}] [FAIL] {tc['name']}")
            print(f"        Input:    num = {num}")
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
