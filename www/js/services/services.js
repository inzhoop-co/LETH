angular.module('leth.services', [])
.service('BEService', function ($rootScope, $http, $window, $q, $ionicLoading) {
  return{
    storeData: function(guid,key,data){
      $window.localStorage[guid + "_" + key] = JSON.stringify(data);
    },
    clearData: function(guid,key){
      $window.localStorage[guid + "_" + key] = '';
    },
    getKey: function (guid,key) {
      var data = $window.localStorage[guid + "_" + key];
      if(data)
        return JSON.parse(data);
      else
        return null;
    },
    removeKey: function(guid,key){
      $window.localStorage.removeItem(guid + "_" + key);
    }
  }
})                
.service('AppService', function ($rootScope, $http, $q) {
  var networks = {
      '0x': {
        name: 'Private',
        class: 'calm',            
        badge: 'badge badge-calm'
      },
      '0x0cd786a2425d16f152c658316c423e6ce1181e15c3295826d7c9904cba9ce303': {
        name: 'Morden',
        class: 'royal',
        badge: 'badge badge-royal'
      },
      '0x41941023680923e0fe4d74a34bdac8141f2540e3ae90623718e47d66d1ca4a2d': {
        name: 'Ropsten',
        class: 'positive',
        badge: 'badge badge-positive'
      },
      '0xa3c565fc15c7478862d50ccd6561e3c06b24cc509bf388941c25ea985ce32cb9': {
        name: 'Kovan',
        class: 'royal',
        badge: 'badge badge-royal'
      },
      '0x6341fd3daf94b748c72ced5a5b26028f2474f5f00d824504e4fa37a75767e177': {
        name: 'Rinkeby',
        class: 'energized',            
        badge: 'badge badge-energized'
      },
      '0xf8db90a3c81d9f86022cca1e12b4e05770aeae784d56cc5a31e78f6aea44698b': {
        name: 'Infura',
        class: 'dark',            
        badge: 'badge badge-dark'
      },
      '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3':{
        name: 'Mainet',
        class: 'balanced',            
        badge: 'badge badge-balanced',
        forkedAt: 1920000
      }, 
      '0x94365e3a8c0b35089c1d1195081fe7489b528a84b22199c916180db8b28ade7f': {
        name: 'MainETC',
        class: 'balanced',            
        badge: 'badge badge-balanced'
      }
  }
  
  var deviceReady = false;
  document.addEventListener("deviceready", function(){
    deviceReady = true;
  }, false); 
  
  return {
    isPlatformReady: function(){
      return deviceReady;
    },
    getNetwork: function(){
      var q = $q.defer();
      var network;
      web3.eth.getBlock(0, function(e, res){
        if(!e && res){
          if(res.hash=='0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3'){
             web3.eth.getBlock(1920000, function(e, res){
                if(!e && res){
                  if(res.hash=='0x94365e3a8c0b35089c1d1195081fe7489b528a84b22199c916180db8b28ade7f'){
                    q.resolve(networks[res.hash]);
                  }
                  else{
                    q.resolve(networks['0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3']);
                  }
                }
              })
          } else{
            var net = networks[res.hash];
            if(!net)
              q.resolve(networks['0x']);
            else
              q.resolve(net);
          }
        } else 
          q.reject(e);
      });
      return q.promise;
    },
    getStore: function (network) {
      var q = $q.defer();
      $http({
        method: 'GET',
        url: StoreEndpoint() + '/' + network + '/Store.json'
      }).then(function(response) {
        q.resolve(response.data);
      }, function(response) {
        q.reject(response);
      });
      return q.promise;
    },
    getStoreCategories: function (network) {
      var q = $q.defer();
      $http({
        method: 'GET',
        url: StoreEndpoint() + '/' + network + '/Store.json'
      }).then(function(response) {
        q.resolve(response.data.categories);
      }, function(response) {
        q.reject(response);
      });
      return q.promise;
    },
    getStoreApps: function (network) {
      var q = $q.defer();
      $http({
        method: 'GET',
        url: StoreEndpoint() + '/' + network + '/Store.json'
      }).then(function(response) {
        q.resolve(response.data.dappleths);
      }, function(response) {
        q.reject(response);
      });
      return q.promise;
    },
    getStoreCoins: function (network) {
      var q = $q.defer();
      $http({
        method: 'GET',
        url: StoreEndpoint() + '/' + network + '/Store.json'
      }).then(function(response) {
        q.resolve(response.data.tokens);
      }, function(response) {
        q.reject(response);
      });
      return q.promise;
    },    
    getLocalCoins: function (network) {
      var list = JSON.parse(localStorage.Tokens);
      return list.filter( function(val) {return val.Network==network;} )
    },  
    getAllTokens: function(network){
      var q = $q.defer();

      var local = this.getLocalCoins(network);

      this.getStoreCoins(network).then(function(response){ 
        if(response){

          var remote  = response.filter(function(store_el){
             return local.filter(function(local_el){
                return store_el.GUID == local_el.GUID;
             }).length == 0
          });

          var list = local.concat(remote);
          q.resolve(list);       
        }else
          q.resolve(local);
      },function(err){
        q.reject(err);
      }) 
      return q.promise;
    }, 
    addLocalToken: function(token){
      var tmpstore = JSON.parse(localStorage.Tokens);
      var indexOfToken = tmpstore.findIndex(i => i.Address === token.Address);

      
      if(token.Custom){
        if(indexOfToken!=-1){
          //if exist update
          token.GUID = tmpstore[indexOfToken].GUID;
          tmpstore[indexOfToken] = token;
        }else{
          //add new one
          var counter = tmpstore.length+1;
          token.GUID = "C" + counter; //to change
          tmpstore.push(token);
        }
      }

      if(!token.Custom){
        if(indexOfToken!=-1){
          //if exist update
          tmpstore[indexOfToken] = token;
        }else{
          //add new one
          tmpstore.push(token);
        }
      }
      

      //save to store
      localStorage.Tokens = JSON.stringify(tmpstore);
    },
    deleteLocalToken: function(token){
      var tmpstore = JSON.parse(localStorage.Tokens);
      var indexOfToken = tmpstore.findIndex(i => i.Address === token.Address);

      tmpstore.splice(indexOfToken,1);
      localStorage.Tokens = JSON.stringify(tmpstore);
    },
    setWeb3Provider: function (keys) {
      var q = $q.defer();

      var web3Provider = new HookedWeb3Provider({
        host: localStorage.NodeHost,
        transaction_signer: keys
      });

      web3.setProvider(web3Provider);
      if(web3.isConnected)
        q.resolve();
      else 
        q.reject()
      return q.promise;
    },
    setWeb3ProviderNode: function (keys, node) {
      var q = $q.defer();

      var web3Provider = new HookedWeb3Provider({
        host: node,
        transaction_signer: keys
      });

      web3.setProvider(web3Provider);
      if(web3.isConnected())
        q.resolve();
      else 
        q.reject()
      return q.promise;
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
        result = local_keystore.getPubKeys(hdPath)[0];
      }catch(e) {
        result = undefined;
      }
      return result;
    },
    balance: function (unit) {
      var result;
      try {
        result = parseFloat(web3.eth.getBalance(this.account()))/unit;
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
    balanceOfUser: function (contractCoin, unit, userAddr) {
      var result;
      try {
        result = contractCoin.balanceOf(userAddr)/ unit;
      }catch (e){
        result = undefined;
      }
      return result
    },
    transactionCall: function (contract, fname, params, value, gLimit, gPrice) {
      return $q(function (resolve, reject) {
        var fromAddr = global_keystore.getAddresses()[0];
        var toAddr = contract.Address;
        var functionName = fname;
        var args = JSON.parse('[]');
        var gasPrice = web3.toBigNumber(gPrice);
        var gas = gLimit;
        
        try {
          args.push(params,{from: fromAddr, gasPrice: gasPrice, gas: gas, value: value});
          
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
    transactionCallNoParam: function (contract, fname, value, gLimit, gPrice) {
      return $q(function (resolve, reject) {
        var fromAddr = global_keystore.getAddresses()[0];
        var toAddr = contract.Address;
        var functionName = fname;
        var args = JSON.parse('[]');
        var gasPrice = web3.toBigNumber(gPrice);
        var gas = gLimit;
        
        try {
          args.push({from: fromAddr, gasPrice: gasPrice, gas: gas, value: value});
          
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
    deployContract: function (datacode, gasValue) {
      return $q(function (resolve, reject) {
        var fromAddr = global_keystore.getAddresses()[0];
        var gasPrice = web3.eth.gasPrice;
        var gas = gasValue; //TODO: use estimate?
        var cdata = datacode;
         try {
            web3.eth.sendTransaction({
              from: fromAddr,
              gasPrice: gasPrice,
              gas: gas,
              data: cdata
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
    contractNew: function (params, abi, datacode, gasLimit, fee) {
      var fromAddr = global_keystore.getAddresses()[0];
      var m = params[0];
      var contract = web3.eth.contract(abi);
      var gasPrice = web3.toBigNumber(50000000000); //web3.eth.gasPrice;
      var estimateGas = web3.eth.estimateGas({from: fromAddr, gasPrice: gasPrice, gas: gasLimit, data: datacode});
      
      var gPrice = fee/estimateGas;
      /*
      console.log("fee: " + fee);
      console.log("price: " + gPrice);
      console.log("estimate: " + estimateGas);
      console.log("priceStandard: " + gasPrice.toNumber());
      console.log("cost: " + gasPrice*gasLimit);
      */
      if(estimateGas>gasLimit) console.log("Warning: GasLimit too low!");

      var q = $q.defer();
        try {
          var callback = function (err, contract) {
            if(err) 
              q.reject(err);
            else{
              if(contract.address){
                q.resolve(contract.address);
              }else{
                q.notify(contract.transactionHash);
              }
            }
          }

          contract.new(m,{from: fromAddr, gasPrice: gasPrice, gas: gasLimit, data: datacode}, callback);

        } catch (e) {
            q.reject(e);
        }
      return q.promise;
    },
    transferEth: function (from, to, value, fee) {
      var gas = web3.eth.estimateGas({});
      var gasPrice = web3.eth.gasPrice; 
      console.log("fee: " + fee);
      var gPrice =  web3.toBigNumber(fee/gas).round();
      console.log(gPrice.toNumber());

      return $q(function (resolve, reject) {
        try {
          web3.eth.sendTransaction({
            from: from,
            to: to,
            value: value,
            gasPrice: gPrice,
            gas: gas
          }, function (err, hash) {
            if(err) reject(err);
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
        var estimateGas = web3.eth.estimateGas({from: fromAddr, gasPrice: gasPrice, gas: gas});
        var gas = estimateGas; //3000000; 
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
.factory('PasswordPopup', function ($rootScope, $q, $ionicLoading, $ionicPopup) {
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
        if(res)
          $ionicLoading.show({template: 'Waiting...', duration: 3000});
        q.resolve(res);
      });

      return q.promise;

    }
  }
});