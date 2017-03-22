(function () {
    /* traverse object tree from given object and call func on all non primitive properties*/
    function traverseNonPrimitives(o, func) {
        var value, key;
        var keys = Object.keys(o);
        for (var i = 0; i < keys.length; i++) {
            key = keys[i];
            value = o[i];
            if (value !== null && typeof(value) == "object") {
                //going one step down in the object tree!!
                traverseNonPrimitives(value, func);
                func.apply(this, [o, i, value]);
            }

        }
    }

    /* wrap a given object in a proxy and call callback on any property change
     also do the same for all properties of the given object that are objects themself
     finally when a change is detected and the new value isn't a DeepProxy, wrap it in one */
    var DeepProxy = function DeepProxy(obj, callback) {
        // return if obj isn't an object or already a DeepProxy
        if (typeof(obj) !== "object" || obj.isDeepProxy) return obj;

        // mark this object as a DeepProxy
        Object.defineProperty(obj, "isDeepProxy", {
            enumerable: false,
            writable: true
        });
        obj.isDeepProxy = true;

        // wrap all properties of obj in DeepProxies
        traverseNonPrimitives(obj, function TraverseCallback(o, key, val) {
            o[key] = DeepProxy(val, callback)
        });

        // set handler to intercept property changes
        var handlers = {
            set: function deepProxySetHandler(innerObj, innerKey, innerValue) {
                // wrap the new value in a DeepProxy
                innerObj[innerKey] = DeepProxy(innerValue, callback);
                callback();
                return true
            }
        };

        return new Proxy(obj, handlers);
    };

    // cache results from localStorage so we don't have to wrap everything again in a DeepProxy on access
    var dotCache = {};

    var handlers = {
        // intercept changes to the localStorage
        set: function dotStorageSetHandler(storage, key, value) {
            // save the value in the localStorage
            storage.setItem(key,  LZString.compress(JSON.stringify(value)));

            // update the dotCache
            dotCache[key] = DeepProxy(value, function dotStorageSetHandlerDeepCallback() {
                handlers.set(storage, key, value);
            });
            return true
        },

        get: function dotStorageGetHandler(storage, key) {
            if (dotCache.hasOwnProperty(key)) {
                // if this key is in the dotCache just return the DeepProxy thats saves there
                return dotCache[key]
            } else {
                // if not try to load it from the lcoalStorage
                obj = storage.getItem(key);

                // if there was an entry in the localStorage with the given key, add it to the dotCache
                if (obj != null) {
                    obj = JSON.parse(LZString.decompress(obj));
                    // flag the new object as not a DeepProxy (just to be sure)
                    obj.isDeepProxy = false;
                    dotCache[key] = DeepProxy(obj, function dotStorageGetHandlerDeepCallback() {
                        handlers.set(storage, key, obj);
                    });
                }

                // return the value of the dotCache with the given key, is undefined if the key wasn't in the localStorage
                return dotCache[key];
            }
        },

        // implement has function as localStorage contains non null value with this key
        has: function dotStorageHasHandler(storage, key) {
            return storage[key] != null
        }
    };

    // publish the created DotStorage
    window.dotStorage = new Proxy(window.localStorage, handlers);
}());



