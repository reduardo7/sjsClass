sjsClass
========

Simple JavaScript Class. Create your advanced JavaScript Class!

Experiment with Chrome
----------------------

http://stackoverflow.com/questions/13792553/write-javascript-in-chrome-developer-tools

Node.js Implementation
----------------------

### Installation

This module is installed via npm:

```
npm install --save sjsclass
```

### Include

#### Normal include

```js
var Class = require('sjsclass');
```

#### Global include

```js
require('sjsclass').registerGlobal();
```

### Node.js usage examples

**Define class**
```javascript
const Class = require('sjsclass');

module.exports = Class({
  'protected protectedMethod': function () {
    // ...
  },
  'property prop1': {
    get: function () {
      return this.protectedMethod();
    }
  },
  publicMethod1: function () {
    // ...
  }
});
```

**Using class**
```javascript
const myClass = require('./myClasss.js');

var obj1 = new myClass();
obj1.publicMethod1();
console.log(obj1.prop1);

obj1.prop1 = 'invalid call'; // Invalid call, "obj1" does not have this setter
obj1.protectedMethod(); // Invalid call, "obj1" does not have this method (there is not a public method)


const otherClass = myClass.extend('otherClass', {
  publicMethod2: function () {
    // ...
  }
});

var obj2 = new otherClass();
obj1.publicMethod1();
obj2.publicMethod2();

obj1.publicMethod2(); // Invalid call, "obj1" does not have this method. There is not a method from 'otherClass'
```

Features
--------

### Extend class

Using <code>extend</code> method:

 - *Class.extend(<code>string ClassName</code>, <code>object definition</code>);*
 - *Class.extend(<code>string ClassName</code>);*
 - *<code>var ClassName2</code> = Class.extend(<code>string ClassName</code>, <code>object definition</code>);*
 - *<code>var ClassName2</code> = Class.extend(<code>string ClassName</code>);*
 - *<code>var ClassName</code> = Class.extend(<code>object definition</code>);*

Using <code>Class</code> function:

 - *Class(<code>string ClassName</code>, <code>object definition</code>);*
 - *Class(<code>string ClassName</code>);*
 - *<code>var ClassName2</code> = Class(<code>string ClassName</code>, <code>object definition</code>);*
 - *<code>var ClassName2</code> = Class(<code>string ClassName</code>);*
 - *<code>var ClassName</code> = Class(<code>object definition</code>);*
```js
    Person.extend('newClassName', {
        __constructor: function() {
            this.var = 1; // -> Public only for this class.
        }
    });
```
```js
    var newClassName = Person.extend({
        ...
    });
```

### Static methods and variables

```js
    Class.extend('Person', {
        __static: {
            // Static methods
            testStatic: function() {
                return true;
            },
            staticVar: true,
            count: 100
        },
        'static getCount': function() {
            return this.count;
        },
        'static getVar': function() {
            return this.staticVar;
        }
        ...
    });
    alert(Person.testStatic());
    alert(Person.staticVar);
    alert(Person.count);
    alert(Person.getCount());
    alert(Person.getVar());
```

### Declare into context

```js
    // Web Page
    (function(context) {
        ...
    })(window);
    Class.extend('Person', ...
    var p = new Person(...
```
```js
    var contextName = {};
    (function(context) {
        ...
    })(contextName);
    contextName.Class.extend('Person', ...
    var p = new contextName.Person(...
```

### Access static methods and variables from instance

```js
    Class.extend('Person', {
        __static: {
            count: 100
        },
        __construct: function() {
            this.__static.count++;
        }
    });
```

### Constructor

 - *<code>Class</code> Class.<code>newInstance</code>([<code>object ConstructorParams</code>])*
 - *<code>Class</code> Class.<code>newInstanceOf</code>(<code>string ClassName</code>, [<code>object ConstructorParams</code>])*
```js
    Class.extend('Person', {
        __construct: function(var1, var2, varN) {
            ...
        }
    });
    var p1 = new Person(22, 13, 16);
    var p2 = Person.newInstance(22, 13, 16);
    var p3 = Class.newInstanceOf('Person', 22, 13, 16);
    // p1 == p2 == p3
```

### Call parent methods

```js
    Person.extend('Ninja', {
        __static: {
            testStatic: function() {
                this.super(); // Call parent 'testStatic'
            }
        },
        __constructor: function() {
            this.__super(true); // Call parent constructor
            ...
        },
        dance: function() {
            this.__super(4); // Call parent method
            ...
        }
    });
```

### Call parent static

```js
    Person.extend('Ninja', {
        __static: {
            testStatic: function() {
                this.super(); // Call parent 'testStatic'
            }
        },
        dance: function() {
            this.__parent.testStatic();
            ...
        }
    });
```

### Check if has value or method

 - *<code>Boolean</code> classInstance.<code>hasMethod</code>(<code>string MethodName</code>)*
 - *<code>Boolean</code> classInstance.<code>hasVar</code>(<code>string VarName</code>)*
```js
    Person.extend('Ninja', {
        methodName: function() {
            ...
        },
        varName: 123
    });
    var p = new Person();
    if (p.hasMethod('methodName')) alert('Yes');
    if (p.hasVar('varName')) alert('Yes');
```

### Get Class name

 - *<code>String</code> classInstance.<code>getClassName</code>()*
 - *<code>String</code> Class.<code>getClassName</code>()*
```js
    Person.extend('Ninja', {
        ...
    });
    var p = new Person();
    alert(p.getClassName()); // -> Alert 'Person'
    var n = new Ninja();
    alert(n.getClassName()); // -> Alert 'Ninja'
```
```js
    var Other = Person.extend({
        ...
    });
    var o = new Other();
    alert(o.getClassName()); // -> Alert 'Person_extended_0'
    var Foo = Person.extend({
        ...
    });
    var f = new Foo();
    alert(f.getClassName()); // -> Alert 'Person_extended_1'
```
```js
    var Bar = Ninja.extend('Fighter', {
        ...
    });
    var b = new Bar();
    alert(b.getClassName()); // -> Alert 'Fighter'
```

### Hash Code

 - *<code>String</code> classInstance.<code>hashCode</code>()*
```js
    var p1 = new Person(false);
    console.log(p1.hashCode()); // -> Get instence Hash Code
```

### equals

 - *<code>Boolean</code> classInstance.<code>equals</code>(<code>Class ClassInstance</code>)*

Check's instances Hash Codes and Class Names.
```js
    var p1 = new Person(false);
    var p2 = Person.newInstance(false);
    console.log(p1.equals(p2)); // -> true
```

### To string

 - *<code>String</code> classInstance.<code>toString</code>()*
```js
    var p1 = new Person(false);
    console.log(p1.toString()); // -> String representation
```

### Callbacks

```js
    Class.extend('Ninja', {
        __onExtend: function() {
            alert('Extending Ninja class!');
        }
    });
    Ninja.extend('Fighter', {
        ...
    });
    var f = new Fighter(); // -> Alert 'Extending Ninja class!'
```

### Check if Class exists

 - *<code>Boolean</code> Class.<code>classExists</code>(<code>string ClassName</code>)*
```js
    Class.extend('Ninja', {
        ...
    });
    Class.classExists('Ninja') && !Class.classExists('Dog'); // -> TRUE
```

### Prefix extended class

```js
    // Creates a 'FightFighter' class, not a 'Fighter' class.
    Class.extend('Fighter', {
        __prefix: 'Fight',
        ...
    });
    // Creates a 'FightSamuray' class, not a 'Samuray' class.
    FightFighter.extend('Samuray' {
        ...
    });
    // Creates a 'Ninja' class, not a 'FightNinja' class.
    FightFighter.extend('Ninja' {
        __prefix: null,
        ...
    });
    // Override 'FightSamuray' class.
    Class.extend('FightSamuray' {
        ...
    });
```

### Get Class from Class Name

 - *<code>Class</code> Class.<code>getClass</code>(<code>string ClassName</code>);*
```js
    Class.extend('Person', {
        ...
    });
    var p = Class.getClass('Person');
    // p === Person
```

### Constants

```js
    Class.extend('Person', {
        __const : {
            BROTHER : 'Mateo',
            FLIA : 'Cuomo'
        },
        'const SISTER' : 'Luciana'
    });
    var f = new Person;
    f.BROTHER = 'Eduardo';
    f.SISTER = 'Vanesa';
    f.BROTHER; // ->  'Mateo'
    f.SISTER; // -> 'Luciana'
```

### Protected methods and variables

```js
    Class.extend('Foo', {
        __protected : {
            privV : 123,
            privF : function () {
                return this.privV + this.priv3;
            }
        },
        'protected priv3' : 'Protected Value',
        setX : function (x) {
            this.privV = x;
        },
        test : function () { return this.privF(); }
    });
    var f = new Foo;
    f.setX(456);
    f.test(); // -> 'Protected Value456'
    f.privF(); // -> Error
    f.privV; // -> undefined
    f.priv3; // -> undefined
```

### Properties

 - *<code>Object</code> <code>__properties</code>*
 - *<code>Object</code> <code>property</code>*
 - *<code>Object</code> <code>prop</code>*

Link: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
```js
    Class.extend('Fighter', {
        __property : {
            Val : {
                get : function () { return this.val; },
                set : function (value) { this.val = value; }
            }
        },
        'prop foo' : {
            get : function () { return this.val * 3; }
        },
        'property bar' : {
            value : 123,
            enumerable : false,
            writable : true
        },
        'protected val' : null
    });

    var f = new Fighter();
    f.Val = 21;
    f.Val; // -> 21
    f.foo = 123;
    f.foo; // -> 63
    f.bar; // -> 63
```

### Fluent Interface

 - *<code>Boolean</code> <code>__fluent</code>*

If <code>__fluent</code> is <code>TRUE</code>, then the methods that return <code>undefined</code>, <code>this</code> instance will return.
```js
    Class.extend('Foo', {
        __fluent : true, // Enable Fluent Interface
        __static : {
            x : '',
            add : function (x) { this.x += x; }, // Fluent Interface
            bar : function () { return this.x; }
        },
        'protected x' : '',
        add : function (x) { this.x += x; }, // Fluent Interface
        bar : function () { return this.x; }
    });
    var f = new Foo();
    f.add(10).add(13).add('LM');
    Foo.add(88).add(86).add('VE');
    console.log(
        f.bar(), // -> 1013LM
        Foo.bar() // ->8886VE
    );
```

### Class ID

 - *<code>String</code> classInstance.<code>__instanceId</code>()*

Get Instance ID.
```js
    Class.extend('Foo', {
        ...
    });

    console.log(
        Foo.__classId
    );
```

### Instance ID

 - *<code>String</code> classInstance.<code>__instanceId</code>()*

Get Instance ID.
```js
    Class.extend('Foo', {
        ...
    });

    var f1 = new Foo();
    var f2 = new Foo();

    console.log(
        f1.__instanceId,
        f2.__instanceId
    );
```

### Instances Count

 - *<code>String</code> ClassName.<code>__instanceCount</code>()*

Get created objects count.
```js
    Class.extend('Foo', {
        ...
    });

    console.log(Foo.__instanceCount); // -> 0
    Foo.__instanceCount = 111;
    console.log(Foo.__instanceCount); // -> 0

    var f1 = new Foo();
    var f2 = new Foo();
    console.log(Foo.__instanceCount); // -> 2
```

### package

 - *<code>Object</code> classInstance.<code>__package</code>*

```js
    var foo = { };

    Class.extend('Cls', {
        __package : foo,
        ...
    });

    var c = new foo.Cls();
```

```js
    var com = {
        eduardocuomo = {
            examples = { }
        }
    };

    Class.extend('Test', {
        __package : com.eduardocuomo.examples,
        ...
    });

    var t = new com.eduardocuomo.examples.Test();
```

### Packager

 - *Class.<code>package</code>(<code>packageObject</code>, <code>packagerFunction(packageObject)</code>)*

```js
    // package
    var com = {
        eduardocuomo : {
            demo : { }
        }
    };

    Class.package(com.eduardocuomo.demo, function () {

        Class.extend('Foo');

    });

    com.eduardocuomo.demo.Foo.package(function () {

        Class('Bar');

    });

    Class.package(com.eduardocuomo.demo, function ($) {

        var f = new $.Foo(),
            b = new this.Bar();

    });
```

### Exception

- *Class.<code>Exception</code>(<code>message</code>, <code>innerException</code>)*

```js
    Class.Exception.extend('FooException');

    // Anonymous Exception
    var BarException = FooException.extend();

    // New Exception
    Class.Exception.extend('TestException', {
        'protected _data' : undefined,
        'property data' : { get : function () { return this._data; } },
        __constructor : function (message, data, innerException) {
            this.__super(message, innerException);
            this._data = data;
        }
    });

    // Result
    var result = true;

    // Test

    try {
        try {
            throw new FooException();
        } catch (e1) {
            e1.data = 'NO SET';
            e1.message = 'NO SET';

            // Should all be true
            result = result && (e1 instanceof Class.Exception) && (e1 instanceof FooException) &&
                (e1.message === undefined);

            throw new BarException('Bar Message', e1);
        }
    } catch (e2) {
        // Should all be true
        result = result && (e2 instanceof Class.Exception) && (e2 instanceof FooException) && (e2 instanceof BarException) &&
            !!e2.innerException && (e2.innerException instanceof FooException) && !(e2.innerException instanceof BarException) &&
            (e2.message === 'Bar Message') && !e2.hasVar('data');
    }

    try {
        throw new TestException('Test Message', { v1 : true, v2 : 'Test' });
    } catch (e3) {
        // Should all be true
        result = result && (e3 instanceof Class.Exception) && !(e3 instanceof FooException) && !(e3 instanceof BarException) &&
            e3.data && (e3.message === 'Test Message') && (e3.data.v1 === true) && (e3.data.v2 === 'Test');
    }

    // Should all be true
    result
```

### Use Class as Function

 - *<code>Object</code> classInstance.<code>__function</code>*

```js
    Class('Test', {
        __function : function (v) {
            return '[[' + v + '|' + v + ']]';
        }
    });

    // Should all be true
    Test(123) === '[[123|123]]'
```

### Prevent Override

 - *<code>Boolean</code> classInstance.<code>__preventOverride</code>*

```js
    Class('Test');

    // Override Test Class
    Class('Test', {
        __preventOverride : true
    });

    // Error, can't override!
    Class('Test', { ... });
```

### Dynamic Property

 - *<code>classInstance</code> classInstance.<code>defineProperty</code>(<code>String PropertyName</code>, <code>object PropertyDefinition</code>)*

About JavaScript Property: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty

```js
    Class.extend('DynProp', {
        __constructor: function (pname, pvalue) {
            this.defineProperty(pname, {
                value: pvalue
            });
        }
    });

    var dyn = new DynProp('testProp', 'testValue');

    // Should all be true
    (dyn.testProp === 'testValue')
```
