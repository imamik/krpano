TIMEOUT = 15000
test:
	./node_modules/.bin/mocha -t $(TIMEOUT)
#	./node_modules/.bin/mocha -t $(TIMEOUT) --debug-brk 

cov test-cov:
	./node_modules/.bin/istanbul cover _mocha -- -t $(TIMEOUT)

coveralls:
	./node_modules/.bin/istanbul cover ./node_modules/mocha/bin/_mocha --report lcovonly -- -R spec -t $(TIMEOUT) && cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js && rm -rf ./coverage

.PHONY: test cov test-cov
