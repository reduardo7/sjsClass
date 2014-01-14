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
 *
 * Thanks : http://ejohn.org/blog/simple-javascript-inheritance/
 */

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

var check = true;

(function () {

	var t = new this.T1(),
		t2 = new this.T2();

	check = check && (t2 instanceof this.T1)
		&& (this.T3 === undefined);

}).apply(com.eduardocuomo.examples);

(function () {

	var t3 = new this.T3();

	check = check && (this.T1 === undefined) && (this.T2 === undefined);

}).apply(com.eduardocuomo.demo);

// Should be true
check