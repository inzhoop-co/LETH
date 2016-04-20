angular.module('leth.services', [])
  .factory('Friends', function ($rootScope, $http, $q) {
    return {
      all: function () {
        return JSON.parse(localStorage.Friends);
      },
      add: function(addressbook,user) {
        if(Array.isArray(addressbook))
          addressbook.push(user);
        return addressbook;
      },
      get: function(address) {
        var addressbook = JSON.parse(localStorage.Friends);
        var obj = addressbook.filter(function (val) {
          return val.addr === address.Friend;
        });
        return obj[0];         
      },
      remove: function(addressbook, index) {
        addressbook.splice(index, 1);
        return addressbook;
      },
      balance: function (friend) {
        var result;
        try {
          result = (parseFloat(web3.eth.getBalance(friend.addr)) / 1.0e18).toFixed(6);
        }catch (e){
          result = undefined;
        }
        return result
      }
    };
  })
  .service('AppService', function ($rootScope, $http, $q) {
    return {
      getStore: function(){
        $http.get('http://www.inzhoop.com/dappleths/Store.json').then(function(response){
          return response.data;
        });
      },
      getStoreApps: function () {
        var q = $q.defer();
        $http({
          method: 'GET',
          url: 'http://www.inzhoop.com/dappleths/Store.json'
        }).then(function(response) {
          q.resolve(response.data);
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
          result = global_keystore.addresses[0];
        }catch(e) {
          result = undefined;
        }
        return result;
      },
      balance: function () {
        var result;
        try {
          result = (parseFloat(web3.eth.getBalance(global_keystore.addresses[0])) / 1.0e18).toFixed(6);
        }catch (e){
          result = undefined;
        }
        return result
      },
      addListners: function ($scope) {
        /*
         $scope.contract.MatchStarted().watch(function (error, result) {
         $scope.$broadcast("matchStarted", result);
         $scope.$broadcast("updateLottery");

         });
         */
      },
      sendMessage: function ($scope) {
        var identity = web3.shh.newIdentity();
        var topic = "Lottery";
        var filter = web3.shh.filter([topic]);
        filter.watch(function (error, result) {
          if (!error)
            console.log(result.payload);
        });

        var payload = 'ciao mondo!';
        var message = {
          from: identity,
          topics: [topic],
          payload: payload,
          ttl: 100,
          workToProve: 100
        };
        web3.shh.post(message);
      },
      transferCoin: function (contract, nameSend, from, to, amount ) {
          var fromAddr = '0x' + from;
          var toAddr = to;
          var functionName = nameSend;
          var args = JSON.parse('[]');
          var gasPrice = web3.eth.gasPrice;
          var gas = 3000000;
          args.push(toAddr,amount,{from: fromAddr, gasPrice: gasPrice, gas: gas});
          var callback = function (err, txhash) {
              console.log('error: ' + err);
              console.log('txhash: ' + txhash);
          }
          args.push(callback);
          contract[functionName].apply(this, args);
          return true;
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
      }
    }
  })
  .factory('PasswordPopup', function ($rootScope, $q, $ionicPopup) {
    return {
      open: function (msg, defaultMessage) {
        var q = $q.defer();

        $rootScope.secureData = {};

        var myPopup = $ionicPopup.show({
          template: '<input type="password" ng-model="secureData.password">',
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
                  //don't allow the user to close unless he enters wifi password
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
  .factory('Transactions', function () {
    var transactions;

    if (localStorage.Transactions != undefined) {
      transactions = JSON.parse(localStorage.Transactions);
    } else {
      transactions = [];
    }

    return {
      all: function () {
        return transactions;
      },
      save: function (from, to, transaction, value, timestamp) {
        var newT = {from: from, to: to, id: transaction, value: value, time: timestamp};
        transactions.push(newT);
        return transactions;
      }
    };
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
