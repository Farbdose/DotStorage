(function () {
    /* traverse object tree from given object and call func on all properties
     found here: http://stackoverflow.com/a/722732/2422125 */
    function traverse(o, func) {
        for (var i in o) {
            if (o.hasOwnProperty(i)) {
                if (o[i] !== null && typeof(o[i]) == "object") {
                    //going one step down in the object tree!!
                    traverse(o[i], func);
                }
                func.apply(this, [o, i, o[i]]);
            }
        }
    }

    /* wrap a given object in a proxy and call callback on any property change
     also do the same for all properties of the given object that are objects themself
     finally when a change is detected and the new value isn't a DeepProxy, wrap it in one */
    var DeepProxy = function (obj, callback) {
        // return if obj isn't an object or already a DeepProxy
        if (obj !== Object(obj) || obj.isDeepProxy) return obj;

        // wrap all properties of obj in DeepProxies
        traverse(obj, function (o, key, val) {
            o[key] = DeepProxy(val, callback)
        });

        // set handler to intercept property changes
        var handlers = {
            set: function (innerObj, innerKey, innerValue) {
                // wrap the new value in a DeepProxy
                innerObj[innerKey] = DeepProxy(innerValue, callback);
                callback();
                return true
            }
        };

        // mark this object as a DeepProxy
        obj.isDeepProxy = true;

        return new Proxy(obj, handlers);
    };

    // cache results from localStorage so we don't have to wrap everything again in a DeepProxy on access
    var dotCache = {};

    var handlers = {
        // intercept changes to the localStorage
        set: function (storage, key, value) {
            // clone the object to remove the DeepProxy marker befor saving it
            var clone = JSON.parse(JSON.stringify(value));
            delete clone.isDeepProxy;

            // save the object in the localStorage
            storage.setItem(key, JSON.stringify(clone));

            // update the dotCache and use the clone to prevent interaction between multiple DeepProxy instances
            dotCache[key] = DeepProxy(clone, function () {
                handlers.set(storage, key, clone);
            });
            return true
        },

        get: function (storage, key) {
            if (dotCache.hasOwnProperty(key)) {
                // if this key is in the dotCache just return the DeepProxy thats saves there
                return dotCache[key]
            } else {
                // if not try to load it from the lcoalStorage
                obj = JSON.parse(storage.getItem(key));

                // if there was an entry in the localStorage with the given key, add it to the dotCache
                if (obj != null) {
                    // flag the new object as not a DeepProxy (just to be sure)
                    obj.isDeepProxy = false;
                    dotCache[key] = DeepProxy(obj, function () {
                        handlers.set(storage, key, obj);
                    });
                }

                // return the value of the dotCache with the given key, is undefined if the key wasn't in the localStorage
                return dotCache[key];
            }
        },

        // implement has function as localStorage contains non null value with this key
        has: function (storage, key) {
            return storage[key] != null
        }
    };

    // public the created DotStorage
    window.dotStorage = new Proxy(window.localStorage, handlers);
}());



