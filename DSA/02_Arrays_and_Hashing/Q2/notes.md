## Eswar's approach:

As the array is having -10^4 as the least value,
Create a variable MAX = INT_MIN, current
The approach is to find a minimum subarray if the subarray sum is going  less than 0 (I mean, current sum  is less than 0), then adding that value to the next will always decreases the sum. 

### Analysis