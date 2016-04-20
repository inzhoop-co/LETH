angular.module('leth.controllers', [])
  .controller('AppCtrl', function ($scope, $ionicModal, $ionicPopup, $timeout, $cordovaBarcodeScanner, $state, $ionicActionSheet, $cordovaEmailComposer, $cordovaContacts, AppService, $q, PasswordPopup, Transactions, Friends) {
     window.refresh = function () {
      $scope.balance = AppService.balance();
      $scope.account = AppService.account();
      $scope.qrcodeString = $scope.account;
      $scope.getNetwork();
      $scope.friends = Friends.all();
      //temp
      $scope.transactions = Transactions.all();
      localStorage.Transactions = JSON.stringify($scope.transactions);
     };

    window.customPasswordProvider = function (callback) {
      var pw;
      PasswordPopup.open("Digit your password", "input password of wallet").then(
        function (result) {
          pw = result;
          if (pw != undefined) {
            try {
              callback(null, pw);

            } catch (err) {
              var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: err.message

              });
              alertPopup.then(function (res) {
                console.log(err);
              });
            }
          }
        },
        function (err) {
          pw = "";
        })
     };
  
    var loginModal;
    var codeModal;
    var saveAddressModal;
    var password;
    var code;

    var createLoginModal = function () {
      $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        loginModal = modal;
        loginModal.show();
      });
    };

    var createCodeModal = function() {
      $ionicModal.fromTemplateUrl('templates/changeCode.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        codeModal = modal;
        codeModal.show();
      });
    };

    var createSaveAddressModal = function(address) {
      $ionicModal.fromTemplateUrl('templates/addFriend.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {

        document.addEventListener("deviceready", function () {
          $cordovaContacts.pickContact().then(function (contactPicked) {
            console.log(JSON.stringify(contactPicked));
            $scope.name = contactPicked.name.formatted;

            var options = {
              replaceLineBreaks: false, // true to replace \n by a new line, false by default
              android: {
                  intent: 'INTENT'  // send SMS with the native android SMS messaging
                  //intent: '' // send SMS without open any other app
              }
            };
          });
        }, false);

        if(address != undefined) {
          $scope.addr = address;
        }
          
        saveAddressModal = modal;
          
        saveAddressModal.show();
      });
    };

    /*
    var loadFriends = function(friendsHash){
      angular.forEach(friendsHash, function (key, value) {
        Friends.getFromIpfs(key).then(function (response) {
          Friends.add($scope.friends, response[0], key);
        }, function (err) {
          console.log(err);
        })
      });
    };
    */
    $scope.isValidAddr = function(addr){
      return web3.isAddress(addr);
    }

    $scope.scanTo = function () {
      document.addEventListener("deviceready", function () {      
        $cordovaBarcodeScanner
          .scan()
          .then(function (barcodeData) {
            if(barcodeData.text!= ""){
				      $state.go('app.wallet', {addr: barcodeData.text});
				      console.log('read code: ' + barcodeData.text);
			      }
          }, function (error) {
            // An error occurred
            console.log('Error!' + error);
          });
      }, false);          
    };

    $scope.getNetwork = function(){
      web3.eth.getBlock(0, function(e, res){
        if(!e){
          switch(res.hash) {
            case '0x0cd786a2425d16f152c658316c423e6ce1181e15c3295826d7c9904cba9ce303':
                $scope.nameNetwork = 'Morden';
                $scope.badgeNetwork = 'badge badge-royal';
                break;
            case '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3':
                $scope.nameNetwork = 'Mainet';
                $scope.badgeNetwork = 'badge badge-balanced';
                break;
            default:
                $scope.nameNetwork = 'Private';
                $scope.badgeNetwork = 'badge badge-calm';              
          }
        }
      });
    }

    $scope.sendFeedback = function(){
      // Show the action sheet
      var hideSheet = $ionicActionSheet.show({
        buttons: [
          { text: '<i class="ion-happy-outline"></i> Good' },
          { text: '<i class="ion-sad-outline"></i> Poor'  }
        ],
        destructiveText: (ionic.Platform.isAndroid()?'<i class="icon ion-android-exit assertive"></i> ':'')+'Cancel',
        titleText: 'Send your mood for this app',
        /*cancelText: 'Cancel',
        cancel: function() {
        // add cancel code..
        },*/
        destructiveButtonClicked:  function() {
          hideSheet();
        },
        buttonClicked: function(index) {
            var mood = index == 0 ? "Good" : "Poor";
            $cordovaEmailComposer.isAvailable().then(function() {
              var emailOpts = {
                to: ['info@inzhoop.com'],
                subject: 'Feedback  from LETH',
                body: 'The user ' + $scope.account + ' said: ' +  mood,
                isHtml: true
              };

              $cordovaEmailComposer.open(emailOpts).then(null, function () {
                console.log('email view dismissed');
              });

              hideSheet();
              return;
            }, function (error) {
              console.log("cordovaEmailComposer not available");
              return;
            });
         // For example's sake, hide the sheet after two seconds
         $timeout(function() {
           hideSheet();
          }, 20000);
        }
      })
    };


    $scope.scanAddr = function () {
      document.addEventListener("deviceready", function () {  
       $cordovaBarcodeScanner
        .scan()
        .then(function (barcodeData) {
          $scope.addr = '0x'+barcodeData.text;
          console.log('Success! ' + barcodeData.text);
        }, function (error) {
          // An error occurred
          console.log('Error!' + error);
        });
      }, false);
    };

    $scope.hasLogged = false;  
    $scope.friends = [];

    $scope.openLoginModal = function () {
      loginModal.show();
    };

    $scope.openChangeCodeModal = function () {
      createCodeModal();
    };

    $scope.closeLoginModal = function () {
      loginModal.hide();
    };

    $scope.closeChangeCodeModal = function () {
      codeModal.hide();
    };

    $scope.exitApp = function () {
      ionic.Platform.exitApp();
    }

    $scope.Login = function (pw, cod) {

      password = pw;
      code = cod;

      global_keystore = new lightwallet.keystore(randomSeed, password);
      global_keystore.generateNewAddress(password, 1);
      global_keystore.passwordProvider = customPasswordProvider;

      AppService.setWeb3Provider(global_keystore);

      localStorage.AppKeys = JSON.stringify({data: global_keystore.serialize()});
      localStorage.AppCode = JSON.stringify({code: code});
      localStorage.HasLogged = JSON.stringify(true);
      localStorage.Transactions = JSON.stringify({});
      localStorage.Friends = JSON.stringify($scope.friends);
      localStorage.Items = JSON.stringify($scope.items);

      loginModal.remove();
      $scope.hasLogged = true;
      $scope.qrcodeString = AppService.account();

      refresh();

    }

    $scope.ChangeCode = function(oldCode, newCode) {
      if(code !== newCode && code === oldCode) {
       code = newCode;
       localStorage.AppCode = JSON.stringify({code: code});
        codeModal.hide();
        codeModal.remove();

      }
    }

    $scope.refresh = function () {
      refresh();
      $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.addAddress = function(address) {
      createSaveAddressModal(address);
    }

    $scope.closeSaveAddressModal = function() {
      saveAddressModal.remove();
    }

    $scope.saveAddr = function(name,addr,comment){
      var icon = blockies.create({ 
        seed: addr, 
        //color: '#ff9933', 
        //bgcolor: 'red', 
        //size: 15, // width/height of the icon in blocks, default: 8
        //scale: 2, 
        //spotcolor: '#000' 
      });

      var friend = {"addr": addr, "comment": comment, "name": name, "icon":icon.toDataURL("image/jpeg")};
      $scope.friends.push(friend);
      localStorage.Friends = JSON.stringify($scope.friends);
      saveAddressModal.remove();
    }
    //temp
    $scope.transactions = Transactions.all();

    if (typeof localStorage.AppKeys == 'undefined') {

      // create keystore and account and store them
      var extraEntropy = "Devouring Time";
      var randomSeed = lightwallet.keystore.generateRandomSeed(extraEntropy);

      //console.log('randomSeed: ' + randomSeed);

      var infoString = 'Your keystore seed is: "' + randomSeed +
        '". Please write it down on paper or in a password manager, you will need it to access your keystore. Do not let anyone see this seed or they can take your Ether. ' +
        'Please enter a password to encrypt your seed and you account while in the mobile phone.';

      createLoginModal();
    }
    else {
      //retreive from localstorage
      var ls = JSON.parse(localStorage.AppKeys);
      code = JSON.parse(localStorage.AppCode).code;
      $scope.hasLogged = JSON.parse(localStorage.HasLogged);
      $scope.transactions = JSON.parse(localStorage.Transactions);

      global_keystore = new lightwallet.keystore.deserialize(ls.data);
      global_keystore.passwordProvider = customPasswordProvider;
      AppService.setWeb3Provider(global_keystore);
      $scope.qrcodeString = AppService.account();
      refresh();
    }
  }) //fine AppCtrl

  .controller('WalletCtrl', function ($scope, $stateParams, $ionicModal, $state, $ionicPopup, $cordovaBarcodeScanner, $ionicActionSheet, $timeout, AppService, Transactions) {
    var TrueException = {};
    var FalseException = {};

    var setCoin = function(index){
      if(index==0){
        $scope.idCoin = 0;
        $scope.logoCoin = "img/ethereum-icon.png";
        $scope.descCoin = "Eth from main wallet";
        $scope.symbolCoin = "ΞTH";
        $scope.balance = AppService.balance();
      }
      else{
		$scope.getNetwork();
		var activeCoins=$scope.storeCoins.filter( function isOnThisNetwork(obj) {return obj.Network==$scope.nameNetwork;} );
        $scope.idCoin = index;
        $scope.logoCoin = activeCoins[index-1].Logo;
        $scope.descCoin = activeCoins[index-1].Abstract;
        $scope.symbolCoin = activeCoins[index-1].Symbol;
        $scope.methodSend = activeCoins[index-1].Send;
        $scope.contractCoin = web3.eth.contract(activeCoins[index-1].ABI).at(activeCoins[index-1].Address);
        $scope.balance = $scope.contractCoin.balanceOf('0x' + $scope.account)*1;
      }
    }

    //set Eth for default
    setCoin(0);


    AppService.getStoreApps().then(function(response){
      console.log("coins loaded: " + response);
      $scope.storeCoins = response.coins;
    });

    $scope.fromAddressBook = false;

    if($stateParams.addr){
      var addr = $stateParams.addr.split('@')[0];
      var coins = $stateParams.addr.split('@')[1];
      $scope.addrTo = addr;
      $scope.amountTo = parseFloat(coins||0);
      $scope.fromAddressBook = true;
    }else {
      $scope.fromAddressBook = false;
    }

    $scope.sendCoins = function (addr, amount, unit, idCoin) {
      if(idCoin!=0){
        AppService.transferCoin($scope.contractCoin, $scope.methodSend, $scope.account, addr, amount);
      }
      else{
        var fromAddr = $scope.account;
        var toAddr = addr;
        var valueEth = amount;
        var value = parseFloat(valueEth) * unit;
        var gasPrice = 50000000000;
        var gas = 50000;
        AppService.sendTransaction(fromAddr, toAddr, value, gasPrice, gas).then(
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
                $state.go('app.transactions');
              });
              //save transaction
              $scope.transactions = Transactions.save(fromAddr, toAddr, result[1], value, new Date().getTime());
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
        title: 'Send Coins',
        template: 'Are you realy sure?'
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
      var buttonsGroup = [{text: 'ETH'}];
	  var activeCoins=$scope.storeCoins.filter( function isOnThisNetwork(obj) {return obj.Network==$scope.nameNetwork;} );
      for (var i = 0; i < activeCoins.length; i++) {
        var text = {text: activeCoins[i].Symbol + " " + activeCoins[i].Name};
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

  })

  .controller('AddressCtrl', function ($scope, AppService, $ionicPopup, $cordovaEmailComposer, $cordovaClipboard, $cordovaSms, $cordovaContacts) {
    $scope.size = 250;
    $scope.correctionLevel = 'H';
    $scope.typeNumber = 6;
    $scope.inputMode = '';
    $scope.image = true;

    $scope.onAmountChange = function(amount){
      if($scope.amountPayment == "")
        $scope.qrcodeString = $scope.account;
  
      $scope.qrcodeString = $scope.account + '@' + amount
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
            console.log(JSON.stringify(contactPicked));
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

  .controller('SettingsCtrl', function ($scope, $ionicPopup, $timeout,$cordovaEmailComposer, $ionicActionSheet, $cordovaFile, AppService) {    
    $scope.addrHost = localStorage.NodeHost;
	
    $scope.pin = { checked: (localStorage.PinOn=="true") };
	  $scope.touch = { checked: (localStorage.TouchOn=="true") };

    var setPin = function(value){
      localStorage.PinOn = value? "true":"false";
      $scope.pin = { checked: value};
    };

    var setTouchID = function(value){
      localStorage.TouchOn = value? "true":"false";
      $scope.touch = { checked: value};
    };

  	$scope.$watch('pin.checked',function(value) {
  		setPin(value);
  	});

    $scope.$watch('touch.checked',function(value) {
      setTouchID(value);
      if(value)
        setPin(value);
    });

    $scope.isIOS = function(){
      return ionic.Platform.isIOS();
    };

    $scope.editHost = function (addr) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Set Provider Host',
        template: 'Are you sure you want to modify the provider host? '
      });
      confirmPopup.then(function (res) {
        if (res) {
          localStorage.NodeHost = addr;
          AppService.setWeb3Provider(global_keystore);
          refresh();
          console.log('provider host update to: ' + addr);
        } else {
          console.log('provider host not modified');
        }
      });
    };

    var confirmImport = function (val) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Import a backuped wallet',
        template: 'Are you sure you want to import a wallet from backup and overwrite the current? '
      });
      confirmPopup.then(function (res) {
        if (res) {
            switch(val){
              case 0:
                  console.log('importing static test wallet');
                  importTestWallet();
                  break;
              case 1:
                  console.log('Importing wallet from Storage');
                  importStorageWallet();
                  break;
            }

          console.log('importing wallet from backup');
          refresh();
        } else {
          console.log('do not import wallet');
        }
      });
    };

    $scope.chooseImportWallet = function () {
		var hideSheet = $ionicActionSheet.show({
        buttons: [
          { text: 'Test Wallet' },
          { text: 'From Storage'  }
        ],
        destructiveText: (ionic.Platform.isAndroid()?'<i class="icon ion-android-exit assertive"></i> ':'')+'Cancel',
        titleText: 'Choose a wallet to import from?',
        /*cancelText: (ionic.Platform.isAndroid()?'<i class="icon ion-android-exit assertive"></i> ':'')+'Cancel',
        cancel: function() {
        // add cancel code..
        },*/
        destructiveButtonClicked:  function() {
          hideSheet();
        },
        buttonClicked: function(index) {
          confirmImport(index);
          hideSheet();
         $timeout(function() {
           hideSheet();
          }, 20000);
        }
      })
		
    };


    var importTestWallet = function () {
      //import wallet from (static value)
      var datal = '{"encSeed":{"encStr":"U2FsdGVkX1/TZRr3RnGrokz0r1v1nBj+qvkSwlYOSinCGUmgAr2bg6msxh3tmXu6NzojB+TVBBBvNBoshCn43qV+XEUi4dkdsIrWUdHNivgyeYRNf8K5daMGXiAapxIh","iv":"b2237015ccb4dd55fa0571f20ad64e66","salt":"d3651af74671aba2"},"encHdRootPriv":{"encStr":"U2FsdGVkX19AGRaRLGkRMY2RVdHrI0fV3B6lr2CTlOH7k+eUya9VSANXY886laiyhxCBFVPJJeuNph9iXfjaxz5a3ktxRJ/361WeJfCx1Y6FnrjEv0LE1V9dEleXA73RWJ7MZW8NbQcgGkVmCZ64L+qh9dM9EnbpI0S/BQ52EoA=","iv":"4e4f267e357c2f4b2d51d5183eefb507","salt":"401916912c691131"},"hdIndex":1,"encPrivKeys":{"d1324ada7e026211d0cacd90cae5777e340de948":{"key":"U2FsdGVkX1+t8Y7gU4jmt9L3WXAu1GwDQioNLTpEXknHZsGzOw1aFTlqzPUCkbpwbR+PTTR71XCtwSxzUD8Lhg==","iv":"3b2bec0c28997f8a9873538ff7407160","salt":"adf18ee05388e6b7"}},"addresses":["d1324ada7e026211d0cacd90cae5777e340de948"],"keyHash":"935cb8c28d033a9e9d9d25db59db954d55990944837c1b953f4d78196995080da5f4e140c4b4b42418ed895fd3de6863d59652bb3843bf0fdfd9c241c16c04c1","salt":{"words":[1505095718,1228820528,-1025278005,853733013],"sigBytes":16}}';

      global_keystore = new lightwallet.keystore.deserialize(datal);
      global_keystore.passwordProvider = customPasswordProvider;

      AppService.setWeb3Provider(global_keystore);
      localStorage.AppKeys = JSON.stringify({data: global_keystore.serialize()});
      refresh();

      var alertPopup = $ionicPopup.alert({
         title: 'Import Wallet',
         template: 'Wallet imported successfully!'
       });

       alertPopup.then(function(res) {
         console.log('test wallet imported');
       });
    };

    var importStorageWallet = function(){
      /*
      var fileList=[];
      window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (dirEntry) {
        var directoryReader = dirEntry.createReader();
        directoryReader.readEntries(
          function(entries){
            var i;
            for (i=0; i<entries.length; i++) {
              if(entries[i].name.indexOf('_lethKeystore.js')> -1)
                fileList.push(entries[i].name); 
            }
          },
          function(){
            console.log("INFO: Listing entries")
          }
        );
      });
      */
      //show all value fileList[]
      var keystoreFilename = "leth_keystore.json";
      document.addEventListener("deviceready", function () {
        $cordovaFile.readAsText(cordova.file.dataDirectory, keystoreFilename)
          .then(function (success) {
            // success
            console.log('read successfully');
            var ls = JSON.parse(success);
            global_keystore = new lightwallet.keystore.deserialize(ls.data);
            global_keystore.passwordProvider = customPasswordProvider;

            AppService.setWeb3Provider(global_keystore);
            localStorage.AppKeys = JSON.stringify({data: global_keystore.serialize()});

            refresh();
   
            var alertPopup = $ionicPopup.alert({
              title: 'Import Wallet',
              template: 'Wallet imported successfully!'
            });

            alertPopup.then(function(res) {
              console.log('test wallet imported');
            });
          }, function (error) {
            // error
            console.log(error);
        });
      }, false);
    };

    var backupWalletToStorage = function(){
      var keystoreFilename = "leth_keystore.json";
      document.addEventListener("deviceready", function () {
        $cordovaFile.writeFile(cordova.file.dataDirectory,
               keystoreFilename,
               localStorage.AppKeys,
               true)
            .then(function (success) {
              var alertPopup = $ionicPopup.alert({
                 title: 'Backup Wallet',
                 template: 'Wallet backuped successfully!'
               });

              alertPopup.then(function(res) {
                console.log('wallet backuped');
              });
            }, function () {
            // not available
          });
      }, false);     
    };

    $scope.backupWallet = function () {
		var hideSheet = $ionicActionSheet.show({
        buttons: [
          { text: 'Backup via Email' },
          { text: 'Backup on Storage'  }
        ],
        destructiveText: (ionic.Platform.isAndroid()?'<i class="icon ion-android-exit assertive"></i> ':'')+'Cancel',
        titleText: 'How do you want to backup your wallet?',
        /*cancelText: (ionic.Platform.isAndroid()?'<i class="icon ion-android-exit assertive"></i> ':'')+'Cancel',
        cancel: function() {
        // add cancel code..
        },*/
        destructiveButtonClicked:  function() {
          hideSheet();
        },
        buttonClicked: function(index) {
            switch(index){
                case 0:
                    console.log('backuping via Email');
                    walletViaEmail();
                    hideSheet();
                    break;
                case 1:
                    console.log('backuping on Storage');
                    backupWalletToStorage();
                    hideSheet();
                    break;
				}
			$timeout(function() {
			 hideSheet();
          }, 20000);
        }
      })
    };

    var walletViaEmail = function(){
      //backup wallet to email 
      document.addEventListener("deviceready", function () {
        var keystoreFilename = global_keystore.addresses[0] + "_lethKeystore.json";
        var directorySave=cordova.file.dataDirectory;
        var directoryAttach=cordova.file.dataDirectory.replace('file://','');
        
        if(ionic.Platform.isAndroid()) {
          directorySave = cordova.file.externalDataDirectory;
          directoryAttach = cordova.file.externalDataDirectory;
        }
        $cordovaFile.writeFile(directorySave,
                               keystoreFilename,
                               JSON.stringify(global_keystore.serialize()),
                               true)
          .then(function (success) {
            $cordovaEmailComposer.isAvailable().then(function() {
              var emailOpts = {
                to: [''],
                attachments: ['' + directoryAttach + keystoreFilename],
                subject: 'Backup LETH Wallet',
                body: 'A LETH backup wallet is attached.<br>powerd by Ethereum from <b>Inzhoop</b>',
                isHtml: true
              };

              $cordovaEmailComposer.open(emailOpts).then(null, function () {
                // user cancelled email
              });

              return;
            }, function (error) {
              return;
            });
          }, function () {
            // not available
          });
      }, false);     
    };
  })

  .controller('FriendsCtrl', function ($scope, Friends, $ionicListDelegate) {    
    $scope.remove = function (friendIndex) {
      Friends.remove($scope.friends,friendIndex);
      localStorage.Friends = JSON.stringify($scope.friends);
      $ionicListDelegate.closeOptionButtons();
    };

    $scope.payFriends = function () {
      $state.go('tab.wallet');
      $scope.addrTo = $scope.friend.addr;
    }
  })

  .controller('FriendCtrl', function ($scope, $stateParams, Friends) {
    $scope.friend = Friends.get($stateParams);
    $scope.friendBalance = Friends.balance($scope.friend);
  })

  .controller('TransactionCtrl', function ($scope) {
    //

     for (var i = 0; i < 1000; i++) $scope.transactions.push(i);
  })

  .controller('AboutCtrl', function ($scope, angularLoad) {
  })

  .controller('DapplethsCtrl', function ($scope, angularLoad, DappPath, $templateRequest, $sce, $compile, $ionicSlideBoxDelegate, $http, CountDapp, AppService) {
    $ionicSlideBoxDelegate.start();
    $scope.nextSlide = function() {
      $ionicSlideBoxDelegate.next();
    };
    $scope.prevSlide = function() {
      $ionicSlideBoxDelegate.previous();
    };

    $scope.appContainer="";
    //load dappleths dinamicamente   
    $scope.storeApp = AppService.getStoreApps().then(function(response){
      angular.forEach(response.dappleths, function(value, key){
        $http.get(value.AppUrl) 
          .success(function(data){
          $scope.appContainer += $sce.trustAsHtml(data);
        })
      });
    });
  })

  .controller('DapplethRunCtrl', function ($scope, angularLoad, DappPath, $templateRequest, $sce, $compile, $ionicSlideBoxDelegate, $http, $stateParams,$timeout) {
      console.log("Param " + $stateParams.Id);

      //load app selected
      var id = $stateParams.Id;
      //TO DO : install dappleths on localStorage and readFrom   
      var path = DappPath.url + '/dapp_';
      var localpath = 'dappleths/dapp_'; 
      //path=localpath;
      //loading template html to inject  
      $http.get(path + id + '/index.html') //cors to load from website
        .success(function(data){
          $scope.appContainer = $sce.trustAsHtml(data);
          //setting contract jscript
          var script = path + id +  "/index.js" ;

          angularLoad.loadScript(script).then(function() {
              console.log('loading ' + script);
          }).catch(function() {
                console.log('ERROR :' + script );
            });
      });

      $scope.refresh = function() {
        updateData(); //defined in external js
        $scope.$broadcast('scroll.refreshComplete');
      }
  });
