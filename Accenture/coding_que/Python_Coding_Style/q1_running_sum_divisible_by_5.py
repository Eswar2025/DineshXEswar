"""
================================================================================
Accenture Coding Assessment Practice
Problem 1: Running Sum Divisible by 5
================================================================================

PROBLEM STATEMENT:
Given a positive integer `n`, calculate the running sum from 1 to `n`. 
Increment a counter every time the running sum is divisible by 5.
Output the total running sum and the final count.

ASSESSMENT PATTERN & CONSTRAINTS:
- Topic: Loops, Number Theory, Prefix Sums
- Platform Style: LeetCode / Wheebox / HackerRank Function Signature
- Typical Time Limit: 1.0 second
- Constraints:
    * 1 <= n <= 10^5

EXAMPLES:
Example 1:
    Input: n = 5
    Step-by-step trace:
        i = 1: running sum = 1
        i = 2: running sum = 1 + 2 = 3
        i = 3: running sum = 3 + 3 = 6
        i = 4: running sum = 6 + 4 = 10 -> Divisible by 5! (count = 1)
        i = 5: running sum = 10 + 5 = 15 -> Divisible by 5! (count = 2)
    Output: (15, 2)
    Explanation: Total running sum = 15, count of times divisible by 5 = 2.

Example 2:
    Input: n = 1
    Output: (1, 0)
    Explanation: Running sum is 1, not divisible by 5, count = 0.

Example 3:
    Input: n = 10
    Output: (55, 4)
    Explanation: Sums divisible by 5 occur at i = 4 (sum 10), i = 5 (sum 15),
                 i = 9 (sum 45), i = 10 (sum 55).
================================================================================
"""

from typing import Tuple


class Solution:
    def runningSumDivisibleBy5(self, n: int) -> Tuple[int, int]:
        """
        Calculates the running sum from 1 to n and counts how many times 
        the running sum is divisible by 5.

        Args:
            n (int): A positive integer.

        Returns:
            Tuple[int, int]: (total_running_sum, count_divisible_by_5)
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
        {"name": "Sample Test Case 1", "n": 5, "expected": (15, 2)},
        {"name": "Sample Test Case 2 (Minimal n=1)", "n": 1, "expected": (1, 0)},
        {"name": "Edge Test Case (Boundary n=4)", "n": 4, "expected": (10, 1)},
        {"name": "Sample Test Case 3 (n=10)", "n": 10, "expected": (55, 4)},
        {"name": "Hidden Test Case (n=14)", "n": 14, "expected": (105, 5)},
        {"name": "Hidden Test Case (n=20)", "n": 20, "expected": (210, 8)},
        {"name": "Large Value (n=100)", "n": 100, "expected": (5050, 40)},
    ]

    print("=" * 70)
    print(" Running Accenture Assessment Test Harness: Problem 1")
    print("=" * 70)

    passed_count = 0
    not_implemented = False

    for idx, tc in enumerate(test_cases, start=1):
        n = tc["n"]
        expected = tc["expected"]
        
        actual = solution.runningSumDivisibleBy5(n)
        
        if actual is None:
            not_implemented = True
            print(f"[{idx}/{len(test_cases)}] {tc['name']}: NOT IMPLEMENTED")
            continue

        if actual == expected:
            print(f"[{idx}/{len(test_cases)}] [PASS] {tc['name']} -> Input: n={n} | Output: {actual}")
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
    import sys
    if len(sys.argv) > 1 and sys.argv[1] != "--test":
        try:
            custom_n = int(sys.argv[1])
            sol = Solution()
            ans = sol.runningSumDivisibleBy5(custom_n)
            print(f"Custom Input n = {custom_n} -> Output: {ans}")
        except ValueError:
            print("Usage: python q1_running_sum_divisible_by_5.py [optional_integer_n]")
    else:
        run_tests()
