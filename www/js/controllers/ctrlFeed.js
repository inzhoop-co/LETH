angular.module('leth.controllers')  
  .controller('FeedCtrl', function ($scope, $stateParams, $cordovaInAppBrowser, $sce, $http, FeedService) {
    if($stateParams.Item){
      $scope.item =  $scope.listFeeds[$stateParams.Item]; 
      
    /*
     $http.get($scope.item.link) 
        .success(function(data){
          $scope.brwContainer = $sce.trustAsHtml(data);          
      });
    */
      var options = {
        location: 'yes',
        clearcache: 'yes'
      };

      $cordovaInAppBrowser.open($scope.item.link, '_system', options)
      .then(function(event) {
        // success
      })
      .catch(function(event) {
        // error
      });
      
      //window.open($scope.item.link, 'iframeName', 'location=yes');
    }  

  })