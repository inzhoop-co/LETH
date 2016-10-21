angular.module('leth.controllers')  
  .controller('DapplethsCtrl', function ($scope, angularLoad,  $templateRequest, $sce, $compile, $ionicSlideBoxDelegate, $http, AppService, FeedService) {
    $ionicSlideBoxDelegate.start();
    $scope.nextSlide = function() {
      $ionicSlideBoxDelegate.next();
    };
    $scope.prevSlide = function() {
      $ionicSlideBoxDelegate.previous();
    };

    refresh();

    FeedService.GetFeed().then(function(infoNews){
      $scope.listFeeds = infoNews;
      $scope.cards = Array.prototype.slice.call($scope.listFeeds, 0, 0);
    });

    $scope.cardSwiped = function(index) {
      $scope.addCard();
    };
    $scope.cardDestroyed = function(index) {
      $scope.cards.splice(index, 1);
    };
    $scope.addCard = function() {
      var newCard = $scope.listFeeds[Math.floor(Math.random() * $scope.listFeeds.length)];
      newCard.id = Math.random();
      $scope.cards.push(angular.extend({}, newCard));
    }
    $scope.accept = function(index) {
        alert(index);
    };

  })
  .controller('DapplethRunCtrl', function ($scope, angularLoad,  $templateRequest, $sce, $interpolate, $compile, 	$ionicSlideBoxDelegate, $http, $stateParams,$timeout) {
      console.log("Param " + $stateParams.Id);
      //load app selected
      var id = $stateParams.Id;
      var activeApp = $scope.listApps.filter( function(app) {return app.GUID==id;} )[0];
      
      $scope.message = "DapplethRunCtrl";
      //$scope.appContainer = $scope.readDapp(activeApp.GUID + ".html");

      $http.get(activeApp.InstallUrl) 
        .success(function(data){
          $scope.appContainer = $sce.trustAsHtml(data);          

          //$compile(data)($scope);
          //$scope.$digest();
      });
 
      angularLoad.loadScript(activeApp.ScriptUrl).then(function() {
          console.log('loading ' + activeApp.ScriptUrl);
      }).catch(function() {
            console.log('ERROR :' + activeApp.ScriptUrl);
      });

      $scope.refresh = function() {
        updateData(); //defined in external js
        $scope.$broadcast('scroll.refreshComplete');
      }
  })