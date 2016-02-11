angular.module('leth.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $ionicPopup, $timeout, $cordovaBarcodeScanner, $state, AppService, $q, PasswordPopup, Transactions, Friends, Items) {

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
          // Success! Barcode data is here
          //Try to Validate before put in field
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

    //QmTQmAEHDzAk9i4BBES1BBhTj1v9KmF8Vcngyns1cd1XpX

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
      $scope.ipfsItems = ["QmTQmAEHDzAk9i4BBES1BBhTj1v9KmF8Vcngyns1cd1XpX"];
      localStorage.ipfsItems = JSON.stringify($scope.ipfsItems);
    }

    if (typeof localStorage.Items == 'undefined') {
      var itemsHash = JSON.parse(localStorage.ipfsItems);
      loadItems(itemsHash);
    } else {
      $scope.items = JSON.parse(localStorage.Items);
    }

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

  })

  .controller('AddressCtrl', function ($scope, AppService, $ionicPopup) {
    $scope.size = 250;
    $scope.correctionLevel = 'H';
    $scope.typeNumber = 6;
    $scope.inputMode = '';
    $scope.image = true;

    $scope.showAddress = function () {
      var alertPopup = $ionicPopup.alert({
        title: 'Wallet Address',
        template: $scope.qrcodeString
      });

      alertPopup.then();
    };

    $scope.shareByEmail = function () {
      window.location.href = "mailto:?subject=Leth - Richiesta di Pagamento&body=Inviami un pagamento a questo indirizzo: " + $scope.qrcodeString;
    };


  })

  .controller('SettingsCtrl', function ($scope, $ionicPopup, AppService) {

    $scope.addrHost = localStorage.NodeHost;

    $scope.importWallet = function () {
      //import wallet from (static value)
      var datal = '{"encSeed":{"encStr":"U2FsdGVkX1/TZRr3RnGrokz0r1v1nBj+qvkSwlYOSinCGUmgAr2bg6msxh3tmXu6NzojB+TVBBBvNBoshCn43qV+XEUi4dkdsIrWUdHNivgyeYRNf8K5daMGXiAapxIh","iv":"b2237015ccb4dd55fa0571f20ad64e66","salt":"d3651af74671aba2"},"encHdRootPriv":{"encStr":"U2FsdGVkX19AGRaRLGkRMY2RVdHrI0fV3B6lr2CTlOH7k+eUya9VSANXY886laiyhxCBFVPJJeuNph9iXfjaxz5a3ktxRJ/361WeJfCx1Y6FnrjEv0LE1V9dEleXA73RWJ7MZW8NbQcgGkVmCZ64L+qh9dM9EnbpI0S/BQ52EoA=","iv":"4e4f267e357c2f4b2d51d5183eefb507","salt":"401916912c691131"},"hdIndex":1,"encPrivKeys":{"d1324ada7e026211d0cacd90cae5777e340de948":{"key":"U2FsdGVkX1+t8Y7gU4jmt9L3WXAu1GwDQioNLTpEXknHZsGzOw1aFTlqzPUCkbpwbR+PTTR71XCtwSxzUD8Lhg==","iv":"3b2bec0c28997f8a9873538ff7407160","salt":"adf18ee05388e6b7"}},"addresses":["d1324ada7e026211d0cacd90cae5777e340de948"],"keyHash":"935cb8c28d033a9e9d9d25db59db954d55990944837c1b953f4d78196995080da5f4e140c4b4b42418ed895fd3de6863d59652bb3843bf0fdfd9c241c16c04c1","salt":{"words":[1505095718,1228820528,-1025278005,853733013],"sigBytes":16}}';


      global_keystore = new lightwallet.keystore.deserialize(datal);
      global_keystore.passwordProvider = customPasswordProvider;

      AppService.setWeb3Provider(global_keystore);
      localStorage.AppKeys = JSON.stringify({data: global_keystore.serialize()});
      refresh();
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
  })


  .controller('ItemsCtrl', function ($scope, Items, $ionicSwipeCardDelegate) {

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

  .controller('ItemCtrl', function ($scope, $stateParams, Items) {
    $scope.item = Items.get($scope.items, $stateParams.Item);
    
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
    //ToDo: per il momento va bene cosi bisogna creare un servizio per passare lo scope tra un controller ed un altro
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

  });