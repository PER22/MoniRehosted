import csv
import numpy as np
import os
dirname = (os.path.dirname(__file__))[:-3]
filename = os.path.join(dirname, 'data/ETFs/actx.us.txt')

with open(filename, 'r') as f:
    reader = csv.reader(f, delimiter=',')
    headers = next(reader)
    data = np.array(list(reader))

data[:,1:6] = np.round(np.array(data[:,1:6].astype(float)*100), 3)
data = data[:,0:6]

chunks = 0
chunk_size = 0

for i in range(1, 10):
    if(len(data) % i == 0):
        chunks = len(data) / i
        chunk_size = i
        break


chunked_data = np.split(data, chunks)

print(chunked_data)
print(chunks)
print(chunk_size)