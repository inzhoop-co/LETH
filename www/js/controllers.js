angular.module('leth.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $ionicPopup, $timeout, $cordovaBarcodeScanner, $state, AppService, FeedService, $q, PasswordPopup, Transactions, Friends, Items) {
    window.refresh = function () {
      $scope.balance = AppService.balance();
      $scope.account = AppService.account();
      $scope.qrcodeString = AppService.account();

      //temp
      $scope.transactions = Transactions.all();
      localStorage.Transactions = JSON.stringify($scope.transactions);
    };
    window.customPasswordProvider = function (callback) {
      var pw;
      PasswordPopup.open("Inserisci Una Password", "Inserisci La tua password").then(
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
        if(address != undefined) {
          $scope.addr = address;
        }
        saveAddressModal = modal;
        saveAddressModal.show();
      });
    };
    var loadFriends = function(friendsHash){
      angular.forEach(friendsHash, function (key, value) {
        Friends.getFromIpfs(key).then(function (response) {
          Friends.add($scope.friends, response[0], key);
        }, function (err) {
          console.log(err);
        })
      });
    };

    $scope.scanTo = function () {
      $cordovaBarcodeScanner
        .scan()
        .then(function (barcodeData) {
          $state.go('app.wallet', {addr: barcodeData.text});
          console.log('Success! ' + barcodeData.text);
        }, function (error) {
          // An error occurred
          console.log('Error!' + error);
        });
    };

    $scope.hasLogged = false;
  
    $scope.friends = [];
    /*********FRIENDS ********/
    if (typeof localStorage.ipfsFriends == 'undefined') {
      $scope.ipfsFriends = ["QmdQxP4dBKsAgZdfqH8jgX1BvhDuu742qZcgDYaCQYS13H", "QmNuBdR2D5osrPT4NgBDSvwpEo7dpR6N8gxVzhvMGNPw2S"];
      localStorage.ipfsFriends = JSON.stringify($scope.ipfsFriends);
    }

    if (typeof localStorage.Friends == 'undefined') {
      /*for testing purpose only*/
      var friendsHash = JSON.parse(localStorage.ipfsFriends);
      loadFriends(friendsHash);
    } else {
      $scope.friends = JSON.parse(localStorage.Friends);
    }
    /*********FRIENDS ********/

    $scope.items = [];

    var loadItems = function(itemsHash){
      angular.forEach(itemsHash, function (key, value) {
        Items.getFromIpfs(key).then(function (response) {
          Items.add($scope.items, response, key);
        }, function (err) {
          console.log(err);
        })
      });
    }

    if (typeof localStorage.ipfsItems == 'undefined') {
      $scope.ipfsItems = ["QmeUm18ySxXdDZQK18kYRZnGR6R4hd2XjTXrqFZQHcWwsu"];
      //QmTQmAEHDzAk9i4BBES1BBhTj1v9KmF8Vcngyns1cd1XpX
      //QmeUm18ySxXdDZQK18kYRZnGR6R4hd2XjTXrqFZQHcWwsu
      localStorage.ipfsItems = JSON.stringify($scope.ipfsItems);
    }

    if (typeof localStorage.Items == 'undefined') {
      var itemsHash = JSON.parse(localStorage.ipfsItems);
      loadItems(itemsHash);
    } else {
      $scope.items = JSON.parse(localStorage.Items);
    }

    // NEWS
    $scope.infoNews = [];
    $scope.newinfo = [];
    FeedService.GetFeed().then(function(infoNews){
      $scope.infoNews = infoNews;
    });
    //

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

    $scope.saveAddr = function(name,comment,addr){
      var friend = {"addr": addr, "comment": comment, "name": name};
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

  .controller('WalletCtrl', function ($scope, $stateParams, $ionicModal, $state, $ionicPopup, $cordovaBarcodeScanner, AppService, Transactions) {

    var TrueException = {};
    var FalseException = {};


    $scope.fromAddressBook = false;

    if($stateParams.addr){
      $scope.addrTo = $stateParams.addr;
      $scope.fromAddressBook = true;
    }else {
      $scope.fromAddressBook = false;
    }

    $scope.sendCoins = function (addr, amount) {
      var fromAddr = $scope.account;
      var toAddr = addr;
      var valueEth = amount;
      var value = parseFloat(valueEth) * 1.0e18;
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
              title: 'Transazione Inoltrata',
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

    $scope.confirmSend = function (addr, amount) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Send Coins',
        template: 'Are you realy sure?'
      });
      confirmPopup.then(function (res) {
        if (res) {
          $scope.sendCoins(addr, amount);
        } else {
          console.log('Send coins aborted');
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
  })

  .controller('AddressCtrl', function ($scope, AppService, $ionicPopup, $cordovaEmailComposer, $cordovaClipboard,$cordovaSms,$cordovaContacts) {
    $scope.size = 250;
    $scope.correctionLevel = 'H';
    $scope.typeNumber = 6;
    $scope.inputMode = '';
    $scope.image = true;


    $scope.showAddress = function () {
      alert($scope.qrcodeString);
      //var alertPopup = $ionicPopup.alert({
      //  title: 'Wallet Address',
      //  template: $scope.qrcodeString
      //});

      //alertPopup.then();
    };

    $scope.shareBySms = function() {
      var content = "My address is " + $scope.qrcodeString;
      var phonenumber="";
      $cordovaContacts.pickContact().then(function (contactPicked) {
          phonenumber = contactPicked;
      });

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
    }

    $scope.shareByEmail = function(){
      $cordovaEmailComposer.isAvailable().then(function() {
         // is available
       }, function () {
         // not available
         console.log("cordovaEmailComposer not available");
       });

        window.plugin.email.open({
            to:          [""], // email addresses for TO field
            cc:          Array, // email addresses for CC field
            bcc:         Array, // email addresses for BCC field
            attachments: '', // file paths or base64 data streams
            subject:    "Please Pay me", // subject of the email
            body:       'Please send me ETH to this Wallet Address: </br><b>' +  $scope.qrcodeString + '</b>', // email body (for HTML, set isHtml to true)
            isHtml:    true, // indicats if the body is HTML or plain text
        }, function () {
            console.log('email view dismissed');
        },
        this);  
     }

      $scope.copyAddr = function(){
        $cordovaClipboard
        .copy($scope.qrcodeString)
        .then(function () {
          // success
          alert('Address in clipboard');
        }, function () {
          // error
          console.log('Copy error');
        });
      }
  })

  .controller('SettingsCtrl', function ($scope, $ionicPopup, $cordovaEmailComposer, $cordovaFile, AppService) {

    $scope.addrHost = localStorage.NodeHost;
	
	$scope.pin = { checked: (localStorage.PinOn=="true") };
	
	$scope.$watch('pin.checked',function(value) {
		localStorage.PinOn= value? "true":"false";
		$scope.pin = { checked: value};
	});

    $scope.importWallet = function () {
      //import wallet from (static value)
      var datal = '{"encSeed":{"encStr":"U2FsdGVkX1/TZRr3RnGrokz0r1v1nBj+qvkSwlYOSinCGUmgAr2bg6msxh3tmXu6NzojB+TVBBBvNBoshCn43qV+XEUi4dkdsIrWUdHNivgyeYRNf8K5daMGXiAapxIh","iv":"b2237015ccb4dd55fa0571f20ad64e66","salt":"d3651af74671aba2"},"encHdRootPriv":{"encStr":"U2FsdGVkX19AGRaRLGkRMY2RVdHrI0fV3B6lr2CTlOH7k+eUya9VSANXY886laiyhxCBFVPJJeuNph9iXfjaxz5a3ktxRJ/361WeJfCx1Y6FnrjEv0LE1V9dEleXA73RWJ7MZW8NbQcgGkVmCZ64L+qh9dM9EnbpI0S/BQ52EoA=","iv":"4e4f267e357c2f4b2d51d5183eefb507","salt":"401916912c691131"},"hdIndex":1,"encPrivKeys":{"d1324ada7e026211d0cacd90cae5777e340de948":{"key":"U2FsdGVkX1+t8Y7gU4jmt9L3WXAu1GwDQioNLTpEXknHZsGzOw1aFTlqzPUCkbpwbR+PTTR71XCtwSxzUD8Lhg==","iv":"3b2bec0c28997f8a9873538ff7407160","salt":"adf18ee05388e6b7"}},"addresses":["d1324ada7e026211d0cacd90cae5777e340de948"],"keyHash":"935cb8c28d033a9e9d9d25db59db954d55990944837c1b953f4d78196995080da5f4e140c4b4b42418ed895fd3de6863d59652bb3843bf0fdfd9c241c16c04c1","salt":{"words":[1505095718,1228820528,-1025278005,853733013],"sigBytes":16}}';


      global_keystore = new lightwallet.keystore.deserialize(datal);
      global_keystore.passwordProvider = customPasswordProvider;

      AppService.setWeb3Provider(global_keystore);
      localStorage.AppKeys = JSON.stringify({data: global_keystore.serialize()});
      refresh();
    };

    $scope.backupWallet = function () {
      //backup wallet to email

      console.log(cordova.file.dataDirectory);
      $cordovaFile.writeFile(cordova.file.dataDirectory,
                             "leth_keystore.json",
                             JSON.stringify(global_keystore.serialize()),
                             true)
        .then(function (success) {
          $cordovaEmailComposer.isAvailable().then(function() {
            var emailOpts = {
              to: [''],
              attachments: ['' +
                            cordova.file.dataDirectory.replace('file://','') + "leth_keystore.json"],
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

    };

    $scope.editHost = function (addr) {
      localStorage.NodeHost = addr;
      AppService.setWeb3Provider(global_keystore);
    };

    $scope.confirmImport = function () {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Recover wallet',
        template: 'Are you sure you want to import wallet from backup?'
      });
      confirmPopup.then(function (res) {
        if (res) {
          $scope.importWallet();
          console.log('Import wallet from backup');
          refresh();
        } else {
          console.log('Do not import wallet');
        }
      });
    };
    $scope.confirmBackup = function () {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Backup wallet',
        template: 'Backup your wallet to email?'
      });
      confirmPopup.then(function (res) {
        if (res) {
          $scope.backupWallet();
          console.log('Backup wallet');
          refresh();
        } else {
          console.log('Do not backup wallet');
        }
      });
    };

  })

  .controller('ItemsCtrl', function ($scope,  $state, Items, $ionicSwipeCardDelegate, $timeout, FeedService) {
    $scope.doRefresh = function() {
      if($scope.newinfo.length > 0){
        $scope.infoNews = $scope.newinfo.concat($scope.infoNews);
          
        //Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
        
        $scope.newinfo = [];
      } else {
        FeedService.GetNew().then(function(infoNews){
          $scope.infoNews = infoNews.concat($scope.infoNews);
          
          //Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
        });
      }
    };
    
    $scope.loadMore = function(){
      FeedService.GetOld().then(function(items) {
        $scope.infoNews = $scope.infoNews.concat(items);
      
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    };
     var CheckNewInfo = function(){
      $timeout(function(){
        FeedService.GetNew().then(function(infoNews){
          $scope.newinfo = infoNews.concat($scope.newinfo);
        
          CheckNewInfo();
        });
      },100000);
     }
    
    //CheckNewInfo();

    $scope.readNews = function(index){
      //get bonus if exist ... later
      //FeedService.GetBonus();
      $state.go('app.detail',{Item: index});
    };
    $scope.remove = function (info) {
      FeedService.remove($scope.infoNews, info);
    };
    $scope.cards = Array.prototype.slice.call($scope.items, 0, 0);
    $scope.cardSwiped = function(index) {
      $scope.addCard();
    };
    $scope.cardDestroyed = function(index) {
      $scope.cards.splice(index, 1);
    };
    $scope.addCard = function() {
      var newCard = $scope.items[Math.floor(Math.random() * $scope.items.length)];
      newCard.id = Math.random();
      $scope.cards.push(angular.extend({}, newCard));
    }
    $scope.accept = function(index) {
        alert(index);
    };
  })

  .controller('ItemCtrl', function ($scope, $stateParams, FeedService, Items) {
    if($stateParams.Card){
      $scope.item =  Items.get($scope.items, $stateParams.Card);    
     }else
      $scope.item =  FeedService.get($scope.infoNews, $stateParams.Item);    
  })

  .controller('FriendsCtrl', function ($scope, Friends) {

    $scope.remove = function (friend) {
      Friends.remove($scope.friends, friend);
      localStorage.Friends = JSON.stringify($scope.friends);
    };

    $scope.payFriends = function () {
      $state.go('tab.wallet');
      $scope.addrTo = $scope.friend.addr;
    }

  })

  .controller('FriendCtrl', function ($scope, $stateParams) {
    $scope.friend = JSON.parse($stateParams.Friend);
    
     $scope.sendMessage = function () {
      web3.setProvider(new web3.providers.HttpProvider(localStorage.NodeHost));
      var identity = web3.shh.newIdentity();
      var topic = "Lottery";
      var filter = web3.shh.filter([topic]);
      filter.watch(function (error, result) {
        if (!error)
          console.log(result.payload);
      });

      var payload = 'ciao mondo!';
      var message = {
        from: identity,
        topics: [topic],
        payload: payload,
        ttl: 100,
        workToProve: 100
      };
      web3.shh.post(message);
    }

  })

  .controller('TransactionCtrl', function ($scope) {

  })

  .controller('AboutCtrl', function ($scope, angularLoad) {      
   
  })

  .controller('ApplethCtrl', function ($scope, angularLoad, FeedService, DappPath, $templateRequest, $sce, $compile, $ionicSlideBoxDelegate, $http,CountDapp) {
    $ionicSlideBoxDelegate.start();
    $scope.nextSlide = function() {
      $ionicSlideBoxDelegate.next();
    };
    $scope.prevSlide = function() {
      $ionicSlideBoxDelegate.previous();
    };

    var path = DappPath.url + '/dapp_';
    var localpath = 'dappleths/dapp_';    //maybe a list  from an API of dappleth Store: sample app
    //path=localpath; //for development
    
    $scope.appContainer="</br>";

    for(var i=1; i<=CountDapp; i++) {
      $http.get(path + i + '/app.html') 
        .success(function(data){
        $scope.appContainer += $sce.trustAsHtml(data);

      })
    }
  })

  .controller('ApplethRunCtrl', function ($scope, angularLoad, FeedService, DappPath, $templateRequest, $sce, $compile, $ionicSlideBoxDelegate, $http, $stateParams, $ocLazyLoad,$timeout) {
      console.log("Param " + $stateParams.Id);

      //load app selected
      var id = $stateParams.Id;
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
