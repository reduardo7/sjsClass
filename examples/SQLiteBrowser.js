/**
 * sjsClass: Simple JavaScript Class.
 * Copyright (c) 2013 sjsClass | Eduardo Daniel Cuomo | eduardo.cuomo.ar@gmail.com
 *
 * By: Edueado Daniel Cuomo.
 *
 * Example: SQLite Adapter for HTML5.
 *
 * Project: https://github.com/reduardo7/sjsClass
 * Doc: https://github.com/reduardo7/sjsClass/blob/master/README.md
 */

// http://blog.modulus.io/nodejs-and-sqlite
// http://zetcode.com/db/sqlite/
// https://github.com/rogerwang/node-webkit/wiki/Save-persistent-data-in-app
(function (context) {
  function select_replace(action, table, data, fnEnd) {
    this._db.transaction(function (db) {
      // Prepare
      var sql = 'INSERT ' + action + ' ' + table + '(',
        d = [],
        v = '',
        c = '',
        $this = this,
        i;

      // Build
      for (i in data) {
        if (data.hasOwnProperty(i)) {
          if (c) {
            c += ',';
            v += ',';
          }
          c += i;
          v += '?';
          d.push(data[i]);
        }
      }

      sql += c + ') VALUES (' + v + ')';

      // Execute
      db.executeSql(sql, d, function (tx, results) {
        if (fnEnd) {
          fnEnd.call($this, results, tx);
        }
      });
    });
  }

  Class('SQLiteBrowser', {
    __fluent : true,
    __package : context,

    __protected : {
      _db : undefined
    },

    __property : {
      db : {
        get : function () { return this._db; }
      }
    },

    /**
     * DB Connection.
     *
     * @param {String} db_name DataBase name.
     * @param {String} db_description (Default: db_name) DataBase description.
     * @param {Integer} db_size (Default: 10) DataBase size (in MB).
     * @param {String} db_version (Default: '1.0') DataBase version.
     */
    __constructor : function (db_name, db_description, db_size, db_version) {
      this._db = openDatabase(db_name, db_version || '1.0', db_description || db_name, ((db_size || 10) * 1024 * 1024));
    },

    /**
     * Create table.
     *
     * @param {String} table Table name.
     * @param {Object} definition Table definition.
     *        {
     *              id : { type: 'INTEGER', primary : true, autoincrement: true, unique: true } // Equals to -> id : { type: 'KEY' } || id : 'key'
     *            , name : { type: 'TEXT' }
     *            , price : { type: 'REAL' | 'DECIMAL' | 'FLOAT' }
     *            , age : { type: 'INTEGER' | 'INT' }
     *            , description : { type: 'BLOB' | 'LONGTEXT', isNull : true }
     *            , ref1_id : { type: 'INTEGER', foreign: { table: 'tableX', key: 'id' } }
     *            , ref2_id : { type: 'INTEGER', foreign: 'tableX.id' }
     *        }
     *        Operations:
     *          {Boolean} __dropTable (Default: FALSE) Drop table if exists?
     * @param {Array[Object]} initData (Default: NONE) Rows to add if table not exists.
     */
    createTable : function (table, definition, initData) {
      // CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY AUTOINCREMENT, customerId INTEGER, price INT)
      // CREATE TABLE IF NOT EXISTS clientes (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, edad TEXT)
      var $this = this;
      this._db.transaction(function (db) {
        // Build
        var c, d, t,
          sql = 'CREATE TABLE IF NOT EXISTS ' + table + ' (',
          f = true;

        $this.tableExists(table, function (te) {
          for (c in definition) {
            if (definition.hasOwnProperty(c)) {
              if (c != '__dropTable') {
                if (f) {
                  f = false;
                } else {
                  sql += ',';
                }
                sql += ' ' + c;

                d = definition[c];
                if (typeof d === 'string') {
                  t = d.toUpperCase();
                  d = { };
                } else if (d) {
                  t = (d.type || '').toUpperCase();
                } else {
                  d = { };
                }

                if (t === 'KEY') {
                  sql += ' INTEGER PRIMARY KEY AUTOINCREMENT';
                } else {
                  // type
                  switch (t) {
                  case 'INTEGER':
                  case 'INT':
                    sql += ' INTEGER';
                    break;
                  case 'REAL':
                  case 'DECIMAL':
                  case 'FLOAT':
                    sql += ' REAL';
                    break;
                  case 'BLOB':
                  case 'LONGTEXT':
                    sql += ' BLOB';
                    break;
                  case 'TEXT':
                  case 'DATE':
                  case 'DATETIME':
                  default:
                    sql += d.foreign ? ' INTEGER' : ' TEXT';
                    break;
                  }
                  // primary
                  if (d.primary) {
                    sql += ' PRIMARY KEY';
                  }
                  // autoincrement
                  if (d.autoincrement) {
                    sql += ' AUTOINCREMENT';
                  }
                  // unique
                  if (d.unique) {
                    sql += ' UNIQUE';
                  }
                  // isNull
                  if (d.isNull) {
                    sql += ' NULL';
                  }
                  // Foreign
                  if (d.foreign) {
                    if (typeof d.foreign === 'string') {
                      f = d.foreign.split('.');
                      d = {
                        table: f[0],
                        key: f[1] || 'id'
                      };
                    } else {
                      d = d.foreign;
                      if (!d.key) {
                        d.key = 'id';
                      }
                    }
                    sql += ' REFERENCES ' + d.table + '(' + d.key + ')';
                  }
                }
              }
            }
          }

          // Foreign (other method)
          // for (c in definition) {
          //   if (definition.hasOwnProperty(c)) {
          //     d = definition[c];
          //     if (d && (typeof d !== 'string') && d.foreign) {
          //       if (typeof d.foreign === 'string') {
          //         f = d.foreign.split('.');
          //         d = {
          //           table: f[0],
          //           key: f[1]
          //         };
          //       } else {
          //         d = d.foreign;
          //       }
          //       sql += ', FOREIGN KEY(' + c + ') REFERENCES ' + d.table + '(' + d.key + ')';
          //     }
          //   }
          // }

          sql += ' )';

          // Create table
          function _ct() {
            $this.execute(sql, [], function () {
              if (!te && initData) {
                $this.insert(table, initData);
              }
            });
          }

          // Drop table
          if (definition.__dropTable) {
            $this.execute('DROP TABLE IF EXISTS ' + table, [], _ct);
          } else {
            _ct.call($this);
          }
        });
      });
    },

    /**
     * Drop Table if Exists.
     *
     * @param {String} table Table Name.
     */
    dropTable : function (table) {
      this._db.transaction(function (db) {
        db.executeSql('DROP TABLE IF EXISTS ' + table);
      });
    },

    /**
     * Execute Query.
     *
     * @param {String} sql Script SQL to execute.
     *        SELECT * FROM usuarios WHERE username = ? AND password = ?
     * @param {Array|Function} params
     *        {Array}: Parameters.
     *            [ 'user', '123456' ]
     *        {Function}: Use as "fnResult" parameter.
     * @param {Function} fnResult Callback results.
     *        Params:
     *            0: Results.
     *            1: Transaction.
     *        Example:
     *            function (results, tx) {
     *                var len = results.rows.length, i;
     *                for (i = 0; i < len; i++) {
     *                    alert(results.rows.item(i).text);
     *                }
     *            }
     */
    execute : function (sql, params, fnResult) {
      if (!fnResult && (typeof params === 'function')) {
        fnResult = params;
        params = [];
      } else if (!params) {
        params = [];
      }

      var t = this;

      this._db.transaction(function (db) {
        db.executeSql(sql, params, function (tx, results) {
          fnResult.call(t, results, tx);
        });
      });
    },

    /**
     * Select Query.
     *
     * @param {String} sql Script SQL to execute.
     *        SELECT * FROM usuarios WHERE username = ? AND password = ?
     * @param {Array|Function} params
     *        {Array}: Parameters.
     *            [ 'user', '123456' ]
     *        {Function}: Use as "fnResult" parameter, and "fnResult" parameter is used as "fnEmpty" parameter.
     * @param {Function} fnResult Callback for each result.
     *        Params:
     *            0: Row data.
     *            1: Index.
     *            2: Rows count.
     *            3: DB Transaction.
     *        Example:
     *            function (row, index, count) {
     *                alert('Row:' + index + ' of ' + count + '. Name: ' + row.name);
     *            }
     * @param {Function} fnEmpty Callback if query has not results.
     *        Params:
     *            0: DB Transaction.
     *        Example:
     *            function () {
     *                alert('No data!');
     *            }
     */
    select : function (sql, params, fnResult, fnEmpty) {
      if (typeof params === 'function') {
        fnEmpty = fnResult;
        fnResult = params;
        params = [];
      } else if (!params) {
        params = [];
      }

      var t = this;

      this._db.transaction(function (db) {
        db.executeSql(sql, params, function (tx, results) {
          var len = results.rows.length, i;

          if (len > 0) {
            for (i = 0; i < len; i++) {
              fnResult.call(t, results.rows.item(i), i, len, tx);
            }
          } else {
            if (fnEmpty) {
              fnEmpty.call(t, tx);
            }
          }
        });
      });
    },

    /**
     * Insert.
     *
     * @param {String} table Table name.
     * @param {Object|Array} data Column data.
     *        { id: 1, name: 'test' }
     *        [{ id: 1, name: 'test' }, { id: 2, name: 'foo' }]
     * @param {Function} fnEnd (Optional) Callback on end.
     *        Params:
     *            0: Results.
     *            1: Transaction.
     *        Example:
     *            function (results, tx) {
     *                alert('Finish!');
     *            }
     */
    insert : function (table, data, fnEnd) {
      select_replace.call(this, 'INSERT', table, data, fnEnd);
    },

    /**
     * Replace.
     *
     * @param {String} table Table name.
     * @param {Object|Array} data Column data.
     *        { id: 1, name: 'test' }
     *        [{ id: 1, name: 'test' }, { id: 2, name: 'foo' }]
     * @param {Function} fnEnd (Optional) Callback on end.
     *        Params:
     *            0: Results.
     *            1: Transaction.
     *        Example:
     *            function (results, tx) {
     *                alert('Finish!');
     *            }
     */
    replace : function (table, data, fnEnd) {
      select_replace.call(this, 'REPLACE', table, data, fnEnd);
    },

    /**
     * Execute transaction.
     *
     * @param {Function} fnTx Transaction function.
     *        Params:
     *            0: Transaction reference.
     *        Example:
     *            function (tx) { tx.executeSql( ... ); }
     */
    transaction : function (fnTx) {
      this._db.transaction(fnTx);
    },

    /**
     * Returns TRUE if table exists.
     *
     * @param {String} tableName Table name.
     * @param {Function} fnResult Function to execute.
     *        Params:
     *            0: TRUE if TABLE exists.
     *            1: DB Transaction.
     *        Example:
     *            function (exists) { alert(exists ? 'EXISTS!' : 'NOT EXISTS!'); }
     */
    tableExists : function (tableName, fnResult) {
      var t = this;
      this._db.transaction(function (db) {
        db.executeSql(
          "SELECT name FROM sqlite_master WHERE type='table' AND name=?;",
          [ tableName ],
          function (tx, results) {
            fnResult.call(t, results.rows.length > 0, tx);
          }
        );
      });
    }
  });
}(window));

// var db = new SQLiteBrowser();

// db.createTable('test', {
//    id : 'key'
//  , name : { type : 'text' }
//  , age : { type : 'integer' }
// });

// db.insert('test', { name: 'Mateo 2', age: 0 })
//  .insert('test', { name: 'Lucy 2', age: 3 })
//  .insert('test', { name: 'Vane 2', age: 25 })
//  .insert('test', { name: 'Edu 2', age: 27 });

// db.select('SELECT * FROM test', function (row) {
//  console.log(row);
// });