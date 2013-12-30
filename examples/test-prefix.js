Class.extend('Test', {
    __prefix: 'Tst'
});

TstTest.extend('T2');

TstT2.extend('T3', {
    __prefix: null
});

var t = new TstTest(),
    t2 = new TstT2(),
    t3 = new T3();

// Should all be true
(this.Test === undefined) && (this.T2 === undefined) && (this.TstT3 === undefined) &&
    (t instanceof Class) && (t2 instanceof TstTest) &&
    (t3 instanceof TstT2) && (t3 instanceof TstTest);
