/**
 * sjsClass: Simple JavaScript Class.
 * Copyright (c) 2013 sjsClass | Eduardo Daniel Cuomo | eduardo.cuomo.ar@gmail.com
 *
 * By: Edueado Daniel Cuomo.
 *
 * Examples: Test Recursive Method.
 *
 * Project: https://github.com/reduardo7/sjsClass
 * Doc: https://github.com/reduardo7/sjsClass/blob/master/README.md
 *
 * Thanks : http://ejohn.org/blog/simple-javascript-inheritance/
 */

'use strict';

Class.extend('TestRecursive', {
	__static : {
		bar : function (v) {
			v += '|';
			return (v.length < 10) ? this.bar(v) : v;
		}
	},
	foo : function (v) {
		v += '-';
		return (v.length < 10) ? this.foo(v) : v;
	}
});

var testRecursive = new TestRecursive();

// Should all be true
(TestRecursive.bar('s') === 's|||||||||') && (testRecursive.foo('m') === 'm---------')