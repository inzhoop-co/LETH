angular.module('leth.controllers')
  .controller('WalletCtrl', function ($scope, $stateParams, $ionicLoading, $ionicModal, $state, 
                                      $ionicPopup, $cordovaBarcodeScanner, $ionicSlideBoxDelegate, $ionicActionSheet, 
                                      $timeout, $cordovaEmailComposer, $cordovaClipboard, $cordovaSms,
                                      AppService, Transactions,ExchangeService, Chat) {
    var TrueException = {};
    var FalseException = {};

    $scope.size = 250;
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

    var setCoin = function(index){
      if(index==0){
        $scope.idCoin = 0;
        $scope.logoCoin = "img/ethereum-icon.png";
        $scope.descCoin = "Eth from main wallet";
        $scope.symbolCoin = "Ξ";
        $scope.xCoin = "XETH";        
        $scope.balance = AppService.balance();
        $scope.listUnit = [
    			{multiplier: "1.0e18", unitName: "Ether"},
    			{multiplier: "1.0e15", unitName: "Finney"},
    			{multiplier: "1",unitName: "Wei"}
    		];
        $scope.unit = $scope.listUnit[0].multiplier;
      }
      else {
      	$scope.getNetwork();
    		var activeCoins=$scope.listCoins.filter( function(obj) {return obj.Network==$scope.nameNetwork;} );
        $scope.idCoin = index;
        $scope.logoCoin = activeCoins[index-1].Logo;
        $scope.descCoin = activeCoins[index-1].Abstract;
        $scope.symbolCoin = activeCoins[index-1].Symbol;
        $scope.xCoin = activeCoins[index-1].Exchange;          
        $scope.methodSend = activeCoins[index-1].Send;
        $scope.contractCoin = web3.eth.contract(activeCoins[index-1].ABI).at(activeCoins[index-1].Address);
        $scope.balance = $scope.contractCoin.balanceOf('0x' + $scope.account)*1;
    		$scope.listUnit = activeCoins[index-1].Units;
        $scope.unit = $scope.listUnit[0].multiplier;
      }
      
      updateExchange();
    }

    var updateExchange = function(){
      if($scope.xCoin){
        ExchangeService.getTicker($scope.xCoin, JSON.parse(localStorage.BaseCurrency).value).then(function(value){
          $scope.balanceExc = JSON.parse(localStorage.BaseCurrency).symbol + " " + parseFloat((value * $scope.balance).toFixed(2)) ;
        });
      }else{
        $scope.balanceExc = JSON.parse(localStorage.BaseCurrency).symbol + " " + parseFloat((0).toFixed(2)) ;
      }
    };

    $scope.$on('$ionicView.enter', function() {
      $scope.balance = AppService.balance();      
      updateExchange();
    })

    //set Eth for default
    setCoin(0);

    $scope.fromAddressBook = false;

    if($stateParams.addr){
      //xxxx#yyy
      var addresses = $stateParams.addr.split('#');
      var coins = $stateParams.addr.split('@').length>1 ? $stateParams.addr.split('@')[1] : "";
      var addr = addresses[0];
      var idkey = addresses.length > 1 ? addresses[1].split('@')[0] : "";
      $scope.addrTo = addr;
      $scope.addrKey = idkey;
      $scope.amountTo = parseFloat(coins);
      $scope.fromAddressBook = true;
    }else { 
      $scope.fromAddressBook = false;
    }

    $scope.listTransaction = function(){
      $state.go('app.transactions');
    }

    $scope.sendCoins = function (addr, amount, unit, idCoin) {
      if( $scope.idCoin!=0){
        AppService.transferCoin($scope.contractCoin, $scope.methodSend, $scope.account, addr, amount).then(
          function (result) {
            if (result[0] != undefined) {
              var errorPopup = $ionicPopup.alert({
                title: 'Error',
                template: result[0]
              });
              errorPopup.then(function (res) {
                console.log(res);
              });
            } else {
              var successPopup = $ionicPopup.alert({
                title: 'Transaction sent',
                template: result[1]
              });
              successPopup.then(function (res) {
                $scope.amountTo = "";
                $state.go('app.transactions');
              });
              //save transaction
              var newT = {from: $scope.account, to: addr, id: result[1], value: amount, unit: unit, symbol: $scope.symbolCoin, time: new Date().getTime()};
              $scope.transactions = Transactions.add(newT);
              Chat.sendTransactionNote(newT);              
              refresh();
            }
          },
          function (err) {
            var alertPopup = $ionicPopup.alert({
              title: 'Error',
              template: err

            });
            alertPopup.then(function (res) {
              console.log(err);
            });
        });

      }
      else{
        var value = parseFloat(amount) * unit;
        AppService.transferEth($scope.account, addr, value, 50000000000, 50000).then(
          function (result) {
            if (result[0] != undefined) {
              var errorPopup = $ionicPopup.alert({
                title: 'Error',
                template: result[0]
              });
              errorPopup.then(function (res) {
                console.log(res);
              });
            } else {
              var successPopup = $ionicPopup.alert({
                title: 'Transaction sent',
                template: result[1]
              });
              successPopup.then(function (res) {
                $scope.amountTo = "";
                $state.go('app.transactions');
              });
              //save transaction
              var newT = {from: $scope.account, to: addr, id: result[1], value: value, unit: unit, symbol: $scope.symbolCoin, time: new Date().getTime()};
              $scope.transactions = Transactions.add(newT);
              Chat.sendTransactionNote(newT);              
              refresh();
            }
          },
          function (err) {
            var alertPopup = $ionicPopup.alert({
              title: 'Error',
              template: err

            });
            alertPopup.then(function (res) {
              console.log(err);
            });
        });
      }//else
    };

    $scope.confirmSend = function (addr, amount,unit) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Confirm payment',
        template: 'Send ' + parseFloat(amount) + " " + document.querySelector('#valuta option:checked').text + " to " + addr + " ?"
      });
      confirmPopup.then(function (res) {
        if (res) {
          $scope.sendCoins(addr, amount,unit);
        } else {
          console.log('send coins aborted');
        }
      });
    };
    
    $scope.checkAddress = function (address) {
      try {
        angular.forEach(this.friends, function(value, key) {
          if(value.addr != address){
            throw TrueException;
          }else {
            throw FalseException;
          }
        })
      }catch (e){
        if(e === TrueException){
          $scope.toAdd = true;
        }else if(e===FalseException) {
          $scope.toAdd = false;
        }
      }
    }

    $scope.clearAddrTo = function(){
      $scope.fromAddressBook = false;
    }

    $scope.chooseCoin = function(){  
		  $scope.getNetwork();
      var buttonsGroup = [{text: '<img width="30px" heigth="30px" src="' + $scope.logoCoin + '"/> Ether [Ξ]'}];

	   var activeCoins=$scope.listCoins.filter( function(obj) {return (obj.Network==$scope.nameNetwork) && (obj.Installed);} );
      for (var i = 0; i < activeCoins.length; i++) {
        var text = {text: '<img width="30px" heigth="30px" src="' + activeCoins[i].Logo + '"/> ' + activeCoins[i].Name + " [" + activeCoins[i].Symbol + "]"};
        buttonsGroup.push(text);
      }

      var hideSheet = $ionicActionSheet.show({
        buttons: buttonsGroup,
        destructiveText: (ionic.Platform.isAndroid()?'<i class="icon ion-android-exit assertive"></i> ':'')+'Cancel',
        titleText: 'Choose coins to pay with',
        destructiveButtonClicked:  function() {
          hideSheet();
        },
        buttonClicked: function(index) {
          setCoin(index);
          hideSheet();
          $timeout(function() {
           hideSheet();
          }, 20000);
        }
      })
    };

    $scope.onAmountChange = function(amount){
      if($scope.amountPayment == "")
        $scope.qrcodeString = AppService.account() + "#" + AppService.idkey();
      $scope.qrcodeString = AppService.account() + "#" + AppService.idkey() + '@' + amount;
    }

    $scope.showAddress = function () {
      var alertPopup = $ionicPopup.alert({
        title: 'Wallet Address',
        template: $scope.qrcodeString
        //template: "<div class='item text-center'><qr text='" + $scope.qrcodeString + "' type-number='typeNumber' correction-level='correctionLevel' size='300' input-mode='inputMode' image='image'></qr></div>"
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