/**
 * sjsClass: Simple JavaScript Class.
 * Copyright (c) 2013 sjsClass | Eduardo Daniel Cuomo | eduardo.cuomo.ar@gmail.com
 *
 * By: Edueado Daniel Cuomo.
 *
 * Examples: Test package.
 *
 * Project: https://github.com/reduardo7/sjsClass
 * Doc: https://github.com/reduardo7/sjsClass/blob/master/README.md
 */

/*jslint browser: true, regexp: true, white: true, evil: true */
/*global Class, TestPackage3 */

var $this = this;

(function () {
	'use strict';

	// package
	var com = {
		eduardocuomo : { }
	};

	Class.extend('TestPackage1', {
		__package : com
	});

	com.TestPackage1.extend('TestPackage2');

	com.TestPackage2.extend('TestPackage3', {
		__package : com.eduardocuomo
	});

	var testPackage1 = new com.TestPackage1(),
		testPackage2 = new com.TestPackage2(),
		testPackage3 = new com.eduardocuomo.TestPackage3();

	console.log('Should all be true:',
		($this.TestPackage1 === undefined), ($this.TestPackage2 === undefined), ($this.TestPackage3 === undefined),
		(com.eduardocuomo.TestPackage1 === undefined), (com.eduardocuomo.TestPackage2 === undefined), (com.TestPackage3 === undefined),
		(testPackage1 instanceof Class), (testPackage2 instanceof com.TestPackage1),
		(testPackage3 instanceof com.TestPackage2), (testPackage3 instanceof com.eduardocuomo.TestPackage3)
	);
}());