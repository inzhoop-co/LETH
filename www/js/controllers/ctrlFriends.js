angular.module('leth.controllers')  
  .controller('FriendsCtrl', function ($scope, Friends, $ionicListDelegate,  AppService, Chat) {    
    
    $scope.$on('$ionicView.enter', function() {
      $scope.cancelDMNotifications();
      $scope.clearBadge();
      $scope.$digest(); 
    })

    $scope.edit = function (friend) {
      $scope.addAddress(friend.name, friend.comment, friend.addr,friend.idkey);
      $ionicListDelegate.closeOptionButtons();
    };

    $scope.remove = function (friend) {
      Friends.remove(friend);
      $scope.loadFriends();
      $ionicListDelegate.closeOptionButtons();
    };

    $scope.payFriends = function () {
      $state.go('tab.wallet');
      $scope.addrTo = $scope.friend.addr;
    }

    $scope.moveItem = function(item, fromIndex, toIndex) {
      $scope.friends.splice(fromIndex, 1);
      $scope.friends.splice(toIndex, 0, item);
    };

  })
  .controller('FriendCtrl', function ($scope, $stateParams, $ionicHistory, $state, $timeout, $cordovaImagePicker, $ionicActionSheet, $cordovaCamera, 
                                      Geolocation, Friends, Chat, AppService) {

    $scope.$on('$ionicView.enter', function() {
      $scope.myidentity = AppService.account();
      Friends.balance($scope.friend).then(function(res){
        $scope.friendBalance = res;
      });
      $scope.cancelDMNotifications();
      Friends.clearUnread($scope.friend.addr);
      $scope.clearBadge();
      $scope.scrollTo('chatDMScroll','bottom');
      $scope.$digest(); 
    })

    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        viewData.enableBack = true;
    });

    $scope.$on('$ionicView.beforeLeave', function(event, viewData) {
      $ionicHistory.clearHistory();
    })

    $scope.friend = Friends.get($stateParams.Friend);

    $scope.isFromTo = function(chat){
      if($scope.friend.addr == AppService.account())
        return false; //no chat with yourself
      if((chat.message.from == $scope.friend.addr && 
          chat.message.to.indexOf(AppService.account())!=-1 ) || 
          (chat.message.to.indexOf($scope.friend.addr)!=-1 && 
          chat.message.from == AppService.account())){
            return true;
      }
      return false;
    }

    $scope.sendDirectMessage = function(){
      if ($scope.text.message.length==0) {
        return;
      }
      var textMsg = $scope.text.message;
      $scope.text.message="";
      
      Chat.sendCryptedMessage(textMsg,$scope.friend.addr,$scope.friend.idkey);

      $scope.scrollTo('chatDMScroll','bottom');
    };

    $scope.sendPhoto = function(img){
      if (img==undefined) {
        return;
      }
      Chat.sendCryptedPhoto(img,$scope.friend.addr,$scope.friend.idkey);

      $scope.scrollTo('chatDMScroll','bottom');    
    };

    $scope.getPhoto = function(){
      if (AppService.isPlatformReady()){
        var options = {
          quality: 50,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 0,
          targetHeight: 300,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false,
          correctOrientation:true
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {
          var photo = "data:image/jpeg;base64," + imageData;
          $scope.sendPhoto(photo);
          console.log('photo :' + photo);
        }, function(err) {
          // error
        });

      };
    };

    $scope.getImage = function(){
      if (AppService.isPlatformReady()){
        var optionsImg = {
          maximumImagesCount: 1,
          width: 0,
          height: 0,
          quality: 50
        };

        $cordovaImagePicker.getPictures(optionsImg)
          .then(function (results) {
            window.resolveLocalFileSystemURL(results[0], function(fileEntry){
              fileEntry.file(function(file) {
                  var reader = new FileReader();
                  reader.onloadend = function(e) {
                       $scope.sendPhoto(this.result);
                   };
                  reader.readAsDataURL(file);
               }); 

            }, function(e){
              console.log(e);
            });                        
          }, function(error) {
              console.log('error get img');
        });
      };
    };

    $scope.shareItems = function(){
      var hideSheet = $ionicActionSheet.show({
        buttons: [
          { text: '<i class="icon ion-ios-camera-outline"></i> Photo...' },
          { text: '<i class="icon ion-ios-location-outline"></i> Position'  }
        ],
        destructiveText: (ionic.Platform.isAndroid()?'<i class="icon ion-android-exit assertive"></i> ':'')+'Cancel',
        titleText: 'Choose to share your...',
        destructiveButtonClicked:  function() {
          hideSheet();
        },
        buttonClicked: function(index) {
          switch(index){
            case 0:
                $scope.getImage($scope.friend.addr,$scope.friend.idkey);
                break;
            case 1:
                Geolocation.getCurrentPosition()
                    .then(function (position) {
                      var coords = {latitude: position.coords.latitude, longitude: position.coords.longitude};
                      Chat.sendCryptedPosition($scope.friend.addr,coords);
                    }, function (err) {
                        // error
                    });
                break;
          }
          hideSheet();
         $timeout(function() {
           hideSheet();
          }, 20000);
        }
      })      
    };
  })