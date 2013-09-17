/**
 * sjsClass: Simple JavaScript Class.
 *
 * Demo.
 *
 * By: Edueado Daniel Cuomo.
 */

'use strict';

Class.extend('Person', {
    __static: {
        // Static methods
        testStatic: function() {
            return true;
        },
        staticVar: true,
        count: 100,
        extendCount: 100
    },
    __onExtend: function() {
        console.log('Extend Person Count:', this.extendCount++);
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

var Tom = Person.extend(/*Dynamic Class Name*/{
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

var p = Person.newInstance(false);
p.dance(); // => true

var g = new Tom();

var n = new Ninja();
n.dance(); // => false
n.swingSword(); // => true

// Should all be true
Person.testStatic() && Tom.testStatic() && Ninja.testStatic() &&
p instanceof Person && p instanceof Class && !(p instanceof Tom) &&
g instanceof Tom && g instanceof Person && g instanceof Class &&
n instanceof Ninja && n instanceof Person && n instanceof Class
