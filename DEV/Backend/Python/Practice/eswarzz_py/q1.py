# 1. Return the second largest DISTINCT value in a list. (Assume it exists.)
#    [4, 9, 2, 7] -> 7        [5, 5, 3] -> 3

nums = [4,9,-4,3,7,11]

def second_largest(nums):
    lar = int(nums[0])
    sec_lar = -999
    n = len(nums)
    for i in range(n):
        if nums[i]>=lar:
            sec_lar=lar
            lar=nums[i]
        elif nums[i] > sec_lar:
            sec_lar = nums[i]
    return sec_lar

print(second_largest(nums),"is the second largest")