angular.module('leth.controllers')  
  .controller('DapplethsCtrl', function ($scope, $state, angularLoad, $ionicLoading, $ionicListDelegate, $ionicPopup, $timeout, $templateRequest, $sce, $compile, $ionicSlideBoxDelegate, $http, $cordovaInAppBrowser, AppService) {
    $ionicSlideBoxDelegate.start();
    $scope.nextSlide = function() {
      $ionicSlideBoxDelegate.next();
    };
    $scope.prevSlide = function() {
      $ionicSlideBoxDelegate.previous();
    };

    refresh();
    
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
      $timeout(function() {
        coin.Installed = false;
        $scope.listCoins.filter(function (c) {
          if(c.GUID === coin.GUID){
            c.Installed = false;
            c.Progress = false;
          }
        })
        coin.Progress = false;
        localStorage.Coins = JSON.stringify($scope.listCoins);
      }, 2000);
      $ionicListDelegate.closeOptionButtons();
    };

    $scope.uninstallCoinOLD = function(coin) {
      coin.Progress = true;
      var coins = $scope.listCoins;
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
      }, 2000);
      $ionicListDelegate.closeOptionButtons();
    };
  })
  .controller('DapplethRunCtrl', function ($scope, $rootScope, $ionicHistory, angularLoad, $ionicLoading, $templateRequest, 
                                          $sce, $interpolate, $compile, 	$ionicSlideBoxDelegate, $http, $stateParams,$timeout, 
                                           StoreEndpoint, AppService, Chat, DappService) {
    var id = $stateParams.Id;
    $scope.Dapp=[];
    $scope.Dapp.activeApp = $scope.listApps.filter( function(app) {return app.GUID==id;} )[0];
    

    $scope.$on("$ionicView.enter", function () {
      $ionicHistory.clearCache();
      //$scope.scrollTo('chatScroll','bottom');
      //$scope.$digest(); 
    });
    

    $scope.$on("$ionicView.afterEnter", function () {    
        angularLoad.loadScript(StoreEndpoint.url + $scope.Dapp.activeApp.ScriptUrl).then(function(result) {
            dappleth.run({scope: $scope, service: DappService, plugin: $ionicSlideBoxDelegate});
            $ionicLoading.hide();
        }).catch(function(err) {
            console.log('ERROR :' + StoreEndpoint.url + $scope.Dapp.activeApp.ScriptUrl);
        });
    });

    $scope.$on("$ionicView.beforeLeave", function () {
      $ionicHistory.clearCache();

      //dappleth.destroy();
      dappleth = null;

      angularLoad.resetScript($scope.Dapp.activeApp.ScriptUrl, "js");
      removejscssfile($scope.Dapp.activeApp.ScriptUrl, "js"); 
    });
    
    $scope.refresh = function() {
      //dappleth.update();
      $scope.$broadcast('scroll.refreshComplete');
    }

    var isLoaded = function(filename, filetype){
        var targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none" //determine element type to create nodelist from
        var targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none" //determine corresponding attribute to test for
        var allsuspects=document.getElementsByTagName(targetelement)
        for (var i=allsuspects.length; i>=0; i--){ //search backwards within nodelist for matching elements to remove
        if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1)
            return true;
        }
        return false;
    }

    var removejscssfile = function(filename, filetype){
        var targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none" //determine element type to create nodelist from
        var targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none" //determine corresponding attribute to test for
        var allsuspects=document.getElementsByTagName(targetelement)
        for (var i=allsuspects.length; i>=0; i--){ //search backwards within nodelist for matching elements to remove
        if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1)
            allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
        }
    }

    $scope.isFromDapp = function(item){
      if($scope.Dapp.activeApp.GUID == item.guid)
        return true; 
      return false;
    }

  })