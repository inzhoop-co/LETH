angular.module('leth.controllers')  
  .controller('FriendsCtrl', function ($scope, Friends, $ionicListDelegate, AppService, Chat) {    
    $scope.remove = function (friendIndex) {
      Friends.remove($scope.friends,friendIndex);
      localStorage.Friends = JSON.stringify($scope.friends);
      $ionicListDelegate.closeOptionButtons();
    };

    $scope.payFriends = function () {
      $state.go('tab.wallet');
      $scope.addrTo = $scope.friend.addr;
    }
    $scope.chatMessage = "incoming message"
    $scope.$on('chatMessage', function (e, r) {
      $scope.chatIcon = blockies.create({ 
        seed: r.from, 
      }).toDataURL("image/jpeg");
      $scope.chatTime=r.sent*1000; 
      $scope.chatMessage=r.payload; 
      $scope.$digest();     
    });

    //AppService.listenMessage($scope);
    Chat.listenMessage($scope);
    
    $scope.sendMessage = function(msg){
      Chat.sendMessage("leth",msg);
    };
  })
  .controller('FriendCtrl', function ($scope, $stateParams, Friends) {
    $scope.friend = Friends.get($stateParams.Friend);
    $scope.friendBalance = Friends.balance($scope.friend);
  })
