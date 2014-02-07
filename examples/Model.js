Class.extend('Model', {
  __fluent: true, // Enable Fluent Interface

  __static: {
    table: null,
    columns: { id: 'key' },

    new: function (values) {
      return new this(values);
    },

    delete: function () {
      switch (arguments.length) {
        case 0:
          throw new Class.Exception('Invalid call!');
        case 1:
          var value = arguments[0];
          if (typeof value === 'string') {
            // TODO: DELETE FROM {TABLE} WHERE {KEY} = {value}
          } else {
            // TODO: DELETE FROM {TABLE} WHERE {value.toWhere}
          }
          break;
        case 2:
        default:
          // TODO: DELETE FROM {TABLE} WHERE arguments[0] = arguments[1]
          break;
      }
    },

    find: function () {
      switch (arguments.length) {
        case 1:
          var value = arguments[0];
          if (typeof value !== 'string') {
            // TODO: SELECT * FROM {TABLE} WHERE {value.toWhere}
            break;
          }
        case 0:
          throw new Class.Exception('Invalid call!');
        case 2:
        default:
          // TODO: SELECT * FROM {TABLE} WHERE arguments[0] = arguments[1]
          break;
      }
    },

    get: function () {
      switch (arguments.length) {
        case 0:
          throw new Class.Exception('Invalid call!');
        case 1:
          var value = arguments[0];
          if (typeof value === 'string') {
            // TODO: SELECT * FROM {TABLE} WHERE {KEY} = {value} LIMIT 1
          } else {
            // TODO: SELECT * FROM {TABLE} WHERE {value.toWhere} LIMIT 1
          }
          break;
        case 2:
        default:
          // TODO: SELECT * FROM {TABLE} WHERE arguments[0] = arguments[1] LIMIT 1
          break;
      }
    }
  },

  __protected: {
    _values: {}
  },

  __constructor: function (values) {
    var col;
    for (col in this.__static.columns) {
      if (this.__static.columns.hasOwnProperty(col)) {
        if (values) {
          // Initial value
          this._values = values[col];
        }
        this.defineProperty(col, {
          get: function () { return this._values[col]; },
          set: function (value) { this._values[col] = value; }
        });
      }
    }
  },

  __onExtend: function () {
    var columns, table;

    // Convert "columns" to "read-only property"
    columns = this.columns;
    delete this.columns;
    this.defineProperty('columns', {
      get: function () { return columns; }
    });

    // Convert "table" to "read-only property"
    table = this.table;
    delete this.table;
    this.defineProperty('table', {
      get: function () { return table; }
    });
  },

  equals: function(o) {
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

  save: function () {
    // TODO: REPLACE Query
  },

  delete: function () {
    // TODO: DELETE FROM {TABLE} WHERE {KEY} = {this.id}
  },

  read: function (keyValue) {
    // TODO: SELECT * FROM {TABLE} WHERE {KEY} = {value} LIMIT 1
  }
});