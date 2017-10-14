angular.module('leth.controllers')  
  .controller('ChatsCtrl', function ($scope, $ionicListDelegate, $ionicModal, $ionicActionSheet, $translate,
                                      $ionicScrollDelegate, $cordovaImagePicker, $cordovaCamera, $timeout, 
                                      Friends, Chat, AppService, Geolocation) {    

    $scope.$on('$ionicView.enter', function() {
      $scope.myidentity = AppService.account();
      $scope.topicsList = Chat.listTopics();

      $scope.cancelAllNotifications();
      $scope.clearBadge();
      $scope.scrollTo('chatScroll','bottom');

      $scope.$digest(); 
    })

    $scope.sendMessage = function(){
      if ($scope.text.message.length==0) {
        return;
      }
      var content = $scope.text.message;      
      $scope.text.message="";
      Chat.sendMessage(content);
      $scope.scrollTo('chatScroll','bottom');
    };

    $scope.sendPhoto = function(img){
      if (img==undefined) {
        return;
      }
      Chat.sendImage(img);
      $scope.scrollTo('chatScroll','bottom');      
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
          { text: '<i class="icon ion-ios-camera-outline"></i> ' + $translate.instant('PHOTO') + '...' },
          { text: '<i class="icon ion-ios-location-outline"></i> ' + $translate.instant('POSITION') },
          { text: '<i class="icon ion-ios-person-outline"></i> ' + $translate.instant('CONTACT')  }
        ],
        destructiveText: (ionic.Platform.isAndroid()?'<i class="icon ion-android-exit assertive"></i> ':'')+'Cancel',
        //destructiveText: 'Cancel',
        titleText: $translate.instant('CHOOSETOSHARE') + ':',
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
                      var coords = {latitude: position.coords.latitude, longitude: position.coords.longitude};
                      Chat.sendPosition(null,coords);
                    }, function (err) {
                        // error
                    });
                break;
            case 2:
                Chat.sendContact();
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