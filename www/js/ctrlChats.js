angular.module('leth.controllers')  
  .controller('ChatsCtrl', function ($scope, Friends, $ionicListDelegate, $ionicScrollDelegate, $timeout, Chat) {    

    Chat.addTopic("leth");

    $scope.$on('$ionicView.enter', function() {
      $scope.myidentity = Chat.identity();
      $scope.cancelAllNotifications();
      $scope.clearBadge();
      //$ionicScrollDelegate.$getByHandle('chatScroll').resize();
      //$ionicScrollDelegate.$getByHandle('chatScroll').scrollBottom(true);
      $scope.$digest(); 

    })

    $scope.sendMessage = function(){
      if ($scope.text.message.length==0) {
        return;
      }
      Chat.sendMessage($scope.text.message);
      $scope.scrollTo('chatScroll','bottom');
      $scope.text.message="";
      //$scope.$digest(); 
    };

    $scope.addTopicFilter = function(){
      if ($scope.topic.name.length==0) {
        return;
      }
      Chat.addTopic($scope.topic.name);
      $scope.topic.name="";
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