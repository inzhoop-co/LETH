angular.module('leth.services')
.factory('nfcService', function ($rootScope, $ionicPlatform) {
    var tagNFC = {};

    return {
        tagNFC: tagNFC,

        listen: function(){
            document.addEventListener("deviceready", function () {
                nfc.addNdefListener(function(nfcEvent) {
                    console.log(nfcEvent.tag);
                    $rootScope.$apply(function(){
                        angular.copy(nfcEvent.tag, tagNFC);
                        // if necessary $state.go('some-route')
                    });
                }, function () {
                    console.log("Listening for NDEF Tags.");
                }, function (reason) {
                    console.log("Error adding NFC Listener " + reason);
                });
            }, false)
        },
        clearTag: function () {
            angular.copy({}, this.tagNFC);
        },
        share: function (message) {
            document.addEventListener("deviceready", function () {
                var tag = [
                    ndef.textRecord(message)
                ];
                nfc.share(tag, function (success) {
                    console.log("Ok: " + success);
                }, function (fail) {
                    console.log("Err: " + fail);
                });
            }, false)
        },
        unshare: function () {
            document.addEventListener("deviceready", function () {
                nfc.unshare(function (success) {
                    console.log("Ok: " + success);
                }, function (fail) {
                    console.log("Err: " + fail);
                });
            }, false)
        }

    };
})
