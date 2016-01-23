/**
 * sjsClass
 * Simple JavaScript Class
 * 
 * Copyright (c) 2016 sjsClass | Eduardo Daniel Cuomo | eduardo.cuomo.ar@gmail.com
 *
 * Project: https://github.com/reduardo7/sjsClass
 * Doc: https://github.com/reduardo7/sjsClass/blob/master/README.md
 *
 * Thanks:
 *      http://ejohn.org/blog/simple-javascript-inheritance/
 *      http://marcosc.com/2012/03/dynamic-function-names-in-javascript/
 */

/*jslint browser: true, regexp: true, white: true, evil: true */
/*global xyz*/

(function () {
	'use strict';
	
	// Node.js
	var $window = (typeof window === 'undefined') ? undefined : window,
		__isNodeJs__ = !$window,
		Class;

	function VoidClassWindowNodeJs() {
		return undefined;
	}
	if (__isNodeJs__) {
		$window = new VoidClassWindowNodeJs();
	}

	(function (context, BaseClassName) {

		// Check if loaded
		if (typeof context[BaseClassName] === 'function') { return; }

		var initializing         = false,
			instancing           = true,
			instanceLock         = true,
			fnTest               = /xyz/.test(function () { return xyz; }) ? /\b__super\b/ : /.*/,
			extendClassCount     = 0,
			invalidStatic        = ['prototype', 'length', 'name', 'arguments', 'caller', '__parent', '__preventOverride'],
			invalidProto         = ['__static'],
			// Internal
			constants            = { },
			properties           = { },
			protecteds           = { },
			protectedsVals       = { },
			protectedCallStack   = { },
			instancesCount       = { },
			baseCount            = 0;

		// Internal Utils

		function defined(x) { return x !== undefined; }
		function hasVar(x) { return this.hasOwnProperty(x); }
		function hasMethod(m) { return defined(this[m]) && (typeof this[m] === 'function'); }
		function throwException(message) { throw Class.Exception ? new Class.Exception(message) : message; }
		function clone(o) {
			if ((o === null) || (typeof o !== 'object')) { return o; }
			var k, t = o.constructor();
			for (k in o) {
				if (o.hasOwnProperty(k)) {
					try {
						t[k] = clone(o[k]);
					} catch (ignore) {
						// Properties
					}
				}
			}
			return t;
		}

		function protectedCall(t, fn, args) {
			var r, i, id = t.__instanceId;
			if (!protectedsVals[id]) {
				protectedsVals[id] = clone(protecteds[t.getClassName()]);
			}
			if (protectedCallStack[id] === undefined) {
				protectedCallStack[id] = 0;
			}

			// Add Protecteds
			if (protectedCallStack[id] === 0) {
				for (i in protectedsVals[id]) {
					if (protectedsVals[id].hasOwnProperty(i)) {
						t[i] = protectedsVals[id][i];
					}
				}
			}
			protectedCallStack[id]++;

			// Execute
			try {
				r = fn.apply(t, args);
			} finally {
				// Save and Remove Protecteds
				protectedCallStack[id]--;
				if (protectedCallStack[id] === 0) {
					for (i in protectedsVals[id]) {
						if (protectedsVals[id].hasOwnProperty(i)) {
							protectedsVals[id][i] = t[i];
							delete t[i];
						}
					}
				}
			}

			// Return
			return r;
		}

		function defineProperty$($this, className, t, i) {
			$this.defineProperty.call(t, i, properties[className][i]);
		}

		function createPropertyWithParent(__super, fluent, name$, fn) {
			return function () {
				var hs = (typeof __super[name$] === "function") && fnTest.test(fn),
					tmp = this.__super,
					ret;

				if (name$ === '__constructor') { instancing = false; }

				// Add a new .__super() method that is the same method
				// but on the super-class
				if (hs) {
					this.__super = function () {
						return protectedCall(this, __super[name$], arguments);
					};
				}

				// The method only need to be bound temporarily, so we
				// remove it when we're done executing
				try {
					ret = protectedCall(this, fn, arguments);
				} finally {
					if (name$ === '__constructor') { instancing = true; }

					// Restore __super
					if (hs) {
						this.__super = tmp;
					}
				}

				// Return result
				return (!defined(ret) && fluent) ? this : ret;
			};
		}

		function createPropertyWithParentStatic(__construct, fluent, name$, fn) {
			return function () {
				var ret,
					hs = (typeof __construct[name$] === "function") && fnTest.test(fn),
					tmp = this.__super;

				// Add a new .__super() method that is the same method
				// but on the super-class
				if (hs) {
					this.__super = function () {
						return __construct[name$].apply(this, arguments);
					};
				}

				// The method only need to be bound temporarily, so we
				// remove it when we're done executing
				try {
					ret = fn.apply(this, arguments);
				} finally {
					// Restore __super
					if (hs) { this.__super = tmp; }
				}

				return (!defined(ret) && fluent) ? this : ret;
			};
		}

		function initNewClass(o, value) {
			// Class ID
			Object.defineProperty(o, '__classId', {
				enumerable : false,
				writable : false,
				value : o.prototype.constructor.name + ':' + (++baseCount)
			});

			// Instance Count
			Object.defineProperty(o, '__instanceCount', {
				enumerable : true,
				get : function () { return instancesCount[o.__classId]; },
				set : function (value) { if (!instanceLock) { instancesCount[o.__classId] = value; } }
			});
			instanceLock = false;
			o.__instanceCount = value || 0;
			instanceLock = true;
		}

		function setInstanceId(o) {
			instanceLock = false;
			Object.defineProperty(o, '__instanceId', {
				value : o.constructor.__classId + ':' + (++o.constructor.__instanceCount),
				configurable : false,
				enumerable : true,
				writable : false
			});
			instanceLock = true;
		}

		function getMethodName(v) {
			var i;
			for (i in v) {
				if (v.hasOwnProperty(i) && (['const', 'constant', 'prop', 'property', 'protected', 'static'].indexOf(v[i]) === -1)) {
					return v[i];
				}
			}
			throwException('[' + v + '] not have a name!');
		}

		function defineProperty(name, def) {
			if (
				(typeof def.get === 'function')
					|| (typeof def.set === 'function')
			) {
				// Getter and Setter
				Object.defineProperty(this, name, {
					configurable : def.configurable || true,
					enumerable : def.enumerable || true,
					get : (typeof def.get === 'function') ? function () { return protectedCall(this, def.get); } : undefined,
					set : (typeof def.set === 'function') ? function () { protectedCall(this, def.set, arguments); } : undefined
				});
			} else {
				// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
				Object.defineProperty(this, name, {
					configurable : def.configurable || true,
					enumerable : def.enumerable || true,
					// Value
					value : def.value || undefined,
					writable : def.writable || false
				});
			}
			return this;
		}

		// Class

		function ClassInit() {
			if (this instanceof Class) {
				// New instance
				if (initializing) { return; }
				// Instance ID
				setInstanceId(this);
				return this;
			}
			// Static call
			return Class.extend.apply(Class, arguments);
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
				var n, h = { };
				for (n in this) {
					if (this.hasOwnProperty(n) && (invalidStatic.indexOf(n) === -1) && (typeof this[n] !== 'function')) {
						h[n] = this[n];
					}
				}
				h.__CLASS_NAME = this.constructor.name;
				return JSON.stringify(h);
			},
			equals : function (o) { return (o instanceof Class) && (this.getClassName() === o.getClassName()) && (this.hashCode() === o.hashCode()); },
			toString : function () { return this.getClassName() + ':' + this.hashCode(); },
			defineProperty : defineProperty,
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
		Class.__onExtend      = function () { return undefined; };
		Class.__getConstants  = function () { return clone(constants[this.name]); };
		Class.__getProperties = function () { return clone(properties[this.name]); };
		Class.__getProtecteds = function () { return clone(protecteds[this.name]); };
		Class.defineProperty  = defineProperty;

		// Properties
		Object.defineProperty(Class, '__preventOverride', { value: true });

		// Instances Count
		initNewClass(Class);

		Class.new = Class.newInstance = function () {
			var i, s = 'return new t(';
			for (i in arguments) {
				if (arguments.hasOwnProperty(i)) {
					if (i > 0) { s += ','; }
					s += 'a[' + i + ']';
				}
			}
			return new Function('t', 'a', s + ')')(this, arguments);
		};

		Class.newInstanceOf = function (className) {
			if (this.classExists(className)) {
				var i, s = 'return new c(';
				for (i in arguments) {
					if (arguments.hasOwnProperty(i) && (i > 0)) {
						if (i > 1) { s += ','; }
						s += 'a[' + i + ']';
					}
				}
				return new Function('c', 'a', s + ')')(this.getClass(className), arguments);
			}
			throwException('Error! Class "' + className + '" not declared!');
		};

		Class.getClass = function (className) {
			if (this.classExists(className)) {
				return this.__static.__package[className];
			}
			throwException('Error! Class "' + this.__static.__package.constructor.name + '.' + className + '" not declared!');
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
			var __super        = this.prototype,
				__construct      = __super.constructor,
				fluent           = !!this.__fluent,
				className        = false,
				register         = false,
				__constructProps = Object.getOwnPropertyNames(__construct),
				$this            = this,
				newClass         = {},
				ppt,
				$i;

			function setName(n) {
				className = n;
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
					src = src_name || { };
				}
			}

			// Static
			if (!defined(src.__static)) {
				src.__static = { };
			}

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

			// Fluent interface
			if (defined(src.__fluent)) {
				fluent = !!src.__fluent;
			}

			// On Extend Event
			if (defined(src.__onExtend)) {
				src.__static.__onExtend = src.__onExtend;
				delete src.__onExtend;
			}

			// Prevent override
			if (defined(src.__preventOverride)) {
				src.__static.__preventOverride = !!src.__preventOverride;
				delete src.__preventOverride;
			} else {
				src.__static.__preventOverride = false;
			}

			// Call as Function
			if (defined(src.__function) && (typeof src.__function === 'function')) {
				var _f = src.__function;
				delete src.__function;
				src.__static.__function = function () {
					var r, tmp = this.__super;
					this.__super = __construct.__function;
					try {
						r = _f.apply(this, arguments);
					} finally {
						this.__super = tmp;
					}
					return r;
				};
			} else {
				src.__static.__function = function () {
					return __construct.__function ? __construct.__function.apply(this, arguments) : undefined;
				};
			}

			// Constants
			if (defined(src.__const)) {
				for ($i in src.__const) {
					if (src.__const.hasOwnProperty($i)) {
						constants[className][$i] = src.__const[$i];
					}
				}
				delete src.__const;
			}

			// Protected
			if (defined(src.__protected)) {
				for ($i in src.__protected) {
					if (src.__protected.hasOwnProperty($i)) {
						protecteds[className][$i] = src.__protected[$i];
					}
				}
				delete src.__protected;
			}

			// Properties
			if (defined(src.__property)) {
				for ($i in src.__property) {
					if (src.__property.hasOwnProperty($i)) {
						properties[className][$i] = src.__property[$i];
					}
				}
				delete src.__property;
			}

			// Alternative declaration
			var name$, v;
			for (name$ in src) {
				if (src.hasOwnProperty(name$) && name$) {
					v = name$.toString().trim().split(/\s+/);
					if (v.length > 1) {
						if (v.indexOf('static') > -1) {
							src.__static[getMethodName(v)] = src[name$];
						} else if (v.indexOf('protected') > -1) {
							protecteds[className][getMethodName(v)] = src[name$];
						} else if (v.indexOf('const') > -1) {
							constants[className][getMethodName(v)] = src[name$];
						} else if ((v.indexOf('property') > -1) || (v.indexOf('prop') > -1)) {
							properties[className][getMethodName(v)] = src[name$];
						} else {
							// Invalid declaration
							throwException('Invalid declaration: "' + name$ + '"');
						}

						delete src[name$];
					}
				}
			}

			// Instantiate a base class (but only create the instance, don't run the constructor: __constructor)
			initializing = true;
			try {
				ppt = new this();
			} finally {
				initializing = false;
			}

			// Copy the properties over onto the new prototype
			for (name$ in src) {
				if (src.hasOwnProperty(name$) && (invalidProto.indexOf(name$) === -1)) {
					// Check if we're overwriting an existing function
					if (ppt.hasProperty(name$)) {
						// Define Property
						defineProperty$($this, className, ppt, name$);
					} else {
						// Copy Property
						ppt[name$] = (typeof src[name$] === "function") ? createPropertyWithParent(__super, fluent, name$, src[name$]) : src[name$];
					}
				}
			}

			// The dummy class constructors
			newClass = new Function('init', 'return function ' + className + '(){return init.apply(this,arguments);};')(function () {
				var i,
					t = this,
					vl = src.__static.__package[className]
						// Normal
						? (t instanceof src.__static.__package[className])
						// Anonymous Class
						: ((t.constructor.name === className) && (t.__static.__package === src.__static.__package));
				if (vl) {
					// New Instance
					if (initializing) {
						return;
					}

					if (instancing) {
						// Properties
						for (i in properties[className]) {
							if (properties[className].hasOwnProperty(i)) {
								defineProperty$($this, className, t, i);
							}
						}
						// Instance ID
						setInstanceId(t);
					}

					// Constructor
					if (t.__constructor) {
						t.__constructor.apply(t, arguments);
					}

					return t;
				}

				// Static call
				return newClass.__function.apply(newClass, arguments);
			});

			// Static
			for ($i in __constructProps) {
				if (__constructProps.hasOwnProperty($i)) {
					name$ = __constructProps[$i];
					// Check if we're overwriting an existing function
					if (invalidStatic.indexOf(name$) === -1) {
						newClass[name$] = __construct[name$];
					}
				}
			}

			// Constants
			for ($i in constants[className]) {
				if (constants[className].hasOwnProperty($i)) {
					// Static
					Object.defineProperty(newClass, $i, { value: constants[className][$i] });
					// Instance
					Object.defineProperty(ppt, $i, { value: constants[className][$i] });
				}
			}

			// New Static
			if (src.__static) {
				for (name$ in src.__static) {
					if (src.__static.hasOwnProperty(name$) && (invalidStatic.indexOf(name$) === -1)) {
						// Check if we're overwriting an existing function
						newClass[name$] = (typeof src.__static[name$] === "function") ? createPropertyWithParentStatic(__construct, fluent, name$, src.__static[name$]) : src.__static[name$];
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
			if (register && (!__isNodeJs__ || !(src.__static.__package instanceof VoidClassWindowNodeJs))) {
				if (src.__static.__preventOverride) {
					// Read only property
					Object.defineProperty(src.__static.__package, className, { value : newClass });
				} else {
					// Normal
					src.__static.__package[className] = newClass;
				}
			}

			// Execute Callback
			this.__onExtend();

			// Return
			return newClass;
		};

		// Exception

		Class.extend('Exception', {
			__package : Class,
			__preventOverride: true,
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
	}($window, 'Class'));
}());
