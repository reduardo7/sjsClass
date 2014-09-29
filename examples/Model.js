/**
 * sjsClass: Simple JavaScript Class.
 * Copyright (c) 2013 sjsClass | Eduardo Daniel Cuomo | eduardo.cuomo.ar@gmail.com
 *
 * By: Edueado Daniel Cuomo.
 *
 * Example: Simple Database Model mapping using SQLite for HTML5.
 *
 * Project: https://github.com/reduardo7/sjsClass
 * Doc: https://github.com/reduardo7/sjsClass/blob/master/README.md
 */
/*jslint browser: true, regexp: true, white: true, evil: true */
/*global Class, JSQL */

Class.extend('Model', {
	__fluent: true, // Enable Fluent Interface

	__constant: {
		KEY_FIELD: 'key'
	},

	__static: {
		table: null,
		keyField: null,
		columns: { id: 'key' },

		_db: null,

		setSQLiteBrowserInstance: function (db) {
			this.defineProperty('_db', db);
		},

		new: function (values) {
			return new this.newInstance(values);
		},

		deleteWhere: function (where, values, fnEnd) {
			this._db.execute(JSQL({
				DELETE: this.table,
				WHERE: where
			}), values, fnEnd);
		},

		deleteBy: function (field, value, fnEnd) {
			this.deleteWhere([[ field, '?' ]], value, fnEnd);
		},

		delete: function (keyValue, fnEnd) {
			this.deleteBy(this.keyField, keyValue, fnEnd);
		},

		findWhere: function (where, values, fnResult, fnEmpty) {
			var $this = this;
			this._db.select(JSQL({
				SELECT: '*',
				FROM: this.table,
				WHERE: where
			}), values, function (row, index, count) {
				if (fnResult) {
					fnResult.call($this, new $this.newInstance(row), index, count);
				}
			}, fnEmpty);
		},

		findBy: function (field, value, fnResult, fnEmpty) {
			this.findWhere([[ field, '?' ]], value, fnResult, fnEmpty);
		},

		get: function (keyValue, fnFound, fnNotFound) {
			var $this = this;
			this._db.select(JSQL({
				SELECT: '*',
				FROM: this.table,
				WHERE: [[ this.keyField, '?' ]],
				LIMIT: 1
			}), keyValue, function (row, index, count) {
				if (fnFound) {
					fnFound.call($this, new $this.newInstance(row), index, count);
				}
			}, fnNotFound);
		}
	},

	__protected: {
		_values: {},

		_setValues: function (values) {
			var col,
				v = values || {};

			function xGet(col) {
				return function () { return this._values[col]; };
			}

			function xSet(col) {
				return function (value) { this._values[col] = value; };
			}

			for (col in this.__static.columns) {
				if (this.__static.columns.hasOwnProperty(col)) {
					this._values[col] = v[col];

					this.defineProperty(col, {
						get: xGet(col),
						set: xSet(col)
					});
				}
			}
		},

		_getDataForQuery: function (withKey) {
			var k, o = {};
			for (k in this._values) {
				if (this._values.hasOwnProperty(k) && (!withKey || (k !== this.__super.keyField))) {
					o[k] = '?';
				}
			}
			return o;
		},

		_getColumnsForQuery : function (withKey) {
			var k, c = [];
			for (k in this._values) {
				if (this._values.hasOwnProperty(k) && (!withKey || (k !== this.__super.keyField))) {
					c.push(k);
				}
			}
			return c;
		},

		_getValuesForQuery : function (withKey) {
			var k, vals = [];
			for (k in this._values) {
				if (this._values.hasOwnProperty(k) && (!withKey || (k !== this.__super.keyField))) {
					vals.push('?');
				}
			}
			return vals;
		}
	},

	__property: {
		__id: { get: function () { return this._values[this.__super.keyField]; } },
		__data: { get: function () { return this._values; } },
		__columns : { get: function () { return Object.keys(this._values); } },
		__values : { get: function () {
			var k, vals = [];
			for (k in this._values) {
				if (this._values.hasOwnProperty(k)) {
					vals.push(this._values[k]);
				}
			}
			return vals;
		}}
	},

	__constructor: function (values) {
		this._setValues(values);
	},

	__onExtend: function () {
		var columns, table, col;

		// Convert "columns" to "read-only property"
		columns = this.columns;
		delete this.columns;
		this.defineProperty('columns', { get: function () { return columns; } });

		// Convert "table" to "read-only property"
		table = this.table;
		delete this.table;
		this.defineProperty('table', { get: function () { return table; } });

		// Find KeyField
		for (col in this.__static.columns) {
			if (this.__static.columns.hasOwnProperty(col) && (this.__static.columns[col] === this.KEY_FIELD)) {
				this.defineProperty('keyField', { value: col });
				break;
			}
		}
	},

	equals: function (o) {
		if (o instanceof this.constructor) {
			var i;

			for (i in this._values) {
				if (this._values.hasOwnProperty(i) && (!o.hasOwnProperty(i) || (this._values[i] !== o[i]))) {
					// Not equals
					return false;
				}
			}

			// All equal!
			return true;
		}

		// Not equals
		return false;
	},

	save: function (fnEnd) {
		if (this.__id === undefined) {
			// New
			this._db.execute(JSQL({
				INSERT: this.table,
				COLUMNS: this._getColumnsForQuery(false),
				VALUES: this._getValuesForQuery(false)
			}), this._getValuesForQuery(false), fnEnd);
		} else {
			// Update
			this._db.execute(JSQL({
				UPDATE: this.table,
				SET: this._getDataForQuery(false),
				WHERE: [[ this.__super.keyField, '?' ]]
			}), this._getValuesForQuery(false), fnEnd);
		}
	},

	delete: function (keyValue, fnEnd) {
		if (keyValue === undefined) {
			keyValue = this.__id;
		}
		this._db.execute(JSQL({
			DELETE: this.table,
			WHERE: [[ this.__super.keyField, '?' ]]
		}), keyValue, fnEnd);
	},

	read: function (keyValue, fnSuccess, fnNotFound) {
		var $this = this;
		this._db.select(JSQL({
			SELECT: '*',
			FROM: this.table,
			WHERE: [[ this.__super.keyField, '?' ]],
			LIMIT: 1
		}), keyValue, function (row) {
			$this._setValues(row);
			if (fnSuccess) {
				fnSuccess.call($this, $this);
			}
		}, fnNotFound);
	}
});