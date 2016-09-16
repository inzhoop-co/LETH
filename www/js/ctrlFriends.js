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

  })
  .controller('FriendCtrl', function ($scope, $stateParams, Friends, Chat) {
    $scope.friend = Friends.get($stateParams.Friend);
    $scope.friendBalance = Friends.balance($scope.friend);

    $scope.sendMessagePrivate = function(addr){
      if ($scope.text.message.length==0) {
        return;
      }
      var textMsg = $scope.text.message;
      lightwallet.keystore.deriveKeyFromPassword('Password1', function (err, pwDerivedKey) {
        textMsg = lightwallet.encryption.multiEncryptString(local_keystore,pwDerivedKey,textMsg, local_keystore.getPubKeys(hdPath)[0],local_keystore.getPubKeys(hdPath),hdPath);
        console.log(textMsg);

        var msg = {type: 'leth', mode: 'encrypted', from: global_keystore.getAddresses()[0], text: textMsg, image: '' };
        Chat.sendMessage(msg);
        $scope.scrollTo('chatScroll','bottom');
        $scope.text.message="";

      });

    };
  })