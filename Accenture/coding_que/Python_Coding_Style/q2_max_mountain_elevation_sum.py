"""
================================================================================
Accenture Coding Assessment Practice
Problem 2: Maximum Mountain Elevation Route (Max Sum)
================================================================================

PROBLEM STATEMENT:
A person is traveling along a mountain trail and records the elevation at 
each checkpoint in an array A of size N. 

A valid mountain route must follow these strict rules:
1. Must be a continuous, contiguous subarray of checkpoints.
2. Elevation must strictly increase while moving towards the peak.
3. At one checkpoint, the person reaches the peak.
4. After the peak, elevation must strictly decrease.
5. Must contain at least three checkpoints.

Task:
Find the maximum possible sum of elevations in any valid mountain route.
If no valid route exists, return 0.

ASSESSMENT PATTERN & CONSTRAINTS:
- Topic: Arrays, Two Pointers, Peak Finding, Subarrays
- Difficulty: Medium (Common in Accenture Advanced Coding rounds)
- Time Limit: 1.0s
- Space Limit: O(1) auxiliary space expected
- Constraints:
    * 1 <= N <= 10^5
    * 0 <= A[i] <= 10^4

EXAMPLES:
Example 1:
    Input: N = 5, A = [1, 3, 5, 4, 2]
    Peak: index 2 (value 5)
    Ascent: 1 < 3 < 5
    Descent: 5 > 4 > 2
    Mountain route: [1, 3, 5, 4, 2]
    Sum: 1 + 3 + 5 + 4 + 2 = 15
    Output: 15

Example 2:
    Input: N = 7, A = [2, 1, 4, 7, 3, 2, 5]
    Peak: index 3 (value 7)
    Valid mountain: [1, 4, 7, 3, 2]
    Sum: 1 + 4 + 7 + 3 + 2 = 17
    Output: 17

Example 3:
    Input: N = 4, A = [1, 2, 3, 4]
    Explanation: The array strictly increases, but there is no descent after peak.
    Output: 0

Example 4:
    Input: N = 4, A = [1, 2, 2, 1]
    Explanation: Checkpoints are flat (2 == 2), which violates the strict inequality.
    Output: 0
================================================================================
"""

from typing import List


class Solution:
    def maxMountainElevationSum(self, n: int, arr: List[int]) -> int:
        """
        Finds the maximum possible sum of elevations in any valid mountain route.

        Args:
            n (int): Number of checkpoints.
            arr (List[int]): Elevation array.

        Returns:
            int: Maximum sum of a valid mountain route, or 0 if none exists.
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
            "name": "Sample Test Case 1 (Single Mountain)",
            "n": 5,
            "arr": [1, 3, 5, 4, 2],
            "expected": 15,
        },
        {
            "name": "Sample Test Case 2 (Mountain with valley before)",
            "n": 7,
            "arr": [2, 1, 4, 7, 3, 2, 5],
            "expected": 17,
        },
        {
            "name": "Edge Case: Strictly Increasing (No Descent)",
            "n": 4,
            "arr": [1, 2, 3, 4],
            "expected": 0,
        },
        {
            "name": "Edge Case: Strictly Decreasing (No Ascent)",
            "n": 4,
            "arr": [4, 3, 2, 1],
            "expected": 0,
        },
        {
            "name": "Edge Case: Flat Peak Plateau (arr[i] == arr[i+1])",
            "n": 4,
            "arr": [1, 2, 2, 1],
            "expected": 0,
        },
        {
            "name": "Edge Case: Array Size < 3",
            "n": 2,
            "arr": [1, 2],
            "expected": 0,
        },
        {
            "name": "Multiple Mountains: Choose Max Sum",
            "n": 9,
            "arr": [1, 3, 1, 0, 2, 5, 8, 3, 1],
            # Mountain 1: [1, 3, 1] -> sum = 5
            # Mountain 2: [0, 2, 5, 8, 3, 1] -> sum = 19
            "expected": 19,
        },
        {
            "name": "Minimal Valid Mountain of Length 3",
            "n": 3,
            "arr": [10, 50, 20],
            "expected": 80,
        },
    ]

    print("=" * 70)
    print(" Running Accenture Assessment Test Harness: Problem 2")
    print("=" * 70)

    passed_count = 0
    not_implemented = False

    for idx, tc in enumerate(test_cases, start=1):
        n = tc["n"]
        arr = tc["arr"]
        expected = tc["expected"]
        
        actual = solution.maxMountainElevationSum(n, arr)
        
        if actual is None:
            not_implemented = True
            print(f"[{idx}/{len(test_cases)}] {tc['name']}: NOT IMPLEMENTED")
            continue

        if actual == expected:
            print(f"[{idx}/{len(test_cases)}] [PASS] {tc['name']} -> Output: {actual}")
            passed_count += 1
        else:
            print(f"[{idx}/{len(test_cases)}] [FAIL] {tc['name']}")
            print(f"        Input:    arr = {arr}")
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
