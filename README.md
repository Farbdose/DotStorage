# DotStorage
Wrapper for localStorage to add full dot support

## Usage
Set primitive values:
`dotStorage.Hello = "World";`
console.assert(dotStorage.Hello == "World");

Set objects:
`dotStorage.stringTest = {
    "Hello": "World"
};`
console.assert(dotStorage.stringTest.Hello == "World");

// Test array of primitives
input = [1, 2, 3];
dotStorage.arrayTest = input;
dotStorage.arrayTest.forEach(function (e, i) {
    console.assert(input[i] == e)
});

Set complex arrays and access them again:
dotStorage.complexArray = [
    {"Hello": "World0", "index": 0},
    {"Hello": "World1", "index": 1},
    {"Hello": "World2", "index": 2}
];

dotStorage.complexArray.forEach(function (e, i) {
    console.log(e.Hello, e.index);
});

// Save an object, modify nested properties and be surprised that the DotStorage saved these changes too
`var myObj = {"New": "object"};
dotStorage.refTest = myObj;
myObj = dotStorage.refTest;

myObj.New = {"nested": {"otherObject": [0, 1]}};
console.log(JSON.stringify(dotStorage.refTest.New));

myObj.New.nested = 2;
console.log(JSON.stringify(dotStorage.refTest.New));`
`
