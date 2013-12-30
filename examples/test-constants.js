Class.extend('Test', {
	__const : {
		cx : 111
	},
	'const c' : 123,
	foo : function (v) {
		this.c = v;
		return this.c;
	}
});

var t = new Test();
t.c = 6776;
t.cx = 55555;

// Should all be true
(t.c === 123) && (t.foo(534) === 123) && (Test.c === 123) &&
	(t.cx === 111) && (Test.cx === 111);
