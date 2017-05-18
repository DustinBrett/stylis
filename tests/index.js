/**
 * tester runner
 *
 * excutes tests given an object describing the tests
 * based on sample input vs expected output
 * if output === expected output, test passed
 * else test failed
 *
 * log format
 *
 * ------
 *
 * Tests Passed #
 *
 * ...
 *
 * [Finnished In] #ms
 *
 * Tests Failed #
 *
 * ...
 *
 * [Finnished In] #ms
 */


var browser = this.window;
var stylis = browser ? this.stylis : require('../stylis.js');
var spec = browser ? this.spec : require('./spec.js');

/**
 * run tests
 * @return {Object} tests
 */
function run (tests, fn) {
	var start = Date.now();

	var passed = [];
	var failed = [];

	var format = {
		reset: browser ? '' : '\x1b[0m',
		green: browser ? '' : '\x1b[32m',
		red: browser ? '' : '\x1b[31m',
		yellow: browser ? '' : '\x1b[33m',
		underline: browser ? '' : '\x1b[4m',
		dim: browser ? '' : '\x1b[2m',
		bold: browser ? '' : '\x1b[1m',
		clear: browser ? '' : '\x1Bc\n'
	};

	for (var name in tests) {
		var test = tests[name];

		var name = test.name.trim();
		var sample = test.sample.trim();
		var expected = test.expected.trim();
		var options = test.options || {};

		fn.p.length = 0;

		var result = fn(
			test.selector || '.user',
			sample,
			options.animations,
			options.compact === void 0 ? true : options.compact,
			options.middleware
		);

		if (result !== expected || /\n/g.test(result)) {
			// log why it failed
			console.log(result.length, 'failed: '+ name, '\n\n' + result)
			console.log(expected.length, 'expected: ', '\n\n' + expected, '\n\n---------------\n\n')

			failed.push(name);
		} else {
			passed.push(name);
		}
	}

	var end = '\n\n'+format.reset+'[Finnished In] '+(Date.now()-start)+'ms\n';

	// start test logger
	console.log('\n------');

	// passed
	console.log(
		format.bold+'\nTests Passed '+passed.length+format.reset+format.green + '\n\n'+passed.join('\n')+end
	);

	// failed
	console.log(
		format.bold+'Tests Failed '+failed.length+format.reset+format.red +
		'\n\n'+(failed.join('\n') || 'no failed tests')+end
	);

	// if failed trigger exit
	if (failed.length) {
		if (browser) {
			console.error(new Error('^^^'));
		} else {
			process.exit(1);
		}
	}
}

run(spec, stylis)
