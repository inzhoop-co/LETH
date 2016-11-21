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
      coin.progress = true;
      $timeout(function() {
        coin.Installed = true;
        var coins = JSON.parse(localStorage.Coins);
        coin.progress = false;
        coins.push(coin);
        localStorage.Coins = JSON.stringify(coins);
      }, 3000);
    };

    $scope.uninstallCoin = function(coin) {
      coin.progress = true;
      $timeout(function() {
        var coins = JSON.parse(localStorage.Coins);
        var index = coins.indexOf(coin);
        coins.splice(index, 1);
        localStorage.Coins = JSON.stringify(coins);
        coin.Installed = false;
        coin.progress = false;
      }, 3000);
      $ionicListDelegate.closeOptionButtons();
    };
  })
  .controller('DapplethRunCtrl', function ($scope, $rootScope, angularLoad, $ionicLoading, $templateRequest, $sce, $interpolate, $compile, 	$ionicSlideBoxDelegate, $http, $stateParams,$timeout, AppService, Chat) {
    $scope.$on('$ionicView.beforeEnter', function() {
      $scope.showTabs(false);
    })

    $scope.$on('$ionicView.beforeLeave', function() {
      $scope.showTabs(true);
    })

    var id = $stateParams.Id;
    $scope.activeApp = $scope.listApps.filter( function(app) {return app.GUID==id;} )[0];
    
    $scope.message = "DapplethRunCtrl";

    $http.get($scope.activeApp.InstallUrl) 
      .success(function(data){
        $scope.appContainer = $sce.trustAsHtml(data);          
    });
    $ionicLoading.show(); 
    angularLoad.loadScript($scope.activeApp.ScriptUrl).then(function() {
      $ionicLoading.hide();
        console.log('loading ' + $scope.activeApp.ScriptUrl);
    }).catch(function() {
        console.log('ERROR :' + $scope.activeApp.ScriptUrl);
    });

    $scope.refresh = function() {
      updateData(); //defined in external js
      $scope.$broadcast('scroll.refreshComplete');
    }

    $rootScope.$on('dappEvent', function(event,args){
      var msg = {type: 'leth', mode: 'dappMessage', from: $scope.activeApp.Address, to: [null], text: args.data.detail, image: '' };
      Chat.sendDappMessage(msg, $scope.activeApp.Identity, $scope.activeApp.Name);  
    });

  })
  .controller('FeedCtrl', function ($scope, $stateParams, $cordovaInAppBrowser, $sce, $http, FeedService) {
    if($stateParams.Item){
      $scope.item =  $scope.listFeeds[$stateParams.Item]; 
      
    /*
     $http.get($scope.item.link) 
        .success(function(data){
          $scope.brwContainer = $sce.trustAsHtml(data);          
      });
    */
      var options = {
        location: 'yes',
        clearcache: 'yes'
      };

      $cordovaInAppBrowser.open($scope.item.link, '_system', options)
      .then(function(event) {
        // success
      })
      .catch(function(event) {
        // error
      });
      
      //window.open($scope.item.link, 'iframeName', 'location=yes');
    }  

  })