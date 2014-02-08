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

'use strict';

Class.extend('TestPrefix', {
	__prefix: 'Tst'
});

TestPrefix.extend('TestPrefixT2');

TestPrefixT2.extend('TestPrefixT3', {
	__prefix: null
});

var testPrefix = new TestPrefix(),
	testPrefixT2 = new TestPrefixT2(),
	testPrefixT3 = new TestPrefixT3();

// Should all be true
(this.TestPrefix === undefined) && (this.TestPrefixT2 === undefined) && (this.TstT3 === undefined) &&
	(testPrefix instanceof Class) && (testPrefixT2 instanceof TestPrefix) &&
	(testPrefixT3 instanceof TestPrefixT2) && (testPrefixT3 instanceof TestPrefix);
