import numpy as np

x = np.array([[1,1,1,1,1,1],[-2,-1,-1,0,1,3]]).T

y = np.array([-1,-2,3,-1,1,-2]).T

A = x.T @ x
c = x.T @ y
lamI = (np.identity(len(A)) * 0)
lamI[0, 0] = 0

#print(lamI)

#print(A)
#print(c)

print(np.linalg.solve((A + lamI), c))