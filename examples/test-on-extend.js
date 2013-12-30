var testVar = 1;

Class.extend('Test', {
    __onExtend: function() {
        testVar++;
    }
});

Test.extend('TestExtend');

// Should all be true
testVar === 2;
