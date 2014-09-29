/**
 * sjsClass: Simple JavaScript Class.
 * Copyright (c) 2013 sjsClass | Eduardo Daniel Cuomo | eduardo.cuomo.ar@gmail.com
 *
 * By: Edueado Daniel Cuomo.
 *
 * Examples: Test package (2).
 *
 * Project: https://github.com/reduardo7/sjsClass
 * Doc: https://github.com/reduardo7/sjsClass/blob/master/README.md
 */

/*jslint browser: true, regexp: true, white: true, evil: true */
/*global Class */

(function () {
	'use strict';

	// package
	var com = {
		eduardocuomo : {
			examples : { },
			demo : { }
		}
	};


	// Class 1
	(function () {

		Class.extend('T1', {
			__package : this
		});

	}).apply(com.eduardocuomo.examples);

	// Class 2
	(function () {

		this.T1.extend('T2');

	}).apply(com.eduardocuomo.examples);

	// Class 3
	(function () {

		Class.extend('T3', {
			__package : this
		});

	}).apply(com.eduardocuomo.demo);


	// Work

	(function () {

		var t2 = new this.T2();

		console.log('Should be true:', (t2 instanceof this.T1), (this.T3 === undefined));

	}).apply(com.eduardocuomo.examples);

	(function () {

		console.log('Should be true:', (this.T1 === undefined), (this.T2 === undefined));

	}).apply(com.eduardocuomo.demo);
}());