/**
 * sjsClass: Simple JavaScript Class.
 * Copyright (c) 2013 sjsClass | Eduardo Daniel Cuomo | eduardo.cuomo.ar@gmail.com
 *
 * By: Edueado Daniel Cuomo.
 *
 * Examples: Test On Extend.
 *
 * Project: https://github.com/reduardo7/sjsClass
 * Doc: https://github.com/reduardo7/sjsClass/blob/master/README.md
 */

/*jslint browser: true, regexp: true, white: true, evil: true */
/*global Class, TestOnExtend */

(function () {
	'use strict';

	var testVar = 1;

	Class.extend('TestOnExtend', {
		__onExtend: function() {
			testVar++;
		}
	});

	TestOnExtend.extend('TestExtend');

	console.log('Should all be true:', testVar === 2);
}());