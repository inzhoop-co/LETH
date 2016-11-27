angular.module('leth.services', [])
  .service('AppService', function ($rootScope, $http, $q, StoreEndpoint) {
    return {
      getStore: function () {
        var q = $q.defer();
        $http({
          method: 'GET',
          url: StoreEndpoint.url + '/Store.json'
        }).then(function(response) {
          q.resolve(response.data);
        }, function(response) {
          q.reject(response);
        });
        return q.promise;
      },
      getStoreApps: function () {
        var q = $q.defer();
        $http({
          method: 'GET',
          url: StoreEndpoint.url + '/Store.json'
        }).then(function(response) {
          q.resolve(response.data.dappleths);
        }, function(response) {
          q.reject(response);
        });
        return q.promise;
      },
      getStoreCoins: function () {
        var q = $q.defer();
        $http({
          method: 'GET',
          url: StoreEndpoint.url + '/Store.json'
        }).then(function(response) {
          q.resolve(response.data.coins);
        }, function(response) {
          q.reject(response);
        });
        return q.promise;
      },        
      setWeb3Provider: function (keys) {
        var web3Provider = new HookedWeb3Provider({
          host: localStorage.NodeHost,
          transaction_signer: keys
        });
        web3.setProvider(web3Provider);
        return true;
      },
      account: function () {
        var result;
        try {
          result = "0x" + global_keystore.getAddresses()[0];
        }catch(e) {
          result = undefined;
        }
        return result;
      },
      idkey: function () {
        var result;
        try {
          result = "0x" + local_keystore.getPubKeys(hdPath)[0];
        }catch(e) {
          result = undefined;
        }
        return result;
      },
      balance: function (unit) {
        var result;
        try {
          result = (parseFloat(web3.eth.getBalance(this.account())) / unit).toFixed(6);
        }catch (e){
          result = undefined;
        }
        return result
      },
      balanceOf: function (contractCoin, unit) {
        var result;
        try {
          result = contractCoin.balanceOf(this.account())/ unit;
        }catch (e){
          result = undefined;
        }
        return result
      },
      sendTransaction: function (from, to, value, gasPrice, gas) {
        return $q(function (resolve, reject) {
          try {
            web3.eth.sendTransaction({
              from: from,
              to: to,
              value: value,
              gasPrice: gasPrice,
              gas: gas
            }, function (err, hash) {
              var result = new Array;
              result.push(err);
              result.push(hash);
              resolve(result);
            });
          } catch (e) {
            reject(e);
          }
        });
      },
      transferEth: function (from, to, value, gasPrice, gas) {
        return $q(function (resolve, reject) {
          try {
            web3.eth.sendTransaction({
              from: from,
              to: to,
              value: value,
              gasPrice: gasPrice,
              gas: gas
            }, function (err, hash) {
              var result = new Array;
              result.push(err);
              result.push(hash);
              resolve(result);
            });
          } catch (e) {
            reject(e);
          }
        });
      },
      transferCoin: function (contract, nameSend, from, to, amount ) {
        return $q(function (resolve, reject) {
          var fromAddr = from;
          var toAddr = to;
          var functionName = nameSend;
          var args = JSON.parse('[]');
          var gasPrice = web3.eth.gasPrice;
          var gas = 3000000; //TODO: use estimate?
          try {
            args.push(toAddr,amount,{from: fromAddr, gasPrice: gasPrice, gas: gas});
            var callback = function (err, hash) {
              var result = new Array;
              result.push(err);
              result.push(hash);
              resolve(result);
            }
            args.push(callback);
            contract[functionName].apply(this, args);
          } catch (e) {
              reject(e);
            }
          });  
      }           
    }
  })
  .factory('PasswordPopup', function ($rootScope, $q, $ionicPopup) {
    return {
      open: function (msg, defaultMessage) {
        var q = $q.defer();

        $rootScope.secureData = {};

        var myPopup = $ionicPopup.show({
          template: '<input type="password" ng-model="secureData.password" autofocus="true">',
          title: msg,
          subTitle: defaultMessage,
          scope: $rootScope,
          buttons: [
            {text: 'Cancel'},
            {
              text: '<b>Ok</b>',
              type: 'button-positive',
              onTap: function (e) {
                if (!$rootScope.secureData.password) {
                  //don't allow the user to close unless he enters password
                  e.preventDefault();
                } else {
                  return $rootScope.secureData.password;
                }
              }
            }
          ]
        });

        myPopup.then(function (res) {

          q.resolve(res);
        });

        return q.promise;

      }
    }
  })
  .factory('$localstorage', ['$window', function ($window) {
    return {
      set: function (key, value) {
        $window.localStorage[key] = value;
      },
      get: function (key, defaultValue) {
        return $window.localStorage[key] || defaultValue;
      },
      setObject: function (key, value) {
        $window.localStorage[key] = JSON.stringify(value);
      },
      getObject: function (key) {
        return JSON.parse($window.localStorage[key] || '{}');
      }
    }
  }]);
