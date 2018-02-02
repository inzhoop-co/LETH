angular.module('leth.services')
.factory('ExchangeService', function ($q, $http) {
  var assets = [];

  return {
    getAllAssets: function () {
      return assets;
    },
    readAssets: function(){
      var q = $q.defer();
      $http({
        method: 'GET',
        url: 'https://api.kraken.com/0/public/Assets'
      }).then(function(response) {
        q.resolve(response.data);
      }, function(response) {
        q.reject(response);
      });
      return q.promise;
    },
    getCurrencies: function(){
      var c= [
          { name: 'EUR', symbol:'€', value: 'ZEUR'},
          { name: 'USD', symbol:'$', value: 'ZUSD' },
          { name: 'GBP', symbol:'£', value: 'ZGBP' },
          { name: 'CAD', symbol:'$', value: 'ZCAD' },
          { name: 'JPY', symbol:'¥', value: 'ZJPY' },
          { name: 'DAO', symbol:'Ð', value: 'XDAO' },
          { name: 'BTC', symbol:'฿', value: 'XXBT' }

          ];
      return c;
    },
    getTicker: function(coin, pair){
      var q = $q.defer();
      $http({
        method: 'GET',
        url: 'https://api.kraken.com/0/public/Ticker?pair=' + coin + pair
      }).then(function(response) {
        if(typeof response.data.error == 'undefined')
          q.resolve(response.data.result[coin + pair]["o"]);
        else
          q.reject(response.data.error);
      }, function(response) {
        q.reject(response);
      });
      return q.promise;
    }
  };
})
