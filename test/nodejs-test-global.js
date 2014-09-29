/**
 * sjsClass: Simple JavaScript Class.
 * Copyright (c) 2013 sjsClass | Eduardo Daniel Cuomo | eduardo.cuomo.ar@gmail.com
 *
 * By: Edueado Daniel Cuomo.
 *
 * Examples: Node.js - Test Global.
 *
 * Project: https://github.com/reduardo7/sjsClass
 * Doc: https://github.com/reduardo7/sjsClass/blob/master/README.md
 */
/*jslint browser: true, regexp: true, white: true, evil: true, devel: true */
/*global Class, NodeJsTestGlobal, NodeJsTestGlobalOther */

require('../lib/sjsclass.js').registerGlobal();

(function () {
	'use strict';

	Class.extend('NodeJsTestGlobal', {
		__const : {
			c1 : 'Constant 1'
		},
		__protected : {
			pv : 111,
			pf : function () {
				return this.pv;
			}
		},
		__property : {
			prop1 : {
				get : function () { return this.pv; }
			}
		},
		foo : function (v) {
			this.pv = v;
		},
		bar : function () {
			return this.c1 + '|' + this.pf();
		}
	});

	NodeJsTestGlobal.extend('NodeJsTestGlobalOther', {
		'const c2' : 'Constant 2',
		'protected pv' : 222,
		'property prop1' : {
			get : function () { return this.pv; },
			set : function (v) { this.pv = v; }
		},
		foo : function () {
			// Execute into this context
			this.pv = NodeJsTestGlobalOther.c2;
		},
		bar : function () {
			// Execute into this context
			return this.__super(this);
		}
	});

	var t = new NodeJsTestGlobal();
	t.foo(123);
	t.prop1 = 321;

	var o = new NodeJsTestGlobalOther();
	o.foo(456);

	console.log('Should be true:', (t.c1 === NodeJsTestGlobal.c1) && (t.c1 === 'Constant 1') && (t.c2 === undefined) && (NodeJsTestGlobal.c2 === undefined) &&
		(o.c1 === t.c1) && (NodeJsTestGlobalOther.c1 === NodeJsTestGlobal.c1) && (o.c2 === NodeJsTestGlobalOther.c2) && (NodeJsTestGlobalOther.c2 === 'Constant 2') &&
		(t.prop1 === 123) &&
		(t.bar() === 'Constant 1|123') &&
		(o.prop1 === NodeJsTestGlobalOther.c2) && (o.bar() === 'Constant 1|Constant 2'));
}());