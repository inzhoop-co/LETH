angular.module('leth.services')
.factory('Chat', function ($rootScope, $http, $q, $sce, $filter, AppService, Friends) {
  var ttlTime = 10000;
  var wtpTime = 100;

  var identity ="0x";
  var chats=[];
  var chatsDM=[];
  var chatsDAPP=[];
  var topics = ["leth"];
  var filter =  null;
  var _decryptMessageO = function(payload){
      //todo
  };

  var _encryptMessageO = function (msg,toAddr,toKey) {
      //todo
  };

  return{
    identity: function(){
      if(!web3.shh.hasIdentity(identity)){
        identity = web3.shh.newIdentity();
      }
      return identity;
    },
    find: function(){
      return chats ;
    },
    findDM: function(){
      return chatsDM;
    },
    findDAPP: function(){
      return chatsDAPP;
    },
    addTopic: function(t){
      topics.push(t);
    },
    removeTopic: function(t){
      topics.pop(t); 
    },
    listTopics: function(){
      var list = JSON.parse( JSON.stringify( topics ) );
      var index = list.indexOf("leth");
      list.splice(index, 1);
      return list;
    },      
    sendMessage: function (content) {
      var msg = {type: 'leth', mode: 'plain', time: Date.now(), from: AppService.account(), to: [null], text: content, image: '', attach: {addr: AppService.account(), idkey: AppService.idkey()} };
      var payload = web3.fromUtf8(JSON.stringify(msg));
      var message = {
        from:  this.identity(),
        topics: topics,
        payload: payload,
        ttl: ttlTime,
        workToProve: wtpTime
      };
      web3.shh.post(message); 

      chats.push({
        identity: blockies.create({ seed: msg.from}).toDataURL("image/jpeg"),
        timestamp: Date.now(),
        message: msg
      });
    },
    sendImage: function (content) {
      var msg = {type: 'leth', mode: 'plain', time: Date.now(), from: AppService.account(), to: [null], text: '', image: content, attach: {addr: AppService.account(), idkey: AppService.idkey()} };
      var payload = web3.fromUtf8(JSON.stringify(msg));
      var message = {
        from:  this.identity(),
        topics: topics,
        payload: payload,
        ttl: ttlTime,
        workToProve: wtpTime
      };
      web3.shh.post(message); 

      chats.push({
        identity: blockies.create({ seed: msg.from}).toDataURL("image/jpeg"),
        timestamp: Date.now(),
        message: msg
      });
    },

    sendCryptedMessage: function (content,toAddr,toKey) {
      var msg = {type: 'leth', mode: 'encrypted', time: Date.now(), from: AppService.account(), to: [toAddr,AppService.account()] , senderKey: local_keystore.getPubKeys(hdPath)[0] , text: content, image: '' };
      var idFrom = this.identity();

      chatsDM.push({
            identity: blockies.create({ seed: msg.from}).toDataURL("image/jpeg"),
            timestamp: Date.now(),
            message: msg
      });

      lightwallet.keystore.deriveKeyFromPassword(JSON.parse(localStorage.AppCode).code, function (err, pwDerivedKey) {
        var encMsg = angular.copy(msg);
        encMsg.text = lightwallet.encryption.multiEncryptString(local_keystore,pwDerivedKey,content,local_keystore.getPubKeys(hdPath)[0],[toKey.replace("0x",""),local_keystore.getPubKeys(hdPath)[0]],hdPath);
        var payload = web3.fromUtf8(JSON.stringify(encMsg));        
        var message = {
          from:  idFrom,
          topics: topics,
          payload: payload,
          ttl: ttlTime,
          workToProve: wtpTime
        };

        web3.shh.post(message); 
      });
    },
    sendCryptedPaymentReq: function (content,request,toAddr,toKey) {
      var msg = {type: 'leth', mode: 'payment', time: Date.now(), from: AppService.account(), to: [toAddr,AppService.account()] , senderKey: local_keystore.getPubKeys(hdPath)[0] , text: content, image: '', attach: {addr: AppService.account(), idkey: AppService.idkey(), payment: request}};
      var idFrom = this.identity();

      chatsDM.push({
          identity: blockies.create({ seed: msg.from}).toDataURL("image/jpeg"),
          timestamp: Date.now(),
          message: msg
        });

      lightwallet.keystore.deriveKeyFromPassword(JSON.parse(localStorage.AppCode).code, function (err, pwDerivedKey) {
        var encMsg = angular.copy(msg);
        encMsg.text = lightwallet.encryption.multiEncryptString(local_keystore,pwDerivedKey,content,local_keystore.getPubKeys(hdPath)[0],[toKey.replace("0x",""),local_keystore.getPubKeys(hdPath)[0]],hdPath);
        var payload = web3.fromUtf8(JSON.stringify(encMsg));
        var message = {
          from:  idFrom,
          topics: topics,
          payload: payload,
          ttl: ttlTime,
          workToProve: wtpTime
        };

        web3.shh.post(message); 
      });
    },
    sendCryptedCustomToken: function (content,token,toAddr,toKey) {
      var msg = {type: 'leth', mode: 'token', time: Date.now(), from: AppService.account(), to: [toAddr,AppService.account()] , senderKey: local_keystore.getPubKeys(hdPath)[0] , text: content, image: token.Logo, attach: {addr: AppService.account(), idkey: AppService.idkey(), token: token}};
      var idFrom = this.identity();
     
      chatsDM.push({
          identity: blockies.create({ seed: msg.from}).toDataURL("image/jpeg"),
          timestamp: Date.now(),
          message: msg
        });

      lightwallet.keystore.deriveKeyFromPassword(JSON.parse(localStorage.AppCode).code, function (err, pwDerivedKey) {
        var encMsg = angular.copy(msg);
        encMsg.text = lightwallet.encryption.multiEncryptString(local_keystore,pwDerivedKey,content,local_keystore.getPubKeys(hdPath)[0],[toKey.replace("0x",""),local_keystore.getPubKeys(hdPath)[0]],hdPath);
        encMsg.image = lightwallet.encryption.multiEncryptString(local_keystore,pwDerivedKey,token.Logo,local_keystore.getPubKeys(hdPath)[0],[toKey.replace("0x",""),local_keystore.getPubKeys(hdPath)[0]],hdPath);

        var payload = web3.fromUtf8(JSON.stringify(encMsg));
        var message = {
          from:  idFrom,
          topics: topics,
          payload: payload,
          ttl: ttlTime,
          workToProve: wtpTime
        };

        web3.shh.post(message); 
      });
    },
    sendInviteToDapp: function (dapp,toAddr,toKey) {
      var content = dapp.message;
      var msg = {type: 'leth', mode: 'encrypted', time: Date.now(), from: AppService.account(), to: [toAddr,AppService.account()] , senderKey: local_keystore.getPubKeys(hdPath)[0] , text: content, image: '', attach: dapp };
      var idFrom = this.identity();

      chatsDM.push({
          identity: blockies.create({ seed: msg.from}).toDataURL("image/jpeg"),
          timestamp: Date.now(),
          message: msg
        });

      lightwallet.keystore.deriveKeyFromPassword(JSON.parse(localStorage.AppCode).code, function (err, pwDerivedKey) {
        var encMsg = angular.copy(msg);
        encMsg.text = lightwallet.encryption.multiEncryptString(local_keystore,pwDerivedKey,content,local_keystore.getPubKeys(hdPath)[0],[toKey.replace("0x",""),local_keystore.getPubKeys(hdPath)[0]],hdPath);
        var payload = web3.fromUtf8(JSON.stringify(encMsg));
        var message = {
          from:  idFrom,
          topics: topics,
          payload: payload,
          ttl: ttlTime,
          workToProve: wtpTime
        };

        web3.shh.post(message); 
      });
    },
    sendCryptedPhoto: function (content,toAddr,toKey) {
      var msg = {type: 'leth', mode: 'encrypted', time: Date.now(), from: AppService.account(), to: [toAddr,AppService.account()] , senderKey: local_keystore.getPubKeys(hdPath)[0] , text: '', image: content };
      var idFrom = this.identity();

      chatsDM.push({
          identity: blockies.create({ seed: msg.from}).toDataURL("image/jpeg"),
          timestamp: Date.now(),
          message: msg
        });

      lightwallet.keystore.deriveKeyFromPassword(JSON.parse(localStorage.AppCode).code, function (err, pwDerivedKey) {
        var encMsg = angular.copy(msg);
        crptMsg.payload.image = lightwallet.encryption.multiEncryptString(local_keystore,pwDerivedKey,content,local_keystore.getPubKeys(hdPath)[0],[toKey.replace("0x",""),local_keystore.getPubKeys(hdPath)[0]],hdPath);
        var payload = web3.fromUtf8(JSON.stringify(encMsg));
        var message = {
          from:  idFrom,
          topics: topics,
          payload: payload,
          ttl: ttlTime,
          workToProve: wtpTime
        };

        web3.shh.post(message); 
      });
    },
    sendTransactionNote: function (transaction) {
      var note = {type: 'leth', mode: 'transaction', time: Date.now(), from: AppService.account(), to: [transaction.to,AppService.account()], text: 'I sent ' + transaction.symbol + " " + (transaction.value / transaction.unit).toFixed(6) + '&#x1F4B8;', image: '', attach: transaction };   
      var payload = web3.fromUtf8(JSON.stringify(note));
      var message = {
        from:  this.identity(),
        topics: topics,
        payload: payload,
        ttl: ttlTime,
        workToProve: wtpTime
      };
      web3.shh.post(message); 

      chatsDM.push({
        identity: blockies.create({ seed: note.from}).toDataURL("image/jpeg"),
        timestamp: Date.now(),
        message: note
      });
    },      
    sendContact: function () {
      var contact = {type: 'leth', mode: 'contact', time: Date.now(), from: AppService.account(), to: [null], text: 'My addresses ' + '&#x1F464;' , image: '', attach: {addr: AppService.account(), idkey: AppService.idkey()} }; 
      var payload = web3.fromUtf8(JSON.stringify(contact));
      var message = {
        from:  this.identity(),
        topics: topics,
        payload: payload,
        ttl: ttlTime,
        workToProve: wtpTime
      };
      web3.shh.post(message); 

      chats.push({
        identity: blockies.create({ seed: contact.from}).toDataURL("image/jpeg"),
        timestamp: Date.now(),
        message: contact
      });
    },      
    sendPosition: function (toAddr, position) {
      var msg = {type: 'leth', mode: 'geolocation', time: Date.now(), from: AppService.account(), to: [toAddr,AppService.account()], text: "Here I am! " + '&#x1F4CD;' , image: '', attach:  position};
      var payload = web3.fromUtf8(JSON.stringify(msg));
      var message = {
        from:  this.identity(),
        topics: topics,
        payload: payload,
        ttl: ttlTime,
        workToProve: wtpTime
      };
      web3.shh.post(message); 
      
      if(toAddr==null){
        chats.push({
          identity: blockies.create({ seed: msg.from}).toDataURL("image/jpeg"),
          timestamp: Date.now(),
          message: msg
        });
      }else{
        chatsDM.push({
          identity: blockies.create({ seed: msg.from}).toDataURL("image/jpeg"),
          timestamp: Date.now(),
          message: msg
        });
      }
    },
    sendDappMessageShh: function (text, dapp) {
      var msg = {type: 'leth', mode: 'dappMessage', time: Date.now(), from: dapp.Address, to: [null], text: text, image:''};
      var payload = web3.fromUtf8(JSON.stringify(msg));
      var message = {
        from:  this.identity(),
        topics: topics,
        payload: payload,
        ttl: ttlTime,
        workToProve: wtpTime
      };
      web3.shh.post(message); 

      chatsDAPP.push({
        identity: blockies.create({ seed: msg.from}).toDataURL("image/jpeg"),
        timestamp: Date.now(),
        message: msg
      });
    },
    sendDappMessage: function (event, guid) {
      var msg = {type: 'leth', mode: 'dappMessage', time: Date.now(), from: event.from, to: [null], text: event.text, image:''};
      var payload = web3.fromUtf8(JSON.stringify(msg));
      var message = {
        from:  event.from,
        payload: payload
      };

      chatsDAPP.push({
        guid: guid,
        identity: blockies.create({ seed: msg.from}).toDataURL("image/jpeg"),
        timestamp: Date.now(),
        message: msg
      });
    },
    listenMessageOLD: function($scope){
      filter =  web3.shh.filter({topics: [topics]});

      filter.watch(function (error, result) {
        var payload = JSON.parse(web3.toUtf8(result.payload));
        //exit on error
        if(error){return;}; 
        //exit if mine
        if(payload.from == AppService.account()){
          //only if exist in chats/chatsDM array skip
          var exist=false;
          angular.forEach(chats, function(value, key) {
            if(angular.equals(value.message,payload)){
             exist=true;
             return;
            }
          })

          if(exist)
            return;
        } 
        //exit if outdated  get only 1 hour before last msg
        if(payload.time*3600 < JSON.parse(localStorage.LastMsg).time){return;} 
        //if encrypted msg write to DM
        if(payload.mode == 'encrypted'){ 
          lightwallet.keystore.deriveKeyFromPassword(JSON.parse(localStorage.AppCode).code, function (err, pwDerivedKey) {
            if(payload.text != '')
              payload.text = lightwallet.encryption.multiDecryptString(local_keystore,pwDerivedKey,payload.text, payload.senderKey,local_keystore.getPubKeys(hdPath)[0],hdPath);
            if(payload.image != '')
              payload.image = lightwallet.encryption.multiDecryptString(local_keystore,pwDerivedKey,payload.image, payload.senderKey,local_keystore.getPubKeys(hdPath)[0],hdPath);

            if(payload.from == AppService.account()){
              angular.forEach(chatsDM, function(value, key) {
                if(angular.equals(value.message,payload)){
                  exist=true;
                  return;
                }
              })

              if(exist)
                return;
            }
            
            chatsDM.push({
              identity: blockies.create({ seed: payload.from}).toDataURL("image/jpeg"),
              timestamp: payload.time,
              message: payload
            });
            
            payload.hash = result.hash;
            $scope.$broadcast("incomingMessage", payload);

          });
        }
        //if plain msg go to global chat
        if(payload.mode == 'plain'){ 
          //if(payload.to[0] == null){
            chats.push({
              identity: blockies.create({ seed: payload.from}).toDataURL("image/jpeg"),
              timestamp: payload.time,
              message: payload
            });  
          //}

          payload.hash = result.hash;
          $scope.$broadcast("incomingMessage", payload);

        };

        //if share contact go to global chat
        if(payload.mode == 'contact'){ 
          //if(payload.to[0] == null){
            chats.push({
              identity: blockies.create({ seed: payload.from}).toDataURL("image/jpeg"),
              timestamp: payload.time,
              message: payload
            });
          //}

          payload.hash = result.hash;
          $scope.$broadcast("incomingMessage", payload);
        };

        //if payment request go to private chat
        if(payload.mode == 'payment'){ 
          //if(payload.to[0] == null){
            //only DM request supported
          //}
          lightwallet.keystore.deriveKeyFromPassword(JSON.parse(localStorage.AppCode).code, function (err, pwDerivedKey) {
            if(payload.text != '')
              payload.text = lightwallet.encryption.multiDecryptString(local_keystore,pwDerivedKey,payload.text, payload.senderKey,local_keystore.getPubKeys(hdPath)[0],hdPath);
            if(payload.image != '')
              payload.image = lightwallet.encryption.multiDecryptString(local_keystore,pwDerivedKey,payload.image, payload.senderKey,local_keystore.getPubKeys(hdPath)[0],hdPath);
            
            chatsDM.push({
              identity: blockies.create({ seed: payload.from}).toDataURL("image/jpeg"),
              timestamp: payload.time,
              message: payload
            });

            payload.hash = result.hash;
            $scope.$broadcast("incomingMessage", payload);
          });
        };

        if(payload.mode == 'token'){ 
          lightwallet.keystore.deriveKeyFromPassword(JSON.parse(localStorage.AppCode).code, function (err, pwDerivedKey) {
            if(payload.text != '')
              payload.text = lightwallet.encryption.multiDecryptString(local_keystore,pwDerivedKey,payload.text, payload.senderKey,local_keystore.getPubKeys(hdPath)[0],hdPath);
            if(payload.image != '')
              payload.image = lightwallet.encryption.multiDecryptString(local_keystore,pwDerivedKey,payload.image, payload.senderKey,local_keystore.getPubKeys(hdPath)[0],hdPath);
            
            chatsDM.push({
              identity: blockies.create({ seed: payload.from}).toDataURL("image/jpeg"),
              timestamp: payload.time,
              message: payload
            });
            payload.hash = result.hash;
            $scope.$broadcast("incomingMessage", payload);
          });
        };

        //if share contact go to global chat
        if(payload.mode == 'geolocation'){ 
          if(payload.to[0] == AppService.account()){
            chatsDM.push({
              identity: blockies.create({ seed: payload.from}).toDataURL("image/jpeg"),
              timestamp: payload.time,
              message: payload
            });
          }
          if(payload.to[0] == null){
            chats.push({
              identity: blockies.create({ seed: payload.from}).toDataURL("image/jpeg"),
              timestamp: payload.time,
              message: payload
            });
          }

          payload.hash = result.hash;
          $scope.$broadcast("incomingMessage", payload);
        };

        if(payload.mode == 'transaction'){ 
          //if(payload.to[0] == null){
            chatsDM.push({
              identity: blockies.create({ seed: payload.from}).toDataURL("image/jpeg"),
              timestamp: payload.time,
              message: payload
            });
          //}

          payload.hash = result.hash;
          $scope.$broadcast("incomingMessage", payload);
        };

        //if dappMessage go to dapp chat
        if(payload.mode == 'dappMessage'){ 
          //if(payload.to[0] == null){
            chatsDAPP.push({
              identity: blockies.create({ seed: payload.from}).toDataURL("image/jpeg"),
              timestamp: payload.time,
              message: payload
            });
          //}

          payload.hash = result.hash;
          $scope.$broadcast("incomingMessage", payload);
        };

      });
    },
    listenMessage: function($scope){
      filter =  web3.shh.filter({topics: [topics]});
      filter.watch(function (error, result) {
        var payload = JSON.parse(web3.toUtf8(result.payload));
        //exit on error
        if(error){return;}; 
        //exit if outdated  get only 1 hour before last msg
        if(payload.time*3600 < JSON.parse(localStorage.LastMsg).time){return;} 
        //exit if mine
        if(payload.from == AppService.account()){
          var exist=false;
          angular.forEach(chats, function(value, key) {
            if(angular.equals(value.message,payload)){
             exist=true;
             return;
            }
          })
          //exit if exist in chats/chatsDM array
          if(exist)
            return;
        }
        //if is public
        if(!payload.to[0]){
          chats.push({
            identity: blockies.create({ seed: payload.from}).toDataURL("image/jpeg"),
            timestamp: payload.time,
            message: payload
          });  

          payload.hash = result.hash;
          $scope.$broadcast("incomingMessage", payload);

        };

        if(payload.to[0] && payload.to[0]==AppService.account()){

          lightwallet.keystore.deriveKeyFromPassword(JSON.parse(localStorage.AppCode).code, function (err, pwDerivedKey) {
            if(payload.text != '')
              payload.text = lightwallet.encryption.multiDecryptString(local_keystore,pwDerivedKey,payload.text, payload.senderKey,local_keystore.getPubKeys(hdPath)[0],hdPath);
            if(payload.image != '')
              payload.image = lightwallet.encryption.multiDecryptString(local_keystore,pwDerivedKey,payload.image, payload.senderKey,local_keystore.getPubKeys(hdPath)[0],hdPath);

            /*
            //if dappMessage go to dapp chat
            if(payload.mode == 'dappMessage'){ 
              //if(payload.to[0] == null){
                chatsDAPP.push({
                  identity: blockies.create({ seed: payload.from}).toDataURL("image/jpeg"),
                  timestamp: payload.time,
                  message: payload
                });
              //}
            */

            chatsDM.push({
              identity: blockies.create({ seed: payload.from}).toDataURL("image/jpeg"),
              timestamp: payload.time,
              message: payload
            });

            payload.hash = result.hash;
            $scope.$broadcast("incomingMessage", payload);

          });
        }
      });
    },    
    unlistenMessage: function(){
      if(filter!=null)
        filter.stopWatching();
    }
  }
})
