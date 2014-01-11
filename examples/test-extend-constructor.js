/**
 * sjsClass: Simple JavaScript Class.
 * Copyright (c) 2013 sjsClass | Eduardo Daniel Cuomo | eduardo.cuomo.ar@gmail.com
 *
 * By: Edueado Daniel Cuomo.
 *
 * Examples: Test Extend Constructor.
 *
 * Project: https://github.com/reduardo7/sjsClass
 * Doc: https://github.com/reduardo7/sjsClass/blob/master/README.md
 *
 * Thanks : http://ejohn.org/blog/simple-javascript-inheritance/
 */

'use strict';

Class.Extend('Test', {
	'protected _pv' : 'Initial Value',
	'property prop1' : {
		get : function () { return this._pv; }
	},
	__constructor : function (a) {
		this._pv = a;
	}
});

Test.Extend('Foo', {
	__constructor : function (a) {
		this.__super('[' + a + ']');
	},
	x : function () {
		return this._pv;
	}
});

Test.Extend('Bar');

var t = new Test(111),
	f = new Foo(222),
	b = new Bar(333);

// Should all be true
(t.prop1 === 111) && (f.prop1 === '[222]') && (b.prop1 === 333)