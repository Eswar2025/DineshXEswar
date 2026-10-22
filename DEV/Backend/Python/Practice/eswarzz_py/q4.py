# 4. Return True if n is a prime number. (1 is not prime.)

n = 29

def is_prime(n):
    x= True
    if x == 2 :
        return ;
    for i in range(2,n ** 0.5 +1) :
        if n%i == 0 :
            x = True
            break
    return x

print(f"the statement that no. is prime is {is_prime(n)}")
            
