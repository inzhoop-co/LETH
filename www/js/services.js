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
          return val.addr === address;
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
      getHostHood: function () {
        var q = $q.defer();
        $http({
          method: 'GET',
          url: 'https://www.ethernodes.org/network/1/data?draw=1&columns[0][data]=id&columns[1][data]=host&columns[1][orderable]=true&order[0][column]=0&order[0][dir]=asc&start=0&length=10000&search[value]=&search[regex]=false'
        }).then(function(response) {
          q.resolve(response.data.data);
        }, function(response) {
          q.reject(response);
        });
        return q.promise;
      },
       checkHostHood: function (host) {
        var q = $q.defer();
        $http({
          method: 'GET',
          url: host
        }).then(function(response) {
          if(response.status==200)
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
          result = global_keystore.getAddresses()[0];
        }catch(e) {
          result = undefined;
        }
        return result;
      },
      balance: function () {
        var result;
        try {
          result = (parseFloat(web3.eth.getBalance(global_keystore.getAddresses()[0])) / 1.0e18).toFixed(6);
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
      sendMessage: function (chat,msg) {
        web3.shh.newIdentity(function(err,res){
          if(!err){
            var topic = chat;
            var payload = msg;
            var message = {
              from: res,
              //to: "0x04a49b8ce5cdaf4955f6e6a60ad725c62fe547c5085670e0eca889810974f16cd1c1090ca3f555f83d06dd80fd29413335038ee0093d981dd6b097eab0a95dbd7d",
              topics: [topic],
              payload: payload,
              ttl: 10,
              workToProve: 10
            };
            web3.shh.post(message);            
          }
        });
      },
      listenMessage: function($scope){
        var filter =  web3.shh.filter({topics: ["leth"]});
        filter.watch(function (error, result) {
          if (!error)
           $scope.$broadcast("chatMessage", result);
        });
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
      loginSesamo: function(address,sessionId){
        var tokenAdr = "0xd42fda38922b5da5b3bd0b8bed6ac4cbd68c2f05";
        var tokenABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"type":"function"},{"constant":false,"inputs":[{"name":"site","type":"address"},{"name":"sessionId","type":"string"}],"name":"loginToSite","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"version","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"}],"name":"returnTo","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"}],"name":"endBalance","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"}],"name":"startBalance","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"sesamoAddr","type":"address"}],"name":"linkSesamo","outputs":[],"type":"function"},{"inputs":[{"name":"tokenName","type":"string"},{"name":"decimalUnits","type":"uint8"},{"name":"tokenSymbol","type":"string"},{"name":"versionOfTheCode","type":"string"}],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"msg","type":"string"},{"indexed":false,"name":"value","type":"string"},{"indexed":false,"name":"addr","type":"address"}],"name":"Log","type":"event"}];
        var sesamoToken = web3.eth.contract(tokenABI).at(tokenAdr);

        var sesamoAdr = "0x354c1c7cd264fc6373829619af11bcb364f5f388";
        var sesamoABI = [{"constant":false,"inputs":[{"name":"site","type":"address"},{"name":"sessionId","type":"string"}],"name":"login","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"site","type":"address"},{"name":"addr","type":"address"}],"name":"enable","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getSite","outputs":[{"name":"u","type":"address"}],"type":"function"},{"constant":true,"inputs":[],"name":"getSitesCount","outputs":[{"name":"count","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"site","type":"address"}],"name":"removeSite","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"site","type":"address"}],"name":"reset","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"site","type":"address"}],"name":"getUsersCount","outputs":[{"name":"count","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"site","type":"address"}],"name":"addSite","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"promoteOwner","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"site","type":"address"},{"name":"addr","type":"address"}],"name":"disable","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"site","type":"address"},{"name":"index","type":"uint256"}],"name":"getUser","outputs":[{"name":"u","type":"address"}],"type":"function"},{"inputs":[{"name":"sesamoTokenAddr","type":"address"}],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"sessionId","type":"string"}],"name":"AuthOK","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"sessionId","type":"string"}],"name":"AuthKO","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"msg","type":"string"},{"indexed":false,"name":"value","type":"string"},{"indexed":false,"name":"addr","type":"address"}],"name":"Log","type":"event"}]
        var sesamoLogin = web3.eth.contract(sesamoABI).at(sesamoAdr);
        
        var fromAddr = global_keystore.getAddresses()[0];
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
        
        var fromAddr = global_keystore.getAddresses()[0];
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
      getTicker: function(coin, pair){
        var q = $q.defer();
        $http({
          method: 'GET',
          url: 'https://api.kraken.com/0/public/Ticker?pair=' + coin + pair
        }).then(function(response) {
          q.resolve(response.data.result[coin + pair]["o"]);
        }, function(response) {
          q.reject(response);
        });
        return q.promise;
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
