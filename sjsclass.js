/**
 * sjsClass: Simple JavaScript Class.
 *
 * By: Edueado Daniel Cuomo.
 *
 * Thanks : http://ejohn.org/blog/simple-javascript-inheritance/
 */

;'use strict';

(function(context) {
    'use strict';

    // Check if loaded
    if (context.Class !== undefined) { return; }

    // Internal Utils

    function defined(x) { return typeof x !== 'undefined'; }
    function hasVar(x) { return typeof this[x] !== 'undefined'; }
    function hasMethod(m) { return this.hasVar(m) && (typeof this[m] === 'function'); }

    // Class

    var initializing = false,
        fnTest = /xyz/.test(function(){xyz;}) ? /\b__super\b/ : /.*/,
        extendClassCount = 0,
        invalidStatic = ['prototype', 'length', 'name', 'arguments', 'caller', '__parent'],
        invalidProto = ['__static'];


    function Class() {};

    Class.prototype = {
        hasVar: hasVar,
        hasMethod: hasMethod,
        constructor: Class,
        getClassName: function() { return this.constructor.name; },
        hashCode: function() {
            var h = {};
            for (var n in this) {
                if (invalidStatic.indexOf(n) === -1) {
                    if (typeof this[n] !== 'function') {
                        h[n] = this[n];
                    }
                }
            }
            return JSON.stringify(h);
        },
        equals: function(o) { return (o instanceof Class) && (this.getClassName() == o.getClassName()) && (this.hashCode() == o.hashCode()); },
        toString: function() { return this.getClassName() + ':' + this.hashCode(); }
    }

    Class.hasVar       = hasVar;
    Class.hasMethod    = hasMethod;
    Class.getClassName = function() { return this.name; };
    Class.__prefix     = null;
    Class.__onExtend   = function() { };
    Class.classExists  = function(className) { return eval('typeof ' + className + ' === "function";'); };

    Class.newInstance = function() {
        var s = 'new this(';
        for (var i in arguments) {
            if (i > 0) s += ',';
            s += 'arguments[' + i + ']';
        }
        return eval(s + ')');
    };

    Class.newInstanceOf = function(className) {
        if (this.classExists(className)) {
            var s = 'new ' + className + '(';
            for (var i in arguments) {
                if (i > 0) {
                    if (i > 1) s += ',';
                    s += 'arguments[' + i + ']';
                }
            }
            return eval(s + ')');
        } else {
            throw 'Error! Class "' + className + '" not declared!';
        }
    };

    Class.getClass = function(className) {
        if (this.classExists(className)) {
            return eval(className);
        } else {
            throw 'Error! Class "' + className + '" not declared!';
        }
    };

    Class.extend = function(src_name, src) {
        var __super          = this.prototype,
            __construct      = __super.constructor,
            className        = false,
            register         = false,
            __constructProps = Object.getOwnPropertyNames(__construct),
            newClass;

        function setName(n) {
            className = src_name.replace(/^[^a-zA-Zºª_\$]+/i, '').replace(/[^a-zA-Zºª0-9_\$]/gi, '').trim();
            register  = true;
        }

        // Class Name
        if (src) {
            setName(src_name);
        } else {
            if (typeof src_name === 'string') {
                src = {};
                setName(src_name);
            } else {
                src = src_name;
            }
        }

        // Generate new dynamic Class Name
        if (!className) {
            do {
                className = __construct.name + '_extended_' + extendClassCount++;
            } while (context[className]);
        }

        if (!defined(src['__static'])) {
            src['__static'] = {};
        }

        if (defined(src['__onExtend'])) {
            src.__static.__onExtend = src['__onExtend'];
            delete src['__onExtend'];
        }

        // Prefix
        if (defined(src['__prefix'])) {
            src.__static.__prefix = src['__prefix'] ? src['__prefix'].trim() : '';
            delete src['__prefix'];
        } else {
            src.__static.__prefix = this.__prefix ? this.__prefix.trim() : '';
        }
        className = src.__static.__prefix + className;

        // Instantiate a base class (but only create the instance,
        // don't run the __constructor constructor)
        initializing  = true;
        var prototype = new this();
        initializing  = false;

        // Copy the properties over onto the new prototype
        for (var name in src) {
            if (invalidProto.indexOf(name) === -1) {
                // Check if we're overwriting an existing function
                prototype[name] = (typeof src[name] === "function") && (typeof __super[name] === "function") && fnTest.test(src[name]) ? (
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
            if (invalidStatic.indexOf(name) === -1) {
                // Check if we're overwriting an existing function
                newClass[name] = __construct[name];
            }
        }

        // New Static
        if (src['__static']) {
            for (var name in src['__static']) {
                if (invalidStatic.indexOf(name) === -1) {
                    // Check if we're overwriting an existing function
                    newClass[name] = (typeof src['__static'][name] === "function") && (typeof __construct[name] === "function") && fnTest.test(src['__static'][name]) ? (
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
        newClass.__parent  = this;
        prototype.__static = newClass;

        // Populate our constructed prototype object
        newClass.prototype = prototype;

        // Enforce the constructor to be what we expect
        newClass.prototype.constructor = newClass;

        // Execute Callback
        this.__onExtend();

        // Append in context
        if (register) { context[className] = newClass; }

        // Return
        return newClass;
    };

    // Append in context
    context.Class = Class;
})(window || this);
