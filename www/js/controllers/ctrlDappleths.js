angular.module('leth.controllers')  
  .controller('DapplethsCtrl', function ($scope, $state, angularLoad, $ionicLoading, $ionicListDelegate, $ionicPopup, $timeout, $templateRequest, $sce, $compile, $ionicSlideBoxDelegate, $http, $cordovaInAppBrowser, AppService, FeedService) {
    $ionicSlideBoxDelegate.start();
    $scope.nextSlide = function() {
      $ionicSlideBoxDelegate.next();
    };
    $scope.prevSlide = function() {
      $ionicSlideBoxDelegate.previous();
    };

    refresh();

    $scope.cardSwiped = function(index) {
      $scope.addCard();
    };
    $scope.cardDestroyed = function(index) {
      $scope.cards.splice(index, 1);
    };
    $scope.addCard = function() {
      var i = Math.floor(Math.random() * $scope.listFeeds.length);
      var newCard = $scope.listFeeds[i];
      newCard.id = i;
      $scope.cards.push(angular.extend({}, newCard));
    }
    
    $scope.accept = function(index) {
        alert(index);
    };
    
    $scope.earn = function(index){
      $scope.item =  $scope.listFeeds[index]; 

      var options = {
        location: 'no',
        clearcache: 'yes'
      };

      var earnPopup = $ionicPopup.show({
        title: "1 coins earned!",
        scope: $scope
      })  

      earnPopup.then(function(res){
        document.addEventListener("deviceready", function () {      
          $cordovaInAppBrowser.open($scope.item.link, '_system', options)
            .then(function(event) {
              // success
            })
            .catch(function(event) {
              // error
            });      
        }, false); 
      })

      $timeout(function(){
        earnPopup.close();
         
      }, 2000);
    }

    $scope.installCoin = function(coin) {
      coin.Progress = true;
      $timeout(function() {
        coin.Installed = true;
        $scope.listCoins.filter(function (c) {
          if(c.GUID === coin.GUID){
            c.Installed = true;
            c.Progress = false;
          }
        })
        coin.Progress = false;
        if($scope.listCoins.indexOf(coin)==-1)
          $scope.listCoins.push(coin);
        localStorage.Coins = JSON.stringify($scope.listCoins);
      }, 3000);
    };

    $scope.uninstallCoin = function(coin) {
      coin.Progress = true;
      var coins = JSON.parse(localStorage.Coins);
      $timeout(function() {
        if(!coin.Custom){
          coins.splice(coins.indexOf(coin), 1);
        }else{
          coins.filter(function (c) {
            if(c.GUID === coin.GUID){
              c.Installed = false;
              c.Progress = false;
            }
          })
        }
        coin.Progress = false;
        localStorage.Coins = JSON.stringify(coins);
        $scope.listCoins = JSON.parse(localStorage.Coins);
      }, 3000);
      $ionicListDelegate.closeOptionButtons();
    };
  })
  .controller('DapplethRunCtrl', function ($scope, $rootScope, $ionicHistory, angularLoad, $ionicLoading, $templateRequest, $sce, $interpolate, $compile, 	$ionicSlideBoxDelegate, $http, $stateParams,$timeout, StoreEndpoint, AppService, Chat) {
    var id = $stateParams.Id;
    $scope.activeApp = $scope.listApps.filter( function(app) {return app.GUID==id;} )[0];
    
    $http.get(StoreEndpoint.url + $scope.activeApp.InstallUrl) 
      .success(function(data){
        $scope.appContainer = $sce.trustAsHtml(data);          
    });
    
    $ionicLoading.show(); 

    dappContract = web3.eth.contract($scope.activeApp.ABI).at($scope.activeApp.Address);

    angularLoad.loadScript(StoreEndpoint.url + $scope.activeApp.ScriptUrl).then(function() {
      $ionicLoading.hide();
        console.log('loading ' + StoreEndpoint.url + $scope.activeApp.ScriptUrl);
    }).catch(function() {
        console.log('ERROR :' + StoreEndpoint.url + $scope.activeApp.ScriptUrl);
    });

    $scope.refresh = function() {
      updateData(); //defined in external js
      $scope.$broadcast('scroll.refreshComplete');
    }

    $scope.initDapp = function() {
      init(); //defined in external js
    }

    $scope.scan = function() {
      document.addEventListener("deviceready", function () {      
      $cordovaBarcodeScanner
        .scan()
        .then(function (barcodeData) {
          if(barcodeData.text!= ""){
            console.log('read code: ' + barcodeData.text);
          }
        }, function (error) {
          console.log('Error!' + error);
        });
      }, false);   
    }

    $scope.$on("$ionicView.enter", function () {
       //$ionicHistory.clearCache();
       $scope.initDapp(); 
    });

    $rootScope.$on('dappEvent', function(event,args){
      var msg = args.data.detail;
      Chat.sendDappMessage(msg, $scope.activeApp);  
    });

  })