class UserMainCode(object):
    @classmethod
    def maxRacers(cls, input1, input2):
        
        # input1 : int (number of racers X)
        # input2 : List[List[int]] (position matrix [start, end])
        
        n = input1
        min_pos = 9999
        max_pos = 0
        
        for i in range(n):
            min_pos = min(min_pos, input2[i][0])
            max_pos = max(max_pos, input2[i][1])
        
        ans = 0
        for i in range(min_pos, max_pos + 1):
            cnt = 0
            for j in range(n):
                if i >= input2[j][0] and i <= input2[j][1]:
                    cnt = cnt + 1
            ans = max(ans, cnt)
            
        return ans