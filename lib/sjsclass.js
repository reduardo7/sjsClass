/**
 * sjsClass: Simple JavaScript Class.
 * Copyright (c) 2013 sjsClass | Eduardo Daniel Cuomo | eduardo.cuomo.ar@gmail.com
 *
 * By: Eduardo Daniel Cuomo.
 *
 * Project: https://github.com/reduardo7/sjsClass
 * Doc: https://github.com/reduardo7/sjsClass/blob/master/README.md
 *
 * Thanks:
 *      http://ejohn.org/blog/simple-javascript-inheritance/
 *      http://marcosc.com/2012/03/dynamic-function-names-in-javascript/
 */

// Node.js
var __isNodeJs__ = !window;
function voidClassWindowNodeJs () {};
if (__isNodeJs__) var window = new voidClassWindowNodeJs();

(function (context, BaseClassName) {
    'use strict';

	// Check if loaded
	if (typeof context[BaseClassName] === 'function') return;

	var initializing         = false,
		instancing           = true,
		instanceLock         = true,
		fnTest               = /xyz/.test(function () { xyz; }) ? /\b__super\b/ : /.*/,
		extendClassCount     = 0,
		invalidStatic        = ['prototype', 'length', 'name', 'arguments', 'caller', '__parent'],
		invalidProto         = ['__static'],
		// Internal
		constants            = { },
		properties           = { },
		protecteds           = { },
		protectedsVals       = { },
		protectedCallStack   = { },
		instancesCount       = { },
		baseCount            = 0,
		Class;

	// Internal Utils

	function defined (x) { return typeof x !== 'undefined'; }
	function hasVar (x) { return this.hasOwnProperty(x); }
	function hasMethod (m) { return defined(this[m]) && (typeof this[m] === 'function'); }
	function throwException (message) { throw Class.Exception ? new Class.Exception(message) : message; }
	function clone (o) {
		if ((o === null) || (typeof o !== 'object'))
			return o;
		var t = o.constructor();
		for (var k in o) {
			try {
				t[k] = clone(o[k]);
			} catch (e) {
				// Properties
			}
		}
		return t;
	}

	function initNewClass (o, value) {
		// Class ID
		Object.defineProperty(o, '__classId', {
			enumerable : false,
			writable : false,
			value : o.prototype.constructor.name + ':' + ++baseCount
		});

		// Instance Count
		Object.defineProperty(o, '__instanceCount', {
			enumerable : true,
			get : function () { return instancesCount[o.__classId]; },
			set : function (value) { if (!instanceLock) instancesCount[o.__classId] = value; }
		});
		instanceLock = false;
		o.__instanceCount = value || 0;
		instanceLock = true;
	}

	function setInstanceId (o) {
		instanceLock = false;
		Object.defineProperty(o, '__instanceId', {
			value : o.constructor.__classId + ':' + ++o.constructor.__instanceCount,
			configurable : false,
			enumerable : true,
			writable : false
		});
		instanceLock = true;
	}

	function getMethodName (v) {
		for (var i in v)
			if (['const', 'constant', 'prop', 'property', 'protected', 'static'].indexOf(v[i]) === -1)
				return v[i];
		throwException('[' + v + '] not have a name!');
	}

	// Class

	function ClassInit () {
		if (this instanceof Class) {
			// New instance
			if (initializing)
				return;
			// Instance ID
			setInstanceId(this);
			return this;
		} else {
			// Static call
			return Class.extend.apply(Class, arguments);
		}
	}

	Class = new Function('init', 'return function ' + BaseClassName + '(){return init.apply(this,arguments);}')(ClassInit);

	Class.prototype = {
		constructor : Class,
		hasVar : hasVar,
		hasMethod : hasMethod,
		getClassName : function () { return this.constructor.name; },
		hasGetter : function (n) { return defined(this.__lookupGetter__(n)); },
		hasSetter : function (n) { return defined(this.__lookupSetter__(n)); },
		hasProperty : function (n) { return defined(this.__lookupGetter__(n)) || defined(this.__lookupSetter__(n)); },
		hashCode : function () {
			var h = { };
			for (var n in this)
				if ((invalidStatic.indexOf(n) === -1) && (typeof this[n] !== 'function'))
					h[n] = this[n];
			h.__CLASS_NAME = this.constructor.name;
			return JSON.stringify(h);
		},
		equals : function (o) { return (o instanceof Class) && (this.getClassName() === o.getClassName()) && (this.hashCode() === o.hashCode()); },
		toString : function () { return this.getClassName() + ':' + this.hashCode(); },
		__static : Class
	};

	constants[BaseClassName]  = { };
	properties[BaseClassName] = { };
	protecteds[BaseClassName] = { };

	Class.__package       = context;
	Class.__prefix        = null;
	Class.hasVar          = hasVar;
	Class.hasMethod       = hasMethod;
	Class.getClassName    = function () { return this.name; };
	Class.classExists     = function (className) { var c = this.__static.__package[className]; return (typeof c === 'function') && (c.prototype instanceof Class); };
	Class.__onExtend      = function () { };
	Class.__getConstants  = function () { return clone(constants[this.name]); };
	Class.__getProperties = function () { return clone(properties[this.name]); };
	Class.__getProtecteds = function () { return clone(protecteds[this.name]); };

	// Instances Count
	initNewClass(Class);

	Class.new = Class.newInstance = function () {
		var s = 'return new t(';
		for (var i in arguments) {
			if (i > 0) s += ',';
			s += 'a[' + i + ']';
		}
		return new Function('t', 'a', s + ')')(this, arguments);
	};

	Class.newInstanceOf = function (className) {
		if (this.classExists(className)) {
			var s = 'return new c(';
			for (var i in arguments) {
				if (i > 0) {
					if (i > 1) s += ',';
					s += 'a[' + i + ']';
				}
			}
			return new Function('c', 'a', s + ')')(this.getClass(className), arguments);
		} else {
			throwException('Error! Class "' + className + '" not declared!');
		}
	};

	Class.getClass = function (className) {
		if (this.classExists(className)) {
			return this.__static.__package[className];
		} else {
			throwException('Error! Class "' + this.__static.__package.constructor.name + '.' + className + '" not declared!');
		}
	};

	Class.package = function (pka, fn) {
		var o = this.__package;
		if (!fn) {
			fn = pka;
			pka = this.__package;
		} else {
			this.__package = pka;
		}
		Class.__package = pka;
		try {
			fn.apply(pka, [ pka, this ]);
		} finally {
			this.__package = o;
			Class.__package = context;
		}
	};

	Class.extend = function (src_name, src) {
		var __super          = this.prototype,
			__construct      = __super.constructor,
			fluent           = !!this.__fluent,
			className        = false,
			register         = false,
			__constructProps = Object.getOwnPropertyNames(__construct),
			newClass, ppt;

		function setName (n) {
			className = src_name;
			register  = true;
		}

		// Class Name
		if (src) {
			setName(src_name);
		} else {
			if (typeof src_name === 'string') {
				src = { };
				setName(src_name);
			} else {
				src = src_name ? src_name : { };
			}
		}

		// Static
		if (!defined(src.__static))
			src.__static = { };

		// Context
		if (defined(src.__package)) {
			src.__static.__package = src.__package;
			register = true;
		} else if (defined(src.__static.__package)) {
			register = true;
		} else {
			src.__static.__package = __construct.__package;
		}

		// Generate new dynamic Class Name
		if (!className) {
			do {
				className = __construct.name + '_extended_' + extendClassCount++;
			} while (src.__static.__package[className]);
		}

		// Prefix
		if (defined(src.__prefix)) {
			src.__static.__prefix = src.__prefix ? src.__prefix.trim() : '';
			delete src.__prefix;
		} else {
			src.__static.__prefix = this.__prefix ? this.__prefix.trim() : '';
		}
		className = src.__static.__prefix + className;

		// Internal vars
		constants[className]  = this.__getConstants();
		properties[className] = this.__getProperties();
		protecteds[className] = this.__getProtecteds();

		function protectedCall (t, fn, args) {
			var r, i, id = t.__instanceId;
			if (!protectedsVals[id])
				protectedsVals[id] = clone(protecteds[t.getClassName()]);
			if (protectedCallStack[id] === undefined)
				protectedCallStack[id] = 0;

			// Add Protecteds
			if (!protectedCallStack[id]++)
				for (i in protectedsVals[id])
					t[i] = protectedsVals[id][i];

			// Execute
			try {
				r = fn.apply(t, args);
			} finally {
				// Save and Remove Protecteds
				if (!--protectedCallStack[id]) {
					for (i in protectedsVals[id]) {
						protectedsVals[id][i] = t[i];
						delete t[i];
					}
				}
			}

			// Return
			return r;
		}

		// Fluent interface
		if (defined(src.__fluent))
			fluent = !!src.__fluent;

		// On Extend Event
		if (defined(src.__onExtend)) {
			src.__static.__onExtend = src.__onExtend;
			delete src.__onExtend;
		}

		// Call as Function
		if (defined(src.__function) && (typeof src.__function === 'function')) {
			var _f = src.__function;
			delete src.__function;
			src.__static.__function = function () {
				var tmp = this.__super;
				this.__super = __construct.__function;
				var r = _f.apply(this, arguments);
				this.__super = tmp;
				return r;
			}
		} else {
			src.__static.__function = function () {
				return __construct.__function ? __construct.__function.apply(this, arguments) : undefined;
			};
		}

		// Constants
		if (defined(src.__const)) {
			for (var i in src.__const)
				constants[className][i] = src.__const[i];
			delete src.__const;
		}

		// Protected
		if (defined(src.__protected)) {
			for (var i in src.__protected)
				protecteds[className][i] = src.__protected[i];
			delete src.__protected;
		}

		// Properties
		if (defined(src.__property)) {
			for (var i in src.__property)
				properties[className][i] = src.__property[i];
			delete src.__property;
		}

		// Alternative declaration
		for (var name in src) {
			var v = (name + '').trim().split(/\s+/);
			if (v.length > 1) {
				if (v.indexOf('static') > -1) {
					src.__static[getMethodName(v)] = src[name];
				} else if (v.indexOf('protected') > -1) {
					protecteds[className][getMethodName(v)] = src[name];
				} else if (v.indexOf('const') > -1) {
					constants[className][getMethodName(v)] = src[name];
				} else if ((v.indexOf('property') > -1) || (v.indexOf('prop') > -1)) {
					properties[className][getMethodName(v)] = src[name];
				} else {
					// Invalid declaration
					throwException('Invalid declaration: "' + name + '"');
				}

				delete src[name];
			}
		}

		// Instantiate a base class (but only create the instance, don't run the constructor: __constructor)
		initializing = true;
		try {
			ppt = new this();
		} finally {
			initializing = false;
		}

		function _defineProperty (t, i) {
			if (
				(typeof properties[className][i].get === 'function')
				|| (typeof properties[className][i].set === 'function')
			) {
				// Getter and Setter
				Object.defineProperty(t, i, {
					configurable : true,
					enumerable : true,
					get : (typeof properties[className][i].get === 'function') ? function () { return protectedCall(t, properties[className][i].get); } : undefined,
					set : (typeof properties[className][i].set === 'function') ? function () { protectedCall(t, properties[className][i].set, arguments); } : undefined
				});
			} else {
				// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
				Object.defineProperty(t, i, {
					configurable : properties[className][i].configurable || true,
					enumerable : properties[className][i].enumerable || true,
					// Value
					value : properties[className][i].value || undefined,
					writable : properties[className][i].writable || false,
					// Getter and Setter
					get : (typeof properties[className][i].get === 'function') ? function () { return protectedCall(t, properties[className][i].get); } : undefined,
					set : (typeof properties[className][i].set === 'function') ? function (v) { protectedCall(t, properties[className][i].set, arguments); } : undefined
				});
			}
		}

		// Copy the properties over onto the new prototype
		for (var name in src) {
			if (invalidProto.indexOf(name) === -1) {
				// Check if we're overwriting an existing function
				if (ppt.hasProperty(name)) {
					// Define Property
					_defineProperty(ppt, name);
				} else {
					// Copy Property
					ppt[name] = (typeof src[name] === "function") ? (
						function (name, fn) {
							return function () {
								var t = this,
									hs = (typeof __super[name] === "function") && fnTest.test(src[name]),
									tmp = t.__super,
									ret;

								if (name === '__constructor')
									instancing = false;

								// Add a new .__super() method that is the same method
								// but on the super-class
								if (hs) t.__super = function () { return protectedCall(this, __super[name], arguments); };

								// The method only need to be bound temporarily, so we
								// remove it when we're done executing
								try {
									ret = protectedCall(t, fn, arguments);
								} finally {
									if (name === '__constructor')
										instancing = true;
								}

								// Restore __super
								if (hs) t.__super = tmp;

								// Return result
								return (!defined(ret) && fluent) ? t : ret;
							};
						})(name, src[name]) : src[name];
				}
			}
		}

		function constructorInit () {
			var t = this;
			if (src.__static.__package[className]
				// Normal
				? (t instanceof src.__static.__package[className])
				// Anonymous Class
				: ((t.constructor.name === className) && (t.__static.__package === src.__static.__package))
			) {
				// New Instance
				if (initializing)
					return;

				if (instancing) {
					// Properties
					for (var i in properties[className])
						_defineProperty(t, i);
					// Instance ID
					setInstanceId(t);
				}

				// Constructor
				if (t.__constructor)
					t.__constructor.apply(t, arguments);

				return t;
			} else {
				// Static call
				return newClass.__function.apply(newClass, arguments);
			}
		}

		// The dummy class constructors
		newClass = new Function('init', 'return function ' + className + '(){return init.apply(this,arguments);};')(constructorInit);

		// Static
		for (var i in __constructProps) {
			var name = __constructProps[i];
			// Check if we're overwriting an existing function
			if (invalidStatic.indexOf(name) === -1)
				newClass[name] = __construct[name];
		}

		// Constants
		for (var i in constants[className]) {
			// Static
			Object.defineProperty(newClass, i, { value: constants[className][i] });
			// Instance
			Object.defineProperty(ppt, i, { value: constants[className][i] });
		}

		// New Static
		if (src.__static) {
			for (var name in src.__static) {
				if (invalidStatic.indexOf(name) === -1) {
					// Check if we're overwriting an existing function
					newClass[name] = (typeof src.__static[name] === "function") ? (
						function (name, fn) {
							return function () {
								var ret,
									t = this,
									hs = (typeof __construct[name] === "function") && fnTest.test(src.__static[name]),
									tmp = t.__super;

								// Add a new .__super() method that is the same method
								// but on the super-class
								if (hs) t.__super = function () {
									return __construct[name].apply(t, arguments);
								};

								// The method only need to be bound temporarily, so we
								// remove it when we're done executing
								try {
									ret = fn.apply(t, arguments);
								} finally {
									// Restore __super
									if (hs) t.__super = tmp;
								}

								return (!defined(ret) && fluent) ? t : ret;
							};
						})(name, src.__static[name]) : src.__static[name];
				}
			}
		}

		// Instance count to 0
		initNewClass(newClass);

		// References
		ppt.__parent = __super;
		newClass.__parent = this;
		ppt.__static = newClass;

		// Populate our constructed prototype object
		newClass.prototype = ppt;

		// Enforce the constructor to be what we expect
		newClass.prototype.constructor = newClass;

		// Append in context
		if (register && (!__isNodeJs__ || !(src.__static.__package instanceof voidClassWindowNodeJs)))
			Object.defineProperty(src.__static.__package, className, { value : newClass });

		// Execute Callback
		this.__onExtend();

		// Return
		return newClass;
	};

	// Exception

	Class.extend('Exception', {
		__package : Class,
		__protected : {
			_message : undefined,
			_innerException : undefined
		},
		__property : {
			message : {
				get : function () { return this._message; }
			},
			innerException : {
				get : function () { return this._innerException; }
			}
		},
		__function : function (message, innerException) {
			return new this(message, innerException);
		},
		__constructor : function (message, innerException) {
			this._message = message;
			this._innerException = innerException;
		},
		toString : function () {
			return this._message;
		}
	});

	// Change package for derived Classes
	Class.Exception.__package = context;

	if (__isNodeJs__) {
		// Node.js
		// Create "Register Global" method
		Class.registerGlobal = function () {
			if (!global[BaseClassName]) {
				// Set "global" as package
				Class.__package = global;
				// Register Class in "global" context
				global[BaseClassName] = Class;
				// Change package
				Class.Exception.__package = global;
			}
			// Return Class
			return Class;
		};

		module.exports = Class;
	} else {
		// Append in context
		Object.defineProperty(context, BaseClassName, { value : Class });
	}
})(window, 'Class');