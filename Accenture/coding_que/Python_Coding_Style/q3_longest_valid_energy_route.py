"""
================================================================================
Accenture Coding Assessment Practice
Problem 3: Longest Valid Energy Route (Robot Checkpoints)
================================================================================

PROBLEM STATEMENT:
A robot travels through a series of checkpoints where each checkpoint has an 
associated energy value represented in an array of size N.

A valid energy route must satisfy the following strict requirements:
1. A route consists of consecutive checkpoints (contiguous subarray).
2. Energy values strictly increase while moving toward a peak checkpoint.
3. After reaching the highest energy value (peak), energy values strictly decrease.
4. A route must contain at least three checkpoints (length >= 3).

Task:
Find the maximum length (number of checkpoints) in any valid energy route.
If no valid route exists, return 0.

ASSESSMENT PATTERN & CONSTRAINTS:
- Topic: Arrays, Peak Finding, Two Pointers, Monotonic Properties
- Difficulty: Easy-Medium (Accenture Standard Coding Section)
- Time Complexity: O(N) required to pass all hidden test cases.
- Space Complexity: O(1) auxiliary space.
- Constraints:
    * 1 <= N <= 10^5
    * 0 <= energy[i] <= 10^6

EXAMPLES:
Example 1:
    Input: N = 7, energy = [2, 1, 4, 7, 3, 2, 5]
    Explanation:
        Subarray from index 1 to 5 is [1, 4, 7, 3, 2].
        - Strictly increases: 1 < 4 < 7
        - Peak at index 3 (value 7)
        - Strictly decreases: 7 > 3 > 2
        - Total checkpoints in this route = 5
    Output: 5

Example 2:
    Input: N = 5, energy = [2, 2, 2, 2, 2]
    Explanation: No strictly increasing/decreasing sequence exists.
    Output: 0

Example 3:
    Input: N = 6, energy = [1, 2, 3, 4, 5, 6]
    Explanation: Route only increases, no descending portion after peak.
    Output: 0

Example 4:
    Input: N = 3, energy = [1, 5, 2]
    Explanation: Minimal valid route of length 3.
    Output: 3
================================================================================
"""

from typing import List


class Solution:
    def longestValidEnergyRoute(self, n: int, energy: List[int]) -> int:
        """
        Finds the maximum length (number of checkpoints) in any valid energy route.

        Args:
            n (int): Number of checkpoints.
            energy (List[int]): Energy value at each checkpoint.

        Returns:
            int: Maximum number of checkpoints in a valid energy route, or 0.
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
            "name": "Sample Test Case 1 (Standard Peak)",
            "n": 7,
            "energy": [2, 1, 4, 7, 3, 2, 5],
            "expected": 5,
        },
        {
            "name": "Edge Case: Equal Values Flat Line",
            "n": 5,
            "energy": [2, 2, 2, 2, 2],
            "expected": 0,
        },
        {
            "name": "Edge Case: Strictly Increasing (No Peak)",
            "n": 6,
            "energy": [1, 2, 3, 4, 5, 6],
            "expected": 0,
        },
        {
            "name": "Edge Case: Strictly Decreasing (No Ascent)",
            "n": 5,
            "energy": [9, 8, 7, 6, 5],
            "expected": 0,
        },
        {
            "name": "Smallest Valid Route (Length 3)",
            "n": 3,
            "energy": [1, 5, 2],
            "expected": 3,
        },
        {
            "name": "Multiple Routes: Choose Longest Route",
            "n": 10,
            "energy": [1, 3, 1, 0, 1, 2, 6, 5, 3, 1],
            # Route 1: [1, 3, 1] -> len = 3
            # Route 2: [0, 1, 2, 6, 5, 3, 1] -> len = 7
            "expected": 7,
        },
        {
            "name": "Edge Case: Array Length < 3",
            "n": 2,
            "energy": [10, 20],
            "expected": 0,
        },
    ]

    print("=" * 70)
    print(" Running Accenture Assessment Test Harness: Problem 3")
    print("=" * 70)

    passed_count = 0
    not_implemented = False

    for idx, tc in enumerate(test_cases, start=1):
        n = tc["n"]
        energy = tc["energy"]
        expected = tc["expected"]
        
        actual = solution.longestValidEnergyRoute(n, energy)
        
        if actual is None:
            not_implemented = True
            print(f"[{idx}/{len(test_cases)}] {tc['name']}: NOT IMPLEMENTED")
            continue

        if actual == expected:
            print(f"[{idx}/{len(test_cases)}] [PASS] {tc['name']} -> Output: {actual}")
            passed_count += 1
        else:
            print(f"[{idx}/{len(test_cases)}] [FAIL] {tc['name']}")
            print(f"        Input:    energy = {energy}")
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
