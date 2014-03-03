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
/*global Class, FooException, TestException */

(function () {
	'use strict';

	// New Exception
	Class.Exception.extend('FooException');

	// Anonymous Exception
	var BarException = FooException.extend();

	// New Exception
	Class.Exception.extend('TestException', {
		'protected _data' : undefined,
		'property data' : { get : function () { return this._data; } },
		__constructor : function (message, data, innerException) {
			this.__super(message, innerException);
			this._data = data;
		}
	});

	// Test

	try {
		try {
			throw new FooException();
		} catch (e1) {
			// e1.data = 'NO SET'; --> Error
			// e1.message = 'NO SET'; --> Error

			// Should all be true
			console.log('Should be true:', (e1 instanceof Class.Exception), (e1 instanceof FooException),
				(e1.message === undefined));

			throw new BarException('Bar Message', e1);
		}
	} catch (e2) {
		// Should all be true
		console.log('Should be true:', (e2 instanceof Class.Exception), (e2 instanceof FooException), (e2 instanceof BarException),
			!!e2.innerException, (e2.innerException instanceof FooException), !(e2.innerException instanceof BarException),
			(e2.message === 'Bar Message'), !e2.hasVar('data'));
	}

	try {
		throw new TestException('Test Message', { v1 : true, v2 : 'Test' });
	} catch (e3) {
		// Should all be true
		console.log('Should be true:', (e3 instanceof Class.Exception), !(e3 instanceof FooException), !(e3 instanceof BarException),
			(e3.message === 'Test Message'), (e3.data.v1 === true), (e3.data.v2 === 'Test'));
	}
}());