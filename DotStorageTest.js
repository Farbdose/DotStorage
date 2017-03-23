// Note: actual ability to preserve saved values persistently is not tested

// Test simple strings via dot
dotStorage.Hello = "World";
console.assert(dotStorage.Hello == "World");

// Test simple strings via bracket
dotStorage["Hello"] = "World";
console.assert(dotStorage["Hello"] == "World");

// Test simple objects
dotStorage.simpleObj = {
    "Hello": "World"
};
console.assert(dotStorage.simpleObj.Hello == "World");

// Test array of primitives
input = [1, 2, 3];
dotStorage.arrayTest = input;
dotStorage.arrayTest.forEach(function (e, i) {
    console.assert(input[i] == e)
});

// Test array of objects
dotStorage.complexArrayTest = [
    {"Hello": "World0", "index": 0, "more":[{"Hello0":"World3"}]},
    {"Hello": "World1", "index": 1, "more":[{"Hello1":"World4"}]},
    {"Hello": "World2", "index": 2, "more":[{"Hello2":"World5"}]}
];
dotStorage.complexArrayTest.forEach(function (e, i) {
    console.assert(e.Hello == "World" + i, [e,i]);
    console.assert(e.index == i, [e,i])
});

// Test DeepProxy (changes to nested attributes are expected to be save in the localStorage too)
var myObj = {"New": "pre"};
dotStorage.refTest = myObj;
myObj = dotStorage.refTest;

myObj.New = {"nested": {"post": [0, 1]}};
console.assert(myObj.New.nested.post.length == 2);

myObj.New.nested = 2;
console.assert(myObj.New.nested == 2, myObj.New.nested);


// stresstest
var randomJSON = [
    {
        "_id": "58d2c025a17fd30495034a78",
        "index": 0,
        "guid": "74a90953-ad1c-449b-b368-684bd0e04367",
        "isActive": false,
        "balance": "$1,821.13",
        "picture": "http://placehold.it/32x32",
        "age": 33,
        "eyeColor": "blue",
        "name": {
            "first": "Anne",
            "last": "Allen"
        },
        "company": "BRAINQUIL",
        "email": "anne.allen@brainquil.me",
        "phone": "+1 (920) 423-2627",
        "address": "418 Apollo Street, Staples, South Dakota, 3939",
        "about": "Ut enim voluptate id reprehenderit culpa esse esse proident in anim mollit mollit. Non tempor fugiat sit occaecat id. Fugiat cupidatat pariatur ad occaecat incididunt elit officia laborum eiusmod et et. Proident aute dolore aute ea est duis consectetur laborum cupidatat nisi eu non consequat. Anim dolor enim enim ex aliquip aliqua tempor aliqua exercitation magna consequat eu esse. Ipsum eiusmod ea commodo ad deserunt fugiat veniam dolor nostrud sunt ea reprehenderit Lorem.",
        "registered": "Tuesday, November 25, 2014 10:41 PM",
        "latitude": "80.574771",
        "longitude": "-124.38966",
        "tags": [
            "proident",
            "esse",
            "officia",
            "Lorem",
            "veniam"
        ],
        "range": [
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9
        ],
        "friends": [
            {
                "id": 0,
                "name": "Odonnell Sykes"
            },
            {
                "id": 1,
                "name": "Janine Mcgee"
            },
            {
                "id": 2,
                "name": "Mccormick Roberts"
            }
        ],
        "greeting": "Hello, Anne! You have 5 unread messages.",
        "favoriteFruit": "apple"
    }
];

var arr = [];
for(var i=0; i<1000; i++){
    arr.push(randomJSON)
}

dotStorage.StressTest = arr;
console.log(dotStorage.StressTest);