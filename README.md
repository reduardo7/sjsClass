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
        ...
    });

    alert(Person.testStatic());
    alert(Person.staticVar);
    alert(Person.count);
</pre>

3. Declare into context.
<pre>
    // Web Page
    (function(context) {
        ...
    })(window);

    Class.extend(...
</pre>
<pre>
    var contextName = {};
    (function(context) {
        ...
    })(contextName);

    contextName.Class.extend(...
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
    });

    var p = Class.getClass('Person');

    // p === Person
</pre>

Example Code
------------

### Declare

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
        __constructor: function(isDancing) {
            this.dancing = isDancing;
            console.log(this.getClassName(), 'has "dance" method?', this.hasMethod('dance'));
            console.log(this.getClassName(), 'has "dancing" value?', this.hasVar('dancing'));
            console.log('Person number', ++Person.count);
        },
        dance: function() {
            console.log('dance', this.getClassName(), this.dancing);
        }
    });

    var Grew = Person.extend(/*Dynamic Class Name*/{
        __static: {
            // Static methods
            testStatic: function() {
                return this.__super() && this.__parent.testStatic();
            }
        },
        __constructor: function() {
            this.__super(this.__static.staticVar);
            // or this.dancing = false;
        }
    });

    Grew.extend('Ninja', {
        dance: function() {
            // Call the inherited version of dance()
            this.__super(); // => dance Ninja false
            this.__parent.dance(); // => dance Person undefined
        },
        swingSword: function() {
            console.log('swingSword');
        }
    });
</pre>

### Instance

<pre>
    var p = Person.newInstance(false);
    p.dance(); // => true

    var g = new Grew();

    var n = new Ninja();
    n.dance(); // => false
    n.swingSword(); // => true
</pre>

### Should all be true

<pre>
    Person.testStatic() && Grew.testStatic() && Ninja.testStatic() &&
    p instanceof Person && p instanceof Class && !(p instanceof Grew) &&
    g instanceof Grew && g instanceof Person && g instanceof Class &&
    n instanceof Ninja && n instanceof Person && n instanceof Class
</pre>
