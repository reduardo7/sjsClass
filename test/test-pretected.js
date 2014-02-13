/**
 * sjsClass: Simple JavaScript Class.
 * Copyright (c) 2013 sjsClass | Eduardo Daniel Cuomo | eduardo.cuomo.ar@gmail.com
 *
 * By: Edueado Daniel Cuomo.
 *
 * Examples: Test Protected.
 *
 * Project: https://github.com/reduardo7/sjsClass
 * Doc: https://github.com/reduardo7/sjsClass/blob/master/README.md
 */

'use strict';

Class.extend('TestProtected', {
  __protected: {
    p2: 222,
    pf: function () {
      return this.p1;
    },
    pp: false
  },

  'protected p1': 1,

  __constructor: function (v) {
    this.pp = v;
    this.pf();
    this.bar();
    this.pp += v;
  },

  foo: function (v) {
    this.p1 = v;
  },

  bar: function () {
    return this.pf() + this.p2;
  },

  constructorVar: function () {
    return this.pp;
  }
});

var testProtected = new TestProtected(444);
testProtected.foo(111);

// Should all be true
(testProtected.p1 === undefined) && (testProtected.p2 === undefined) &&
  (TestProtected.p1 === undefined) && (TestProtected.p2 === undefined) &&
  (testProtected.pf === undefined) && (testProtected.bar() === 333) &&
  (testProtected.pp === undefined) && (testProtected.constructorVar() === 888);
