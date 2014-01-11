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
 *
 * Thanks : http://ejohn.org/blog/simple-javascript-inheritance/
 */

'use strict';

Class.Extend('Test', {
	__prefix: 'Tst'
});

TstTest.Extend('T2');

TstT2.Extend('T3', {
	__prefix: null
});

var t = new TstTest(),
	t2 = new TstT2(),
	t3 = new T3();

// Should all be true
(this.Test === undefined) && (this.T2 === undefined) && (this.TstT3 === undefined) &&
	(t instanceof Class) && (t2 instanceof TstTest) &&
	(t3 instanceof TstT2) && (t3 instanceof TstTest);
