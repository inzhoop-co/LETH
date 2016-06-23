angular.module('leth.controllers')  
  .controller('ChatsCtrl', function ($scope, Friends, $ionicListDelegate, Chat) {    
    $scope.remove = function (index) {

      $ionicListDelegate.closeOptionButtons();
    };

    Chat.listenMessage($scope);

    $scope.$on('chatMessage', function (e, r) {
     $scope.chats = Chat.find();   
     $scope.$digest(); 
    });

    
    $scope.sendMessage = function(msg){
      Chat.sendMessage("leth",msg);
    };
  })
