/**
 * sjsClass: Simple JavaScript Class.
 *
 * By: Edueado Daniel Cuomo.
 *
 * Thanks : http://ejohn.org/blog/simple-javascript-inheritance/
 */
 
'use strict';
 
(function(context) {
    'use strict';
    
    var initializing = false,
        fnTest = /xyz/.test(function(){xyz;}) ? /\b__super\b/ : /.*/,
        extendClassCount = 0,
        invalidStatic = ['prototype', 'length', 'name', 'arguments', 'caller', 'extend', '__parent'];

    function hasVar(x) {
        return typeof this[x] !== 'undefined';
    }

    function hasMethod(m) {
        return this.hasVar(m) && (typeof this[m] === 'function');
    }

    function Class() {};

    Class.prototype = {
        hasVar: hasVar,
        hasMethod: hasMethod,
        constructor: Class,
        getClassName: function() {
            return this.constructor.name;
        },
        hashCode: function() {
            var h = {};
            for (var n in this) {
                if (invalidStatic.indexOf(n) == -1) {
                    if (typeof this[n] != 'function') {
                        h[n] = this[n];
                    }
                }
            }
            return JSON.stringify(h);
        },
        equals: function(o) {
            return (o instanceof Class) &&
                (this.getClassName() == o.getClassName()) &&
                (this.hashCode() == o.hashCode());
        },
        toString: function() {
            return this.getClassName() + ':' + this.hashCode();
        }
    }

    Class.hasVar = hasVar;
    Class.hasMethod = hasMethod;

    Class.newInstance = function() {
        var r, s = 'r=new this(';
        for (var i in arguments) {
            if (i > 0) s += ',';
            s += 'arguments[' + i + ']';
        }
        eval(s + ');');
        return r;
    };

    Class.extend = function(src_name, src) {
        var __super          = this.prototype,
            __construct      = __super.constructor,
            className        = false,
            register         = false,
            __constructProps = Object.getOwnPropertyNames(__construct),
            newClass;

        if (src) {
            className = src_name.replace(/^[^a-zA-Zºª_\$]+/i, '').replace(/[^a-zA-Zºª0-9_\$]/gi, '') || className;
            register  = true;
        } else {
            src = src_name;
        }

        if (!className) {
            do {
                className = __construct.name + '_extended_' + extendClassCount++;
            } while (context[className]);
        }

        // Instantiate a base class (but only create the instance,
        // don't run the __constructor constructor)
        initializing  = true;
        var prototype = new this();
        initializing  = false;

        // Copy the properties over onto the new prototype
        for (var name in src) {
            if (name != '__static') {
                // Check if we're overwriting an existing function
                prototype[name] = (typeof src[name] == "function") && (typeof __super[name] == "function") && fnTest.test(src[name]) ? (
                    function(name, fn) {
                        return function() {
                            var tmp = this.__super;

                            // Add a new .__super() method that is the same method
                            // but on the super-class
                            this.__super = __super[name];

                            // The method only need to be bound temporarily, so we
                            // remove it when we're done executing
                            var ret = fn.apply(this, arguments);
                            this.__super = tmp;

                            return ret;
                        };
                    })(name, src[name]) : src[name];
            }
        }

        // The dummy class constructor
        eval('newClass=function ' + className + '(){if(!initializing&&this.__constructor){this.__constructor.apply(this,arguments);}};');

        // Static
        for (var i in __constructProps) {
            var name = __constructProps[i];
            if (invalidStatic.indexOf(name) == -1) {
                // Check if we're overwriting an existing function
                newClass[name] = __construct[name];
            }
        }

        // New Static
        if (src['__static']) {
            for (var name in src['__static']) {
                if (invalidStatic.indexOf(name) == -1) {
                    // Check if we're overwriting an existing function
                    newClass[name] = (typeof src['__static'][name] == "function") && (typeof __construct[name] == "function") && fnTest.test(src['__static'][name]) ? (
                        function(name, fn) {
                            return function() {
                                var tmp = this.__super;

                                // Add a new .__super() method that is the same method
                                // but on the super-class
                                this.__super = __construct[name];

                                // The method only need to be bound temporarily, so we
                                // remove it when we're done executing
                                var ret = fn.apply(this, arguments);
                                this.__super = tmp;

                                return ret;
                            };
                        })(name, src['__static'][name]) : src['__static'][name];
                }
            }
        }

        // References
        prototype.__parent = __super;
        newClass.__parent = __construct;
        prototype.__static = newClass;

        // Populate our constructed prototype object
        newClass.prototype = prototype;

        // Enforce the constructor to be what we expect
        newClass.prototype.constructor = newClass;

        // And make this class extendable
        newClass.extend = Class.extend;

        // Register in context
        if (register) {
            context[className] = newClass;
        }

        // Return
        return newClass;
    };

    // Register in context
    context.Class = Class;
})(window);






// Example

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

var p = Person.newInstance(false);
p.dance(); // => true

var g = new Grew();

var n = new Ninja();
n.dance(); // => false
n.swingSword(); // => true

// Should all be true
Person.testStatic() && Grew.testStatic() && Ninja.testStatic() &&
p instanceof Person && p instanceof Class && !(p instanceof Grew) &&
g instanceof Grew && g instanceof Person && g instanceof Class &&
n instanceof Ninja && n instanceof Person && n instanceof Class
