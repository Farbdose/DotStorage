dotStorage.stringTest = {
    "Hello": "World"
};
console.assert(dotStorage.stringTest.Hello == "World");

input = [1,2,3];
dotStorage.arrayTest = input;
dotStorage.arrayTest.forEach(function(i,e){console.assert(input[i]==e)});

dotStorage.complexArrayTest = [
    {"Hello": "World", "index": 0},
    {"Hello": "World2", "index": 1},
    {"Hello": "World3", "index": 2}
];
dotStorage.complexArrayTest.forEach(function(i,e){
    console.assert(e.Hello == "World"+i);
    console.assert(e.index == i)
});

var myObj = {"New": "object"};
dotStorage.refTest = myObj;
myObj = dotStorage.refTest;

myObj.New = {"nested": { "otherObject": [0,1] }};
console.assert(myObj.New.nested.otherObject.length == 2);

myObj.New.nested = 2;
console.assert(myObj.New.nested == 2);