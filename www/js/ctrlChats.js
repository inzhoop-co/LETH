angular.module('leth.controllers')  
  .controller('ChatsCtrl', function ($scope, Friends, $ionicListDelegate, $ionicScrollDelegate, $cordovaImagePicker, $cordovaCamera, $timeout, Chat) {    

    Chat.addTopic("leth");

    $scope.$on('$ionicView.enter', function() {
      $scope.myidentity = Chat.identity();
      $scope.cancelAllNotifications();
      $scope.clearBadge();
      $scope.$digest(); 

    })

    $scope.sendMessage = function(){
      if ($scope.text.message.length==0) {
        return;
      }
      var msg = {type: 'leth', text: $scope.text.message, image: '' };
      Chat.sendMessage(msg);
      $scope.scrollTo('chatScroll','bottom');
      $scope.text.message="";
    };

    $scope.sendPhoto = function(img){
      if (img==undefined) {
        return;
      }
      var msg = {type: 'leth', text: '', image: img};
      Chat.sendMessage(msg);
      $scope.scrollTo('chatScroll','bottom');
      //$scope.text.message="";      
    };

    $scope.addTopicFilter = function(){
      if ($scope.topic.name.length==0) {
        return;
      }
      Chat.addTopic($scope.topic.name);
      $scope.topic.name="";
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
    }

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
    }

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