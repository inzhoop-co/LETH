angular.module('leth.services')
.service('DappService', function ($rootScope, $http, $q, $timeout, 
                                $ionicPopup, $ionicPlatform, $ionicLoading, $ionicScrollDelegate,
                                $cordovaBarcodeScanner,
                                StoreEndpoint, AppService, Chat, ENSService, ExchangeService, 
                                Friends, nfcService, SwarmService, Geolocation) {
  return{
    sendMessage: function(id,sender,message){
    	var payload = {from: sender, text: message};
    	Chat.sendDappMessage(payload,id);
    }
  }
})