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
        invalidStatic = ['prototype', 'length', 'name', 'arguments', 'caller', '__parent'],
        invalidProto = ['__static'];

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
    Class.__prefix = null;
    
    Class.__onExtend = function() { };
    
    Class.classExists = function(className) {
        var r, s = 'r=' + className + ' instanceof Class;';
        eval(s);
        return r;
    };

    Class.newInstance = function() {
        var r, s = 'r=new this(';
        for (var i in arguments) {
            if (i > 0) s += ',';
            s += 'arguments[' + i + ']';
        }
        eval(s + ');');
        return r;
    };

    Class.newInstanceOf = function(className) {
        if (this.classExists(className)) {
            var r, s = 'r=new ' + className + '(';
            for (var i in arguments) {
                if (i > 0) {
                    if (i > 1) s += ',';
                    s += 'arguments[' + i + ']';
                }
            }
            eval(s + ');');
            return r;
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
        
        if (!src['__static']) {
            src['__static'] = {};
        }
        
        if (src['__onExtend']) {
            src.__static.__onExtend = src['__onExtend'];
            delete src['__onExtend'];
        }
        
        if (src['__prefix']) {
            src.__static.__prefix = src['__prefix'];
            delete src['__prefix'];
        }

        // Instantiate a base class (but only create the instance,
        // don't run the __constructor constructor)
        initializing  = true;
        var prototype = new this();
        initializing  = false;

        // Copy the properties over onto the new prototype
        for (var name in src) {
            if (invalidProto.indexOf(name) === -1) {
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
        
        // Prefix
        className = src.__static.__prefix || this.__prefix;

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
        
        // Execute Callback
        newClass.__onExtend();

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
