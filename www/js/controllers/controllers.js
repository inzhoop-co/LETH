angular.module('leth.controllers', [])
.controller('AppCtrl', function ($ionicHistory, $interval, $scope, $rootScope, $ionicModal,  $cordovaDeviceMotion, $ionicPlatform, 
                                $ionicPopup, $ionicTabsDelegate, $timeout, $cordovaBarcodeScanner, $state, 
                                $ionicActionSheet, $cordovaEmailComposer, $cordovaContacts, $q, $ionicLoading, 
                                $ionicLoadingConfig, $location, $sce, $lockScreen, $cordovaInAppBrowser,$cordovaLocalNotification,
                                $cordovaBadge,$ionicScrollDelegate, $ionicListDelegate, $cordovaClipboard, $cordovaVibration,
                                AppService, Chat, PasswordPopup, Transactions, Friends, ExchangeService, Geolocation, FeedService) {
  
  window.refresh = function () {
    $ionicLoading.show();
    if($scope.idCoin==0 || $scope.idCoin==undefined)    
      $scope.balance = AppService.balance($scope.unit);
    else
      $scope.balance = AppService.balanceOf($scope.contractCoin,$scope.unit + 'e+' + $scope.decimals);

    ExchangeService.getTicker($scope.xCoin, JSON.parse(localStorage.BaseCurrency).value).then(function(value){
      $scope.balanceExc = JSON.parse(localStorage.BaseCurrency).symbol + " " + parseFloat(value * $scope.balance).toFixed(2) ;
    });
    $scope.account = AppService.account();
    $scope.nick = AppService.idkey();
    $scope.qrcodeString = $scope.account + "/" + $scope.nick ;
    $scope.getNetwork();
    $scope.loadFriends();
    $scope.transactions = Transactions.all();
    localStorage.Transactions = JSON.stringify($scope.transactions);
    $scope.readDappsList();
    $scope.readCoinsList();
    //$scope.readFeedsList();
    $timeout(function() {$ionicLoading.hide();}, 1000);
  };

  function keyboardShowHandler(e){
    //patch on open
    
    if($ionicHistory.currentView().stateName== "tab.chats"){
      $scope.scrollTo('chatScroll','bottom');
      //$rootScope.hideTabs = 'tabs-item-hide';
    }

    if($ionicHistory.currentView().stateName== "tab.friend"){
      $scope.scrollTo('chatDMScroll','bottom');
      //$rootScope.hideTabs = 'tabs-item-hide';
    }
  }

  function keyboardHideHandler(e){

  }

  window.addEventListener('native.keyboardshow', keyboardShowHandler);     
  //window.addEventListener('native.keyboardhide', keyboardHideHandler);     

  window.setChatFilter = function(){
    //stop listening shh
    Chat.unlistenMessage();
    //start listening message shh
    Chat.listenMessage($scope);
  }

  $scope.loadFriends = function(){
    $scope.friends = Friends.all();
  }
  
  window.customPasswordProvider = function (callback) {
    var pw;
    PasswordPopup.open("Digit your wallet password", "unlock account to proceed").then(
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
  
  /*
  FeedService.GetFeed().then(function(infoNews){
    $scope.listFeeds = infoNews;
    $scope.cards = Array.prototype.slice.call($scope.listFeeds, 0, 0);
  });
  */
  $scope.openInEtherscan = function(addr){
    var pinUrl = "https://testnet.etherscan.io/address/" + addr;
    
      var options = {
        location: 'yes',
        clearcache: 'yes',
        toolbar: 'yes'
      };

      document.addEventListener("deviceready", function () {
        $cordovaInAppBrowser.open(pinUrl, '_system', options)
          .then(function(event) {
            // success
          })
          .catch(function(event) {
            // error
          });
          //$cordovaInAppBrowser.close();
      }, false);
  }

  var getSync = function(){
    if(!web3.currentProvider) return;

    try {    
        if(web3.eth.syncing)
          $scope.syncStatus = "icon ion-eye-disabled light";
        else
          $scope.syncStatus = "icon ion-eye calm";

        $scope.lastBlock = web3.eth.blockNumber;
    } catch (err) {
      var alertPopup = $ionicPopup.show({
        title: 'Error',
        template: 'Something is wrong! <br/>' + err.message   
      });

      alertPopup.then(function(res) {
         alertPopup.close();
      });
    
      $timeout(function() {
         alertPopup.close(); //close the popup after x seconds for some reason
      }, 3000);
    }
  }

  $scope.infoSync = function(){
     var alertPopup = $ionicPopup.alert({
        title: 'Info Sync Node',
        template: web3.eth.syncing=='false' ? 'Sync status: OK' : 'Sync status: progress' + '<br/>BlockNumber: ' + web3.eth.blockNumber + '<br/>Network: ' + $scope.nameNetwork
      });

      alertPopup.then(function(res) {
        
      });
  }

  $scope.readDappsList = function(){
    $scope.filterStoreCoins = 'button button-small button-outline button-positive';
    $scope.filterStoreApps = 'button button-small button button-positive';
    $scope.filterFeed = 'button button-small button-outline button-positive';
    $scope.isDapp = true;
    $scope.isCoin = false;
    $scope.isFeed = false;

    AppService.getStoreApps().then(function(response){
      $scope.listApps = response;
    }) 

  }; 

  $scope.readCoinsList = function(){
    $scope.filterStoreCoins = 'button button-small button button-positive';
    $scope.filterStoreApps = 'button button-small button-outline button-positive';
    $scope.filterFeed = 'button button-small button-outline button-positive';
    $scope.isDapp = false;
    $scope.isCoin = true;
    $scope.isFeed = false;

    $scope.listCoins = JSON.parse(localStorage.Coins);

    AppService.getStoreCoins().then(function(response){
      angular.merge($scope.listCoins,response);
    }) 
  };      

  $scope.readFeedsList = function(){
    $scope.filterStoreCoins = 'button button-small button-outline button-positive';
    $scope.filterStoreApps = 'button button-small button-outline button-positive';
    $scope.filterFeed = 'button button-small button button-positive';
    $scope.isDapp = false;
    $scope.isCoin = false;
    $scope.isFeed = true;
  };  

  $scope.shareByChat = function (friend,payment) {
    Chat.sendCryptedPaymentReq("Please send me " + payment + " eth &#x1F4B8; !", payment, friend.addr,friend.idkey);
    $state.go('tab.friend', {Friend: friend.addr});
  };

 $scope.inviteFriend = function (friend,param) {
    Chat.sendInviteToDapp(param,friend.addr,friend.idkey);
    $ionicLoading.show({ template: "Done!", noBackdrop: true, duration: 2000 })
    
  };

  $scope.readFeed = function(index){
    $state.go('tab.feed',{Item: index});
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
  var createSaveAddressModal = function(name,comment,address,key) {
    $ionicModal.fromTemplateUrl('templates/addFriend.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      if(name != undefined) {
        $scope.name = name;
      }
      if(comment != undefined) {
        $scope.comment = comment;
      }
      if(address != undefined) {
        $scope.addr = address;
      }
      if(key != undefined) {
        $scope.idkey = key;
      }

      saveAddressModal = modal;
      saveAddressModal.show();
    });
  };

  var addrsModal;
  $scope.openFriendsModal = function (param) {
    createModalFriends(param);
  };
  $scope.closeFriendsModal = function () {
    addrsModal.hide();
    addrsModal.remove();
  };
  var createModalFriends = function(param) {
    $scope.param = param;
    $ionicModal.fromTemplateUrl('templates/addressbook.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      addrsModal = modal;
      addrsModal.show();
    });
  };
  $scope.chooseFriend = function (friend) {
    if($ionicHistory.currentTitle()=="Wallet"){
     $scope.addrTo = friend.addr;
    }
    if($ionicHistory.currentTitle()=="Address")
      $scope.shareByChat(friend, $scope.param);
    if($ionicHistory.currentTitle()=="LΞTH")
      $scope.shareCustomToken(friend, $scope.param);
    if($ionicHistory.currentView().stateName == "tab.dappleth-run"){
      if($scope.param.action=="invite")
        $scope.inviteFriend(friend, $scope.param);
    }

    $scope.closeFriendsModal();
  };

  var tokenModal;
  $scope.openTokenModal = function () {
    createModalToken();
  };
  $scope.closeTokenModal = function () {
    tokenModal.hide();
    tokenModal.remove();
  };
  var createModalToken = function() {
    $ionicModal.fromTemplateUrl('templates/token.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      tokenModal = modal;
      tokenModal.show();
    });
  };

  $scope.addCustomToken = function (token) {
    var customToken = {
      "Custom" : true,
      "Installed" : true,
      "Name" : token.name,
      "GUID" : "C" + $scope.listCoins.length+1,
      "Network" : $scope.nameNetwork, 
      "Company" : token.company,
      "Logo" : token.logo,
      "Symbol" : token.symbol,
      "Decimals" : token.decimals,
      "Abstract" : token.abstract,
      "Address" : token.address,
      "ABI" : JSON.parse(token.ABI),
      "Send" : "transfer",
      "Events" : [{"Transfer":"address indexed from, address indexed to, uint256 value"}],
      "Units":[{"multiplier": "1", "unitName": "Token"}]
    }

    $scope.listCoins.push(customToken);
    localStorage.Coins = JSON.stringify($scope.listCoins);
    
    $scope.closeTokenModal();
  };

  $scope.removeCustomToken = function (token) {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Delete Custom Token',
      template: 'Are you sure you want to delete this Token?'
    });

    confirmPopup.then(function(res) {
      if(res) {
        $scope.listCoins.splice($scope.listCoins.indexOf(token),1);
        localStorage.Coins = JSON.stringify($scope.listCoins);
      }
    
      $scope.readCoinsList();
      $ionicListDelegate.closeOptionButtons();
   });
   
  }

  $scope.shareCustomToken = function (friend,token) {
    Chat.sendCryptedCustomToken("Use this token " + token.Name + " !", token, friend.addr,friend.idkey);

    $ionicListDelegate.closeOptionButtons();
  }

  $scope.showCustomTokenInfo = function(param) {
    $scope.token = param;
    $ionicModal.fromTemplateUrl('templates/token-info.html', {
      scope: $scope,
      animation: 'slide-in-right'
    }).then(function (modal) {
      tokenModal = modal;
      tokenModal.show();
    });
  };

  $scope.isValidAddr = function(addr){
    if(!web3.isAddress(addr)) {return false};

    return true;
  };

  $scope.scanTo = function () {
    document.addEventListener("deviceready", function () {      
      $cordovaBarcodeScanner
        .scan()
        .then(function (barcodeData) {
          if(barcodeData.text!= ""){
			      $state.go('tab.wallet', {addr: barcodeData.text});
			      console.log('read code: ' + barcodeData.text);
		      }
        }, function (error) {
          // An error occurred
          console.log('Error!' + error);
        });
    }, false);          
  };

  $scope.lat = "N/A";
  $scope.long = "";

  $scope.geoWatch;    
  /*
  $scope.watchLocation = function(){
    $scope.geoWatch = Geolocation.watchPosition();
    $scope.geoWatch.then(
      null,
      function (err) {
        console.log(err);
        $scope.geoWatch.clearWatch();
        $scope.watchLocation();
      },
      function (position) {
        console.log(position);
        $scope.lat  = position.coords.latitude;
        $scope.long = position.coords.longitude;
        //Chat.sendPosition(position);
      });
  }
  */

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
    try{
      web3.eth.getBlock(0, function(e, res){
        if(!e){
          switch(res.hash) {
            case '0x0cd786a2425d16f152c658316c423e6ce1181e15c3295826d7c9904cba9ce303':
              $scope.nameNetwork = 'Morden';
              $scope.classNetwork = 'royal';                
              $scope.badgeNetwork = 'badge badge-royal';
              break;
            case '0x41941023680923e0fe4d74a34bdac8141f2540e3ae90623718e47d66d1ca4a2d':
              $scope.nameNetwork = 'Ropsten';
              $scope.classNetwork = 'positive';                
              $scope.badgeNetwork = 'badge badge-positive';
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
      getSync();
    } catch(err){
      console.log(err.message);
    }
  };

  $scope.sendFeedback = function(){
    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: '<i class="ion-sad-outline"></i> Poor'  },
        { text: '<i class="ion-happy-outline"></i> Good' },
        { text: '<i class="ion-help-buoy"></i> Make donation' }

      ],
      destructiveText: (ionic.Platform.isAndroid()?'<i class="icon ion-android-exit assertive"></i> ':'')+'Cancel',
      titleText: 'Send your mood to Inzhoop',
      destructiveButtonClicked:  function() {
        hideSheet();
      },
      buttonClicked: function(index) {
        if(index==2){
            $state.go('tab.wallet', {addr: "0xd1324ada7e026211d0cacd90cae5777e340de948"});
        }else{
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
        }
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
        $scope.addr = barcodeData.text.split('#')[0];
        $scope.idkey = barcodeData.text.split('#')[1];
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
    if(!lightwallet.keystore.isSeedValid(seed)){
      var alertPopup = $ionicPopup.alert({
        title: 'Invalid Seed',
        template: 'The Seed provided is not valid!'
      });

      alertPopup.then(function(res) {
        createEntropyModal();
      });
    }else{
      $ionicLoading.show();
      //register inzhoop user in addressbook
      var usrInzhoop = {"addr":"0xd1324ada7e026211d0cacd90cae5777e340de948","idkey":"0xc34293fdf389d8d5c0dd852d0e858576d367342777a57347e2407f64b1446b1c","name":"inzhoop","icon":"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAAgACADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD7M8D+B/8AhDPtv/E0+2fbPL/5YeXs2bv9o5zu/SuW/wCSM/8AUY/tj/t38ryv++92fN9sY754x/2kP2b/APhoP/hHf+Kz/sD+wPtf/MO+1ed5/k/9NU27fJ987u2OeW+LHxY/4ZK/sr/iQf8ACVf8JV5//L19h+zfZvL/ANiXfu+0f7ONnfPH5NkeZ/257arjcT9axGK5faYXk9n7X2d1D9+kow5IpVPdtzW5HdsvM8t/s72NLBUfY06PNyV+bn9nz2cv3bbc+dtw1vy35lax6D/yWb/qD/2P/wBvHm+b/wB8bceV75z2xz1PjjwP/wAJn9i/4mn2P7H5n/LDzN+/b/tDGNv614r8J/ix/wANa/2r/wASD/hFf+EV8j/l6+3faftPmf7EWzb9n/2s7+2Oep/Zv/Zv/wCGfP8AhIv+Kz/t/wDt/wCyf8w77L5Pked/01fdu872xt754M8zP+w/Y1cFifquIwvN7PC8ntPZe0sp/v2nGfPFup71+W/IrNBlmW/2j7aljaPtqdbl56/Nye05LuP7tNOHI0oaW5rczvc5b9sj4sf8Kv8A+EQ/4kH9p/2n/aH/AC9eT5fl/Z/9hs58z2xj3rz7/lH1/wBT7/wnv/cL+xfYf+//AJm/7Z/s7fL/AIt3HoP7ZHxY/wCFX/8ACIf8SD+0/wC0/wC0P+XryfL8v7P/ALDZz5ntjHvXlnwn+LH/AAtD+1f+JB/Zn9meR/y9ed5nmeZ/sLjHl++c+1fdcF5DHiThfAYPEV7UF7Xnpcvx/vJOPvpqUeWS5tHrs9D5ziPNZ5FnGKxdHD3m+S1Tn291J+6007p8u2m5pf8AKQX/AKkL/hAv+4p9t+3f9+PL2fY/9rd5n8O3n0H9jf4sf8LQ/wCEv/4kH9mf2Z/Z/wDy9ed5nmfaP9hcY8v3zn2ryz4sfFj/AIVf/ZX/ABIP7T/tPz/+XryfL8vy/wDYbOfM9sY969T/AGN/ix/wtD/hL/8AiQf2Z/Zn9n/8vXneZ5n2j/YXGPL9859qONMhjw3wvj8Hh696D9lyUuX4P3kXL323KXNJ82r02WgcO5rPPc4wuLrYe01z3qc+/utL3UklZLl213P/2Q==","unread":0}
      $scope.friends.push(usrInzhoop);

      //add keystore for encryption
      lightwallet.keystore.deriveKeyFromPassword(code, function (err, pw2DerivedKey) {
        local_keystore = new lightwallet.keystore(seed, pw2DerivedKey,hdPath);
        var info={curve: 'curve25519', purpose: 'asymEncrypt'};
        local_keystore.addHdDerivationPath(hdPath,pw2DerivedKey,info);
        local_keystore.generateNewEncryptionKeys(pw2DerivedKey, 1, hdPath);
        local_keystore.setDefaultHdDerivationPath(hdPath);
        local_keystore.passwordProvider = code; //customPasswordProvider;
      });

      lightwallet.keystore.deriveKeyFromPassword(password, function (err, pwDerivedKey) {
        global_keystore = new lightwallet.keystore(seed, pwDerivedKey);
        global_keystore.generateNewAddress(pwDerivedKey, 1);
        global_keystore.passwordProvider = customPasswordProvider;

        AppService.setWeb3Provider(global_keystore);

        localStorage.AppKeys = JSON.stringify({data: global_keystore.serialize()});
        localStorage.EncKeys = JSON.stringify({data: local_keystore.serialize()});
        localStorage.AppCode = JSON.stringify({code: code});
        localStorage.HasLogged = JSON.stringify(true);
        localStorage.Transactions = JSON.stringify({});
        localStorage.Friends = JSON.stringify($scope.friends);

        $rootScope.hasLogged = true;

        var msg = 'new user added';
        Chat.sendMessage(msg);

        refresh();

        $state.go('tab.dappleths');
        //$location.path('/tab/dappleths');
        //$timeout(function() {$ionicLoading.hide();}, 1000);
      });
    }
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

  $scope.addAddress = function(name,comment,address,key) {
    createSaveAddressModal(name,comment,address,key);
  }

  $scope.closeSaveAddressModal = function() {
    $scope.name = "";
    $scope.addr = "";
    $scope.comment ="";
    $scope.idkey = "";
    saveAddressModal.remove();
  }

  $scope.isFriend = function(address) {
    var res = Friends.get(address);
    if(address == AppService.account())
        return "me" ; 
    if(res==undefined)
      return "";
    else         
      return res.name ;
  }

  $scope.saveAddr = function(name,addr,idkey,comment){
    if($scope.isFriend(addr))
      Friends.update(name,addr,idkey,comment);
    else
      Friends.add(name,addr,idkey,comment);
    
    $scope.closeSaveAddressModal(); 
    $scope.friends = Friends.all();
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
    document.addEventListener("deviceready", function () {   
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

  var imageModal;
  var createImageModal = function(img) {
    $scope.imageSrc  = img;
    $ionicModal.fromTemplateUrl('templates/image-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      imageModal = modal;
      imageModal.show();
    });
  }

  $scope.openModalIMG = function(img) {
    $scope.imageSrc = img;
    imageModal.show();
  };

  $scope.closeModalIMG = function() {
    imageModal.hide();
  };

  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    imageModal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modalIMG.hide', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modalIMG.removed', function() {
    // Execute action
  });
  $scope.$on('modalIMG.shown', function() {
    //console.log('Modal is shown!');
  });

  $scope.goLogin = function(random){
    closeEntropyModal();
    // create keystore and account and store them
    var extraEntropy = random.toString();
    $scope.randomSeed = lightwallet.keystore.generateRandomSeed(extraEntropy);
    createLoginModal();
  }

  $scope.restoreLogin = function(seed){
    closeEntropyModal();
    // restore keystore from seed 
    $scope.randomSeed = seed;
    createLoginModal();
  }

  $scope.Login = function (seed, pw, cod) { 
    var err;
    if(!lightwallet.keystore.isSeedValid(seed))
      err = "Seed not valid <br/>";
    if(!pw || pw.length<8 || pw.length>20)
      err = "Password not valid <br/>";
    if(!cod || cod.length!=4)
      err = "Code not valid <br/>";

    if(err){
      var alertPopup = $ionicPopup.show({
        title: 'Error',
        template: 'Invalid data! <br/>' + err   
      });

      alertPopup.then(function(res) {
         alertPopup.close();
      });

      $timeout(function() {
         alertPopup.close(); 
      }, 3000);

    }else{
      $scope.createWallet(seed, pw, cod);
      $scope.closeLoginModal();      
    }
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
  //$scope.fromStore(true);
  $scope.readFeedsList();

  $scope.currencies = ExchangeService.getCurrencies();
  $scope.xCoin = "XETH";
  
  if($rootScope.hasLogged ){
    var ls = JSON.parse(localStorage.AppKeys);
    var ks = JSON.parse(localStorage.EncKeys);
    code = JSON.parse(localStorage.AppCode).code;
    $scope.transactions = JSON.parse(localStorage.Transactions);

    global_keystore = new lightwallet.keystore.deserialize(ls.data);
    global_keystore.passwordProvider = customPasswordProvider;

    local_keystore = new lightwallet.keystore.deserialize(ks.data);
    local_keystore.passwordProvider = customPasswordProvider; //to verify

    AppService.setWeb3Provider(global_keystore);
    $scope.qrcodeString = AppService.account();

  setChatFilter();


  }else{
    createEntropyModal();
  }

  /**
  ** CHATS section
  */
  $scope.msgCounter = 0;
  $scope.DMCounter = 0;
  $scope.DMchats = Chat.findDM(); 
  $scope.DAPPchats = Chat.findDAPP(); 
  $scope.chats = Chat.find(); 

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

  $scope.scheduleSingleNotification = function (title, text, id) {
    document.addEventListener("deviceready", function () {        
      $cordovaLocalNotification.schedule({
          id: id,
          //title: title,
          text: text
        }).then(function (result) {
          //console.log('Notification 1 triggered');
        });
    }, false); 
  };

  $scope.scrollTo = function(handle,where){
    $timeout(function() {
      $ionicScrollDelegate.$getByHandle(handle).resize();
      $ionicScrollDelegate.$getByHandle(handle).scrollTo(where,350);
    }, 1000);

  }

  $scope.chooseAction = function(msg){
    var buttonsOpt= [{ text: '<i class="icon ion-ios-copy-outline"></i> Copy message', index: 1 }];

    if((msg.mode=='plain' || msg.mode=="contact") && msg.attach.addr && msg.attach.idkey){
      if($scope.isFriend(msg.attach.addr) && msg.attach.addr!=AppService.account())
        buttonsOpt.push({ text: '<i class="icon ion-ios-person-outline"></i>Go to Friend', index: 2 })
      else
        buttonsOpt.push({ text: '<i class="icon ion-ios-personadd-outline"></i>Add to Friends', index: 3 })
    }
    if(msg.mode=="geolocation" && msg.attach)
      buttonsOpt.push({ text: '<i class="icon ion-ios-navigate-outline"></i>Open location', index: 4 });
    if(msg.mode=="payment" && msg.attach)
      buttonsOpt.push({ text: '<i class="icon icon-wallet"></i>Pay request', index: 5 });
    if(msg.mode=="token" && msg.attach)
      buttonsOpt.push({ text: '<i class="icon ion-ios-circle-outline"></i>Install token', index: 6 });

    if(msg.image){
        buttonsOpt.push({ text: '<i class="icon ion-image"></i>Show Image', index: 7 })
    }

    var hideSheet = $ionicActionSheet.show({
      buttons: buttonsOpt,
      destructiveText: (ionic.Platform.isAndroid()?'<i class="icon ion-android-exit assertive"></i> ':'')+'Cancel',
      titleText: 'Choose an action',
      destructiveButtonClicked:  function() {
        hideSheet();
      },
      buttonClicked: function(index) {
        switch(this.buttons[index].index){
          case 1: //copy message
            document.addEventListener("deviceready", function () {  
              if(msg.image){
                $cordovaClipboard.copy(msg.image).then(function () {
                  // success
                }, function () {
                  // error
                });
              }else{
                $cordovaClipboard.copy(msg.text).then(function () {
                    // success
                }, function () {
                    // error
                });
              }
            }, false);
            break;
          case 2: //go to friend
            $state.go('tab.friend', {Friend: msg.attach.addr}, { relative: $state.$current.view});
            break;
          case 3: // add to friends
            $scope.addAddress(msg.attach.addr, msg.text, msg.attach.addr,msg.attach.idkey)
            break;
          case 4: // open location
            var pinUrl = "https://www.google.com/maps/place/" + msg.attach.latitude + "," + msg.attach.longitude
      
            var options = {
              location: 'yes',
              clearcache: 'yes',
              toolbar: 'yes'
            };

            document.addEventListener("deviceready", function () {
              $cordovaInAppBrowser.open(pinUrl, '_blank', options)
                .then(function(event) {
                  // success
                })
                .catch(function(event) {
                  // error
                });
                //$cordovaInAppBrowser.close();
            }, false);
            break;
          case 5: // pay request
            $state.go('tab.wallet', {addr: msg.attach.addr + "#" + msg.attach.idkey + "@" + msg.attach.payment}, { relative: $state.$current.view});
            break;
          case 6: // install token
            var msgTxt = "<h2 class='text-center'>Custom Token " + msg.attach.token.Name + " Shared! </h2>";
            msgTxt += "<p class='text-center'><img height='100px' width='auto' src='" + msg.attach.token.Logo + "'/></p>";
              
            var confirmPopup = $ionicPopup.confirm({
              title: 'Install Custom Token',
              template: 'A new Token shared with you!<br/>Do you want to add ' + msg.attach.token.Name + '?'
            });

            confirmPopup.then(function(res) {
              if(res) {
                if($scope.listCoins.indexOf(msg.attach.token)==-1)
                  $scope.listCoins.push(msg.attach.token);
                localStorage.Coins = JSON.stringify($scope.listCoins);
                $state.go('tab.dappleths', { relative: $state.$current.view});
               }
            });
            break;
          case 7: // show image
            createImageModal(msg.image);
            break;
        }
        hideSheet();
       $timeout(function() {
         hideSheet();
        }, 20000);
      }
    });
  }

  $scope.chooseDappAction = function(dapp){
    var buttonsOpt= [{ text: '<i class="icon ion-android-share-alt"></i> Invite a friend', index: 1 }];
    
    var hideSheet = $ionicActionSheet.show({
      buttons: buttonsOpt,
      destructiveText: (ionic.Platform.isAndroid()?'<i class="icon ion-android-exit assertive"></i> ':'')+'Cancel',
      titleText: 'Choose an action',
      destructiveButtonClicked:  function() {
        hideSheet();
      },
      buttonClicked: function(index) {
        switch(this.buttons[index].index){
          case 1: // invite friend
            $scope.openFriendsModal({action:"invite", sender: dapp, message: "Come on " + dapp.Name });
            break;
        }
        hideSheet();
       $timeout(function() {
         hideSheet();
        }, 20000);
      }
    });
  }

  $scope.vibrate = function(){
    if(localStorage.Vibration){
      document.addEventListener('deviceready', function () {
        $cordovaVibration.vibrate(100);
      });
    }
  }

  $scope.$on('incomingMessage', function (e, payload) {
    if(!payload.to[0]){
      //public msg
      if($ionicTabsDelegate.selectedIndex()==1) 
        $scope.scrollTo('chatScroll','bottom');
      else{
        if(payload.time > JSON.parse(localStorage.LastMsg).time){
          $scope.msgCounter += 1;
          localStorage.LastMsg = JSON.stringify({time: payload.time, hash: payload.hash});
        }
      }
      $scope.vibrate(); 
    }

    if(payload.to[0] && payload.to[0]==AppService.account()){
      //direct to me
      if(!$scope.isFriend(payload.from)){
        Friends.add(payload.from,payload.from,payload.senderKey,payload.text);
      }
      if($ionicHistory.currentView().stateName=='tab.friend' && 
        $ionicHistory.currentView().stateParams.Friend == payload.from)
        $scope.scrollTo('chatDMScroll','bottom');
      else{
        if(payload.time > JSON.parse(localStorage.LastMsg).time){
          $scope.DMCounter += 1;
          Friends.increaseUnread(payload.from);
          localStorage.LastMsg = JSON.stringify({time: payload.time, hash: payload.hash});
        }
      }

      if(payload.mode=="transaction")
        Transactions.add(payload.attach);

      if(payload.mode=="token")
        //Token.add(payload.attach);

      $scope.loadFriends();
      $scope.vibrate(); 
    }

    $scope.$digest(); 
  });


  document.addEventListener('deviceready', function () {
    // Android customization
    cordova.plugins.backgroundMode.setDefaults({ text:'Doing heavy tasks.'});
    // Enable background mode
    if(localStorage.BackMode=="true"){
      cordova.plugins.backgroundMode.enable();
      console.log('device ready for background');
    }else
    console.log('backmode not activated');

    
     // Called when background mode has been activated
    cordova.plugins.backgroundMode.onactivate = function() {
      console.log('backgroundMode activated');
      $scope.$on('incomingMessage', function (e, payload) {
        var msg="new message on LETH";
        if(payload.text.length)
          msg = $sce.trustAsHtml(payload.text);
        if(payload.image.length)
          msg = "Image sent";

        var toNotify = false;
        if(!payload.to[0] || (payload.to[0] && payload.to.indexOf(AppService.account())!=-1)){
          toNotify=true;
        }

        //console.log('in backgroundMode:' + msg);    
        if(toNotify){
          $scope.scheduleSingleNotification(payload.from,msg,payload.hash);
          $scope.increaseBadge();
        }
      });
    }

    cordova.plugins.backgroundMode.ondeactivate = function() {
      console.log('backgroundMode deactivated');
      if(localStorage.PinOn=="true"){
        $lockScreen.show({
          code: JSON.parse(localStorage.AppCode).code,
          touchId: JSON.parse(localStorage.TouchOn),
          ACDelbuttons: true,
          onCorrect: function () {
            $scope.cancelAllNotifications();
            $scope.clearBadge();
          },
          onWrong: function (attemptNumber) {
          },
        });
      };
    };

  }, false);

  $scope.cancelAllNotifications = function () {
    $scope.msgCounter = 0;
    document.addEventListener("deviceready", function () {        
      $cordovaLocalNotification.cancelAll().then(function (result) {
            console.log('All Notification Canceled');
      });
    }, false); 
  };

  $scope.cancelDMNotifications = function () {
    $scope.DMCounter = 0;      
    document.addEventListener("deviceready", function () {        
      $cordovaLocalNotification.cancelAll().then(function (result) {
            console.log('DM Notification Canceled');
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
.controller('TransactionCtrl', function ($scope, $stateParams, $ionicPopup, $ionicListDelegate, Transactions) {
  $scope.isFromTo = function(item) {
      if($stateParams.addr!="")
        return (item.to == $stateParams.addr || item.from == $stateParams.addr);
      return item;
  }

 $scope.checkStatus = function(t){
    web3.eth.getTransaction(t.id, function(err,res){
      if(res){
        t.block = res.blockNumber;
        Transactions.upd(t);
        $scope.transactions = Transactions.all();
        $scope.$digest(); 
      }
    });

    $ionicListDelegate.closeOptionButtons();
 }

  $scope.deleteTransaction = function(t){
    var confirmPopup = $ionicPopup.confirm({
      title: 'Delete Transaction',
      template: 'Are you sure you want to delete this transaction?'
    });

    confirmPopup.then(function(res) {
     if(res) {
        Transactions.del(t);
     }

     $ionicListDelegate.closeOptionButtons();
   });
  }

  $scope.deleteAllTransactions = function(){
    var confirmPopup = $ionicPopup.confirm({
      title: 'Delete Transactions',
      template: 'Are you sure you want to delete all transactions?'
    });

    confirmPopup.then(function(res) {
     if(res) {
        Transactions.delAll();
        $scope.transactions = Transactions.all();
     }
   });
  }

})