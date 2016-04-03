/*
PRE-REQUISITE: Install the Keychain plugin using the Cordova cli or plugman
*/

function onBodyLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
}

/* When this function is called, PhoneGap has been initialized and is ready to roll */

function onDeviceReady() {
    try {

        // do your thing!
    } catch (e) {
        debug.error(e);
    }
}

function onGet() {
    var kc = new Keychain();

    var key = document.getElementById("keytoget").value;
    var servicename = document.getElementById("servicename").value

    var win = function(value) {
            alert("GET SUCCESS - Key: " + key + " Value: " + value);
        };
    var fail = function(error) {
            alert("GET FAIL - Key: " + key + " Error: " + error);
        };

    kc.getForKey(win, fail, key, servicename);
}

function onSet() {
    var kc = new Keychain();

    var key = document.getElementById("keytoset").value;
    var value = document.getElementById("valuetoset").value;
    var servicename = document.getElementById("servicename").value;

    var win = function() {
            alert("SET SUCCESS - Key: " + key);
        };
    var fail = function(error) {
            alert("SET FAIL - Key: " + key + " Error: " + error);
        };

    kc.setForKey(win, fail, key, servicename, value);
}

function onRemove() {
    var kc = new Keychain();

    var key = document.getElementById("keytoremove").value;
    var servicename = document.getElementById("servicename").value

    var win = function() {
            alert("REMOVE SUCCESS - Key: " + key);
        };
    var fail = function(error) {
            alert("REMOVE FAIL - Key: " + key + " Error: " + error);
        };

    kc.removeForKey(win, fail, key, servicename);
}
