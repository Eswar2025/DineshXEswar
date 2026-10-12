class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int cur_sum=0;
        int maximum=INT_MIN;
        int n= nums.size();
        for(int i=0; i<n; i++){
            cur_sum+=nums[i];
            maximum = (maximum > cur_sum) ? maximum : cur_sum ;
            if(cur_sum < 0 ){
                cur_sum=0;
            }
        }
        return maximum;
    }
};