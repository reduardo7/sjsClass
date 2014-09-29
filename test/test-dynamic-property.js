/**
 * sjsClass: Simple JavaScript Class.
 * Copyright (c) 2013 sjsClass | Eduardo Daniel Cuomo | eduardo.cuomo.ar@gmail.com
 *
 * By: Edueado Daniel Cuomo.
 *
 * Examples: Test Dynamic Property.
 *
 * Project: https://github.com/reduardo7/sjsClass
 * Doc: https://github.com/reduardo7/sjsClass/blob/master/README.md
 */

/*jslint browser: true, regexp: true, white: true, evil: true */
/*global Class, DynProp */

(function () {
	'use strict';

	Class.extend('DynProp', {
		__constructor: function (pname, pvalue) {
			this.defineProperty(pname, {
				value: pvalue
			});
		}
	});

	var dynProp1 = new DynProp('prop1', 'val1');
	var dynProp2 = new DynProp('prop2', 'val2');

	console.log('Should be true:', (dynProp1.prop1 === 'val1'), (dynProp2.prop2 === 'val2'),
		(dynProp1.prop2 === undefined), (dynProp2.prop1 === undefined));
}());