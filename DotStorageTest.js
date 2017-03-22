// Note: actual ability to preserve saved values persistently is not tested

// Test simple strings via dot
dotStorage.Hello = "World";
console.assert(dotStorage.Hello == "World");

// Test simple strings via bracket
dotStorage["Hello"] = "World";
console.assert(dotStorage["Hello"] == "World");

// Test simple objects
dotStorage.stringTest = {
    "Hello": "World"
};
console.assert(dotStorage.stringTest.Hello == "World");

// Test array of primitives
input = [1, 2, 3];
dotStorage.arrayTest = input;
dotStorage.arrayTest.forEach(function (e, i) {
    console.assert(input[i] == e)
});

// Test array of objects
dotStorage.complexArrayTest = [
    {"Hello": "World0", "index": 0},
    {"Hello": "World1", "index": 1},
    {"Hello": "World2", "index": 2}
];
dotStorage.complexArrayTest.forEach(function (e, i) {
    console.assert(e.Hello == "World" + i);
    console.assert(e.index == i)
});

// Test DeepProxy (changes to nested attributes are expected to be save in the localStorage too)
var myObj = {"New": "object"};
dotStorage.refTest = myObj;
myObj = dotStorage.refTest;

myObj.New = {"nested": {"otherObject": [0, 1]}};
console.assert(myObj.New.nested.otherObject.length == 2);

myObj.New.nested = 2;
console.assert(myObj.New.nested == 2);
