angular.module('leth.controllers', [])
  .controller('AppCtrl', function ($interval, $scope, $rootScope, $ionicModal,  $cordovaDeviceMotion, $ionicPlatform, 
                                  $ionicPopup, $ionicTabsDelegate, $timeout, $cordovaBarcodeScanner, $state, 
                                  $ionicActionSheet, $cordovaEmailComposer, $cordovaContacts, AppService, 
                                  $q, PasswordPopup, Transactions, Friends, ExchangeService, $ionicLoading, 
                                  $ionicLoadingConfig,$cordovaLocalNotification,$cordovaBadge,$ionicScrollDelegate,Chat) {
    window.refresh = function () {
      $ionicLoading.show();
      $scope.balance = AppService.balance();
      ExchangeService.getTicker($scope.xCoin, JSON.parse(localStorage.BaseCurrency).value).then(function(value){
        $scope.balanceExc = JSON.parse(localStorage.BaseCurrency).symbol + " " + parseFloat(value * $scope.balance).toFixed(2) ;
      });
      $scope.account = AppService.account();
      $scope.qrcodeString = $scope.account;
      $scope.getNetwork();
      $scope.friends = Friends.all();
      $scope.transactions = Transactions.all();
      localStorage.Transactions = JSON.stringify($scope.transactions);
      loadApps(flagApps);
      $timeout(function() {$ionicLoading.hide();}, 1000);
    };
    
    window.customPasswordProvider = function (callback) {
      var pw;
      PasswordPopup.open("Digit your wallet password", "unlock account to sign transaction").then(
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

    var loadApps = function(store){
      if(store){
        $scope.filterStoreApps = 'button button-small button button-positive';
        $scope.filterLocalApps = 'button button-small button-outline button-positive';
        AppService.getStoreApps().then(function(response){
          $scope.listCoins = response.coins;
          $scope.listApps = response.dappleths;
        }) 
      }else{
        $scope.filterStoreApps = 'button button-small button-outline button-positive';
        $scope.filterLocalApps = 'button button-small button button-positive';
        $scope.listCoins = localStorage.Coins;
        $scope.listApps = localStorage.DAppleths;
      }
    };

    $scope.fromStore = function(value){
      flagApps = value;
      loadApps(flagApps);
    };     

    var codeModal;
    var createCodeModal = function() {
      $ionicModal.fromTemplateUrl('templates/changeCode.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        codeModal = modal;
        codeModal.show();
      });
    };
    $scope.openChangeCodeModal = function () {
      createCodeModal();
    };
    $scope.closeChangeCodeModal = function () {
      codeModal.hide();
    };

    var saveAddressModal;
    var createSaveAddressModal = function(address) {
      $ionicModal.fromTemplateUrl('templates/addFriend.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {

        document.addEventListener("deviceready", function () {
          $cordovaContacts.pickContact().then(function (contactPicked) {
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

    $scope.isValidAddr = function(addr){
      return web3.isAddress(addr);
    };

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


    $scope.scanSesamo = function () {
      document.addEventListener("deviceready", function () {      
        $cordovaBarcodeScanner
          .scan()
          .then(function (barcodeData) {
            if(barcodeData.text!= ""){
              var addr = barcodeData.text.split('@')[0];
              var session = barcodeData.text.split('@')[1];
              AppService.loginTest(addr,session);
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
                $scope.classNetwork = 'royal';                
                $scope.badgeNetwork = 'badge badge-royal';
                break;
            case '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3':
                $scope.nameNetwork = 'Mainet';
                $scope.classNetwork = 'balanced';                
                $scope.badgeNetwork = 'badge badge-balanced';
                break;
            default:
                $scope.nameNetwork = 'Private';
                $scope.classNetwork = 'calm';                
                $scope.badgeNetwork = 'badge badge-calm';              
          }
        }
      });
    };

    $scope.sendFeedback = function(){
      // Show the action sheet
      var hideSheet = $ionicActionSheet.show({
        buttons: [
          { text: '<i class="ion-happy-outline"></i> Good' },
          { text: '<i class="ion-sad-outline"></i> Poor'  }
        ],
        destructiveText: (ionic.Platform.isAndroid()?'<i class="icon ion-android-exit assertive"></i> ':'')+'Cancel',
        titleText: 'Send your mood for this app',
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

    $scope.exitApp = function () {
      ionic.Platform.exitApp();
    };


    $scope.createWallet = function (seed, password, code) {   
      $ionicLoading.show();
      lightwallet.keystore.deriveKeyFromPassword(password, function (err, pwDerivedKey) {
        global_keystore = new lightwallet.keystore(seed, pwDerivedKey);
        global_keystore.generateNewAddress(pwDerivedKey, 1);
        global_keystore.passwordProvider = customPasswordProvider;

        //add keystore for encryption
        local_keystore = new lightwallet.keystore(seed, pwDerivedKey,hdPath);
        var info={curve: 'curve25519', purpose: 'asymEncrypt'};
        local_keystore.addHdDerivationPath(hdPath,pwDerivedKey,info);
        local_keystore.generateNewEncryptionKeys(pwDerivedKey, 1, hdPath);
        local_keystore.setDefaultHdDerivationPath(hdPath);
        local_keystore.passwordProvider = customPasswordProvider;

        AppService.setWeb3Provider(global_keystore);

        localStorage.AppKeys = JSON.stringify({data: global_keystore.serialize()});
        localStorage.EncKeys = JSON.stringify({data: local_keystore.serialize()});
        localStorage.AppCode = JSON.stringify({code: code});
        localStorage.HasLogged = JSON.stringify(true);
        localStorage.Transactions = JSON.stringify({});
        localStorage.Friends = JSON.stringify($scope.friends);

        $rootScope.hasLogged = true;

        $state.go('app.dappleths');

        $timeout(function() {$ionicLoading.hide();}, 1000);
      });
    };

    $scope.ChangeCode = function(oldCode, newCode) {
      if(code !== newCode && code === oldCode) {
       code = newCode;
       localStorage.AppCode = JSON.stringify({code: code});
        codeModal.hide();
        codeModal.remove();
      }
    };

    $scope.refresh = function () {
      refresh();
      $scope.$broadcast('scroll.refreshComplete');
    };

    $scope.addAddress = function(address) {
      createSaveAddressModal(address);
    }

    $scope.closeSaveAddressModal = function() {
      $scope.name = "";
      $scope.addr = "";
      $scope.comment ="";
      saveAddressModal.remove();
    }

    $scope.isFriend = function(address) {
      var res = Friends.get(address);
      if(res==undefined)
        return "";
      else
        return res.name;
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
    };
    
    console.log("status login: " + $rootScope.hasLogged)

    //shake start
    // Watcher object
    $scope.watch = null;
    $scope.randomString="";
    $scope.shakeCounter=3;

    // watch Acceleration options
    $scope.options = { 
        frequency: 500, // Measure every 100ms
        deviation : 30  // We'll use deviation to determine the shake event, best values in the range between 25 and 30
    };
    // Current measurements
    $scope.measurements = {
        x : null,
        y : null,
        z : null,
        timestamp : null
    }
    // Previous measurements    
    $scope.previousMeasurements = {
        x : null,
        y : null,
        z : null,
        timestamp : null
    }   
    
    var hashCode = function(text) {
      var hash = 0, i, chr, len;
      if (text.length === 0) return hash;
      for (i = 0, len = text.length; i < len; i++) {
        chr   = text.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
      }
      return hash;
    };

    var startWatching = function() { 
      $ionicPlatform.ready(function() {    
          $scope.watch = $cordovaDeviceMotion.watchAcceleration($scope.options);
          $scope.watch.then(null, function(error) {
              console.log('Error');
          },function(result) {
              // Set current data  
              $scope.measurements.x = result.x;
              $scope.measurements.y = result.y;
              $scope.measurements.z = result.z;
              $scope.measurements.timestamp = result.timestamp;  
              // Detecta shake  
              detectShake(result);   
          });   
      });
    };       

    var stopWatching = function() {  
        $scope.watch.clearWatch();      
    }       
  
    var detectShake = function(result) {  
      var measurementsChange = {};
      // Calculate measurement change only if we have two sets of data, current and old
      if ($scope.previousMeasurements.x !== null) {
          measurementsChange.x = Math.abs($scope.previousMeasurements.x, result.x);
          measurementsChange.y = Math.abs($scope.previousMeasurements.y, result.y);
          measurementsChange.z = Math.abs($scope.previousMeasurements.z, result.z);
      }

      //console.log(measurementsChange.x + measurementsChange.y + measurementsChange.z);

      if (measurementsChange.x + measurementsChange.y + measurementsChange.z > $scope.options.deviation) {
          stopWatching();  // Stop watching because it will start triggering like hell
          console.log('Shake detected'); 
          $scope.classShake = "shakeit";       
          $scope.shakeCounter--;

          if ($scope.shakeCounter>0)
           setTimeout(startWatching(), 800);  // Again start watching after 1 sec
  
          $scope.randomString+=result.x+result.y+result.z;

          // Clean previous measurements after succesfull shake detection, so we can do it next time
          $scope.previousMeasurements = { 
              x: null, 
              y: null, 
              z: null
          } 

         if($scope.shakeCounter==0){
            $scope.randomString = hashCode($scope.randomString);
            $scope.goLogin($scope.randomString);
          }

      } else if (measurementsChange.x + measurementsChange.y + measurementsChange.z > $scope.options.deviation/2) {
          $scope.classShake = "shakeit"; 
          $scope.previousMeasurements = {
              x: result.x,
              y: result.y,
              z: result.z
          }
      } else {
        // On first measurements set it as the previous one
        $scope.classShake = ""; 
        $scope.previousMeasurements = {
            x: result.x,
            y: result.y,
            z: result.z
        }
      }           
    }        

    $scope.$on('$ionicView.beforeLeave', function(){
        if($scope.watch != undefined)
          $scope.watch.clearWatch(); 
    }); 

    var entropyModal;
    var createEntropyModal = function () {
      $ionicModal.fromTemplateUrl('templates/entropy.html', {
        scope: $scope,
        animation: 'slide-in-down',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
      }).then(function (modal) {
        entropyModal = modal;
        entropyModal.show();
        startWatching();
      });
    };
    var closeEntropyModal = function () {
      entropyModal.hide();
    };

    var loginModal;
    var createLoginModal = function() {
      $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope,
        animation: 'slide-in-right',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
      }).then(function (modal) {
        loginModal = modal;
        loginModal.show();
      });
    };
    $scope.openLoginModal = function () {
      loginModal.show();
    };
    $scope.closeLoginModal = function () {
      loginModal.hide();
    };

    $scope.goLogin = function(random){
      closeEntropyModal();
      // create keystore and account and store them
      var extraEntropy = random.toString();
      $scope.randomSeed = lightwallet.keystore.generateRandomSeed(extraEntropy);
      //randomSeed = "occur appear stock great sport remain athlete remain return embody team jazz";
      createLoginModal();
    }

    $scope.restoreLogin = function(seed){
      closeEntropyModal();
      // restore keystore from seed 
      $scope.randomSeed = seed;
      //randomSeed = "occur appear stock great sport remain athlete remain return embody team jazz";
      console.log($scope.randomSeed);
      createLoginModal();
    }

    $scope.Login = function (seed, pw, cod) {      
      $scope.createWallet(seed, pw, cod);
      $scope.closeLoginModal();
    };

    $scope.sendSeedByEmail = function(){
      document.addEventListener("deviceready", function () {  
        $cordovaEmailComposer.isAvailable().then(function() {
        var emailOpts = {
          to: [''],
          subject: 'Backup your Seed from LETH',
          body: 'Please write it down on paper or in a password manager, you will need it to access your keystore. Do not let anyone see this seed or they can take your Ether.<br/><br/>' + $scope.randomSeed,
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
      }, false);        
    };

    $scope.installDapp = function(id) {
      var dappToInstall = $scope.listApps.filter( function(app) {return app.GUID==id;} )[0];

      document.addEventListener("deviceready", function () {
        var directoryTemplate=cordova.file.dataDirectory;
        if(ionic.Platform.isAndroid()) {
          directoryTemplate = cordova.file.externalDataDirectory;
        }
        var templateName = dappToInstall.GUID + ".html";
        var templateContent ="";

        $http.get(dappToInstall.TemplateUrl) 
        .success(function(data){
          templateContent =  $sce.trustAsHtml(data);

          angularLoad.loadScript(dappToInstall.ScriptUrl).then(function() {
              console.log('loading ' + dappToInstall.ScriptUrl);
          }).catch(function() {
                console.log('ERROR :' + dappToInstall.ScriptUrl);
            });
        });

        $cordovaFile.writeFile(directoryTemplate,
                               templateName,
                               templateContent,
                               true)
          .then(function (success) {
            localStorage.DAppleths.push(dappToInstall);

            var alertPopup = $ionicPopup.alert({
              title: 'Install Dappleth',
                template: 'Dappleth ' + dappToInstall.Name + ' installed successfully!'
            });

            alertPopup.then(function(res) {
              console.log('dappleth ' + dappToInstall.Name + ' installed');
            });
          }, function () {
          // not available
        });
      }, false);  
    }

    $scope.readDapp = function(filename){
      document.addEventListener("deviceready", function () {
        var directoryTemplate=cordova.file.dataDirectory;
        if(ionic.Platform.isAndroid()) {
          directoryTemplate = cordova.file.externalDataDirectory;
        }
        $cordovaFile.readAsText(directoryTemplate, filename)
          .then(function (success) {
            // success
            return $sce.trustAsHtml(success);
            console.log('read successfully');
          }, function (error) {
            // error
            console.log(error);
        });
      }, false);
    }
    //init
    $scope.friends = [];    
    $scope.transactions = Transactions.all();
    $scope.fromStore(true);

    $scope.currencies = [
          { name: 'EUR', symbol:'€', value: 'ZEUR'},
          { name: 'USD', symbol:'$', value: 'ZUSD' },
          { name: 'GBP', symbol:'£', value: 'ZGBP' },
          { name: 'DAO', symbol:'Ð', value: 'XDAO' },
          { name: 'BTC', symbol:'฿', value: 'XXBT' }
    ];
    $scope.xCoin = "XETH";
    
    if($rootScope.hasLogged ){
      var ls = JSON.parse(localStorage.AppKeys);
      var ks = JSON.parse(localStorage.EncKeys);
      code = JSON.parse(localStorage.AppCode).code;
      $scope.transactions = JSON.parse(localStorage.Transactions);

      global_keystore = new lightwallet.keystore.deserialize(ls.data);
      global_keystore.passwordProvider = customPasswordProvider;

      local_keystore = new lightwallet.keystore.deserialize(ks.data);
      local_keystore.passwordProvider = customPasswordProvider;

      AppService.setWeb3Provider(global_keystore);
      $scope.qrcodeString = AppService.account();

    }else{
      createEntropyModal();
    }

    /**
    ** CHATS section
    */
    $scope.msgCounter = 0;

    $scope.setBadge = function(value) {
      document.addEventListener("deviceready",function() {    
        $cordovaBadge.hasPermission().then(function(result) {
            $cordovaBadge.set(value);
        }, function(error) {
            console.log(error);
        });
      }, false);
    }

    $scope.increaseBadge = function() {
      document.addEventListener("deviceready",function() {    
        $cordovaBadge.hasPermission().then(function(result) {
            $cordovaBadge.increase();
        }, function(error) {
            console.log(error);
        });
      }, false);
    }

    $scope.clearBadge = function() {
      document.addEventListener("deviceready",function() {    
        $cordovaBadge.hasPermission().then(function(result) {
            $cordovaBadge.clear();
        }, function(error) {
            console.log(error);
        });
      }, false);
    }

    $scope.scrollTo = function(handle,where){
      $ionicScrollDelegate.$getByHandle(handle).resize();
      $timeout(function() {
            $ionicScrollDelegate.$getByHandle(handle).scrollTo(where,350);
      }, 100);
    }
    //start listening message shh
    Chat.listenMessage($scope);

    $scope.$on('chatMessage', function (e, r) {     
      //se encrypted allora è un DM
      var from = r.from;
      var msg = r.payload; 
      if(r.payload.mode == 'encrypted'){
        lightwallet.keystore.deriveKeyFromPassword('Password1', function (err, pwDerivedKey) {
          msg = lightwallet.encryption.multiDecryptString(local_keystore,pwDerivedKey,r.payload.text, local_keystore.getPubKeys(hdPath)[0],local_keystore.getPubKeys(hdPath)[0],hdPath);        

          $scope.DMchats = Chat.find(); 
          $scope.scrollTo('chatScroll','bottom');
          if($ionicTabsDelegate.selectedIndex()!=1)
            $scope.msgCounter += 1;
          $scope.$digest(); 

        });
      } else {

       if(r.payload.type=='leth'){
        if(r.payload.text.length)
          msg = r.payload.text;
        if(r.payload.image.length)
          msg = "sent image";
       }

       $scope.chats = Chat.find(); 
       $scope.scrollTo('chatScroll','bottom');
       if($ionicTabsDelegate.selectedIndex()!=1)
         $scope.msgCounter += 1;
       $scope.$digest(); 
      }

    });


    $scope.$on('chatMessageOK', function (e, r) {
     var from = r.from;
     var msg = r.payload; 
     if(r.payload.type=='leth'){
      if(r.payload.text.length)
        msg = r.payload.text;
      if(r.payload.image.length)
        msg = "sent image";
     }
     //$scope.scheduleSingleNotification(from,msg);
     $scope.chats = Chat.find(); 
     $scope.scrollTo('chatScroll','bottom');
     if($ionicTabsDelegate.selectedIndex()!=1)
       $scope.msgCounter += 1;
     $scope.$digest(); 
    });

    $scope.$on('chatMessagePrivate', function (e, r) {
     var from = r.from;
     var msg = r.payload; 
     if(r.payload.type=='leth'){
      if(r.payload.text.length)
        msg = r.payload.text;
      if(r.payload.image.length)
        msg = "sent image";

      if(r.payload.mode == 'encrypted'){
        lightwallet.keystore.deriveKeyFromPassword('Password1', function (err, pwDerivedKey) {
          msg = lightwallet.encryption.multiDecryptString(local_keystore,pwDerivedKey,r.payload.text, local_keystore.getPubKeys(hdPath)[0],local_keystore.getPubKeys(hdPath)[0],hdPath);        

          $scope.DMchats = Chat.find(); 
          $scope.scrollTo('chatScroll','bottom');
          if($ionicTabsDelegate.selectedIndex()!=1)
            $scope.msgCounter += 1;
          $scope.$digest(); 

        });
      }

     }
    });

    document.addEventListener('deviceready', function () {
      // Android customization
      cordova.plugins.backgroundMode.setDefaults({ text:'Doing heavy tasks.'});
      // Enable background mode
      cordova.plugins.backgroundMode.enable();

      console.log('device ready for background');
      
       // Called when background mode has been activated
      cordova.plugins.backgroundMode.onactivate = function() {
        $scope.$on('chatMessage', function (e, r) {
          var from = r.from;
          var msg = r.payload; 
          if(r.payload.type=='leth'){
          if(r.payload.text.length)
            msg = r.payload.text;
          if(r.payload.image.length)
            msg = "sent image";
          }
          $scope.scheduleSingleNotification(from,msg);
          if($ionicTabsDelegate.selectedIndex()!=1)
            $scope.msgCounter += 1;
          $scope.increaseBadge();
        });
      }

      cordova.plugins.backgroundMode.ondeactivate = function() {
        $scope.cancelAllNotifications();
        $scope.clearBadge();
      };

    }, false);


    $scope.scheduleSingleNotification = function (title, text) {
      document.addEventListener("deviceready", function () {        
        $cordovaLocalNotification.schedule({
            id: 1,
            //title: title,
            text: text
          }).then(function (result) {
            //console.log('Notification 1 triggered');
          });
      }, false); 
    };

    $scope.cancelAllNotifications = function () {
      $scope.msgCounter = 0;
      document.addEventListener("deviceready", function () {        
        $cordovaLocalNotification.cancelAll().then(function (result) {
              console.log('All Notification Canceled');
        });
      }, false); 
    };

    //clear notification and badge on click (todo: add on open)
    $rootScope.$on('$cordovaLocalNotification:click',
      function (event, notification, state) {
        $scope.cancelAllNotifications();
        $scope.clearBadge();
      }
    );     

  }) //fine AppCtrl
  .controller('TransactionCtrl', function ($scope) {
  })
  