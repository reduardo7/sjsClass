/**
 * sjsClass: Simple JavaScript Class.
 * Copyright (c) 2013 sjsClass | Eduardo Daniel Cuomo | eduardo.cuomo.ar@gmail.com
 *
 * By: Edueado Daniel Cuomo.
 *
 * Examples: Test Constants.
 *
 * Project: https://github.com/reduardo7/sjsClass
 * Doc: https://github.com/reduardo7/sjsClass/blob/master/README.md
 */

/*jslint browser: true, regexp: true, white: true, evil: true */
/*global Class, TestConstants */

(function () {
	'use strict';

	Class.extend('TestConstants', {
		__const : {
			cx : 111
		},
		'const c' : 123,
		foo : function (v) {
			// this.c = v; --> Invalid!
			return this.c;
		}
	});

	var t = new TestConstants();
	// t.c = 6776; --> Invalid!
	// t.cx = 55555; --> Invalid!

	console.log('Should be true:', (t.c === 123), (t.foo(534) === 123), (TestConstants.c === 123),
		(t.cx === 111), (TestConstants.cx === 111));
}());