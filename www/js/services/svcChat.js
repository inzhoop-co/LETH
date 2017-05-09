angular.module('leth.services')
.factory('Chat', function ($rootScope, $http, $q, $sce, $filter, AppService, Friends, SwarmService) {
  var ttlTime = 90000;
  var wtpTime = 50;

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
    clearDAPP: function(){
      chatsDAPP=[];
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
    sendImageShh: function (content) {
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
    sendImage: function (content) {
      var msg = {type: 'leth', mode: 'plain', time: Date.now(), from: AppService.account(), to: [null], text: '', image: content, attach: {addr: AppService.account(), idkey: AppService.idkey()} };
      var idFrom = this.identity();

      SwarmService.upload(content).then(function(val){
        var nMsg = angular.copy(msg);
        nMsg.image = val;
        nMsg.text = "bzzr@: " + val;
        
        var payload = web3.fromUtf8(JSON.stringify(nMsg));
        var message = {
          from:  idFrom,
          topics: topics,
          payload: payload,
          ttl: ttlTime,
          workToProve: wtpTime
        };
        web3.shh.post(message); 

      }).catch(console.log);
    },
    sendCryptedMessage: function (content,toAddr,toKey) {
      var msg = {type: 'leth', mode: 'encrypted', time: Date.now(), from: AppService.account(), to: [toAddr,AppService.account()] , senderKey: AppService.idkey() , text: content, image: '' };
      var idFrom = this.identity();

      chatsDM.push({
            identity: blockies.create({ seed: msg.from}).toDataURL("image/jpeg"),
            timestamp: Date.now(),
            message: msg
      });

      lightwallet.keystore.deriveKeyFromPassword(JSON.parse(localStorage.AppCode).code, function (err, pwDerivedKey) {
        var encMsg = angular.copy(msg);
        encMsg.text = lightwallet.encryption.multiEncryptString(local_keystore,pwDerivedKey,content,AppService.idkey(),[toKey.replace("0x",""),AppService.idkey()],hdPath);
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
      var paymentRequest = {addr: AppService.account(), idkey: AppService.idkey(), payment: request};
      var msg = {type: 'leth', mode: 'payment', time: Date.now(), from: AppService.account(), to: [toAddr,AppService.account()] , senderKey: AppService.idkey() , text: content, image: '', attach: paymentRequest};
      var idFrom = this.identity();

      chatsDM.push({
          identity: blockies.create({ seed: msg.from}).toDataURL("image/jpeg"),
          timestamp: Date.now(),
          message: msg
        });

      lightwallet.keystore.deriveKeyFromPassword(JSON.parse(localStorage.AppCode).code, function (err, pwDerivedKey) {
        var encMsg = angular.copy(msg);
        encMsg.text = lightwallet.encryption.multiEncryptString(local_keystore,pwDerivedKey,content,AppService.idkey(),[toKey.replace("0x",""),AppService.idkey()],hdPath);
        encMsg.attach = lightwallet.encryption.multiEncryptString(local_keystore,pwDerivedKey,JSON.stringify(paymentRequest),AppService.idkey(),[toKey.replace("0x",""),AppService.idkey()],hdPath);
        
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
      var msg = {type: 'leth', mode: 'token', time: Date.now(), from: AppService.account(), to: [toAddr,AppService.account()] , senderKey: AppService.idkey() , text: content, image: token.Logo, attach: token};
      var idFrom = this.identity();
     
      chatsDM.push({
          identity: blockies.create({ seed: msg.from}).toDataURL("image/jpeg"),
          timestamp: Date.now(),
          message: msg
        });

      lightwallet.keystore.deriveKeyFromPassword(JSON.parse(localStorage.AppCode).code, function (err, pwDerivedKey) {
        var encMsg = angular.copy(msg);
        encMsg.text = lightwallet.encryption.multiEncryptString(local_keystore,pwDerivedKey,content,AppService.idkey(),[toKey.replace("0x",""),AppService.idkey()],hdPath);
        encMsg.image = lightwallet.encryption.multiEncryptString(local_keystore,pwDerivedKey,token.Logo,AppService.idkey(),[toKey.replace("0x",""),AppService.idkey()],hdPath);
        encMsg.attach = lightwallet.encryption.multiEncryptString(local_keystore,pwDerivedKey,JSON.stringify(token),AppService.idkey(),[toKey.replace("0x",""),AppService.idkey()],hdPath);

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
      var msg = {type: 'leth', mode: 'encrypted', time: Date.now(), from: AppService.account(), to: [toAddr,AppService.account()] , senderKey: AppService.idkey() , text: content, image: '', attach: dapp };
      var idFrom = this.identity();

      chatsDM.push({
          identity: blockies.create({ seed: msg.from}).toDataURL("image/jpeg"),
          timestamp: Date.now(),
          message: msg
        });

      lightwallet.keystore.deriveKeyFromPassword(JSON.parse(localStorage.AppCode).code, function (err, pwDerivedKey) {
        var encMsg = angular.copy(msg);
        encMsg.text = lightwallet.encryption.multiEncryptString(local_keystore,pwDerivedKey,content,AppService.idkey(),[toKey.replace("0x",""),AppService.idkey()],hdPath);
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
    sendCryptedPhotoShh: function (content,toAddr,toKey) {
      var msg = {type: 'leth', mode: 'encrypted', time: Date.now(), from: AppService.account(), to: [toAddr,AppService.account()] , senderKey: AppService.idkey() , text: '', image: content };
      var idFrom = this.identity();

      chatsDM.push({
          identity: blockies.create({ seed: msg.from}).toDataURL("image/jpeg"),
          timestamp: Date.now(),
          message: msg
        });

      lightwallet.keystore.deriveKeyFromPassword(JSON.parse(localStorage.AppCode).code, function (err, pwDerivedKey) {
        var encMsg = angular.copy(msg);
        crptMsg.payload.image = lightwallet.encryption.multiEncryptString(local_keystore,pwDerivedKey,content,AppService.idkey(),[toKey.replace("0x",""),AppService.idkey()],hdPath);
         
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
      var msg = {type: 'leth', mode: 'encrypted', time: Date.now(), from: AppService.account(), to: [toAddr,AppService.account()] , senderKey: AppService.idkey() , text: '', image: content };
      var idFrom = this.identity();

      chatsDM.push({
          identity: blockies.create({ seed: msg.from}).toDataURL("image/jpeg"),
          timestamp: Date.now(),
          message: msg
        });

      lightwallet.keystore.deriveKeyFromPassword(JSON.parse(localStorage.AppCode).code, function (err, pwDerivedKey) {
        var encMsg = angular.copy(msg);
        var encImg = lightwallet.encryption.multiEncryptString(local_keystore,pwDerivedKey,content,AppService.idkey(),[toKey.replace("0x",""),AppService.idkey()],hdPath);
        encMsg.image = web3.fromUtf8(JSON.stringify(encImg));

        SwarmService.upload(encMsg.image).then(function(val){
          encMsg.image = val;
          var bzzrAddr = "bzzr@: " + val;
          encMsg.text = lightwallet.encryption.multiEncryptString(local_keystore,pwDerivedKey,bzzrAddr,AppService.idkey(),[toKey.replace("0x",""),AppService.idkey()],hdPath); 
          
          var payload = web3.fromUtf8(JSON.stringify(encMsg));
          var message = {
            from:  idFrom,
            topics: topics,
            payload: payload,
            ttl: ttlTime,
            workToProve: wtpTime
          };

          web3.shh.post(message); 
        }).catch(console.log);
      });
    },
    sendTransactionNotePlain: function (transaction) {
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
    sendTransactionNote: function (transaction) {
      var note = {type: 'leth', mode: 'transaction', time: Date.now(), from: AppService.account(), to: [transaction.to,AppService.account()], senderKey: AppService.idkey() ,text: 'I sent ' + transaction.symbol + " " + (transaction.value / transaction.unit).toFixed(6) + '&#x1F4B8;', image: '', attach: transaction };   
      var idFrom = this.identity();
     
      chatsDM.push({
        identity: blockies.create({ seed: note.from}).toDataURL("image/jpeg"),
        timestamp: Date.now(),
        message: note
      });

      var toKey = Friends.get(transaction.to).idkey;

      lightwallet.keystore.deriveKeyFromPassword(JSON.parse(localStorage.AppCode).code, function (err, pwDerivedKey) {
        var encNote = angular.copy(note);
        encNote.text = lightwallet.encryption.multiEncryptString(local_keystore,pwDerivedKey,note.text,AppService.idkey(),[toKey.replace("0x",""),AppService.idkey()],hdPath); 
        encNote.attach = lightwallet.encryption.multiEncryptString(local_keystore,pwDerivedKey,JSON.stringify(transaction),AppService.idkey(),[toKey.replace("0x",""),AppService.idkey()],hdPath);

        var payload = web3.fromUtf8(JSON.stringify(encNote));
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
      
      chats.push({
        identity: blockies.create({ seed: msg.from}).toDataURL("image/jpeg"),
        timestamp: Date.now(),
        message: msg
      });
    },
    sendCryptedPosition: function (toAddr, position) {
      var msg = {type: 'leth', mode: 'geolocation', time: Date.now(), from: AppService.account(), to: [toAddr,AppService.account()], senderKey: AppService.idkey(), text: "Here I am! " + '&#x1F4CD;' , image: '', attach:  position};
      var idFrom = this.identity();
    
      chatsDM.push({
        identity: blockies.create({ seed: msg.from}).toDataURL("image/jpeg"),
        timestamp: Date.now(),
        message: msg
      });

      var toKey = Friends.get(toAddr).idkey;

      lightwallet.keystore.deriveKeyFromPassword(JSON.parse(localStorage.AppCode).code, function (err, pwDerivedKey) {
        var encMsg = angular.copy(msg);
        encMsg.text = lightwallet.encryption.multiEncryptString(local_keystore,pwDerivedKey,msg.text,AppService.idkey(),[toKey.replace("0x",""),AppService.idkey()],hdPath); 
        encMsg.attach = lightwallet.encryption.multiEncryptString(local_keystore,pwDerivedKey,JSON.stringify(position),AppService.idkey(),[toKey.replace("0x",""),AppService.idkey()],hdPath);

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
    listenMessage: function($scope){
      
      var pushChat = function(payload, result){
          
          chats.push({
            identity: blockies.create({ seed: payload.from}).toDataURL("image/jpeg"),
            timestamp: payload.time,
            message: payload
          });  
          
          payload.hash = result.hash;
          
          $scope.$broadcast("incomingMessage", payload);
      };

      var pushChatDM = function(payload, result){         
          chatsDM.push({
            identity: blockies.create({ seed: payload.from}).toDataURL("image/jpeg"),
            timestamp: payload.time,
            message: payload
          });

          payload.hash = result.hash;
          $scope.$broadcast("incomingMessage", payload);
      };

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
          if(payload.image != ''){
            SwarmService.download(payload.image).then(function(val){
              payload.image = val;
              pushChat(payload, result);
            }).catch(console.log);
          }else{
            pushChat(payload, result);
          }
        };

        if(payload.to[0] && payload.to[0]==AppService.account()){
          lightwallet.keystore.deriveKeyFromPassword(JSON.parse(localStorage.AppCode).code, function (err, pwDerivedKey) {
            if(payload.text != '')
              payload.text = lightwallet.encryption.multiDecryptString(local_keystore,pwDerivedKey,payload.text, payload.senderKey,AppService.idkey(),hdPath);
            if(payload.attach && payload.attach != '')
              payload.attach = JSON.parse(lightwallet.encryption.multiDecryptString(local_keystore,pwDerivedKey,payload.attach, payload.senderKey,AppService.idkey(),hdPath));
            if(payload.image != ''){
              SwarmService.downloadRw(payload.image).then(function(val){
                var img = JSON.parse(web3.toUtf8(val.toString()));
                payload.image = lightwallet.encryption.multiDecryptString(local_keystore,pwDerivedKey,img, payload.senderKey,AppService.idkey(),hdPath);
                
                pushChatDM(payload, result);
              }, function(err){
                payload.image = lightwallet.encryption.multiDecryptString(local_keystore,pwDerivedKey,payload.image, payload.senderKey,AppService.idkey(),hdPath);
                pushChatDM(payload, result);
              }).catch(console.log);
            }else
               pushChatDM(payload, result);
          });
        }
      });
    },    
    retrieveImage: function(){

    },
    unlistenMessage: function(){
      if(filter!=null)
        filter.stopWatching();
    },
    flush: function(){
      chats=[];
      chatsDM=[];
      chatsDAPP=[];
    },

  }
})
