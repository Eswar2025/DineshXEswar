#include <bits/stdc++.h>

using namespace std;

class Solution
{
public:
    int majorityElement(vector<int> &nums)
    {
        // 13 min for method
        // Now implementation
        int n = nums.size();
        map<int, int> freq;
        // for(auto i : nums)
        for (int i = 0; i < n; i++)
        {
            freq[nums[i]]++;
            // freq[key] 0 -> 1
        }

        for (auto mp : freq)
        {
            // mp.first
            // mp.second
            if (mp.second > n / 2)
            {
                return mp.first;
            }
        }
    }
};

// (4, 23) (23, 3) (-34, 8)
// SC - O( N )
// TC - O(N log N)
int main()
{

    return 0;
}