# DotStorage
Wrapper for localStorage to add full dot support

## Usage
Set primitive values:
```javascript
dotStorage.Hello = "World";
```

Set objects:
```javascript
dotStorage.simpleObj = {
    "Hello": "World"
};
``` 

Set complex arrays and access them again:
```javascript
dotStorage.complexArray = [
    {"Hello": "World0", "index": 0},
    {"Hello": "World1", "index": 1},
    {"Hello": "World2", "index": 2}
];

dotStorage.complexArray.forEach(function (e, i) {
    console.log(e.Hello, e.index);
});
```

Save an object, modify nested properties and be surprised that DotStorage saves these changes too
```javascript
var myObj = {"New": "object"};
dotStorage.refTest = myObj;
myObj = dotStorage.refTest;

myObj.New = {"nested": {"otherObject": [0, 1]}};
console.log(JSON.stringify(dotStorage.refTest.New));

myObj.New.nested = 2;
console.log(JSON.stringify(dotStorage.refTest.New));
```
