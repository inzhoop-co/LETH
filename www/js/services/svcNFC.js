angular.module('leth.services')
.factory('nfcService', function ($rootScope, $ionicPlatform) {
    var tagNFC = {};

    document.addEventListener("deviceready", function () {
        nfc.addNdefListener(function (nfcEvent) {
            console.log(JSON.stringify(nfcEvent.tag, null, 4));
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

    return {
        tagNFC: tagNFC,

        clearTag: function () {
            angular.copy({}, this.tagNFC);
        }
    };
})
