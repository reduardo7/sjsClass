/**
 * sjsClass: Simple JavaScript Class.
 *
 * Demo.
 *
 * By: Edueado Daniel Cuomo.
 */

;'use strict';

// New Person Class
Class.extend('Person', {
	__static : {
		// Static methods
		testStatic : function () {
			return true;
		},
		staticVar : true,
		count : 100,
		extendCount : 100
	},
	__private : {
		privatePersonVar: true
	},
	__const : {
		constant1 : true
	},
	__property : {
		name : {
			get : function () { return this.privatePersonVar; },
			set : function (value) { this.privatePersonVar = value; }
		}
	},
	__onExtend : function () {
		// Static Context
		console.log('Extend Person Count:', this.extendCount++);
	},
	dancing : null,
	__constructor : function (isDancing) {
		this.dancing = isDancing;
		console.log(this.getClassName(), 'has "dance" method?', this.hasMethod('dance'));
		console.log(this.getClassName(), 'has "dancing" value?', this.hasVar('dancing'));
		console.log('Person number', ++Person.count);
		console.log('Person Private Var (inside)', this.privatePersonVar);
	},
	dance : function () {
		console.log('dance', this.getClassName(), this.dancing);
	}
});

// New extended Person Class.
var Tom = Person.extend(/*Dynamic Class Name*/{
	// Static method
	'static testStatic' : function () {
		return !(this.__super() && this.__parent.testStatic());
	},
	__constructor : function () {
		this.__super(this.__static.staticVar);
	}
});

// New Ninja extends Person Class.
Person.extend('Ninja', {
	'property length' : { get: function () { return 55; } },
	// or: 'prop length' : { get: function () { return 55; } }
	'private privateNinjaVar' : true,
	'const constant2' : 'constant 2',
	dance: function () {
		// Call the inherited version of dance()
		this.__super(); // => dance Ninja false
		this.__parent.dance(); // => dance Person undefined
	},
	swingSword : function () {
		console.log('swingSword');
		this.testPrivateNinjaVar();
	},
	testPrivateNinjaVar : function () {
		console.log('Private Ninja Var test: ', this.privateNinjaVar);
	}
});

// Person Class instance
var p = Person.newInstance('[PERSON]');
p.dance();
console.log('Person Private Var (outside)', p.privatePersonVar);
p.constant1 = false; // => Value not updated!

// Extended Person Class instance
var g = new Tom();
g.name = "Tom's Name";

// Ninja extends Person Class instance
var n = new Ninja();
n.dance(); // => false
n.swingSword(); // => true
console.log('Ninja Private Var (outside)', n.privatePersonVar);

// Should all be true
Person.testStatic() && !Tom.testStatic() && Ninja.testStatic() &&
p instanceof Person && p instanceof Class && !(p instanceof Tom) && p.hasGetter('name') && p.hasSetter('name') && p.constant1
g instanceof Tom && g instanceof Person && (g instanceof Class) && (g.name === "Tom's Name")
n instanceof Ninja && n instanceof Person && (n instanceof Class) && (n.length === 55) && n.hasProperty('name') && !n.hasSetter('length')
