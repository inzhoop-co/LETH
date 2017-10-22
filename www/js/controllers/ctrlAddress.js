angular.module('leth.controllers')
  .controller('AddressCtrl', function ($scope, AppService, $ionicModal, $ionicPopup, $cordovaEmailComposer, $cordovaClipboard, $cordovaSms, $cordovaContacts) {
    $scope.size = 200;
    $scope.correctionLevel = 'H';
    $scope.typeNumber = 12;
    $scope.inputMode = '';
    $scope.image = true;
    $scope.filterWalletAddr = 'button button-small button-outline button-dark';
    $scope.filterShhAddr = 'button button-small button-outline button-dark';
      
    $scope.$on('$ionicView.afterEnter', function() {
       $scope.walletAddress();
    })

    $scope.listUnit = [
      {multiplier: "1.0e18", unitName: "Ether"},
      {multiplier: "1.0e15", unitName: "Finney"},
      {multiplier: "1", unitName: "Wei"}
    ];

    $scope.walletAddress = function(){      
      $scope.filterWalletAddr = 'button button-small button button-dark';
      $scope.filterShhAddr = 'button button-small button-outline button-dark';
      $scope.isWalletAddress = true;
      $scope.isShhAddress = false;
      $scope.profileAddress = AppService.account();
      $scope.qrcodeString = $scope.profileAddress;
    }

    $scope.shhAddress = function(){
      $scope.filterWalletAddr = 'button button-small button-outline button-dark';
      $scope.filterShhAddr = 'button button-small button button-dark';
      $scope.isWalletAddress = false;
      $scope.isShhAddress = true;
      $scope.profileAddress = AppService.idkey();
      $scope.qrcodeString = AppService.account() + "#" + AppService.idkey();

    }
    
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
      var content;
      if($scope.isWalletAddress)
        content = "My wallet address is leth://" + $scope.qrcodeString ;
      if($scope.isShhAddress)
        content = "My identity keys for Leth are leth://" + AppService.account() + "#" + AppService.idkey() ;
      
      var phonenumber="";
      if (AppService.isPlatformReady()){
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
      };      
    }

    $scope.shareByShh = function(amount){
      if($scope.isWalletAddress)
        $scope.openFriendsModal(amount);
     if($scope.isShhAddress)
        $scope.openFriendsModal('contact');       
    }

    $scope.shareByEmail = function(){
      var mailSubj = '';
      var mailBody = '';

      if($scope.isWalletAddress){
        mailSubj = 'Payment Request';
        mailBody = '<h3>Please send me ETH to my Wallet Address:</h3> <p><a href="leth://' + $scope.qrcodeString + '"> click to pay from Leth</a></p>';
      }

      if($scope.isShhAddress){
        mailSubj = 'Add me to Friends';
        mailBody = '<h3>Please add me to your Leth friends:</h3> <p><a href="leth://' + $scope.qrcodeString + '"> click to add on Leth</a></p>';
      }

      var imgQrcode = angular.element(document.querySelector('qr > img')).attr('ng-src');
      //I need to remove header of bitestream and replace with the new one
      var allegato = 'base64:qr.png//'+imgQrcode.replace('data:image/png;base64,','');

      if (AppService.isPlatformReady()){
         $cordovaEmailComposer.isAvailable().then(function() {
        
          var emailOpts = {
            to: [''],
            attachments:[allegato],
            subject: mailSubj,
            body: mailBody,
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
      };         
    }

    $scope.copyAddr = function(){
      if (AppService.isPlatformReady()){
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
      };
    }
  })
