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
/*global Class, TestFunction, TestFunctionB */

(function () {
	'use strict';

	Class.extend('TestFunction', {
		__function : function (v) {
			return '[[' + v + '|' + v + ']]';
		}
	});

	TestFunction.extend('TestFunctionB', {
		__function : function (j) {
			return '***' + this.__super(j) + '***';
		}
	})

	console.log('Should all be true:', (TestFunction(123) === '[[123|123]]'), (TestFunctionB(456) === '***[[456|456]]***'));
}());