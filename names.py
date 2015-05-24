import random, math
from pymongo import MongoClient
from random import shuffle

firsts = ['rushing', 'swift', 'majestic', 'glorious', 'royal', 'ancient', 'raging', 'royal', 'graceful', 'grand', 'regal', 'elegant']
seconds = ['mountain', 'stream', 'forest', 'plains', 'ocean', 'vista', 'mesa', 'canyon', 'fjord', 'delta', 'river', 'trail', 'beach', 'glacier', 'iceberg', 'peak', 'cavern', 'crevasse']

taken = []

for first in firsts:
	for second in seconds:
		for x in range(1000):
			taken += [{'email' : first + '-' + second + str(x) + '@gocha.io', 'taken': False}]


cl = MongoClient()
coll = cl.cha.email

print len(taken)
shuffle(taken)

for email in taken:
    coll.insert(email)