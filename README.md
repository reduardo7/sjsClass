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
