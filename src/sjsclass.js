/**
 * sjsClass: Simple JavaScript Class.
 * Copyright (c) 2013 sjsClass | Eduardo Daniel Cuomo | eduardo.cuomo.ar@gmail.com
 *
 * By: Edueado Daniel Cuomo.
 *
 * Project: https://github.com/reduardo7/sjsClass
 * Doc: https://github.com/reduardo7/sjsClass/blob/master/README.md
 *
 * Thanks : http://ejohn.org/blog/simple-javascript-inheritance/
 */

;'use strict';

(function (context) {
	'use strict';

	// Check if loaded
	// if (context.Class !== undefined) { return; }

	var initializing = false,
		fnTest = /xyz/.test(function (){xyz;}) ? /\b__super\b/ : /.*/,
		extendClassCount = 0,
		invalidStatic = ['prototype', 'length', 'name', 'arguments', 'caller', '__parent'],
		invalidProto = ['__static'];

	// Internal Utils

	function defined (x) { return typeof x !== 'undefined'; }
	function hasVar (x) { return this.hasOwnProperty(x); }
	function hasMethod (m) { return defined(this[m]) && (typeof this[m] === 'function'); }

	function getMethodName (n, v) {
		var x;
		for (var i in n) {
			if (['const', 'constant', 'prop', 'property', 'private'].indexOf(n[i]) === -1) {
				x = v[i];
				break;
			}
		}
		if (!x) throw '[' + n + '] not have a name!';
		return x;
	}

	// Class
	function Class() {};

	Class.prototype = {
		hasVar : hasVar,
		hasMethod : hasMethod,
		constructor : Class,
		getClassName : function () { return this.constructor.name; },
		hasGetter : function (n) { return defined(this.__lookupGetter__(n)); },
		hasSetter : function (n) { return defined(this.__lookupSetter__(n)); },
		hasProperty : function (n) { return defined(this.__lookupGetter__(n)) || defined(this.__lookupSetter__(n)); },
		clone : function () {
			initializing  = true;
			var c = new this.__static();
			initializing  = false;
			for (var i in this) {
				c[i] = this[i];
			}
			return c;
		},
		hashCode : function () {
			var h = {
				CLASS_NAME : this.constructor.name
			};
			for (var n in this) {
				if (invalidStatic.indexOf(n) === -1) {
					if (typeof this[n] !== 'function') {
						h[n] = this[n];
					}
				}
			}
			return JSON.stringify(h);
		},
		equals : function (o) { return (o instanceof Class) && (this.getClassName() == o.getClassName()) && (this.hashCode() == o.hashCode()); },
		toString : function () { return this.getClassName() + ':' + this.hashCode(); }
	}

	Class.hasVar        = hasVar;
	Class.hasMethod     = hasMethod;
	Class.getClassName  = function () { return this.name; };
	Class.__prefix      = null;
	Class.__onExtend    = function () { };
	Class.classExists   = function (className) { return typeof context[className] === 'function'; };
	Class.getConstants  = function () { return {}; };
	Class.getProperties = function () { return {}; };
	Class.getPrivates   = function () { return {}; };

	Class.newInstance = function () {
		var s = 'new this(';
		for (var i in arguments) {
			if (i > 0) s += ',';
			s += 'arguments[' + i + ']';
		}
		return eval(s + ')');
	};

	Class.newInstanceOf = function (className) {
		if (this.classExists(className)) {
			var s = 'new context.' + className + '(';
			for (var i in arguments) {
				if (i > 0) {
					if (i > 1) s += ',';
					s += 'arguments[' + i + ']';
				}
			}
			return eval(s + ')');
		} else {
			throw 'Error! Class "context.' + className + '" not declared!';
		}
	};

	Class.getClass = function (className) {
		if (this.classExists(className)) {
			return eval(className);
		} else {
			throw 'Error! Class "context.' + className + '" not declared!';
		}
	};

	Class.extend = function (src_name, src) {
		var __super          = this.prototype,
			__construct      = __super.constructor,
			fluent           = !!this.__fluent,
			className        = false,
			register         = false,
			__constructProps = Object.getOwnPropertyNames(__construct),
			constants        = this.getConstants(),
			properties       = this.getProperties(),
			privates         = this.getPrivates(),
			privatesVals     = this.getPrivates(),
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

		// Fluent interface
		if (defined(src['__fluent'])) {
			fluent = !!src['__fluent'];
		}

		// Static
		if (!defined(src['__static'])) {
			src['__static'] = {};
		}

		// On Extend Event
		if (defined(src['__onExtend'])) {
			src.__static.__onExtend = src['__onExtend'];
			delete src['__onExtend'];
		}

		// Constants
		if (defined(src['__const'])) {
			for (var i in src['__const'])
				constants[i] = src['__const'][i];
			delete src['__const'];
		}

		// Privates
		if (defined(src['__private'])) {
			for (var i in src['__private'])
				privates[i]     = src['__private'][i];
				privatesVals[i] = src['__private'][i];
			delete src['__private'];
		}

		// Properties
		if (defined(src['__property'])) {
			for (var i in src['__property'])
				properties[i] = src['__property'][i];
			delete src['__property'];
		}

		// Alternative declaration
		for (var name in src) {
			var n = (name + '')
				, np = n.toLowerCase().split(/\s+/)
				, nv = n.split(/\s+/);
			if (np.length > 1) {
				var a = false;
				if (np.indexOf('static') > -1) {
					src['__static'][getMethodName(np, nv)] = src[name];
					a = true;
				} else if (np.indexOf('private') > -1) {
					privates[getMethodName(np, nv)] = src[name];
					privatesVals[getMethodName(np, nv)] = src[name];
					a = true;
				} else if (np.indexOf('const') > -1) {
					constants[getMethodName(np, nv)] = src[name];
					a = true;
				} else if ((np.indexOf('property') > -1) || (np.indexOf('prop') > -1)) {
					properties[getMethodName(np, nv)] = src[name];
					a = true;
				}
				if (a) delete src[name];
			}
		}

		// Generate new dynamic Class Name
		if (!className) {
			do {
				className = __construct.name + '_extended_' + extendClassCount++;
			} while (context[className]);
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
				prototype[name] = (typeof src[name] === "function") ? (
					function (name, fn) {
						return function () {
							var hs = (typeof __super[name] === "function") && fnTest.test(src[name]),
								tmp = this.__super;

							// Add Privates
							for (var i in privatesVals) this[i] = privatesVals[i];

							// Add a new .__super() method that is the same method
							// but on the super-class
							if (hs) this.__super = __super[name];

							// The method only need to be bound temporarily, so we
							// remove it when we're done executing
							var ret = fn.apply(this, arguments);

							// Restore __super
							if (hs) this.__super = tmp;

							// Save and Remove Privates
							for (var i in privatesVals) {
								privatesVals[i] = this[i];
								delete this[i];
							}

							// Return result
							return (!defined(ret) && fluent) ? this : ret;
						};
					})(name, src[name]) : src[name];
			}
		}

		function constructorInit () {
			// Properties
			for (var i in properties) {
				if (typeof properties[i].get === 'function')
					this.__defineGetter__(i, properties[i].get);
				if (typeof properties[i].set === 'function')
					this.__defineSetter__(i, properties[i].set);
			}
		}

		// The dummy class constructors
		eval('newClass=function ' + className + '(){if(!initializing&&this.__constructor){constructorInit.apply(this);this.__constructor.apply(this,arguments);}};');

		// Static
		for (var i in __constructProps) {
			var name = __constructProps[i];
			if (invalidStatic.indexOf(name) === -1) {
				// Check if we're overwriting an existing function
				newClass[name] = __construct[name];
			}
		}
		// Constants
		for (var i in constants) newClass.__defineGetter__(i, function () { return constants[i]; } );
		newClass.getConstants  = function () { return constants; };
		newClass.getProperties = function () { return properties; };
		newClass.getPrivates   = function () { return privates; };

		// New Static
		if (src['__static']) {
			for (var name in src['__static']) {
				if (invalidStatic.indexOf(name) === -1) {
					// Check if we're overwriting an existing function
					newClass[name] = (typeof src['__static'][name] === "function") ? (
						function (name, fn) {
							return function () {
								var hs = (typeof __construct[name] === "function") && fnTest.test(src['__static'][name]),
									tmp = this.__super;

								// Add a new .__super() method that is the same method
								// but on the super-class
								if (hs) this.__super = __construct[name];

								// The method only need to be bound temporarily, so we
								// remove it when we're done executing
								var ret = fn.apply(this, arguments);

								// Restore __super
								if (hs) this.__super = tmp;

								return (!defined(ret) && fluent) ? this : ret;
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

		// Append in context
		if (register) { context[className] = newClass; }

		// Execute Callback
		this.__onExtend();

		// Return
		return newClass;
	};

	// Append in context
	context.Class = Class;
})(window || this);
