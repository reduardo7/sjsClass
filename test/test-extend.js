/**
 * sjsClass: Simple JavaScript Class.
 * Copyright (c) 2013 sjsClass | Eduardo Daniel Cuomo | eduardo.cuomo.ar@gmail.com
 *
 * By: Edueado Daniel Cuomo.
 *
 * Examples: Test Exception.
 *
 * Project: https://github.com/reduardo7/sjsClass
 * Doc: https://github.com/reduardo7/sjsClass/blob/master/README.md
 */

/*jslint browser: true, regexp: true, white: true, evil: true */
/*global Class, TestExtendTest, TestExtendOther */

(function () {
	'use strict';

	Class.extend('TestExtendTest', {
		__const : {
			c1 : 'Constant 1'
		},
		__protected : {
			pv : 111,
			pf : function () {
				return this.pv;
			}
		},
		__property : {
			prop1 : {
				get : function () { return this.pv; }
			}
		},
		foo : function (v) {
			this.pv = v;
		},
		bar : function () {
			return this.c1 + '|' + this.pf();
		}
	});

	TestExtendTest.extend('TestExtendOther', {
		'const c2' : 'Constant 2',
		'protected pv' : 222,
		'property prop1' : {
			get : function () { return this.pv; },
			set : function (v) { this.pv = v; }
		},
		foo : function () {
			// Execute into this context
			this.pv = TestExtendOther.c2;
		},
		bar : function () {
			// Execute into this context
			return this.__super(this);
		}
	});

	var t = new TestExtendTest();
	t.foo(123);
	// t.prop1 = 321; --> Error

	var o = new TestExtendOther();
	o.foo(456);

	console.log('Should all be true:',
		(t.c1 === TestExtendTest.c1), (t.c1 === 'Constant 1'), (t.c2 === undefined), (TestExtendTest.c2 === undefined),
		(o.c1 === t.c1), (TestExtendOther.c1 === TestExtendTest.c1), (o.c2 === TestExtendOther.c2), (TestExtendOther.c2 === 'Constant 2'),
		(t.prop1 === 123),
		(t.bar() === 'Constant 1|123'),
		(o.prop1 === TestExtendOther.c2), (o.bar() === 'Constant 1|Constant 2')
	);
}());