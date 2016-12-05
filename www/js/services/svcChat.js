angular.module('leth.services')
.factory('Chat', function ($rootScope, $http, $q, $sce, AppService, Friends) {
  var ttlTime = 10000;
  var wtpTime = 100;

  var identity ="0x";
  var chats=[];
  var chatsDM=[];
  var chatsDAPP=[];
  var topics = ["leth"];
  var filter =  null;
  var _decryptMessage = function(result){
      lightwallet.keystore.deriveKeyFromPassword(JSON.parse(localStorage.AppCode).code, function (err, pwDerivedKey) {
        result.payload.text = lightwallet.encryption.multiDecryptString(local_keystore,pwDerivedKey,result.payload.text, result.payload.senderKey,local_keystore.getPubKeys(hdPath)[0],hdPath);
        
        return result;
      });
  };
  return{
    identity: function(){
      if(!web3.shh.hasIdentity(identity)){
        identity = web3.shh.newIdentity();
      }
      return identity;
    },
    find: function(){
      return chats;
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
      //base topic uneditable
      var index = list.indexOf("leth");
      list.splice(index, 1);
      return list;
    },      
    sendMessage: function (content) {
      var msg = {type: 'leth', mode: 'plain', from: AppService.account(), to: [null], text: content, image: '', attach: {addr: AppService.account(), idkey: AppService.idkey()} };
      var payload = msg;
      var message = {
        from:  this.identity(),
        topics: topics,
        payload: payload,
        ttl: ttlTime,
        workToProve: wtpTime
      };
      web3.shh.post(message); 

      chats.push({
        identity: blockies.create({ seed: payload.from}).toDataURL("image/jpeg"),
        timestamp: Date.now(),
        message: payload
      });
    },
    sendImage: function (content) {
      var msg = {type: 'leth', mode: 'plain', from: AppService.account(), to: [null], text: '', image: img};
      var payload = msg;
      var message = {
        from:  this.identity(),
        topics: topics,
        payload: payload,
        ttl: ttlTime,
        workToProve: wtpTime
      };
      web3.shh.post(message); 

      chats.push({
        identity: blockies.create({ seed: payload.from}).toDataURL("image/jpeg"),
        timestamp: Date.now(),
        message: payload
      });
    },
    sendCryptedMessage: function (content,toAddr,toKey) {
      var msg = {type: 'leth', mode: 'encrypted', from: AppService.account(), to: [toAddr,AppService.account()] , senderKey: local_keystore.getPubKeys(hdPath)[0] , text: content, image: '' };
      var idFrom = this.identity();
      var payload = msg;
      var message = {
        from:  idFrom,
        topics: topics,
        payload: payload,
        ttl: ttlTime,
        workToProve: wtpTime
      };

      chatsDM.push({
          identity: blockies.create({ seed: payload.from}).toDataURL("image/jpeg"),
          timestamp: Date.now(),
          message: payload
        });

      lightwallet.keystore.deriveKeyFromPassword(JSON.parse(localStorage.AppCode).code, function (err, pwDerivedKey) {
        var crptMsg = angular.copy(message);

        crptMsg.payload.text = lightwallet.encryption.multiEncryptString(local_keystore,pwDerivedKey,content,local_keystore.getPubKeys(hdPath)[0],[toKey.replace("0x",""),local_keystore.getPubKeys(hdPath)[0]],hdPath);

        web3.shh.post(crptMsg); 
      });
    },
    sendCryptedPhoto: function (content,toAddr,toKey) {
      var msg = {type: 'leth', mode: 'encrypted', from: AppService.account(), to: [toAddr,AppService.account()] , senderKey: local_keystore.getPubKeys(hdPath)[0] , text: '', image: content };
      var idFrom = this.identity();
      var payload = msg;
      var message = {
        from:  idFrom,
        topics: topics,
        payload: payload,
        ttl: ttlTime,
        workToProve: wtpTime
      };

      chatsDM.push({
          identity: blockies.create({ seed: payload.from}).toDataURL("image/jpeg"),
          timestamp: Date.now(),
          message: payload
        });

      lightwallet.keystore.deriveKeyFromPassword(JSON.parse(localStorage.AppCode).code, function (err, pwDerivedKey) {
        var crptMsg = angular.copy(message);

        crptMsg.payload.image = lightwallet.encryption.multiEncryptString(local_keystore,pwDerivedKey,content,local_keystore.getPubKeys(hdPath)[0],[toKey.replace("0x",""),local_keystore.getPubKeys(hdPath)[0]],hdPath);

        web3.shh.post(crptMsg); 
      });
    },
    sendTransactionNote: function (transaction) {
      var note = {type: 'leth', mode: 'transaction', from: AppService.account(), to: [transaction.to,AppService.account()], text: 'I sent ' + transaction.symbol + " " + (transaction.value / transaction.unit).toFixed(6) + '&#x1F4B8;', image: '', attach: transaction };
      
      var payload = note;
      var message = {
        from:  this.identity(),
        topics: topics,
        payload: payload,
        ttl: ttlTime,
        workToProve: wtpTime
      };
      web3.shh.post(message); 

      chatsDM.push({
        identity: blockies.create({ seed: payload.from}).toDataURL("image/jpeg"),
        timestamp: Date.now(),
        message: payload
      });
    },      
    sendContact: function () {
      var contact = {type: 'leth', mode: 'contact', from: AppService.account(), to: [null], text: 'My addresses ' + '&#x1F464;' , image: '', attach: {addr: AppService.account(), idkey: AppService.idkey()} };
      
      var payload = contact;
      var message = {
        from:  this.identity(),
        topics: topics,
        payload: payload,
        ttl: ttlTime,
        workToProve: wtpTime
      };
      web3.shh.post(message); 

      chats.push({
        identity: blockies.create({ seed: payload.from}).toDataURL("image/jpeg"),
        timestamp: Date.now(),
        message: payload
      });
    },      
    sendPosition: function (toAddr, position) {
      var note = {type: 'leth', mode: 'geolocation', from: AppService.account(), to: [toAddr,AppService.account()], text: "Here I am! " + '&#x1F4CD;' , image: '', attach:  position};
      
      var payload = note;
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
          identity: blockies.create({ seed: payload.from}).toDataURL("image/jpeg"),
          timestamp: Date.now(),
          message: payload
        });
      }else{
        chatsDM.push({
          identity: blockies.create({ seed: payload.from}).toDataURL("image/jpeg"),
          timestamp: Date.now(),
          message: payload
        });
      }
    },
    sendDappMessage: function (txt, dapp) {
      var msg = {type: 'leth', mode: 'dappMessage', from: dapp.Address, to: [null], text: text};
      var payload = msg;
      var message = {
        from:  identity,
        topics: topics,
        payload: payload,
        ttl: ttlTime,
        workToProve: wtpTime
      };
      web3.shh.post(message); 

      chatsDAPP.push({
        identity: blockies.create({ seed: payload.from}).toDataURL("image/jpeg"),
        timestamp: Date.now(),
        message: payload
      });
    },
    encryptMessage: function (msg,toAddr,toKey) {
      lightwallet.keystore.deriveKeyFromPassword(JSON.parse(localStorage.AppCode).code, function (err, pwDerivedKey) {
        textMsg = lightwallet.encryption.multiEncryptString(local_keystore,pwDerivedKey,textMsg, local_keystore.getPubKeys(hdPath)[0],[toKey.replace("0x",""),local_keystore.getPubKeys(hdPath)[0]],hdPath);

        var msg = {type: 'leth', mode: 'encrypted', from: AppService.account(), to: [toAddr,AppService.account()] , senderKey: local_keystore.getPubKeys(hdPath)[0] , text: textMsg, image: '' };

        return msg;    
      });
      return false;
    },
    listenMessageEX: function($scope){
      filter =  web3.shh.filter({topics: [topics]});
      filter.watch(function (error, result) {
        if(error){return;};
        if(result.payload.from == AppService.account()){return;}
        if(result.sent*1000 <= localStorage.LastMsgTms){return;}
        if(result.payload.mode == 'encrypted'){
          lightwallet.keystore.deriveKeyFromPassword(JSON.parse(localStorage.AppCode).code, function (err, pwDerivedKey) {
            if(result.payload.text != '')
              result.payload.text = lightwallet.encryption.multiDecryptString(local_keystore,pwDerivedKey,result.payload.text, result.payload.senderKey,local_keystore.getPubKeys(hdPath)[0],hdPath);
            if(result.payload.image != '')
              result.payload.image = lightwallet.encryption.multiDecryptString(local_keystore,pwDerivedKey,result.payload.image, result.payload.senderKey,local_keystore.getPubKeys(hdPath)[0],hdPath);

            chatsDM.push({
              identity: blockies.create({ seed: result.payload.from}).toDataURL("image/jpeg"),
              timestamp: result.sent*1000,
              message: result.payload
            });
            $scope.$broadcast("incomingMessage", result);              
          });
        }
        else{
          if(result.payload.from != AppService.account()){
            if(result.payload.to[0] == null){
              chats.push({
                identity: blockies.create({ seed: result.payload.from}).toDataURL("image/jpeg"),
                timestamp: result.sent*1000,
                message: result.payload
              });
            }else{
              chatsDM.push({
                identity: blockies.create({ seed: result.payload.from}).toDataURL("image/jpeg"),
                timestamp: result.sent*1000,
                message: result.payload
              });
            }

            $scope.$broadcast("incomingMessage", result);
          }//exclude self sent              
        };//else
        localStorage.LastMsgTms = result.sent*1000;
      });
    },
    listenMessage: function($scope){
      filter =  web3.shh.filter({topics: [topics]});

      filter.watch(function (error, result) {
        //exit on error
        if(error){return;}; 
        //exit if mine
        if(result.payload.from == AppService.account()){return;} 
        //exit if outdated
        if(result.sent*1000 <= localStorage.LastMsgTms){return;} 
        //if encrypted msg write to DM
        if(result.payload.mode == 'encrypted'){ 
          lightwallet.keystore.deriveKeyFromPassword(JSON.parse(localStorage.AppCode).code, function (err, pwDerivedKey) {
            if(result.payload.text != '')
              result.payload.text = lightwallet.encryption.multiDecryptString(local_keystore,pwDerivedKey,result.payload.text, result.payload.senderKey,local_keystore.getPubKeys(hdPath)[0],hdPath);
            if(result.payload.image != '')
              result.payload.image = lightwallet.encryption.multiDecryptString(local_keystore,pwDerivedKey,result.payload.image, result.payload.senderKey,local_keystore.getPubKeys(hdPath)[0],hdPath);

            chatsDM.push({
              identity: blockies.create({ seed: result.payload.from}).toDataURL("image/jpeg"),
              timestamp: result.sent*1000,
              message: result.payload
            });

            $scope.$broadcast("incomingMessage", result);              
          });
        }
        //if plain msg go to global chat
        if(result.payload.mode == 'plain'){ 
          //if(result.payload.to[0] == null){
            chats.push({
              identity: blockies.create({ seed: result.payload.from}).toDataURL("image/jpeg"),
              timestamp: result.sent*1000,
              message: result.payload
            });
          //}

          $scope.$broadcast("incomingMessage", result);
        };

        //if share contact go to global chat
        if(result.payload.mode == 'contact'){ 
          //if(result.payload.to[0] == null){
            chats.push({
              identity: blockies.create({ seed: result.payload.from}).toDataURL("image/jpeg"),
              timestamp: result.sent*1000,
              message: result.payload
            });
          //}

          $scope.$broadcast("incomingMessage", result);
        };

        //if share contact go to global chat
        if(result.payload.mode == 'geolocation'){ 
          if(result.payload.to[0] == AppService.account()){
            chatsDM.push({
              identity: blockies.create({ seed: result.payload.from}).toDataURL("image/jpeg"),
              timestamp: result.sent*1000,
              message: result.payload
            });
          }
          if(result.payload.to[0] == null){
            chats.push({
              identity: blockies.create({ seed: result.payload.from}).toDataURL("image/jpeg"),
              timestamp: result.sent*1000,
              message: result.payload
            });
          }

          $scope.$broadcast("incomingMessage", result);
        };

        //if dappMessage go to dapp chat
        if(result.payload.mode == 'dappMessage'){ 
          //if(result.payload.to[0] == null){
            chatsDAPP.push({
              identity: blockies.create({ seed: result.payload.from}).toDataURL("image/jpeg"),
              timestamp: result.sent*1000,
              message: result.payload
            });
          //}

          $scope.$broadcast("incomingMessage", result);
        };

        //flag time last received
        localStorage.LastMsgTms = result.sent*1000;
      });
    },
    unlistenMessage: function(){
      if(filter!=null)
        filter.stopWatching();
    }
  }
})
