Keychain Plugin for Apache Cordova
=====================================
created by Shazron Abdullah

[Apache 2.0 License](http://www.apache.org/licenses/LICENSE-2.0.html) except for the SFHFKeychainUtils code that is under **src/ios/SFHFKeychainUtils**

Follows the [Cordova Plugin spec](http://cordova.apache.org/docs/en/3.0.0/plugin_ref_spec.md), so that it works with [Plugman](https://github.com/apache/cordova-plugman), or you can install it manually below.
 
Manually importing the plugin is not supported anymore, please use [Plugman](http://npmjs.org/plugman)     or the [Cordova CLI tool](http://npmjs.org/cordova)    

The "Keychain" object definition is installed globally. 

The plugin's JavaScript functions are called after creating the plugin object thus:
 
        var kc = new Keychain();
        kc.getForKey(win, fail, "some_key", "some_servicename");

### iCloud keychain enabled

iCloud keychain synchonizing is enabled, so the keychain will be mirrored across all devices *if* the user is signed in to iCloud (Settings > iCloud) and has iCloud keychain turned on (Settings > iCloud > Keychain)

### Usage
        
**Important:**

```js
If you are saving a JSON string value in setForKey, for example after applying JSON.stringify on an object, you must escape the characters in that string, if not you cannot retrieve it using getForKey.        

var obj = { foo: 'bar' };
var value = JSON.stringify(obj);
value = value 
      .replace(/[\\]/g, '\\\\')
      .replace(/[\"]/g, '\\\"')
      .replace(/[\/]/g, '\\/')
      .replace(/[\b]/g, '\\b')
      .replace(/[\f]/g, '\\f')
      .replace(/[\n]/g, '\\n')
      .replace(/[\r]/g, '\\r')
      .replace(/[\t]/g, '\\t');
```

              
See the **example** folder for example usage.

```js
// Get a reference to the plugin first
var kc = new Keychain();

/*
 Retrieves a value for a key and servicename.
 
 @param successCallback returns the value as the argument to the callback when successful
 @param failureCallback returns the error string as the argument to the callback, for a failure
 @param key the key to retrieve
 @param servicename the servicename to use
 */
kc.getForKey(successCallback, failureCallback, 'key', 'servicename');

/*
 Sets a value for a key and servicename.
 
 @param successCallback returns when successful
 @param failureCallback returns the error string as the argument to the callback, for a failure
 @param key the key to set
 @param servicename the servicename to use
 @param value the value to set
 */
kc.setForKey(successCallback, failureCallback, 'key', 'servicename', 'value');

/*
 Removes a value for a key and servicename.
 
 @param successCallback returns when successful
 @param failureCallback returns the error string as the argument to the callback
 @param key the key to remove
 @param servicename the servicename to use
 */
kc.removeForKey(successCallback, failureCallback, 'key', 'servicename');
```
