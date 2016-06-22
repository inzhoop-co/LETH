angular.module('leth.controllers')  
  .controller('FriendsCtrl', function ($scope, Friends, $ionicListDelegate, AppService) {    
    $scope.remove = function (friendIndex) {
      Friends.remove($scope.friends,friendIndex);
      localStorage.Friends = JSON.stringify($scope.friends);
      $ionicListDelegate.closeOptionButtons();
    };

    $scope.payFriends = function () {
      $state.go('tab.wallet');
      $scope.addrTo = $scope.friend.addr;
    }

    $scope.$on('chatMessage', function (e, r) {
      $scope.chatMessage=r.payload; 
      $scope.$digest();     
    });

    AppService.listenMessage($scope);
    
    $scope.sendMessage = function(msg){
      AppService.sendMessage("leth",msg);
    };
  })
  .controller('FriendCtrl', function ($scope, $stateParams, Friends) {
    $scope.friend = Friends.get($stateParams.Friend);
    $scope.friendBalance = Friends.balance($scope.friend);
  })
