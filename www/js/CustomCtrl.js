  var app = angular.module('leth.controllers');
  app.controller('CustomCtrl', ['$scope', function ($scope) {
  	$scope.message = "from custom ctrl";
  }])
