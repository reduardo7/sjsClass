sjsClass
========

Simple JavaScript Class

Features
--------

<h3>Extend class</h3>

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
<pre>
    Person.extend('newClassName', {
        __constructor: function() {
            this.var = 1; // -> Public only for this class.
        }
    });
</pre>
<pre>
    var newClassName = Person.extend({
        ...
    });
</pre>

<h3>Static methods and variables</h3>

<pre>
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
</pre>

<h3>Declare into context</h3>

<pre>
    // Web Page
    (function(context) {
        ...
    })(window);
    Class.extend('Person', ...
    var p = new Person(...
</pre>
<pre>
    var contextName = {};
    (function(context) {
        ...
    })(contextName);
    contextName.Class.extend('Person', ...
    var p = new contextName.Person(...
</pre>

<h3>Access static methods and variables from instance</h3>

<pre>
    Class.extend('Person', {
        __static: {
            count: 100
        },
        __construct: function() {
            this.__static.count++;
        }
    });
</pre>

<h3>Constructor</h3>

 - *<code>Class</code> Class.<code>newInstance</code>([<code>object ConstructorParams</code>])*
 - *<code>Class</code> Class.<code>newInstanceOf</code>(<code>string ClassName</code>, [<code>object ConstructorParams</code>])*
<pre>
    Class.extend('Person', {
        __construct: function(var1, var2, varN) {
            ...
        }
    });
    var p1 = new Person(22, 13, 16);
    var p2 = Person.newInstance(22, 13, 16);
    var p3 = Class.newInstanceOf('Person', 22, 13, 16);
    // p1 == p2 == p3
</pre>

<h3>Call parent methods</h3>

<pre>
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
</pre>

<h3>Call parent static</h3>

<pre>
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
</pre>

<h3>Check if has value or method</h3>

 - *<code>boolean</code> classInstance.<code>hasMethod</code>(<code>string MethodName</code>)*
 - *<code>boolean</code> classInstance.<code>hasVar</code>(<code>string VarName</code>)*
<pre>
    Person.extend('Ninja', {
        methodName: function() {
            ...
        },
        varName: 123
    });
    var p = new Person();
    if (p.hasMethod('methodName')) alert('Yes');
    if (p.hasVar('varName')) alert('Yes');
</pre>

<h3>Get Class name</h3>

 - *<code>string</code> classInstance.<code>getClassName</code>()*
 - *<code>string</code> Class.<code>getClassName</code>()*
<pre>
    Person.extend('Ninja', {
        ...
    });
    var p = new Person();
    alert(p.getClassName()); // -> Alert 'Person'
    var n = new Ninja();
    alert(n.getClassName()); // -> Alert 'Ninja'
</pre>
<pre>
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
</pre>
<pre>
    var Bar = Ninja.extend('Fighter', {
        ...
    });
    var b = new Bar();
    alert(b.getClassName()); // -> Alert 'Fighter'
</pre>

<h3>Hash Code</h3>

 - *<code>string</code> classInstance.<code>hashCode</code>()*
<pre>
    var p1 = new Person(false);
    console.log(p1.hashCode()); // -> Get instence Hash Code
</pre>

<h3>equals</h3>

 - *<code>boolean</code> classInstance.<code>equals</code>(<code>Class ClassInstance</code>)*

Check's instances Hash Codes and Class Names.
<pre>
    var p1 = new Person(false);
    var p2 = Person.newInstance(false);
    console.log(p1.equals(p2)); // -> true
</pre>

<h3>To string</h3>

 - *<code>string</code> classInstance.<code>toString</code>()*
<pre>
    var p1 = new Person(false);
    console.log(p1.toString()); // -> String representation
</pre>

<h3>Callbacks</h3>

<pre>
    Class.extend('Ninja', {
        __onExtend: function() {
            alert('Extending Ninja class!');
        }
    });
    Ninja.extend('Fighter', {
        ...
    });
    var f = new Fighter(); // -> Alert 'Extending Ninja class!'
</pre>

<h3>Check if Class exists</h3>

 - *<code>boolean</code> Class.<code>classExists</code>(<code>string ClassName</code>)*
<pre>
    Class.extend('Ninja', {
        ...
    });
    Class.classExists('Ninja') && !Class.classExists('Dog'); // -> TRUE
</pre>

<h3>Prefix extended class</h3>

<pre>
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
</pre>

<h3>Get Class from Class Name</h3>

 - *<code>Class</code> Class.<code>getClass</code>(<code>string ClassName</code>);*
<pre>
    Class.extend('Person', {
        ...
    });
    var p = Class.getClass('Person');
    // p === Person
</pre>

<h3>Constants</h3>

<pre>
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
</pre>

<h3>Protected methods and variables</h3>

<pre>
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
</pre>

<h3>Properties</h3>

 - *<code>object</code> <code>__properties</code>*
 - *<code>object</code> <code>property</code>*
 - *<code>object</code> <code>prop</code>*

Link: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
<pre>
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
</pre>

<h3>Fluent Interface</h3>

 - *<code>boolean</code> <code>__fluent</code>*

If <code>__fluent</code> is <code>TRUE</code>, then the methods that return <code>undefined</code>, <code>this</code> instance will return.
<pre>
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
</pre>

<h3>Class ID</h3>

 - *<code>string</code> classInstance.<code>__instanceId</code>()*

Get Instance ID.
<pre>
    Class.extend('Foo', {
        ...
    });

    console.log(
        Foo.__classId
    );
</pre>

<h3>Instance ID</h3>

 - *<code>string</code> classInstance.<code>__instanceId</code>()*

Get Instance ID.
<pre>
    Class.extend('Foo', {
        ...
    });

    var f1 = new Foo();
    var f2 = new Foo();

    console.log(
        f1.__instanceId,
        f2.__instanceId
    );
</pre>

<h3>Instances Count</h3>

 - *<code>string</code> ClassName.<code>__instanceCount</code>()*

Get created objects count.
<pre>
    Class.extend('Foo', {
        ...
    });

    console.log(Foo.__instanceCount); // -> 0
    Foo.__instanceCount = 111;
    console.log(Foo.__instanceCount); // -> 0

    var f1 = new Foo();
    var f2 = new Foo();
    console.log(Foo.__instanceCount); // -> 2
</pre>

<h3>package</h3>

 - *<code>object</code> classInstance.<code>__package</code>*

<pre>
    var foo = { };

    Class.extend('Cls', {
        __package : foo,
        ...
    });

    var c = new foo.Cls();
</pre>

<pre>
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
</pre>

<h3>Packager</h3>

 - *Class.<code>package</code>(<code>packageObject</code>, <code>packagerFunction(packageObject)</code>)*

<pre>
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
</pre>

<h3>Exception</h3>

- *Class.<code>Exception</code>(<code>message</code>, <code>innerException</code>)*

<pre>
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
</pre>