# 2. Count the vowels (a e i o u, any case) in a string.
#    "education" -> 5

s = "education is good"

def count_vowels(s):
    v = int(0)
    n= len(s)
    for i in range(n):
        if s[i]=='a' or s[i]=='e' or s[i]=='i' or s[i]=='o' or s[i]=='u':
            v=v+1
    return v

print(f"{count_vowels(s)} \"vowels\" are there in {s}")
