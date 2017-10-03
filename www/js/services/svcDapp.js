angular.module('leth.services')
.service('DappService', function ($rootScope, $http, $q, $timeout, 
                                $ionicPopup, $ionicPlatform, $ionicLoading, $ionicSideMenuDelegate, $ionicSlideBoxDelegate, $ionicScrollDelegate,
                                $cordovaBarcodeScanner,
                                StoreEndpoint, AppService, Chat, ENSService, ExchangeService, 
                                Friends, nfcService, SwarmService, Geolocation) {
  return{
    sendMessage: function(id,sender,message){
    	var payload = {from: sender, text: message};
    	Chat.sendDappMessage(payload,id);
    },
    popupConfirm: function(txtTitle, txtTemplate){
      var q = $q.defer();
      
      var confirmPopup = $ionicPopup.confirm({
        title: txtTitle,
        template: txtTemplate
      });

      confirmPopup.then(function(res) {
        if(res)
          q.resolve(res);
        else
          q.reject(res);
       });
      
      return q.promise;
    },
    popupPrompt: function(txtTitle, txtSubtitle, inputType, inputPlaceholder){
      var q = $q.defer();
    
      var promptPopup = $ionicPopup.prompt({
        title: txtTitle,
        subTitle: txtSubtitle,
        inputType: inputType,
        inputPlaceholder: inputPlaceholder
      });

      promptPopup.then(function(res,err) {
        if(res)
            q.resolve(res);
        else
            q.reject(err);
       });
      
      return q.promise;
    },
    popupAlert: function(txtTitle, txtTemplate){
      var q = $q.defer();
      
      var alertPopup = $ionicPopup.alert({
        title: txtTitle,
        template: txtTemplate
      });

      alertPopup.then(function(res) {
        if(res)
          q.resolve(res);
        else
          q.reject(res);
       });
      
      return q.promise;
    },
    nextSlide: function() {
      $ionicSlideBoxDelegate.next();
    },
    prevSlide: function() {
      $ionicSlideBoxDelegate.previous();
    },
    toggleLeft: function() {
      $ionicSideMenuDelegate.toggleLeft();
    },
    toggleRight: function() {
      $ionicSideMenuDelegate.toggleRight();
    }

  }
})