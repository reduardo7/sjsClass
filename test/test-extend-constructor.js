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
 */

/*jslint browser: true, regexp: true, white: true, evil: true */
/*global Class, TestExtendConstructorTest, TestExtendConstructorFoo, TestExtendConstructorBar */

(function () {
	'use strict';

	Class.extend('TestExtendConstructorTest', {
		'protected _pv' : 'Initial Value',
		'property prop1' : {
			get : function () { return this._pv; }
		},
		__constructor : function (a) {
			this._pv = a;
		}
	});

	TestExtendConstructorTest.extend('TestExtendConstructorFoo', {
		__constructor : function (a) {
			this.__super('[' + a + ']');
		},
		x : function () {
			return this._pv;
		}
	});

	TestExtendConstructorTest.extend('TestExtendConstructorBar');

	var t = new TestExtendConstructorTest(111),
		f = new TestExtendConstructorFoo(222),
		b = new TestExtendConstructorBar(333);

	console.log('Should all be true:', (t.prop1 === 111), (f.prop1 === '[222]'), (b.prop1 === 333));
}());