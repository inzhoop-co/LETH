angular.module('leth.controllers')  
  .controller('DapplethsCtrl', function ($rootScope, $scope, $state, angularLoad, $ionicLoading, 
                                          $ionicListDelegate, $ionicPopup, $timeout, $templateRequest, 
                                          $sce, $compile, $ionicSlideBoxDelegate, $http, 
                                          $cordovaInAppBrowser, AppService) {
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
        $scope.listTokens.filter(function (c) {
          if(c.Address === coin.Address){
            c.Installed = true;
            c.Progress = false;
            c.Network = $scope.nameNetwork;
          }
        })
        coin.Progress = false;

        AppService.addLocalToken(coin);

        AppService.getAllTokens($scope.nameNetwork).then(function(response){
          $scope.listTokens = response;
        }, function(err){
          $scope.listTokens=null;
        });
    
      }, 1500);
    };

    $scope.uninstallCoin = function(coin) {
      coin.Progress = true;
      $timeout(function() {
        coin.Installed = false;
        $scope.listTokens.filter(function (c) {
          if(c.Address === coin.Address){
            c.Installed = false;
            c.Progress = false;
          }
        })
        coin.Progress = false;
        
        AppService.addLocalToken(coin);

      }, 1500);
      $ionicListDelegate.closeOptionButtons();
    };
  })
  .controller('DapplethRunCtrl', function ($scope, $rootScope, $ionicHistory, angularLoad, $ionicLoading, $templateRequest, 
                                          $sce, $interpolate, $compile, 	$ionicSlideBoxDelegate, $http, $stateParams,$timeout, 
                                          AppService, Chat, DappService) {
    var id = $stateParams.Id;
    $scope.Dapp=[];
    $scope.Dapp.activeApp = $scope.listApps.filter( function(app) {return app.GUID==id;} )[0];
    $scope.Dapp.activeApp.Path = $scope.getDappPath($scope.Dapp.activeApp.GUID,"");    
    $scope.Dapp.activeApp.Url.Install = $scope.getDappPath($scope.Dapp.activeApp.GUID,$scope.Dapp.activeApp.Url.Install);
    $scope.Dapp.activeApp.Url.Script = $scope.getDappPath($scope.Dapp.activeApp.GUID,$scope.Dapp.activeApp.Url.Script);

    $scope.$on("$ionicView.enter", function () {
      $ionicHistory.clearCache();
    });
    
    $scope.$on("$ionicView.afterEnter", function () {    
        angularLoad.loadScript($scope.Dapp.activeApp.Url.Script).then(function(result) {
            dappleth.run({scope: $scope, service: DappService});
            $ionicLoading.hide();
        }).catch(function(err) {
            console.log('ERROR :' + $scope.Dapp.activeApp.Url.Script);
        });
    });

    $scope.$on("$ionicView.beforeLeave", function () {
      $ionicHistory.clearCache();

      dappleth.exit();

      angularLoad.resetScript($scope.Dapp.activeApp.Url.Script, "js");
      removejscssfile($scope.Dapp.activeApp.Url.Script, "js"); 

      $scope.Dapp.activeApp=null;
      dappleth = null;
    });
    
    $scope.refresh = function() {
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