/**
 * sjsClass: Simple JavaScript Class.
 * Copyright (c) 2013 sjsClass | Eduardo Daniel Cuomo | eduardo.cuomo.ar@gmail.com
 *
 * By: Edueado Daniel Cuomo.
 *
 * Project: https://github.com/reduardo7/sjsClass
 * Doc: https://github.com/reduardo7/sjsClass/blob/master/README.md
 */

// http://www.sqlite.org/lang.html
(function (context) {
  function _(x) {
    return x !== undefined;
  }

  function from$(table, alias, onq, joint) {
    if (this.query.FROM) {
      if (typeof this.query.FROM === 'string') {
        var qf = this.query.FROM;
        this.query.FROM = {};
        this.query.FROM[qf] = qf;
      }
    } else {
      this.query.FROM = {};
    }
    this.query.FROM[alias || table] = (this.query.FROM.length && onq) ? [ joint || 'INNER', table, onq ] : table;
    return this;
  }

  function where$(d) {
    if (this.query.WHERE) {
      if (typeof this.query.WHERE === 'string') {
        this.query.WHERE = [ this.query.WHERE ];
      }
    } else {
      this.query.WHERE = [];
    }
    this.query.WHERE.push(d);
  }

  function having$(d) {
    if (this.query.HAVING) {
      if (typeof this.query.HAVING === 'string') {
        this.query.HAVING = [ this.query.HAVING ];
      }
    } else {
      this.query.HAVING = [];
    }
    this.query.HAVING.push(d);
  }

  function wherec$(ca, op, cb) {
    if (!_(op) && !_(cb)) {
      return ca;
    }
    if (!_(cb)) {
      return [ ca, op ];
    }
    return [ ca, op, cb ];
  }

  /****************************
   ****************************
   ***                      ***
   ***    JavaScript SQL    ***
   ***                      ***
   ****************************
   ****************************/
  Class.extend('JSQL', {
    __package: context,
    __fluent: true,

    'protected query': null,

    __function: function (q) {
      // Static call
      return new JSQL(q);
    },

    __constructor: function (q) {
      var i;
      this.query = q || {};

      if (this.query.SELECT) {
        if (this.query.SELECT instanceof Array) {
          var s = this.query.SELECT;
          this.query.SELECT = {};

          for (i in s) {
            if (s.hasOwnProperty(i)) {
              this.SELECT(i, s[i]);
            }
          }
        }
      }

      if (this.query.GROUP) {
        if (this.query.GROUP && (typeof this.query.GROUP === 'string')) {
          this.query.GROUP = [ this.query.GROUP ];
        }
      }

      if (this.query.ORDER) {
        if (this.query.ORDER instanceof Array) {
          var o = this.query.ORDER;
          this.query.ORDER = {};
          for (i in o) {
            if (o.hasOwnProperty(i)) {
              this.ORDER(o[i]);
            }
          }
        } else if (typeof this.query.ORDER !== 'object') {
          this.ORDER(this.query.ORDER);
        }
      }

      if (this.query.LIMIT !== undefined) {
        if (this.query.LIMIT instanceof Array) {
          this.LIMIT(this.query.LIMIT[0], this.query.LIMIT[1]);
        } else if (typeof this.query.LIMIT !== 'object') {
          this.LIMIT(this.query.LIMIT);
        }
      }
    },

    /***************************
     ***************************
     ***                     ***
     ***    QUERY: SELECT    ***
     ***                     ***
     ***************************
     ***************************/
    SELECT: function (alias_q, fld) {
      if (!this.query.SELECT) {
        this.query.SELECT = {};
      }

      if (fld === undefined) {
        fld = alias_q;
        alias_q = Object.keys(this.query.SELECT).length + 1;
      }

      if (alias_q === 'DISTINCT') {
        this.query.SELECT.DISTINCT = true;
      } else {
        this.query.SELECT[alias_q] = fld;
      }
    },

    /*************************
     *************************
     ***                   ***
     ***    QUERY: FROM    ***
     ***                   ***
     *************************
     *************************/
    FROM: from$,
    FROM_INNER: function (table, alias, onq) { from$.call(this, table, alias, onq, 'INNER'); },
    FROM_LEFT: function (table, alias, onq) { from$.call(this, table, alias, onq, 'LEFT'); },
    FROM_RIGHT: function (table, alias, onq) { from$.call(this, table, alias, onq, 'RIGHT'); },

    /**************************
     **************************
     ***                    ***
     ***    QUERY: WHERE    ***
     ***                    ***
     **************************
     **************************/
    WHERE: function (ca, op, cb) { where$.call(this, wherec$(ca, op, cb)); },
    WHERE_AND: function (ca, op, cb) { where$.call(this, { AND: wherec$(ca, op, cb) }); },
    WHERE_OR: function (ca, op, cb) { where$.call(this, { OR: wherec$(ca, op, cb) }); },
    WHERE_BETWEEN: function (a, b) { where$.call(this, { BETWEEN: [a, b] }); },
    WHERE_IN: function (a) { where$.call(this, { IN: a }); },
    WHERE_NOT: function (ca, op, cb) { where$.call(this, { NOT: wherec$(ca, op, cb) }); },
    WHERE_NOT_AND: function (ca, op, cb) { where$.call(this, { NOT: { AND: wherec$(ca, op, cb) }}); },
    WHERE_NOT_OR: function (ca, op, cb) { where$.call(this, { NOT: { OR: wherec$(ca, op, cb) }}); },
    WHERE_NOT_BETWEEN: function (a, b) { where$.call(this, { NOT: { BETWEEN: [a, b] }}); },
    WHERE_NOT_IN: function (a) { where$.call(this, { NOT: { IN: a }}); },


    /*****************************
     *****************************
     ***                       ***
     ***    QUERY: GROUP BY    ***
     ***                       ***
     *****************************
     *****************************/
    GROUP: function (x) {
      if (this.query.GROUP) {
        if (typeof this.query.GROUP === 'string') {
          this.query.GROUP = [ this.query.GROUP ];
        }
      } else {
        this.query.GROUP = [];
      }

      if (x instanceof Array) {
        var j;
        for (j in x) {
          if (x.hasOwnProperty(j) && (this.query.GROUP.indexOf(j) === -1)) {
            this.query.GROUP.push(j);
          }
        }
      } else {
        x = x + '';
        if (this.query.GROUP.indexOf(x) === -1) {
          this.query.GROUP.push(x);
        }
      }
    },


    /***************************
     ***************************
     ***                     ***
     ***    QUERY: HAVING    ***
     ***                     ***
     ***************************
     ***************************/
    HAVING: function (ca, op, cb) { having$.call(this, wherec$(ca, op, cb)); },
    HAVING_AND: function (ca, op, cb) { having$.call(this, { AND: wherec$(ca, op, cb) }); },
    HAVING_OR: function (ca, op, cb) { having$.call(this, { OR: wherec$(ca, op, cb) }); },
    HAVING_BETWEEN: function (a, b) { having$.call(this, { BETWEEN: [a, b] }); },
    HAVING_IN: function (a) { having$.call(this, { IN: a }); },
    HAVING_NOT: function (ca, op, cb) { having$.call(this, { NOT: wherec$(ca, op, cb) }); },
    HAVING_NOT_AND: function (ca, op, cb) { having$.call(this, { NOT: { AND: wherec$(ca, op, cb) }}); },
    HAVING_NOT_OR: function (ca, op, cb) { having$.call(this, { NOT: { OR: wherec$(ca, op, cb) }}); },
    HAVING_NOT_BETWEEN: function (a, b) { having$.call(this, { NOT: { BETWEEN: [a, b] }}); },
    HAVING_NOT_IN: function (a) { having$.call(this, { NOT: { IN: a }}); },


    /**************************
     **************************
     ***                    ***
     ***    QUERY: ORDER    ***
     ***                    ***
     **************************
     **************************/
    ORDER: function (fld, o) {
      if (this.query.ORDER) {
        if (typeof this.query.ORDER === 'string') {
          var t = this.query.ORDER;
          this.query.ORDER = {};
          this.query.ORDER[t] = 'ASC';
        }
      } else {
        this.query.ORDER = {};
      }

      this.query.ORDER[fld] = o || 'ASC';
    },


    /**************************
     **************************
     ***                    ***
     ***    QUERY: LIMIT    ***
     ***                    ***
     **************************
     **************************/
    LIMIT: function (l, o) {
      if (isNaN(l) || ((o !== undefined) && isNaN(o))) {
        throw 'Invalid limit!';
      }

      this.query.LIMIT = { LIMIT: parseInt(l), OFFSET: parseInt(o) || 0 };
    },

    /***********************
     ***********************
     ***                 ***
     ***    TO STRING    ***
     ***                 ***
     ***********************
     ***********************/

    toString: function () {
      return this.getQuery();
    },

    getQuery: function (format) {
      var i, sql = '';

      function wts(w, tabCount, u) {
        if (isNaN(tabCount)) {
          tabCount = 1;
        } else {
          tabCount++;
        }

        if (typeof w === 'string') {
          return w;
        } else {
          if (!u) {
            u = 'AND';
          }

          var tb = new Array(tabCount + 1 ).join('\t'),
            f = false, whr, whrK, sql = '';

          function whr_X(op, whr) {
            sql += '(' + (format ? ('\n' + tb + '\t') : ' ') + wts(whr, tabCount, op) + (format ? ('\n' + tb) : ' ') + ')';
          }

          function whr_AND(whr) {
            whr_X('AND', whr);
          }

          function whr_OR(whr) {
            whr_X('OR', whr);
          }

          function whr_IN(whr) {
            sql += 'IN (';
            if (whr instanceof Array) {
              sql += whr.join(', ');
            } else {
              sql += whr;
            }
            sql += ')';
          }

          function whr_NOT(whr) {
            sql += 'NOT ' + ((whr.IN || whr.BETWEEN) ? '' : ('(' + (format ? ('\n' + tb + '\t') : ' ')));
            sql += wts(whr, tabCount);
            if (!whr.IN && !whr.BETWEEN) {
              sql += (format ? ('\n' + tb) : ' ') + ')';
            }
          }

          function whr_BETWEEN(whr) {
            sql += 'BETWEEN ' + whr[0] + ' AND ' + whr[1];
          }

          for (whrK in w) {
            if (w.hasOwnProperty(whrK)) {
              whr = w[whrK];

              if (f) {
                sql += (format ? ('\n' + tb) : ' ') + u + ' ';
              } else {
                f = true;
              }

              if (!whr) {
                throw 'Invalid WHERE!';
              }

              if (typeof whr === 'string') {
                sql += whr;
              } else if (whrK === 'AND') {
                whr_AND(whr);
              } else if (whr.AND) {
                whr_AND(whr.AND);
              } else if (whrK === 'OR') {
                whr_OR(whr);
              } else if (whr.OR) {
                whr_OR(whr.OR);
              } else if (whrK === 'IN') {
                whr_IN(whr);
              } else if (whr.IN) {
                whr_IN(whr.IN);
              } else if (whrK === 'NOT') {
                whr_NOT(whr);
              } else if (whr.NOT) {
                whr_NOT(whr.NOT);
              } else if ((whrK === 'BETWEEN') && (whr instanceof Array) && (whr.length === 2)) {
                whr_BETWEEN(whr);
              } else if ((whr.BETWEEN instanceof Array) && (whr.BETWEEN.length === 2)) {
                whr_BETWEEN(whr.BETWEEN);
              } else if (whr instanceof Array) {
                // Array
                switch (whr.length) {
                  case 3:
                    sql += whr[0] + ' ' + whr[1] + ' ' + whr[2];
                    break;
                  case 2:
                    sql += whr[0] + ' = ' + whr[1];
                    break;
                  default:
                    throw 'Invalid WHERE Array size!';
                    break;
                }
              } else if (whr) {
                sql += whr;
              }
            }
          }

          return sql;
        }
      }

      function _update(action) {
          var f = false, s;
          sql = action;

          switch (this.query.OR) {
            case 'ROLLBACK': sql += ' OR ROLLBACK'; break;
            case 'ABORT': sql += ' OR ABORT'; break;
            case 'REPLACE': sql += ' OR REPLACE'; break;
            case 'FAIL': sql += ' OR FAIL'; break;
            case 'IGNORE': sql += ' OR IGNORE'; break;
            default: throw 'Invalid "' + action + ' OR" definition!';
          }

          sql += ' ' + this.query[action] + (format ? '\nSET' : ' SET');

          for (s in this.query.SET) {
            if (this.query.SET.hasOwnProperty(s)) {
              if (f) {
                sql += ',';
              } else {
                f = true;
              }
              sql += (format ? '\n\t' : ' ') + s + ' = ' + this.query.SET[s];
            }
          }

          if (this.query.WHERE) {
            sql += (format ? '\nWHERE\n\t' : ' WHERE ') + wts(this.query.WHERE);
          }
      }

      function _modTable() {
        var x, colName, cd,
          f = false,
          def = this.query.DEF || this.query.DEFINITION || this.query.COLUMN || this.query.COLUMNS;

        for (colName in def) {
          if (def.hasOwnProperty(colName)) {
            if (f) {
              sql += ',';
            } else {
              f = true;
            }
            sql += (format ? '\n\t' : ' ') + colName;
            cd = def[colName];
            if (cd.type || cd.TYPE) { // TEXT | NUM | INT | REAL
              sql += ' ' + (cd.type || cd.TYPE).toUpperCase();
            }

            // http://www.sqlite.org/syntaxdiagrams.html#column-def
            if (cd.unique || cd.UNIQUE) {
              sql += ' UNIQUE';
            }
            if (cd.key || cd.KEY || cd.primary || cd.PRIMARY) {
              sql += ' PRIMARY KEY';
              if (cd.order || cd.ORDER) { // ASC | DESC
                sql += ' ' + (cd.order || cd.ORDER).toUpperCase();
              }
              if (cd.autoincrement || cd.AUTOINCREMENT) {
                sql += ' AUTOINCREMENT';
              }
            }
            if (cd.notnull || cd.NOTNULL) {
                sql += ' NOT NULL';
            }
            if ((cd.null === false) || (cd.NULL === false)) {
                sql += ' NOT NULL';
            }
            if (cd.check || cd.CHECK) { // String
                sql += ' CHECK (' + (cd.check || cd.CHECK) + ')';
            } else if (cd.enum || cd.ENUM) { // String|Array
                x = cd.enum || cd.ENUM;
                if (x instanceof Array) {
                  x = x.join(', ');
                }
                sql += ' CHECK (' + x + ')';
            }
            if (cd.default || cd.DEFAULT) {
                sql += ' DEFAULT ' + (cd.default || cd.DEFAULT);
            }
            if (cd.collate || cd.COLLATE || cd.collation || cd.COLLATION) {
                sql += ' COLLATE ' + (cd.collate || cd.COLLATE || cd.collation || cd.COLLATION);
            }
          }
        }
      }

      if (this.query.SELECT) {
        /****************
         *              *
         *    SELECT    *
         *              *
         ****************/
        // http://www.sqlite.org/lang_select.html
        sql = 'SELECT';

        var v, f = false;
        if (this.query.SELECT.DISTINCT) {
          sql += ' DISTINCT';
        }

        for (i in this.query.SELECT) {
          if (this.query.SELECT.hasOwnProperty(i) && (i.toUpperCase() !== 'DISTINCT')) {
            v = this.query.SELECT[i];

            if (f) {
              sql += ',';
            } else {
              f = true;
            }

            sql += format ? '\n\t' : ' ';

            if (i === parseInt(i).toString()) {
              // Numeric index
              sql += v;
            } else {
              sql += v + ' AS ' + i;
            }
          }
        }

        if (this.query.FROM) {
          sql += format ? '\nFROM' : ' FROM';

          if (typeof this.query.FROM === 'string') {
            sql += (format ? '\n\t' : ' ') + this.query.FROM;
          } else {
            var f = false, frmDef, alias;

            for (alias in this.query.FROM) {
              if (this.query.FROM.hasOwnProperty(alias)) {
                frmDef = this.query.FROM[alias];
                sql += format ? '\n\t' : ' ';

                if (f) {
                  if (typeof frmDef === 'string') {
                    // NATURAL JOIN
                    if (frmDef instanceof JSQL) {
                      frmDef = '(' + frmDef + ')';
                    }

                    sql += 'NATURAL JOIN ' + frmDef + ' AS ' + alias;
                  } else {
                    if (frmDef.length === 2) {
                      // INNER JOIN
                      if (frmDef[0] instanceof JSQL) {
                        frmDef[0] = '(' + frmDef[0] + ')';
                      }

                      if (!(frmDef[1][0] instanceof Array)) {
                        frmDef[1] = [ frmDef[1] ];
                      }

                      sql += 'INNER JOIN ' + frmDef[0] + ' AS ' + alias + ' ON ' + wts(frmDef[1], 1);
                    } else if (frmDef.length === 2) {
                      // X JOIN
                      if (!(frmDef[2][0] instanceof Array)) {
                        frmDef[2] = [ frmDef[2] ];
                      }

                      if (frmDef[1] instanceof JSQL) {
                        frmDef[1] = '(' + frmDef[1] + ')';
                      }

                      sql += frmDef[0] + ' JOIN ' + frmDef[1] + ' AS ' + alias + ' ON ' + wts(frmDef[2], 1);
                    } else {
                      // Invalid FROM definition
                      throw 'Invalid FROM definition!';
                    }
                  }
                } else {
                  // First
                  if (frmDef instanceof JSQL) {
                    frmDef = '(' + frmDef + ')';
                  }

                  sql += frmDef + ' AS ' + alias;
                  f = true;
                }
              }
            }
          }
        }

        if (this.query.WHERE) {
          sql += (format ? '\nWHERE\n\t' : ' WHERE ') + wts(this.query.WHERE);
        }

        if (this.query.GROUP) {
          sql += format ? '\nGROUP BY' : ' GROUP BY';
          var f = false, grpBy;

          for (grpBy in this.query.GROUP) {
            if (this.query.GROUP.hasOwnProperty(grpBy)) {
              if (f) {
                sql += ',';
              } else {
                f = true;
              }

              sql += (format ? '\n\t' : ' ') + this.query.GROUP[grpBy];
            }
          }
        }

        if (this.query.HAVING) {
          sql += (format ? '\nHAVING\n\t' : ' HAVING ') + wts(this.query.HAVING);
        }

        if (this.query.ORDER) {
          sql += format ? '\nORDER BY' : ' ORDER BY';
          var f = false, ordBy;

          for (ordBy in this.query.ORDER) {
            if (this.query.ORDER.hasOwnProperty(ordBy)) {
              if (f) {
                sql += ',';
              } else {
                f = true;
              }

              sql += (format ? '\n\t' : ' ') + ordBy + ' ' + this.query.ORDER[ordBy].toUpperCase();
            }
          }
        }

        if (this.query.LIMIT) {
          sql += (format ? '\n' : ' ') + 'LIMIT ' + this.query.LIMIT.LIMIT;

          if (!isNaN(this.query.LIMIT.OFFSET) && (this.query.LIMIT.OFFSET !== 0)) {
            sql += ' OFFSET ' + this.query.LIMIT.OFFSET;
          }
        }
      } else {
        if (this.query.INSERT) {
          /****************
           *              *
           *    INSERT    *
           *              *
           ****************/
          // http://www.sqlite.org/lang_insert.html
          var c, v, f = false;
          sql = 'INSERT';

          switch (this.query.OR) {
            case 'REPLACE': sql += ' OR REPLACE'; break;
            case 'ROLLBACK': sql += ' OR ROLLBACK'; break;
            case 'ABORT': sql += ' OR ABORT'; break;
            case 'FAIL': sql += ' OR FAIL'; break;
            case 'IGNORE': sql += ' OR IGNORE'; break;
            default: throw 'Invalid "INSERT OR" definition!';
          }

          sql += ' INTO' + this.query.INSERT;

          if ((this.query.COLUMNS instanceof Array) && (this.query.COLUMNS.length > 0)) {
            // Columns
            sql += ' (';

            for (c in this.query.COLUMNS) {
              if (this.query.COLUMNS.hasOwnProperty(c)) {
                if (f) {
                  sql += ', ';
                } else {
                  f = true;
                }

                sql += this.query.COLUMNS[c];
              }
            }

            sql += ')';
          } else if (this.query.COLUMN) {
            // Column
            sql += ' (' + this.query.COLUMN + ')';
          }

          if ((this.query.VALUES instanceof JSQL) || (typeof this.query.VALUES === 'string')) {
            sql += (format ? ' VALUES (\n\t' : ' VALUES ( ') + this.query.VALUES + (format ? '\n\t)' : ' )');
          } else if ((this.query.VALUES instanceof Array) && (this.query.VALUES.length > 0)) {
            // Values
            f = false;
            sql += format ? '\nVALUES\n\t(' : ' VALUES (';

            if (this.query.VALUES[0] instanceof Array) {
              // First item is an Array -> Multi-insert
              for (c in this.query.VALUES) {
                if (this.query.VALUES.hasOwnProperty(c)) {
                  v = this.query.VALUES[c];

                  if (f) {
                    sql += format ? '),\n\t(' : '), (';
                  } else {
                    f = true;
                  }

                  if (v instanceof Array) {
                    sql += v.join(', ');
                  } else {
                    sql += v;
                  }
                }
              }
            } else {
              // Single-insert
              sql += this.query.VALUES.join(', ');
            }

            sql += ')';
          } else if (this.query.VALUE) {
            // VALUE
            sql += format ? '\nVALUES' : ' VALUES';

            if (this.query.VALUE instanceof Array) {
              sql += (format ? '\n\t(' : ' (') + this.query.VALUE.join(format ? '),\n\t(' : '), (');
            } else {
              sql += ' (' + this.query.VALUE;
            }

            sql += ')';
          }
        } else if (this.query.REPLACE) {
          /*****************
           *               *
           *    REPLACE    *
           *               *
           *****************/
          // http://www.sqlite.org/lang_replace.html
          _update.call(this, 'REPLACE');
        } else if (this.query.UPDATE) {
          /****************
           *              *
           *    UPDATE    *
           *              *
           ****************/
          // http://www.sqlite.org/lang_update.html
          _update.call(this, 'UPDATE');
        } else if (this.query.DELETE) {
          /****************
           *              *
           *    DELETE    *
           *              *
           ****************/
          // http://www.sqlite.org/lang_delete.html
          sql = 'DELETE FROM ' + this.query.DELETE;

          if (this.query.WHERE) {
            sql += (format ? '\nWHERE\n\t' : ' WHERE ') + wts(this.query.WHERE);
          }
        } else if (this.query.CREATE) {
          /**********************
           *                    *
           *    CREATE TABLE    *
           *                    *
           **********************/
          // http://www.sqlite.org/lang_createtable.html
          sql = 'CREATE';

          if (this.query.TEMP || this.query.TEMPORARY) {
            sql += ' TEMPORARY';
          }

          sql += ' TABLE';

          if (this.query.CHECK) {
            sql += ' IF NOT EXISTS';
          }

          sql += ' ' + this.query.CREATE + ' (';
          _modTable.call(this);
          sql += format ? '\n)' : ' )';

          if (this.query.ROWID === false) { // Not use ROWID, use defined "PRIMARY KEY" column.
            sql += ' WITHOUT ROWID';
          }
        } else if (this.query.ALTER) {
          /*********************
           *                   *
           *    ALTER TABLE    *
           *                   *
           *********************/
          // http://www.sqlite.org/lang_altertable.html
          sql = 'ALTER TABLE ' + this.query.ALTER;

          if (this.query.ADD) { // Column Name. Use 'COLUMN' for definition
            var c = this.query.COLUMN;
            this.query.COLUMN = {};
            this.query.COLUMN[this.query.ADD] = c;
            sql += ' ADD COLUMN';
            _modTable.call(this);
          }

          if (this.query.RENAME) { // New table name
            sql += ' RENAME TO ' + this.query.RENAME;
          }
        } else if (this.query.DROP) {
          /********************
           *                  *
           *    DROP TABLE    *
           *                  *
           ********************/
          // http://www.sqlite.org/lang_droptable.html
          sql = 'DROP TABLE';

          if (this.query.CHECK) {
            sql += ' IF EXISTS';
          }

          sql += ' ' + this.query.DROP;
        } else if (this.query.TRUNCATE) {
          /************************
           *                      *
           *    TRUNCATE TABLE    *
           *                      *
           ************************/
          sql = 'TRUNCATE TABLE ' + this.query.TRUNCATE;
        } else {
          // Operation not defined
          throw 'Operation not defined!';
        }
      }

      return sql;
    }
  });

})(window);

// SELECT Syntax
// JSQL({
//   SELECT: {
//       DISTINCT: true,
//       alias1: 'fld1',
//       alias2: 'fld2 + fld3'
//       alias3: JSQL( ... )
//     } || [ 'DISTINCT', 'fld1', 'fld2 + fld3' ]
//   , FROM: 'TableName' || {
//       TableAlias1: 'TableName1'
//       , TableAliasN: 'TableNameN' // NATURAL JOIN
//       , TableAlias2: ['talbeName2', ['tableAlias1.id', 'tableAlias2.idT1' ]] // INNER JOIN
//       , TableAlias3: ['LEFT|RIGHT|INNER', 'talbeName3', [ // WHERE SYNTAX FOR 'ON'
//           ['tableAlias1.id', 'tableAlias3.idT1']
//           , ['tableAlias2.id', '<>', 'tableAlias3.idT2']
//           , { IN: [1, 2, 4] }
//         ]]
//       , QueryAlias1: JSQL( ... )
//       , QueryAlias2: [ JSQL( ... ), [ ... ] ] // WHERE SYNTAX FOR 'ON'
//     }
//   , WHERE: 'field2 = 123123' || [
//     ['field1', '<>', "'test1'"] // field1 <> 'test1'
//     , 'field2 = field1' // AND field2 = field1
//     , ['field1', "'test1'"] // AND field1 = 'test1'
//     , { AND: [
//       ['field1', "'test1'"]
//       ]}
//     , { OR: [
//       ['field1', '<>', "'test1'"] // field1 <> 'test1'
//       , ['field1', "'test1'"] // OR field1 = 'test1'
//       ]}
//     , { BETWEEN: ['fldA', 'fldB'] }
//     , { IN: [1, 2, 3] || JSQL( ... ) }
//     , { NOT: ... } // WHERE SYNTAX
//     , { NOT: { IN: [1, 2, 3] || JSQL( ... ) }} // WHERE SYNTAX
//   ]
//   , GROUP: 'fld1' || [ 'fld1', 'fld2' ]
//   , HAVING: ... // WHERE SYNTAX
//   , ORDER: 'fld1' || [ 'fld1', 'fld2' ] || { fld1: 'ASC', fld2: 'DESC' }
//   , LIMIT: 50 || [10, 50] || { LIMIT: 50, OFFSET: 10 }
// });

// SELECT Example
// var q = JSQL({
//   SELECT: {
//     DISTINCT: true,
//     foo: 'T1.fld1',
//     bar: 'COUNT(T2.fld2)'
//   },
//   FROM: {
//     T1: 'table1',
//     T2: ['table2', ['T1.id', 'T2.xid']],
//     T3: ['table3', [['T2.id', 'T3.xid']]]
//   },
//   WHERE: [
//     'asd = dsa',
//     ['aa', 'bb'],
//     ['cc', '<>', 'ee'],
//     {OR: [
//       ['oa1', 'oa2'],
//       ['oa3', '<>', 'oa4'],
//       {NOT: {IN: JSQL({
//         SELECT: '*',
//         FROM: 'JoinTable',
//         WHERE: {OR: [
//           'WhereX = WhereY',
//           ['aaaa', 'vvvvv']
//           ]}
//       })}},
//       {AND: [
//           'aaaaa',
//           'bbbbbbb',
//           {IN: [1, 2, 3, 4]}
//         ]}
//       ]},
//       {NOT: [
//         'asdsadasdasdasd = 1',
//         ['asdasd', '22222']
//         ]}
//   ],
//   GROUP: ['a1', 'a2'],
//   ORDER: {
//     'a1': 'asc',
//     'b2': 'desc'
//   },
//   LIMIT: 50
// });
// q.SELECT('xx1')
//   .SELECT('aa1', 'xx2');
// q.toString(true)



// INSERT Syntax
// JSQL({
//   INSERT: 'TableName',
//   COLUMNS: ['ca', 'cb', 'cc'], // OPTIONAL
//   VALUES: ['va', 'vb', 'vc'] || [ ['va1', 'vb1', 'vc1'], ['va2', 'vb2', 'vc2'] ] || JSQL( SELECT: ... )
//   ---
//   COLUMN: 'ca',
//   VALUE: 'va' || [ 'va', 'vb' ]
// });

// INSERT Example
// JSQL({
//   INSERT: 'TableName',
//   // COLUMNS: ['ca', 'cb', 'cc'],
//   // VALUES: ['va', 'vb', 'vc']
//   COLUMN: 'value',
//   VALUE: ['123', 4444]
// }).toString(true);



// Update Syntax