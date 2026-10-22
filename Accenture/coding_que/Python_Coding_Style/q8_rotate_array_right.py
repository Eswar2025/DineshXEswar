"""
================================================================================
Accenture Coding Assessment Practice
Problem 8: Rotate Array Right by K Steps
================================================================================

PROBLEM STATEMENT:
Given an integer array `nums` and an integer `k`, rotate the array to the right 
by `k` steps.

You should perform the rotation in-place with O(1) extra memory.

ASSESSMENT PATTERN & CONSTRAINTS:
- Topic: Arrays, Two Pointers, In-Place Reversal / Cyclic Replacements
- Difficulty: Easy-Medium (LeetCode 189 / Accenture Classic)
- Time Limit: 1.0 second
- Space Complexity: O(1) auxiliary space (in-place modification)
- Constraints:
    * 1 <= nums.length <= 10^5
    * -2^31 <= nums[i] <= 2^31 - 1
    * 0 <= k <= 10^5

EXAMPLES:
Example 1:
    Input: nums = [1, 2, 3, 4, 5, 6, 7], k = 3
    Explanation:
        rotate 1 steps to the right: [7, 1, 2, 3, 4, 5, 6]
        rotate 2 steps to the right: [6, 7, 1, 2, 3, 4, 5]
        rotate 3 steps to the right: [5, 6, 7, 1, 2, 3, 4]
    Output: [5, 6, 7, 1, 2, 3, 4]

Example 2:
    Input: nums = [-1, -100, 3, 99], k = 2
    Explanation:
        rotate 1 steps to the right: [99, -1, -100, 3]
        rotate 2 steps to the right: [3, 99, -1, -100]
    Output: [3, 99, -1, -100]

Example 3:
    Input: nums = [1, 2], k = 3
    Explanation: k = 3 is equivalent to k % 2 = 1 rotation.
    Output: [2, 1]
================================================================================
"""

from typing import List


class Solution:
    def rotate(self, nums: List[int], k: int) -> List[int]:
        """
        Rotates nums to the right by k steps in-place.

        Args:
            nums (List[int]): The integer array to rotate in-place.
            k (int): Number of steps to rotate.

        Returns:
            List[int]: The modified array (for convenience/testing).
        """
        # ======================================================================
        # >>> WRITE YOUR CODE BELOW THIS LINE <<<
        # ======================================================================
        
        pass  # Replace with your code (modify nums in-place)
        
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
            "name": "Sample Test Case 1 (Standard Rotation)",
            "nums": [1, 2, 3, 4, 5, 6, 7],
            "k": 3,
            "expected": [5, 6, 7, 1, 2, 3, 4],
        },
        {
            "name": "Sample Test Case 2 (With Negatives)",
            "nums": [-1, -100, 3, 99],
            "k": 2,
            "expected": [3, 99, -1, -100],
        },
        {
            "name": "Edge Case: k Greater Than Array Length",
            "nums": [1, 2],
            "k": 3,
            "expected": [2, 1],
        },
        {
            "name": "Edge Case: k = 0 (No Rotation)",
            "nums": [1, 2, 3, 4],
            "k": 0,
            "expected": [1, 2, 3, 4],
        },
        {
            "name": "Edge Case: k Equal to Array Length",
            "nums": [1, 2, 3],
            "k": 3,
            "expected": [1, 2, 3],
        },
        {
            "name": "Edge Case: Single Element Array",
            "nums": [42],
            "k": 5,
            "expected": [42],
        },
        {
            "name": "Large k multiple",
            "nums": [10, 20, 30, 40, 50],
            "k": 12,  # 12 % 5 = 2 -> [40, 50, 10, 20, 30]
            "expected": [40, 50, 10, 20, 30],
        },
    ]

    print("=" * 70)
    print(" Running Accenture Assessment Test Harness: Problem 8")
    print("=" * 70)

    passed_count = 0
    not_implemented = False

    for idx, tc in enumerate(test_cases, start=1):
        # Pass a copy so test input isn't permanently mutated across retries
        nums_copy = list(tc["nums"])
        k = tc["k"]
        expected = tc["expected"]
        
        # Check both return value or in-place modification of nums_copy
        ret = solution.rotate(nums_copy, k)
        
        # If method returned None without modifying nums_copy from original when expected != original:
        if ret is None and nums_copy == tc["nums"] and expected != tc["nums"]:
            not_implemented = True
            print(f"[{idx}/{len(test_cases)}] {tc['name']}: NOT IMPLEMENTED")
            continue

        # If user returned the rotated list, use ret; otherwise check in-place nums_copy
        actual = ret if (ret is not None and isinstance(ret, list)) else nums_copy

        if actual == expected:
            print(f"[{idx}/{len(test_cases)}] [PASS] {tc['name']} -> Output: {actual}")
            passed_count += 1
        else:
            print(f"[{idx}/{len(test_cases)}] [FAIL] {tc['name']}")
            print(f"        Input:    nums = {tc['nums']}, k = {k}")
            print(f"        Expected: {expected}")
            print(f"        Actual:   {actual}")

    print("=" * 70)
    if not_implemented:
        print("STATUS: Function not implemented. Complete the function in Solution and re-run!")
    else:
        print(f"TEST RESULT: {passed_count}/{len(test_cases)} Passed ({passed_count / len(test_cases) * 100:.1f}%)")
    print("=" * 70)


if __name__ == "__main__":
    run_tests()
