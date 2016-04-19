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
                $scope.nameNetwork = 'Testnet';
                $scope.badgeNetwork = 'badge badge-royal';
                break;
            case '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3':
                $scope.nameNetwork = 'Mainet';
                $scope.badgeNetwork = 'badge badge-balanced';
                break;
            default:
                $scope.nameNetwork = 'Privatenet';
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
          $scope.addr = barcodeData.text;
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

  .controller('WalletCtrl', function ($scope, $stateParams, $ionicModal, $state, $ionicPopup, $cordovaBarcodeScanner, $ionicActionSheet, AppService, Transactions) {
    var TrueException = {};
    var FalseException = {};

    AppService.getStoreApps().then(function(response){
      console.log("coins loaded: " + response);
      $scope.storeCoins = response.coins;
    });

    $scope.fromAddressBook = false;

    if($stateParams.addr){
      var addr = $stateParams.addr.split('@')[0];
      var coins = $stateParams.addr.split('@')[1];
      $scope.addrTo = addr;
      $scope.amountTo = coins;
      $scope.fromAddressBook = true;
    }else {
      $scope.fromAddressBook = false;
    }

    $scope.sendCoins = function (addr, amount, unit) {
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
      /*
      var buttonsGroup = [];
      for (var i = 0; i < $scope.storeCoins.length; i++) {
        var text = "{text:'ZhoopCoin'}";
        buttonsGroup.push(text);
      }
      */
      var hideSheet = $ionicActionSheet.show({
        buttons: [
            { text: $scope.storeCoins[0].Symbol + " " + $scope.storeCoins[0].Name }
        ],
        destructiveText: (ionic.Platform.isAndroid()?'<i class="icon ion-android-exit assertive"></i> ':'')+'Cancel',
        titleText: 'Choose coins to pay with',
        destructiveButtonClicked:  function() {
          hideSheet();
        },
        buttonClicked: function(index) {
          alert(index);
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
			document.addEventListener("deviceready", function () {
				$cordovaEmailComposer.isAvailable().then(function() {
				var emailOpts = {
					to: [''],
					attachments: ['base64:code.png//data:image/png;base64,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'], 
					subject: 'Please Pay me',
          body: 'Please send me ETH to this Wallet Address: </br><a href="ethereum://' + $scope.qrcodeString + '"/>' + $scope.qrcodeString + '</br><img src="' + imgQrcode + '"/></br>',
          isHtml: true
				};

				$cordovaEmailComposer.open(emailOpts).then(null, function () { console.log('email view dismissed');	});
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

    /*
    var path = DappPath.url + '/dapp_';
    var localpath = 'dappleths/dapp_';    //maybe a list  from an API of dappleth Store: sample app
    //path=localpath; //for development
    
    $scope.appContainer="";

    for(var i=1; i<=CountDapp; i++) {
      $http.get(path + i + '/app.html') 
        .success(function(data){
        $scope.appContainer += $sce.trustAsHtml(data);

      })
    }
    */
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
