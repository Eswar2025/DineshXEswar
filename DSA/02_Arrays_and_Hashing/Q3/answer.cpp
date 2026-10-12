class Solution {
public:
    vector<int> majorityElementTwo(vector<int>& nums) {
        int n=nums.size();
        map<int, int > freq;
        for(int i=0; i<n; i++){
            freq[nums[i]]++;
        }
        vector< int > ans;
        for(auto mp : freq){
            if(mp.second > n/3){
                ans.push_back(mp.first);
            }
        }
        return ans;
    }
};