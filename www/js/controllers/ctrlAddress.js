angular.module('leth.controllers')
  .controller('AddressCtrl', function ($scope, AppService, $ionicModal, $ionicPopup, $cordovaEmailComposer, $cordovaClipboard, $cordovaSms, $cordovaContacts) {
    $scope.size = 200;
    $scope.correctionLevel = 'H';
    $scope.typeNumber = 12;
    $scope.inputMode = '';
    $scope.image = true;
    $scope.qrcodeString = AppService.account() + "#" + AppService.idkey();
    
    $scope.listUnit = [
      {multiplier: "1.0e18", unitName: "Ether"},
      {multiplier: "1.0e15", unitName: "Finney"},
      {multiplier: "1", unitName: "Wei"}
    ];

    $scope.onAmountChange = function(amount){
      if($scope.amountPayment == "")
        $scope.qrcodeString = AppService.account() + "#" + AppService.idkey();
  
      $scope.qrcodeString = AppService.account() + "#" + AppService.idkey() + '@' + amount;
    }

    $scope.showAddress = function () {
      var alertPopup = $ionicPopup.alert({
        title: 'Wallet Address',
        template: $scope.qrcodeString
      });

      alertPopup.then(function(res) {
        console.log('show address');
      });
    };

    $scope.shareBySms = function() {
      var content = "My address is ethereum://" + $scope.qrcodeString ;
      var phonenumber="";
      document.addEventListener("deviceready", function () {      
        $cordovaContacts.pickContact().then(function (contactPicked) {
          phonenumber = contactPicked.phoneNumbers[0].value;

          var options = {
            replaceLineBreaks: false, // true to replace \n by a new line, false by default
            android: {
                intent: 'INTENT'  // send SMS with the native android SMS messaging
                //intent: '' // send SMS without open any other app
            }
          };

          $cordovaSms
          .send(phonenumber, content, options)
          .then(function() {
            // Success! SMS was sent
            console.log("SMS to " + phonenumber + " with text :" + content + " sent.");
          }, function(error) {
            // An error occurred
            console.log("ERROR sending SMS to " + phonenumber + " with text :" + content + " sent.");
          });

        });
      }, false);      
    }

    $scope.shareByEmail = function(){
      var imgQrcode = angular.element(document.querySelector('qr > img')).attr('ng-src');
      //I need to remove header of bitestream and replace with the new one
      var allegato = 'base64:qr.png//'+imgQrcode.replace('data:image/png;base64,','');
     
      document.addEventListener("deviceready", function () {
        $cordovaEmailComposer.isAvailable().then(function() {
        
          var emailOpts = {
            to: [''],
            attachments:[allegato],
            subject: 'Please Pay me',
            body: '<h3>Please send me ETH to this Wallet Address:</h3> <p><a href="ethereum://' + $scope.qrcodeString + '">ethereum://' + $scope.qrcodeString + '</a></p>',
            isHtml: true
          };

          $cordovaEmailComposer.open(emailOpts).then(null, function () {
            console.log('email view dismissed');
          });

          return;
        }, function (error) {
          console.log("cordovaEmailComposer not available");
          return;
        });
      }, false);         
    }

    $scope.copyAddr = function(){
      document.addEventListener("deviceready", function () {  
        $cordovaClipboard
        .copy($scope.qrcodeString)
        .then(function () {
          // success
          //alert('Address in clipboard');
          var alertPopup = $ionicPopup.alert({
             title: 'Copy Address',
             template: 'Address is in clipboard!'
           });

           alertPopup.then(function(res) {
             console.log('address copied in clipboard');
           });
        }, function () {
          // error
          console.log('Copy error');
        });
      }, false);         
    }
  })
