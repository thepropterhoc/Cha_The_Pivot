import random, math

firsts = ['rushing', 'swift', 'majestic', 'glorious', 'royal', 'ancient', 'raging', 'royal', 'graceful']
seconds = ['mountain', 'stream', 'forest', 'plains', 'ocean', 'vista', 'mesa', 'canyon', 'fjord', 'delta', 'river', 'trail']

print len(firsts), len(seconds)

taken = []

for _ in xrange(1000):
	firstPossible, secondPossible =  firsts[random.randint(0, len(firsts)-1)], seconds[random.randint(0, len(seconds)-1)]
	if not (firstPossible, secondPossible) in taken:
		taken += [(firstPossible, secondPossible)]

print taken