(function () {
    function traverse(o,func) {
        for (var i in o) {
            if(o.hasOwnProperty(i)){
                if (o[i] !== null && typeof(o[i]) == "object") {
                    //going one step down in the object tree!!
                    traverse(o[i], func);
                }
                func.apply(this, [o, i, o[i]]);
            }
        }
    }

    var DeepProxy = function (obj, callback) {
        if(obj !== Object(obj) || obj.isDeepProxy) return obj;

        console.debug("DeepInit of: ",obj);
        traverse(obj, function (o, key, val) {
            o[key] = DeepProxy(val, callback)
        });

        var handlers = {
            set: function (innerObj, innerKey, innerValue) {
                //console.debug("Called inner set with: ", innerKey, innerValue);
                if(innerValue === Object(innerValue) && !innerValue.isDeepProxy)
                    innerValue = DeepProxy(innerValue, callback);

                innerObj[innerKey] = innerValue;
                callback();
                return true
            }
        };

        obj.isDeepProxy = true;

        return new Proxy(obj, handlers);
    };

    var dotCache = {};

    var handlers = {
        set: function (storage, key, value) {
            console.debug("Called set with: ", key, value);
            var clone = JSON.parse(JSON.stringify(value));
            delete clone.isDeepProxy;
            storage.setItem(key, JSON.stringify(clone));
            dotCache[key] = DeepProxy(value, function () {
                handlers.set(storage, key, value);
            });
            return true
        },

        get: function(storage, key){
            console.debug("Called get with: ", key);

            if(dotCache.hasOwnProperty(key)){
                console.debug("Found in cache...");
                return dotCache[key]
            }else {
                console.debug("Loading from local Storage...");
                obj = JSON.parse(storage.getItem(key));
                obj.isDeepProxy = false;
                if(obj != null) {
                    dotCache[key] = DeepProxy(obj, function () {
                        handlers.set(storage, key, obj);
                    });
                }
                return dotCache[key];
            }
        },

        has: function(storage, key) {
            console.debug("Called has with: ", key);
            return storage.key != null
        },

        defineProperty: function(storage, key, value) {
            console.debug("Called defineProperty with: ", key, value);
            storage.setItem(key, JSON.stringify(value))
        }
    };

    window.dotStorage = new Proxy(window.localStorage, handlers);
}());



