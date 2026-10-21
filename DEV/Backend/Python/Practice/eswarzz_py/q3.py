# 3. Return the sum of the digits of a non-negative integer.
#    1234 -> 10

n = 5235234234

def digit_sum(n):
    x = 0
    while n>=1 :
        x=x+n%10
        n=n//10
    return x

def dig_dig(n) :
    x = digit_sum(n)
    while x>9 :
       x=digit_sum(x)
    return x 

def dineshFn(n) : 
    return dig_dig(n) if dig_dig(n) < 10 else dig_dig(dig_dig(n))

print(f"sum of the digits is {dig_dig(n)}")
print(f"sum of the digits is {dineshFn(n)}")
