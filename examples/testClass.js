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
            this.extend(classNameToTest, (typeof src === 'function') ? { test: src } : src);
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
    __onExtend: function() { TestClass.tests[TestClass.tests.length] = this; },
    __constructor: function() { this.className = this.getClassName().substr(4); this.class = Class.getClass(this.className); },
    _errors: [],
    __prefix: 'Test',
    __test: function(espected, test, type, msg) { var t = test === espected; if (!t) this.addError(msg, type, espected, test); return t; },

    className: null,
    class: null,
    instance: null,
    newInstance:                     function() { this.instance = this.class.newInstance.apply(this.class, arguments); return this.instance; },
    addError:                        function(msg, type, espected, result) { this._errors[this._errors.length] = { type: type || 'GENERAL', message: msg || 'Invalid', espected: espected, result: result }; },
    getErrors:                       function() { return this._errors; },
    hasError:                        function() { return this._errors.length > 0; },
    assertTrue:                      function(test, msg) { return this.__test(test, true, 'assertTrue', msg); },
    assertFalse:                     function(test, msg) { return this.__test(test, false, 'assertFalse', msg); },
    assertIfTrue:                    function(test, msg) { var t = !!test; if (!t) this.addError(msg, 'assertIfTrue', 'if (value == true)', test); return t; },
    assertIfFalse:                   function(test, msg) { var t = !test; if (!t) this.addError(msg, 'assertIfFalse', 'if (value == false)', test); return t; },
    assertNull:                      function(test, msg) { return this.__test(test, null, 'assertNull', msg); },
    assertEmptyString:               function(test, msg) { return this.__test(test, '', 'assertEmptyString', msg); },
    assertIs:                        function(test, typeName, msg) { var t = typeof test === typeName; if (!t) this.addError(msg, 'assertIs', typeName, typeof test); return t; },
    assertIsNot:                     function(test, typeName, msg) { var t = typeof test !== typeName; if (!t) this.addError(msg, 'assertIsNot', typeName, typeof test); return t; },
    assertInstanceIs:                function(typeName, msg) { var t = typeof this.instance === typeName; if (!t) this.addError(msg, 'assertInstanceIs', typeName, typeof this.instance); return t; },
    assertInstanceIsNot:             function(typeName, msg) { var t = typeof this.instance !== typeName; if (!t) this.addError(msg, 'assertInstanceIsNot', typeName, typeof this.instance); return t; },
    assertIsA:                       function(test, object, msg) { var t = typeof test === typeof object; if (!t) this.addError(msg, 'assertIsA', typeof object, typeof test); return t; },
    assertIsNotA:                    function(test, object, msg) { var t = typeof test !== typeof object; if (!t) this.addError(msg, 'assertIsNotA', typeof object, typeof test); return t; },
    assertInstanceIsA:               function(object, msg) { var t = typeof this.instance === typeof object; if (!t) this.addError(msg, 'assertIsA', typeof object, typeof this.instance); return t; },
    assertInstanceIsNotA:            function(object, msg) { var t = typeof this.instance !== typeof object; if (!t) this.addError(msg, 'assertIsNotA', typeof object, typeof this.instance); return t; },
    assertInstanceOf:                function(test, Class, msg) { var t = test instanceof Class; if (!t) this.addError(msg, 'assertInstanceOf', Class, test); return t; },
    assertNotInstanceOf:             function(test, Class, msg) { var t = !(test instanceof Class); if (!t) this.addError(msg, 'assertNotInstanceOf', Class, test); return t; },
    assertInstanceIsInstanceOf:      function(Class, msg) { var t = this.instance instanceof Class; if (!t) this.addError(msg, 'assertInstanceOf', Class, this.instance); return t; },
    assertInstanceIsNotInstanceOf:   function(Class, msg) { var t = !(this.instance instanceof Class); if (!t) this.addError(msg, 'assertNotInstanceOf', Class, this.instance); return t; },
    assertDefined:                   function(test, msg) { var t = typeof test !== 'undefined'; if (!t) this.addError(msg, 'assertDefined', 'not undefined', typeof test); return t; },
    assertUndefined:                 function(test, msg) { var t = typeof test === 'undefined'; if (!t) this.addError(msg, 'assertUndefined', 'undefined', typeof test); return t; },
    assertIsNumber:                  function(test, msg) { var t = !isNaN(test); if (!t) this.addError(msg, 'assertIsNumber', 'Number', test); return t; },
    assertEquals:                    function(obj2, obj1, msg) { var t = obj1 === obj2; if (!t) this.addError(msg, 'assertEquals', obj1, obj2); return t; },
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


TestClass.run();