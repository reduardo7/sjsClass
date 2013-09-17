/**
 * sjsClass: Simple JavaScript Class.
 *
 * Test.
 *
 * By: Edueado Daniel Cuomo.
 */

'use strict';

Class.extend('Class', {
    // To implement
    test: function() {
        throw 'Test not implemented!';
    },

    __static: {

        create: function(classNameToTest, src) {
            this.tests[this.tests.length] = this.extend(classNameToTest, (typeof src === 'function') ? { test: src } : src);
            return this;
        },

        tests: [],
        _test: function() { var t = new this(); t.test(); return t; },
        run: function() {
            var errors = {};
            if (this.tests) {
                for (var i in this.tests) {
                    var test = this.tests[i];
                    try {
                        var t = test._test();
                        if (t.hasError()) {
                            errors[t.getClassName()] = t.getErrors();
                        }
                    } catch(e) {
                        errors[test.getClassName()] = {
                            type: 'EXCEPTION!',
                            exception: e
                        };
                    }
                }
            }
            return errors;
        }
    },
    __constructor: function() { this.className = this.getClassName().substr(4); this.class = Class.getClass(this.className); },
    __prefix: 'Test',
    _test: function(test, espected, type, msg) { var t = test === espected; if (!t) this.addError(msg, type, espected, test); return t; },
    _testN: function(test, espected, type, msg) { var t = test !== espected; if (!t) this.addError(msg, type, espected, test); return t; },
    _errors: [],

    className: null,
    class: null,
    instance: null,
    newInstance:                     function() { this.instance = this.class.newInstance.apply(this.class, arguments); return this.instance; },
    addError:                        function(msg, type, espected, result) { this._errors[this._errors.length] = { type: type || 'GENERAL', message: msg || 'Invalid', espected: espected, result: result }; },
    getErrors:                       function() { return this._errors; },
    hasError:                        function() { return this._errors.length > 0; },
    assertTrue:                      function(test, msg) { return this._test(test, true, 'assertTrue', msg); },
    assertFalse:                     function(test, msg) { return this._test(test, false, 'assertFalse', msg); },
    assertIfTrue:                    function(test, msg) { var t = !!test; if (!t) this.addError(msg, 'assertIfTrue', 'if (value == true)', test); return t; },
    assertIfFalse:                   function(test, msg) { var t = !test; if (!t) this.addError(msg, 'assertIfFalse', 'if (value == false)', test); return t; },
    assertNull:                      function(test, msg) { return this._test(test, null, 'assertNull', msg); },
    assertEmptyString:               function(test, msg) { return this._test(test, '', 'assertEmptyString', msg); },
    assertIs:                        function(test, typeName, msg) { return this._test(typeof test, typeName, 'assertIs', msg); },
    assertIsNot:                     function(test, typeName, msg) { return this._testN(typeof test, typeName, 'assertIsNot', msg); },
    assertInstanceIs:                function(typeName, msg) { return this._test(typeof this.instance, typeName, 'assertInstanceIs', msg); },
    assertInstanceIsNot:             function(typeName, msg) { return this._testN(typeof this.instance, typeName, 'assertInstanceIsNot', msg); },
    assertIsA:                       function(test, object, msg) { return this._test(typeof test, typeof object, 'assertIsA', msg); },
    assertIsNotA:                    function(test, object, msg) { return this._testN(typeof test, typeof object, 'assertIsNotA', msg); },
    assertInstanceIsA:               function(object, msg) { return this._test(typeof this.instance, typeof object, 'assertInstanceIsA', msg); },
    assertInstanceIsNotA:            function(object, msg) { return this._testN(typeof this.instance, typeof object, 'assertInstanceIsNotA', msg); },
    assertInstanceOf:                function(test, Class, msg) { var t = test instanceof Class; if (!t) this.addError(msg, 'assertInstanceOf', Class, test); return t; },
    assertNotInstanceOf:             function(test, Class, msg) { var t = !(test instanceof Class); if (!t) this.addError(msg, 'assertNotInstanceOf', Class, test); return t; },
    assertInstanceIsInstanceOf:      function(Class, msg) { var t = this.instance instanceof Class; if (!t) this.addError(msg, 'assertInstanceIsInstanceOf', Class, this.instance); return t; },
    assertInstanceIsNotInstanceOf:   function(Class, msg) { var t = !(this.instance instanceof Class); if (!t) this.addError(msg, 'assertInstanceIsNotInstanceOf', Class, this.instance); return t; },
    assertDefined:                   function(test, msg) { return this._testN(typeof test, 'undefined', 'assertDefined', msg); },
    assertUndefined:                 function(test, msg) { return this._test(typeof test, 'undefined', 'assertUndefined', msg); },
    assertIsNumber:                  function(test, msg) { var t = !isNaN(test); if (!t) this.addError(msg, 'assertIsNumber', 'Number', test); return t; },
    assertEquals:                    function(obj2, obj1, msg) { return this._test(obj2, obj1, 'assertEquals', msg); },
    assertEqualsClass:               function(class2, class1, msg) { var t = (class1 instanceof Class) && (class2 instanceof Class) && class1.equals(class2); if (!t) this.addError(msg, 'assertEqualsClass', class1.getClassName(), class2.getClassName()); return t; },
    assertInstanceEqualsClass:       function(class1, msg) { var t = (class1 instanceof Class) && (this.instance instanceof Class) && class1.equals(this.instance); if (!t) this.addError(msg, 'assertEqualsClass', class1.getClassName(), this.instance.getClassName()); return t; }
});


// Class

Class.extend('Person', {
    __static: {
        // Static methods
        testStatic: function() {
            return true;
        },
        staticVar: true,
        count: 100
    },
    __constructor: function(isDancing) {
        this.dancing = isDancing;
        console.log(this.getClassName(), 'has "dance" method?', this.hasMethod('dance'));
        console.log(this.getClassName(), 'has "dancing" value?', this.hasVar('dancing'));
        console.log('Person number', ++Person.count);
    },
    dance: function() {
        console.log('dance', this.getClassName(), this.dancing);
    }
});

Person.extend('Ninja', {
    dance: function() {
        // Call the inherited version of dance()
        this.__super(); // => dance Ninja false
        this.__parent.dance(); // => dance Person undefined
    },
    swingSword: function() {
        console.log('swingSword');
    }
});


// Tests

TestClass
    .create('Person', {
        test: function() {
            this.newInstance(true);
            this.assertTrue(this.instance.dancing);
            this.assertUndefined(this.instance.dance());
        }
    })
    .create('Ninja', function() {
        this.newInstance();
        this.assertUndefined(this.instance.dancing);
        this.assertInstanceIsInstanceOf(Person);
    });

// Run tests

TestClass.run();