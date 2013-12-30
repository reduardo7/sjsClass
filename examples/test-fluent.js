Class.extend('Foo', {
    __fluent : true, // Enable Fluent Interface
    __static : {
        x : '',
        add : function (x) { this.x += x; }, // Not returns a value, use Fluent Interface
        bar : function () { return this.x; } // Returns a value, not Fluent Interface
    },
    'protected x' : '',
    add : function (x) { this.x += x; }, // Not returns a value, use Fluent Interface
    bar : function () { return this.x; } // Returns a value, not Fluent Interface
});

var f = new Foo();

f.add('1').add('2').add('LM');
Foo.add('3').add('4').add('VE');

// Should all be true
(f.bar() === '12LM') && (Foo.bar() === '34VE') &&
    (f.x === undefined) && (Foo.x === Foo.bar());
