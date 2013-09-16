/**
 * sjsClass: Simple JavaScript Class.
 *
 * Test.
 *
 * By: Edueado Daniel Cuomo.
 */
 
'use strict';

Class.extend('TestClass', {
    __prefix: 'Test',
    __static: {
        tests: [],
        test: function() {
            var t = new this();
            return t.test();
        },
        run: function() {
            var errors = {};
            if (this.tests) {
                for (var i in this.tests) {
                    errors[this.tests[i].getClassName()] = this.tests[i].test();
                }
            }
            return errors;
        }
    },
    __onExtend: function() {
        TestClass.tests[TestClass.tests.length] = this;
    },
    className: null,
    instance: null,
    __construct: function() {
        this.className = this.getClassName().substr(4);
        this.instance  = Class.newInstanceOf(this.className);
    },
    test: function() {
        throw 'Test not implemented!';
    }
});

// Tests

TestClass.extend('Person', {
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

var Grew = Person.extend(/*Dynamic Class Name*/{
    __static: {
        // Static methods
        testStatic: function() {
            return this.__super() && this.__parent.testStatic();
        }
    },
    __constructor: function() {
        this.__super(this.__static.staticVar);
        // or this.dancing = false;
    }
});

Grew.extend('Ninja', {
    dance: function() {
        // Call the inherited version of dance()
        this.__super(); // => dance Ninja false
        this.__parent.dance(); // => dance Person undefined
    },
    swingSword: function() {
        console.log('swingSword');
    }
});
