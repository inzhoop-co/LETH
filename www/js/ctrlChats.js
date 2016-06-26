angular.module('leth.controllers')  
  .controller('ChatsCtrl', function ($scope, Friends, $ionicListDelegate, $ionicScrollDelegate, $timeout, Chat) {    
    
    $scope.inputUp = function() {
      $timeout(function() {
        $ionicScrollDelegate.$getByHandle('chatScroll').scrollBottom(true);
      }, 300);
    }

    $scope.inputDown = function() {
      $ionicScrollDelegate.$getByHandle('chatScroll').resize();
    }

    $scope.$on('$ionicView.enter', function() {
      $scope.myidentity = Chat.identity();
      $scope.cancelAllNotifications();
      $scope.clearBadge();
      $scope.$digest(); 

    })

    $scope.remove = function (index) {

      $ionicListDelegate.closeOptionButtons();
    };

    $scope.sendMessage = function(msg){
      Chat.sendMessage("leth",msg);
    };
  })
