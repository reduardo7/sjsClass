/**
 * sjsClass: Simple JavaScript Class.
 * Copyright (c) 2013 sjsClass | Eduardo Daniel Cuomo | eduardo.cuomo.ar@gmail.com
 *
 * By: Edueado Daniel Cuomo.
 *
 * Examples: Tests.
 *
 * Project: https://github.com/reduardo7/sjsClass
 * Doc: https://github.com/reduardo7/sjsClass/blob/master/README.md
 *
 * Thanks : http://ejohn.org/blog/simple-javascript-inheritance/
 */

'use strict';

(function (ctx) {

	// Exception

	var AssertException = Class.Exception.Extend('AssertException', {
		__package : this, // Only on this context
		__protected : {
			_type : null,
			_expected : undefined,
			_value : undefined
		},
		__constructor : function (type, value, expected) {
			this.__super(type);
			this._type = type;
			this._expected = expected;
			this._value = value;
		},
		ShowError : function () {
			console.log(this._type, this._expected, this._value)
		},
		toString : function () {
			return this.message;
		}
	});

	// Privates

	var _errors = [ ],
		_asserts = { };

	(function () {

		function _test (type, value, expected) {
			if (test !== expected) _asserts.AddError(type, value, expected);
		}

		function _testN (type, value, expected) {
			if (test === expected) _asserts.AddError(type, value, expected);
		}

		_asserts.AddError = function (type, value, expected) {
			var e = new AssertException(type, value, expected);
			_errors.push(e);
			throw e;
		}

		// Assert

		_asserts.AssertEquals = function (value, expected) {
			_test('AssertEquals', value, expected);
		};

		_asserts.AssertTrue = function (value) {
			_test('AssertTrue', value, true);
		};

		_asserts.AssertFalse = function (value) {
			_test('AssertFalse', value, false);
		};

		_asserts.AssertIsTrue = function (value) {
			if (!value) _asserts.AddError('AssertIsTrue', value, true);
		};

		_asserts.AssertIsFalse = function (value, msg) {
			if (value) _asserts.AddError('AssertIsFalse', value, true);
		};

		_asserts.AssertNull = function (value) {
			_test('AssertNull', value, null);
		};

		_asserts.AssertEmptyString = function (value) {
			_test('AssertEmptyString', value, '');
		};

		_asserts.AssertNullOrEmptyString = function (value) {
			AssertNull(value);
			AssertEmptyString(value.toString());
		};

		_asserts.AssertIsType = function (value, typeName) {
			_test('AssertIsType', typeof value, typeName);
		};

		_asserts.AssertIsNotType = function (value, typeName) {
			_testN('AssertIsNotType', typeof value, typeName);
		};

		_asserts.AssertInstanceOf = function (value, clazz) {
			if (!(value instanceof clazz)) _asserts.AddError('AssertInstanceOf', typeof value, 'a [' + typeof _value + ']');
		};

		_asserts.AssertNotInstanceOf = function (value, clazz) {
			if (value instanceof clazz) _asserts.AddError('AssertNotInstanceOf', typeof value, 'not a [' + typeof value + ']');
		};

		_asserts.AssertDefined = function (value) {
			_testN('AssertDefined', value, undefined);
		};

		_asserts.AssertUndefined = function (value) {
			_test('AssertUndefined', value, undefined);
		};

		_asserts.AssertIsNumber = function (value) {
			if (isNaN(value)) _asserts.AddError('AssertIsNumber', value, Number);
		};

		_asserts.AssertEqualsClass = function (clazzInstence, classInstanceExpected) {
			if (!((clazzInstence instanceof Class) && (classInstanceExpected instanceof Class) && clazzInstence.Equals(classInstanceExpected)))
				_asserts.AddError('AssertEqualsClass', clazzInstence.constructor, classInstanceExpected.constructor);
		};

		_asserts.AssertNotEqualsClass = function (class2, class1) {
			if ((clazzInstence instanceof Class) && (classInstanceExpected instanceof Class) && clazzInstence.Equals(classInstanceExpected))
				_asserts.AddError('AssertNotEqualsClass', clazzInstence.constructor.name, 'not a [' + classInstanceExpected.constructor.name + ']');
		};

	})();

	// Constructor

	function sjsClassUnitTest (name, fnTest) {
		for (var i in _asserts)
			eval('var ' + i + ' = _asserts[i];');

		var Class = ctx.sjsClassUnitTest.TestClass,
			_asserts;

		try {
			eval('(' + fnTest.toString() + ').apply(sjsClassUnitTest);');
		} catch (ex) {
			if (!(ex instanceof AssertException)) {
				try {
					sjsClassUnitTest.AddError('ExecuteException', ex, undefined);
				} catch (e) { }
			}
		}
	}

	// Prototype
	sjsClassUnitTest.prototype = _asserts;
	sjsClassUnitTest.prototype.constructor = sjsClassUnitTest;

	// Static

	sjsClassUnitTest.GetErrors = function () {
		return _errors;
	};

	sjsClassUnitTest.HasError = function () {
		return _errors.length > 0;
	}

	sjsClassUnitTest.RemoveErrors = function () {
		return _errors = [ ];
	};

	sjsClassUnitTest.AddError = _asserts.AddError;

	for (var i in _asserts)
		sjsClassUnitTest[i] = _asserts[i];

	// Class
	Class.Extend('TestClass', { __package : sjsClassUnitTest });

	// Global
	ctx.sjsClassUnitTest = sjsClassUnitTest;

})(window || this);

sjsClassUnitTest.RemoveErrors();

sjsClassUnitTest('Constants', function () {
	Class.Extend('Test', {
		__const : {
			cx : 111
		},
		'const c' : 123,
		foo : function (v) {
			this.c = v;
			return this.c;
		}
	});

	var t = new Test();
	t.c = 6776;
	t.cx = 55555;

	// Should all be true
	AssertEquals(t.c,        123);
	AssertEquals(t.foo(534), 123);
	AssertEquals(Test.c,     123);
	AssertEquals(t.cx,       111);
	AssertEquals(Test.cx,    111);
});

sjsClassUnitTest.GetErrors()