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
 *
 * Thanks : http://ejohn.org/blog/simple-javascript-inheritance/
 */

'use strict';

// package
var com = {
	eduardocuomo : { }
};

Class.extend('T1', {
	__package : com
});

com.T1.extend('T2');

com.T2.extend('T3', {
	__package : com.eduardocuomo
});

var t = new com.T1(),
	t2 = new com.T2(),
	t3 = new com.eduardocuomo.T3();

// Should all be true
(this.T1 === undefined) && (this.T2 === undefined) && (this.T3 === undefined) &&
	(com.eduardocuomo.T1 === undefined) && (com.eduardocuomo.T2 === undefined) && (com.T3 === undefined) &&
	(t instanceof Class) && (t2 instanceof com.T1) &&
	(t3 instanceof com.T2) && (t3 instanceof com.eduardocuomo.T3);