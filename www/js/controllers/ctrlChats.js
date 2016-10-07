angular.module('leth.controllers')  
  .controller('ChatsCtrl', function ($scope, $ionicListDelegate, $ionicActionSheet, $ionicScrollDelegate, $cordovaImagePicker, $cordovaCamera, $timeout, 
                                      Friends, Chat, AppService, Geolocation) {    

    $scope.$on('$ionicView.enter', function() {
      $scope.myidentity = AppService.account();
      $scope.topicsList = Chat.listTopics();

      $scope.cancelAllNotifications();
      $scope.clearBadge();
      $scope.$digest(); 
    })

$scope.test = function(){
  alert('a');
}

    $scope.sendMessage = function(){
      if ($scope.text.message.length==0) {
        return;
      }
      var msg = {type: 'leth', mode: 'plain', from: AppService.account(), to: [null], text: $scope.text.message, image: '' };
      $scope.text.message="";
      Chat.sendMessage(msg);
      $scope.scrollTo('chatScroll','bottom');
    };

    $scope.sendPhoto = function(img){
      if (img==undefined) {
        return;
      }
      var msg = {type: 'leth', mode: 'plain', from: AppService.account(), to: [null], text: '', image: img};
      Chat.sendMessage(msg);
      $scope.scrollTo('chatScroll','bottom');
      //$scope.text.message="";      
    };

    $scope.addTopicFilter = function(topic){
      console.log("add topic " + topic.text);
      Chat.addTopic(topic.text);
      $scope.topicsList = Chat.listTopics();
      setChatFilter();
    };

    $scope.removeTopicFilter = function(topic){
      console.log("del topic " + topic.text);
      Chat.removeTopic(topic.text);
      $scope.topicsList = Chat.listTopics();
      setChatFilter();
    };
  
    $scope.getPhoto = function(){
      document.addEventListener("deviceready", function () {
        var options = {
          quality: 50,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 100,
          targetHeight: 100,
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

      }, false);
    };

    $scope.getImage = function(){
      document.addEventListener("deviceready", function () {
        var optionsImg = {
          maximumImagesCount: 10,
          width: 100,
          height: 100,
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
      }, false);
    };

    $scope.shareItems = function(){
      var hideSheet = $ionicActionSheet.show({
        buttons: [
          { text: 'Photo' },
          { text: 'Position'  }
        ],
        //destructiveText: (ionic.Platform.isAndroid()?'<i class="icon ion-android-exit assertive"></i> ':'')+'Cancel',
        destructiveText: 'Cancel',
        titleText: 'Choose to share your...',
        destructiveButtonClicked:  function() {
          hideSheet();
        },
        buttonClicked: function(index) {
          switch(index){
            case 0:
                $scope.getImage();
                break;
            case 1:
                Geolocation.getCurrentPosition()
                    .then(function (position) {
                      Chat.sendPosition(null,position);
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
  .directive('input', input);

  // The directive enable sending message when tapping return
  // and expose the focus and blur events to adjust the view
  // when the keyboard opens and closes
  function input ($timeout) {
    var directive =  {
      restrict: 'E',
      scope: {
        'returnClose': '=',
        'onReturn': '&',
        'onFocus': '&',
        'onBlur': '&'
      },
      link: link
    };
    return directive;

    ////////////

    function link (scope, element, attrs) {
      element.bind('focus', function (e) {
        if (scope.onFocus) {
          $timeout(function () {
            scope.onFocus();
          });
        }
      });

      element.bind('blur', function (e) {
        if (scope.onBlur) {
          $timeout(function () {
            scope.onBlur();
          });
        }
      });

      element.bind('keydown', function (e) {
        if (e.which == 13) {
          if (scope.returnClose) {
            element[0].blur();
          }

          if (scope.onReturn) {
            $timeout(function () {
              scope.onReturn();
            });
          }
        }
      });
    }
  }