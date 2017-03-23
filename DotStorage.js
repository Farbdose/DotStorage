(function () {

    /* wrap a given object in a proxy and call callback on any property change
     also do the same for all properties of the given object that are objects themself
     finally when a change is detected and the new value isn't a DeepProxy, wrap it in one */
    var DeepProxy = function DeepProxy(obj, callback) {
        // this is a "system" property needed by DotStorage, delete it in case the user set it
        delete obj.isDeepProxy;

        // return if obj isn't an object or already a DeepProxy (isDeepProxy is returned by get-trap)
        if (typeof(obj) !== "object" || obj.isDeepProxy) return obj;

        var handlers = {
            // handler to intercept property changes
            set: function deepProxySetHandler(innerObj, innerKey, innerValue) {
                // wrap the new value in a DeepProxy
                innerObj[innerKey] = DeepProxy(innerValue, callback);
                callback();
                return true
            },

            // inject isDeepProxy property to prevent recursion
            get: function deepProxyGetHandler (innerObj, key) {
                return key == "isDeepProxy" ? true : innerObj[key]
            }
        };

        // wrap all properties of obj in DeepProxies
        var value, key;
        var keys = Object.keys(obj);
        for (var i = 0; i < keys.length; i++) {
            key = keys[i];
            value = obj[key];

            if (value !== null && typeof(value) === "object" &&  !(obj instanceof DeepProxy)) {
                obj[key] = new DeepProxy(value, callback)
            }
        }

        return new Proxy(obj, handlers);
    };

    // cache results from localStorage so we don't have to wrap everything again in a DeepProxy on access
    var dotCache = {};

    var handlers = {
        // intercept changes to the localStorage
        set: function dotStorageSetHandler(storage, key, value) {
            // save the value in the localStorage
            storage.setItem(key, pako.deflate(JSON.stringify(value), { to: 'string' }));

            dotCache[key] = DeepProxy(value, function dotStorageSetHandlerDeepCallback() {
                handlers.set(storage, key, dotCache[key]);
            });
            return true
        },

        get: function dotStorageGetHandler(storage, key) {
            if (key in Object.keys(dotCache)) {
                // if this key is in the dotCache just return the DeepProxy thats saves there
                return dotCache[key]
            } else {
                // if not try to load it from the lcoalStorage
                var obj = storage.getItem(key);

                // if there was an entry in the localStorage with the given key, add it to the dotCache
                if (obj != null) {
                    obj = JSON.parse(pako.inflate(obj, { to: 'string' }));

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



