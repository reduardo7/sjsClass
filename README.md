sjsClass
========

Simple JavaScript Class

Features
--------

1. Static methods and variables.
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
</pre>

2. Declare into context.
<pre>
    (function(context) {
        ...
    })(window);
</pre>
<pre>
    var contextName = {};
    (function(context) {
        ...
    })(contextName);
</pre>
3. Access static methods and variables from instance.
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
4. Constructor.
<pre>
    Class.extend('Person', {
        __construct: function(var1, var2, varN) {
            ...
        }
    });

    var p1 = new Person(22, 13, 16);
    var p2 = Person.newInstance(22, 13, 16);
    
    // p1 == p2
</pre>
5. Call parent methods.
<pre>
    Person.extend('Ninja', {
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
6. Call parent static.
<pre>
    Person.extend('Ninja', {
        dance: function() {
            this.__parent.testStatic();
            ...
        }
    });
</pre>
7. Check if has value or method.
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
8. Get Class name.
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
9. Extend class.
<pre>
    Person.extend('newClassName', {
        ...
    });
</pre>
<pre>
    var newClassName = Person.extend({
        ...
    });
</pre>
10. Hash Code.
<pre>
    var p1 = new Person(false);
    console.log(p1.hashCode()); // -> Get Hash Code
</pre>
11. Equals.
<pre>
    var p1 = new Person(false);
    var p2 = Person.newInstance(false);
    
    console.log(p1.equals(p2)); // -> true
</pre>
12. toString
<pre>
    var p1 = new Person(false);
    console.log(p1.toString()); // -> String representation
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
