import random, math
from pymongo import MongoClient
from random import shuffle

#firsts = ['rushing', 'swift', 'majestic', 'glorious', 'royal', 'ancient', 'raging', 'royal', 'graceful', 'grand', 'regal', 'elegant']
#seconds = ['mountain', 'stream', 'forest', 'plains', 'ocean', 'vista', 'mesa', 'canyon', 'fjord', 'delta', 'river', 'trail', 'beach', 'glacier', 'iceberg', 'peak', 'cavern', 'crevasse']

#firsts = ['19th', 'california', 'fell', 'geary', 'grant', 'fulton', 'lincoln', 'market', 'portola', 'vanness', 'lombard', 'montgomery']
#seconds = ['24th', 'Columbus', 'Fillmore', 'Kearny', 'Mission', 'Polk', 'Stockton', 'Union', 'Third', 'Alemany', 'Broadway', 'Castro', 'Embarcadero']

#lets = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

firsts = 'alert amused brave bright charming cheerful comfortable cooperative courageous delightful determined eager elated enchanting encouraging energetic excited fantastic friendly frowning funny gentle glorious good happy healthy helpful hilarious innocent jolly kind lively lovely lucky perfect proud relaxed smiling splendid successful thoughtful victorious well witty wonderful'.split(' ')
seconds = 'alligator ant bear bee bird camel cat cheetah chicken chimp cow crocodile deer dog dolphin duck eagle elephant fish fly fox frog giraffe goat goldfish hamster horse kangaroo kitten lion lobster monkey octopus owl panda pig puppy rabbit rat scorpion seal shark sheep snail snake spider squirrel tiger turtle wolf zebra'.split(' ')


"""
var = raw_input()

while not var == '' and not var == False and not var == '\n':
	com, word = var.split(' ')
	if com == 'f':
		firsts += [word]
	elif com == 's':
		seconds += [seconds]
	var = raw_input()

with open('data.txt', 'w') as f:
	f.write(str(firsts) + '\n')
	f.write(str(seconds) + '\n')
	"""

cl = MongoClient()
coll = cl.cha.email

for first in firsts:
	for second in seconds:
		for x in range(1000):
			coll.insert({'email' : '{0}-{1}{2:d}@gocha.io'.format(first, second, x), 'taken' : False})