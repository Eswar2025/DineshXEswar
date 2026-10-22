1. given a positive integer n, calculate the running sum from 1 to n. Increment a counter every time the running sum is divisible by 5. Output the total running sum and final count

2. A person is traveling along a mountain trail and records the elevation at each checkpoint in an array A of size N. A valid mountain route must follow these strict rules:
    1. Must be a continuous, contiguous subarray of checkpoints.
    2. Elevation must strictly increase while moving towards the peak.
    3. At one checkpoint, the person reaches the peak.
    4. After the peak, elevation must quickly decrease.
    5. Must contain at least three checkpoints.
Task: Find the maximum possible sum of elevations in any valid mountain route. If no valid route exists, return 0.

3. A robot travels through a series of checkpoints where each checkpoint has an associated energy value.
Valid energy route requirements:
- A route consists of consecutive checkpoints (contiguous subarray).
- Energy values strictly increase while moving toward a peak checkpoint.
- After reaching the highest energy value (peak), energy values strictly decrease.
- A route must contain at least three checkpoints.
Task: Find the maximum length (number of checkpoints) in any valid energy route. If no valid route exists, return 0.
Example:
Input: N = 7, energy = [2, 1, 4, 7, 3, 2, 5]
Valid routes: [1, 4, 7, 3, 2] with peak 7.
Output: 5

4. Given an array of integers `a` of length `n`, inspect the number of digits of each element and compute specific conditional operations based on Accenture slot variations.
Here is the question: Calculate the sum of elements after applying digit length rules.
    1. If digit length is even, add the square of the element's digit length to the total.
    2. If digit length is odd, add the sum of individual digits to that number to the total.
For example, take this input: n = 4, a = [12, 345, 7, 8888].
- 12 is of length 2, which is even, so 2².
- 345 is of length 3, which is odd, so 3 + 4 + 5.
- 7 is of length 1, which is odd, so 7.
- 8888 is of length 4, which is even, so 4².
Total output will be 4 + 12 + 7 + 16 = 39.

5. Given two integer inputs `n` and `d`, iterate through all numbers from 1 to `n`, calculate the square of each number, and determine whether the last digit of the square is equal to `d`. Count and return the total number of integers in the range 1 to `n` whose square ends with the digit `d`. 

For example, n = 5, d = 9.
- 1² = 1
- 2² = 4
- 3² = 9
- 4² = 16
- 5² = 25
Here, only for 3² = 9, the unit digit matches this, so output count = 1.

6. Given a number (example: 38), continuously add all its digits until the result is a single digit. Example: 38 becomes 3 + 8, which equals 11. It becomes 1 + 1 = 2, as 2 is a single digit. Output will be 2. 

7. Next palindromic Perfect Square Difference
    Given an integer n, find the next integer x greater than n such that x is both a perfect square and a palindrome. Return the absolute difference x - n.
    Example: 404. Next palindrome square is 484. The absolute difference was 484 - 404 = 80. 

8. Rotate array to the right by k steps. Given an integer array `nums` and an integer `k`, rotate the array to the right by `k` steps in place. 
Example: 
input nums = [1, 2, 3, 4, 5, 6, 7] and k = 3. Output will be [5, 6, 7, 1, 2, 3, 4]. 