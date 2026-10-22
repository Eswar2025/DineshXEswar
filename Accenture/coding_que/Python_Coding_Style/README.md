# Accenture Coding Assessment Practice (Python)

This directory contains LeetCode-style Python modules for practicing real **Accenture Coding Assessment** problems under authentic exam conditions.

---

## 🎯 Assessment Format & What to Expect

* **Platform**: Typically hosted on **Wheebox / HackerRank / CoCubes / Mettl**.
* **Structure**: Usually **2 coding problems in 45 minutes** (or 3 problems in 60 minutes for Advanced ASE / FSE roles).
* **Code Format**: **LeetCode-Style function completion**. You are given a class/function signature with predefined arguments, and you only need to implement the function and return the answer (or modify in-place where specified).
* **Evaluation**:
  * **Public Test Cases**: Shown on the assessment screen with inputs, outputs, and explanations.
  * **Hidden Test Cases**: Test boundaries ($N=0, 1$, minimal constraints, extreme values, duplicates/plateaus, strict monotonic vs non-monotonic).
  * **Time Limits**: Typically 1.0 - 2.0 seconds per test batch ($O(N)$ or $O(N \log N)$ expected).
* **Exam Mode**: No reference solutions are provided in the files to simulate the pressure and problem-solving experience of the real assessment.

---

## 📂 Practice Question Catalog

| File | Problem Name | Core Concepts | Assessment Difficulty |
| :--- | :--- | :--- | :--- |
| [`q1_running_sum_divisible_by_5.py`](./q1_running_sum_divisible_by_5.py) | **Running Sum Divisible by 5** | Loops, Number Theory, Prefix Sums | Easy |
| [`q2_max_mountain_elevation_sum.py`](./q2_max_mountain_elevation_sum.py) | **Maximum Mountain Elevation Sum** | Two Pointers, Peak Finding, Subarrays | Medium |
| [`q3_longest_valid_energy_route.py`](./q3_longest_valid_energy_route.py) | **Longest Valid Energy Route** | Monotonic Slopes, Sliding Window | Easy-Medium |
| [`q4_digit_length_conditional_sum.py`](./q4_digit_length_conditional_sum.py) | **Conditional Digit-Length Sum** | Strings, Digit Extraction, Modulo | Easy |
| [`q5_count_squares_ending_with_d.py`](./q5_count_squares_ending_with_d.py) | **Count Squares Ending with Digit D** | Loops, Unit Digits, Number Theory | Easy |
| [`q6_add_digits_digital_root.py`](./q6_add_digits_digital_root.py) | **Add Digits (Digital Root)** | Digit Summation, Modulo Arithmetic | Easy |
| [`q7_next_palindrome_square_diff.py`](./q7_next_palindrome_square_diff.py) | **Next Palindrome Square Difference** | Palindromes, Square Search, Math | Easy-Medium |
| [`q8_rotate_array_right.py`](./q8_rotate_array_right.py) | **Rotate Array Right by K Steps** | Array Reversal, In-Place Rotation | Easy-Medium |

---

## 🛠️ How to Practice

1. Open any question file (e.g., [`q5_count_squares_ending_with_d.py`](./q5_count_squares_ending_with_d.py)).
2. Locate the function inside `class Solution`:
   ```python
   class Solution:
       def countSquaresEndingWithD(self, n: int, d: int) -> int:
           # >>> WRITE YOUR CODE HERE <<<
           pass
   ```
3. Implement your logic and save the file.
4. Run the automated test harness:
   ```bash
   python q5_count_squares_ending_with_d.py
   ```
5. If you pass all sample and hidden test cases, you'll see:
   ```text
   TEST RESULT: 8/8 Passed (100.0%)
   ```
