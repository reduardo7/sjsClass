/**
 * sjsClass: Simple JavaScript Class.
 * Copyright (c) 2013 sjsClass | Eduardo Daniel Cuomo | eduardo.cuomo.ar@gmail.com
 *
 * By: Edueado Daniel Cuomo.
 *
 * Examples: Test Prefix.
 *
 * Project: https://github.com/reduardo7/sjsClass
 * Doc: https://github.com/reduardo7/sjsClass/blob/master/README.md
 */

/*jslint browser: true, regexp: true, white: true, evil: true */
/*global Class, TstTestPrefix, TstTestPrefixT2, TestPrefixT3 */

var $this = this;

(function () {
	'use strict';

	Class.extend('TestPrefix', {
		__prefix: 'Tst'
	});

	TstTestPrefix.extend('TestPrefixT2');

	TstTestPrefixT2.extend('TestPrefixT3', {
		__prefix: null
	});

	var testPrefix = new TstTestPrefix(),
		testPrefixT2 = new TstTestPrefixT2(),
		testPrefixT3 = new TestPrefixT3();

	console.log('Should all be true:',
		($this.TestPrefix === undefined), ($this.TestPrefixT2 === undefined), ($this.TstTestPrefixT3 === undefined),
		(testPrefix instanceof Class), (testPrefixT2 instanceof TstTestPrefix), !(testPrefixT2 instanceof TestPrefixT3),
		(testPrefixT3 instanceof TstTestPrefixT2), (testPrefixT3 instanceof TstTestPrefix), (testPrefixT3 instanceof TestPrefixT3)
	);
}());