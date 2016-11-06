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
      balance: function () {
        var result;
        try {
          result = (parseFloat(web3.eth.getBalance(this.account())) / 1.0e18).toFixed(6);
        }catch (e){
          result = undefined;
        }
        return result
      },
      loginSesamo: function(address,sessionId){
        var tokenAdr = "0xd42fda38922b5da5b3bd0b8bed6ac4cbd68c2f05";
        var tokenABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"type":"function"},{"constant":false,"inputs":[{"name":"site","type":"address"},{"name":"sessionId","type":"string"}],"name":"loginToSite","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"version","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"}],"name":"returnTo","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"}],"name":"endBalance","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"}],"name":"startBalance","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"sesamoAddr","type":"address"}],"name":"linkSesamo","outputs":[],"type":"function"},{"inputs":[{"name":"tokenName","type":"string"},{"name":"decimalUnits","type":"uint8"},{"name":"tokenSymbol","type":"string"},{"name":"versionOfTheCode","type":"string"}],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"msg","type":"string"},{"indexed":false,"name":"value","type":"string"},{"indexed":false,"name":"addr","type":"address"}],"name":"Log","type":"event"}];
        var sesamoToken = web3.eth.contract(tokenABI).at(tokenAdr);

        var sesamoAdr = "0x354c1c7cd264fc6373829619af11bcb364f5f388";
        var sesamoABI = [{"constant":false,"inputs":[{"name":"site","type":"address"},{"name":"sessionId","type":"string"}],"name":"login","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"site","type":"address"},{"name":"addr","type":"address"}],"name":"enable","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getSite","outputs":[{"name":"u","type":"address"}],"type":"function"},{"constant":true,"inputs":[],"name":"getSitesCount","outputs":[{"name":"count","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"site","type":"address"}],"name":"removeSite","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"site","type":"address"}],"name":"reset","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"site","type":"address"}],"name":"getUsersCount","outputs":[{"name":"count","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"site","type":"address"}],"name":"addSite","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"promoteOwner","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"site","type":"address"},{"name":"addr","type":"address"}],"name":"disable","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"site","type":"address"},{"name":"index","type":"uint256"}],"name":"getUser","outputs":[{"name":"u","type":"address"}],"type":"function"},{"inputs":[{"name":"sesamoTokenAddr","type":"address"}],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"sessionId","type":"string"}],"name":"AuthOK","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"sessionId","type":"string"}],"name":"AuthKO","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"msg","type":"string"},{"indexed":false,"name":"value","type":"string"},{"indexed":false,"name":"addr","type":"address"}],"name":"Log","type":"event"}]
        var sesamoLogin = web3.eth.contract(sesamoABI).at(sesamoAdr);
        
        var fromAddr = this.account();
        var toAddr = address;
        var functionName = 'loginToSite';
        var args = JSON.parse('[]');
        var gasPrice = 50000000000;
        var gas = 3000000;
        args.push(toAddr,sessionId,{from: fromAddr, gasPrice: gasPrice, gas: gas});
        var callback = function (err, txhash) {
            console.log('error: ' + err);
            console.log('txhash: ' + txhash);
        }
        args.push(callback);
        sesamoToken[functionName].apply(this, args);
        return true;
      },
      loginTest: function(address,sessionId){
        var contractAdr = "0xC1E5dD93D9888d10094128c13efd9D6487452848";
        var contractABI = [ { "constant": false, "inputs": [ { "name": "device", "type": "address" }, { "name": "sessionId", "type": "string" } ], "name": "login", "outputs": [], "type": "function" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "device", "type": "address" }, { "indexed": false, "name": "sessionId", "type": "string" }, { "indexed": false, "name": "applicant", "type": "address" } ], "name": "AuthOK", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "device", "type": "address" }, { "indexed": false, "name": "sessionId", "type": "string" }, { "indexed": false, "name": "applicant", "type": "address" } ], "name": "AuthKO", "type": "event" } ];
        var contract = web3.eth.contract(contractABI).at(contractAdr);
        
        var fromAddr = this.account();
        var deviceAddr = address;
        var functionName = 'login';
        var args = JSON.parse('[]');
        var gasPrice = 50000000000;
        var gas = 3000000;
        args.push(deviceAddr,sessionId,{from: fromAddr, gasPrice: gasPrice, gas: gas});
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
      },
      transferCoinOK: function (contract, nameSend, from, to, amount ) {
          var fromAddr = from;
          var toAddr = to;
          var functionName = nameSend;
          var args = JSON.parse('[]');
          var gasPrice = web3.eth.gasPrice;
          var gas = 3000000; //TODO: use estimate?
          args.push(toAddr,amount,{from: fromAddr, gasPrice: gasPrice, gas: gas});
          var callback = function (err, txhash) {
              console.log('error: ' + err);
              console.log('txhash: ' + txhash);
          }
          args.push(callback);
          contract[functionName].apply(this, args);
          return true;
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
