angular.module('leth.services')
.factory('Geolocation', ['$q', function ($q) {
  var options = {
      timeout : 5000,
      enableHighAccuracy: true // may cause errors if true
  };
  return {
    getCurrentPosition: function () {
      var q = $q.defer();

      navigator.geolocation.getCurrentPosition(function (result) {
        q.resolve(result);
      }, function (err) {
        q.reject(err);
      }, options);

      return q.promise;
    },

    watchPosition: function () {
      var q = $q.defer();

      var watchID = navigator.geolocation.watchPosition(function (result) {
        q.notify(result);
      }, function (err) {
        q.reject(err);
      }, options);

      q.promise.cancel = function () {
        navigator.geolocation.clearWatch(watchID);
      };

      q.promise.clearWatch = function (id) {
        navigator.geolocation.clearWatch(id || watchID);
      };

      q.promise.watchID = watchID;

      return q.promise;
    },

    clearWatch: function (watchID) {
      return navigator.geolocation.clearWatch(watchID);
    }
  };
}])