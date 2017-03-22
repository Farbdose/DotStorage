(function () {
    var handlers = {
        set: function (storage, key, value) {
            console.debug("Called set with: ", key, value);
            storage.setItem(key, JSON.stringify(value));
            return true
        },

        get: function(storage, key){
            console.debug("Called get with: ", key);

            obj = JSON.parse(storage.getItem(key));
            innerHandler = {
                set: function(innerObj, innerKey, innerValue){
                    console.debug("Called inner set with: ", innerKey, innerValue);
                    innerObj[innerKey] = innerValue;
                    handlers.set(storage, key, innerObj);
                    return true
                }
            };
            return new Proxy(obj, innerHandler);
        },

        has: function(storage, key) {
            console.debug("Called has with: ", key);
            return storage.key != null
        },

        defineProperty: function(storage, key, value) {
            console.debug("Called defineProperty with: ", key, value);
            storage.setItem(key, JSON.stringify(value))
        }
    }

    window.dotStorage = new Proxy(window.localStorage, handlers);
}());


dotStorage.stringTest = {
    "Hello": "World"
};
console.log(dotStorage.test.Hello);

dotStorage.arrayTest = [1,2,3];
dotStorage.arrayTest.forEach(function(e){console.log(e)});

dotStorage.complexArrayTest = [
    {"Hello": "World", "index": 0},
    {"Hello": "World2", "index": 1},
    {"Hello": "World3", "index": 2}
];
dotStorage.complexArrayTest.forEach(function(e){console.log(e.index+": "+e.Hello)});

var myObj = {"New": "object"};
dotStorage.refTest = myObj;
myObj = dotStorage.refTest;
myObj.New = "other object";
console.log(dotStorage.refTest.New);


