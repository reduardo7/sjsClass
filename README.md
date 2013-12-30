sjsClass
========

Simple JavaScript Class

Features
--------

1. Extend class.
 - *Class.extend(<code>string ClassName</code>, <code>object definition</code>);*
 - *Class.extend(<code>string ClassName</code>);*
 - *<code>var ClassName2</code> = Class.extend(<code>string ClassName</code>, <code>object definition</code>);*
 - *<code>var ClassName2</code> = Class.extend(<code>string ClassName</code>);*
 - *<code>var ClassName</code> = Class.extend(<code>object definition</code>);*
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

2. Static methods and variables.
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

3. Declare into context.
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

4. Access static methods and variables from instance.
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

5. Constructor.
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

6. Call parent methods.
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

7. Call parent static.
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

8. Check if has value or method.
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

9. Get Class name.
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

10. Hash Code.
 - *<code>string</code> classInstance.<code>hashCode</code>()*
<pre>
    var p1 = new Person(false);
    console.log(p1.hashCode()); // -> Get instence Hash Code
</pre>

11. Equals (check's instances Hash Codes and Class Names).
 - *<code>boolean</code> classInstance.<code>equals</code>(<code>Class ClassInstance</code>)*
<pre>
    var p1 = new Person(false);
    var p2 = Person.newInstance(false);
    console.log(p1.equals(p2)); // -> true
</pre>

12. To string.
 - *<code>string</code> classInstance.<code>toString</code>()*
<pre>
    var p1 = new Person(false);
    console.log(p1.toString()); // -> String representation
</pre>

13. Callbacks.
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

14. Check if Class exists.
 - *<code>boolean</code> Class.<code>classExists</code>(<code>string ClassName</code>)*
<pre>
    Class.extend('Ninja', {
        ...
    });
    Class.classExists('Ninja') && !Class.classExists('Dog'); // -> TRUE
</pre>

15. Prefix extended class.
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

16. Get Class from Class Name.
 - *<code>Class</code> Class.<code>getClass</code>(<code>string ClassName</code>);*
<pre>
    Class.extend('Person', {
        ...
    });
    var p = Class.getClass('Person');
    // p === Person
</pre>

17. Constants
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

18. Protected methods and variables
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

19. Properties

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

20. Fluent Interface

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

21. Instance ID
 - *<code>string</code> classInstance.<code>__instanceId</code>()*

Get Instance ID.
<pre>
    Class.extend('Foo', {
        ...
    });
    
    var f1 = new Foo();
    var f2 = new Foo();
    
    console.log(
        f1.__instanceId, // -> Foo:0
        f2.__instanceId  // -> Foo:1
    );
</pre>

22. Instances Count
 - *<code>string</code> ClassName.<code>__instanceCount</code>()*

Get Instance ID.
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
