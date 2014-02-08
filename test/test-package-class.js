/**
 * sjsClass: Simple JavaScript Class.
 * Copyright (c) 2013 sjsClass | Eduardo Daniel Cuomo | eduardo.cuomo.ar@gmail.com
 *
 * By: Edueado Daniel Cuomo.
 *
 * Examples: Test package Class.
 *
 * Project: https://github.com/reduardo7/sjsClass
 * Doc: https://github.com/reduardo7/sjsClass/blob/master/README.md
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
Class.package(com.eduardocuomo.examples, function () {

	Class.extend('T1');

});

// Class 2
Class.package(com.eduardocuomo.examples, function () {

	this.T1.extend('T2');

});

// Class 3
Class.package(com.eduardocuomo.demo, function () {

	Class.extend('T3');

});

// Class 4
com.eduardocuomo.demo.T3.package(function () {

	Class.extend('T4');

});


// Work

var check = true;

Class.package(com.eduardocuomo.examples, function () {

	var t = new this.T1(),
		t2 = new this.T2();
	check = check && (t2 instanceof this.T1)
		&& (this.T3 === undefined) && (this.T4 === undefined);

});

// equals to

(function () {

	var t = new this.T1(),
		t2 = new this.T2();
	check = check && (t2 instanceof this.T1)
		&& (this.T3 === undefined) && (this.T4 === undefined);

}).apply(com.eduardocuomo.examples);

// ---

Class.package(com.eduardocuomo.demo, function ($) {

	var t3 = new $.T3(),
		t4 = new this.T4();
	check = check && ($ === this) &&
		($.T1 === undefined) && ($.T2 === undefined) && ($.T4 !== undefined);

});

// equals to

(function () {

	var t3 = new this.T3(),
		t4 = new this.T4();
	check = check && (this.T1 === undefined) && (this.T2 === undefined) && (this.T4 !== undefined);

}).apply(com.eduardocuomo.demo);


// Should be true
check