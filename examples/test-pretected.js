/**
 * sjsClass: Simple JavaScript Class.
 * Copyright (c) 2013 sjsClass | Eduardo Daniel Cuomo | eduardo.cuomo.ar@gmail.com
 *
 * By: Edueado Daniel Cuomo.
 *
 * Examples: Test Protected.
 *
 * Project: https://github.com/reduardo7/sjsClass
 * Doc: https://github.com/reduardo7/sjsClass/blob/master/README.md
 *
 * Thanks : http://ejohn.org/blog/simple-javascript-inheritance/
 */

'use strict';

Class.Extend('Test', {
	__protected : {
		p2 : 222,
		pf : function () {
			return this.p1;
		}
	},
	'protected p1' : 1,
	foo : function (v) {
		this.p1 = v;
	},
	bar : function () {
		return this.pf() + this.p2;
	}
});

var t = new Test();
t.foo(111);

// Should all be true
(t.p1 === undefined) && (t.p2 === undefined) &&
	(Test.p1 === undefined) && (Test.p2 === undefined) &&
	(t.pf === undefined) && (t.bar() === 333);
