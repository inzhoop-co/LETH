angular.module('leth.services')
.factory('Chat', function ($rootScope, $http, $q, $sce, $filter, AppService, Friends, SwarmService) {
  var ttlTime = 10000;
  var targetPow = 1.01;
  var timePow = 19;
  var identity ="";
  var chats=[];
  var chatsDM=[];
  var chatsDAPP=[];
  var topics = web3.fromUtf8('leth');
  var filter =  null;

  var envelopvar = {
    type: 'leth', 
    mode: 'plain', 
    time: Date.now(), 
    from: AppService.account(), 
    to: [null], 
    text: '', 
    image: '', 
    attach: {
      addr: AppService.account(), 
      idkey: AppService.idkey()
    }
  };

  return{
    envelop: function(mode){
      return {
        type: 'leth', 
        mode: mode, 
        time: Date.now(), 
        from: AppService.account(), 
        to: [null], 
        text: '', 
        image: '',  
        senderKey: AppService.idkey()
      }
    },
    wrap: function(payload){
      return {
        symKeyID: this.identity(),
        topic: topics,
        ttl: ttlTime,
        powTarget: targetPow,
        powTime: timePow,
        payload: payload
      }
    },
    pushChatDM: function(msg, payload){
      chatsDM.push({
            identity: blockies.create({ seed: msg.from}).toDataURL("image/jpeg"),
            timestamp: Date.now(),
            message: msg,
            hash: payload,
            delivered: false
      });
      
    },
    pushChat: function(msg, payload){
      chats.push({
            identity: blockies.create({ seed: msg.from}).toDataURL("image/jpeg"),
            timestamp: Date.now(),
            message: msg,
            hash: payload,
            delivered: false
      });
     
    },
    identity: function(){
      try{
        if(!web3.shh.hasSymKey(identity)){
          identity = web3.shh.generateSymKeyFromPassword("leth");
        }        
      }catch(e){
        return;
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
      //var index = list.indexOf("leth");
      //list.splice(index, 1);
      return list;
    },
    sendACK: function (content,toAddr) {
      var msg = this.envelop('ack');
      msg.to = [toAddr,AppService.account()];
      msg.attach = content;
      var svc = this;

      var payload = web3.fromUtf8(JSON.stringify(msg));        
      var message = svc.wrap(payload);

      web3.shh.post(message, function(err,res){
        //console.log(err,res);
      }); 

    },
    sendMessage: function (content) {
      var msg = this.envelop('plain');
      msg.text = content;

      var payload = web3.fromUtf8(JSON.stringify(msg));
      var message = this.wrap(payload);

      this.pushChat(msg,payload);

      web3.shh.post(message, function(err,res){
        //console.log(err,res);
      });       
    },
    sendCryptedMessage: function (content,toAddr,toKey) {
      var msg = this.envelop('encrypted');
      msg.to = [toAddr,AppService.account()];
      msg.text = content;
      var svc = this;

      lightwallet.keystore.deriveKeyFromPassword(JSON.parse(localStorage.AppCode).code, function (err, pwDerivedKey) {
        var encMsg = angular.copy(msg);
        encMsg.text = lightwallet.encryption.multiEncryptString(local_keystore,pwDerivedKey,content,AppService.idkey(),[toKey.replace("0x",""),AppService.idkey()],hdPath);
        var payload = web3.fromUtf8(JSON.stringify(encMsg));        
        var message = svc.wrap(payload);

        svc.pushChatDM(msg,payload);

        web3.shh.post(message, function(err,res){
          //console.log(err,res);
        }); 
      });
    },
    sendImageShh: function (content) {
      var msg = this.envelop('plain');
      msg.image=content;
      var payload = web3.fromUtf8(JSON.stringify(msg));
      var message = this.wrap(payload);

      this.pushChat(msg,payload);
      
      web3.shh.post(message, function(err,res){
        //console.log(err,res);
      }); 
    },
    sendImage: function (content) {
      var msg = this.envelop('plain');
      msg.image=content;
      var svc = this;

      SwarmService.upload(content).then(function(val){
        var nMsg = angular.copy(msg);
        nMsg.image = val;
        nMsg.text = "bzzr@: " + val;
        
        var payload = web3.fromUtf8(JSON.stringify(nMsg));
        var message = svc.wrap(payload);
        web3.shh.post(message, function(err,res){
          //console.log(err,res);
        }); 

      }).catch(console.log);
    },
    sendCryptedPaymentReq: function (content,request,toAddr,toKey) {
      var msg = this.envelop('payment');
      var paymentRequest = {addr: AppService.account(), idkey: AppService.idkey(), payment: request};
      msg.to = [toAddr,AppService.account()];
      msg.attach = paymentRequest;
      msg.text = content;
      var svc = this;

      lightwallet.keystore.deriveKeyFromPassword(JSON.parse(localStorage.AppCode).code, function (err, pwDerivedKey) {
        var encMsg = angular.copy(msg);
        encMsg.text = lightwallet.encryption.multiEncryptString(local_keystore,pwDerivedKey,content,AppService.idkey(),[toKey.replace("0x",""),AppService.idkey()],hdPath);
        encMsg.attach = lightwallet.encryption.multiEncryptString(local_keystore,pwDerivedKey,JSON.stringify(paymentRequest),AppService.idkey(),[toKey.replace("0x",""),AppService.idkey()],hdPath);
        
        var payload = web3.fromUtf8(JSON.stringify(encMsg));
        var message = svc.wrap(payload);

        svc.pushChatDM(msg,payload);

        web3.shh.post(message, function(err,res){
          //console.log(err,res);
        }); 
      });
    },
    sendCryptedCustomToken: function (content,token,toAddr,toKey) {
      var msg = this.envelop('token');
      msg.image = token.Logo;
      msg.attach = token;
      msg.to = [toAddr,AppService.account()];
      msg.text = content;
      var svc = this;

      lightwallet.keystore.deriveKeyFromPassword(JSON.parse(localStorage.AppCode).code, function (err, pwDerivedKey) {
        var encMsg = angular.copy(msg);
        encMsg.text = lightwallet.encryption.multiEncryptString(local_keystore,pwDerivedKey,content,AppService.idkey(),[toKey.replace("0x",""),AppService.idkey()],hdPath);
        encMsg.image = lightwallet.encryption.multiEncryptString(local_keystore,pwDerivedKey,token.Logo,AppService.idkey(),[toKey.replace("0x",""),AppService.idkey()],hdPath);
        encMsg.attach = lightwallet.encryption.multiEncryptString(local_keystore,pwDerivedKey,JSON.stringify(token),AppService.idkey(),[toKey.replace("0x",""),AppService.idkey()],hdPath);

        var payload = web3.fromUtf8(JSON.stringify(encMsg));
        var message = svc.wrap(payload);

        svc.pushChatDM(msg,payload);

        web3.shh.post(message, function(err,res){
          //console.log(err,res);
        });
      });
    },
    sendInviteToDapp: function (dapp,toAddr,toKey) {
      var content = dapp.message;
      var msg = {type: 'leth', mode: 'encrypted', time: Date.now(), from: AppService.account(), to: [toAddr,AppService.account()] , senderKey: AppService.idkey() , text: content, image: '', attach: dapp };
      var idFrom = this.identity();

      lightwallet.keystore.deriveKeyFromPassword(JSON.parse(localStorage.AppCode).code, function (err, pwDerivedKey) {
        var encMsg = angular.copy(msg);
        encMsg.text = lightwallet.encryption.multiEncryptString(local_keystore,pwDerivedKey,content,AppService.idkey(),[toKey.replace("0x",""),AppService.idkey()],hdPath);
        var payload = web3.fromUtf8(JSON.stringify(encMsg));
        var message = svc.wrap(payload);

        svc.pushChatDM(msg,payload);

        web3.shh.post(message, function(err,res){
          console.log(err,res);
        });
      });
    },
    sendCryptedPhotoShh: function (content,toAddr,toKey) {
      var msg = this.envelop('encrypted');
      msg.image = content;
      msg.to = [toAddr,AppService.account()];
      var svc = this;

      lightwallet.keystore.deriveKeyFromPassword(JSON.parse(localStorage.AppCode).code, function (err, pwDerivedKey) {
        var encMsg = angular.copy(msg);
        crptMsg.payload.image = lightwallet.encryption.multiEncryptString(local_keystore,pwDerivedKey,content,AppService.idkey(),[toKey.replace("0x",""),AppService.idkey()],hdPath);
         
        var payload = web3.fromUtf8(JSON.stringify(encMsg));
        var message = svc.wrap(payload);

        svc.pushChatDM(msg,payload);

        web3.shh.post(message, function(err,res){
          //console.log(err,res);
        }); 
      });
    },
    sendCryptedPhoto: function (content,toAddr,toKey) {
      var msg = this.envelop('encrypted');
      msg.image = content;
      msg.to = [toAddr,AppService.account()];
      var svc = this;

      lightwallet.keystore.deriveKeyFromPassword(JSON.parse(localStorage.AppCode).code, function (err, pwDerivedKey) {
        var encMsg = angular.copy(msg);
        var encImg = lightwallet.encryption.multiEncryptString(local_keystore,pwDerivedKey,content,AppService.idkey(),[toKey.replace("0x",""),AppService.idkey()],hdPath);
        encMsg.image = web3.fromUtf8(JSON.stringify(encImg));

        SwarmService.upload(encMsg.image).then(function(val){
          encMsg.image = val;
          var bzzrAddr = "bzzr@: " + val;
          encMsg.text = lightwallet.encryption.multiEncryptString(local_keystore,pwDerivedKey,bzzrAddr,AppService.idkey(),[toKey.replace("0x",""),AppService.idkey()],hdPath); 
          
          var payload = web3.fromUtf8(JSON.stringify(encMsg));
          var message = svc.wrap(payload);

          svc.pushChatDM(msg,payload);

          web3.shh.post(message, function(err,res){
            //console.log(err,res);
          }); 
        }).catch(console.log);
      });
    },
    sendTransactionNotePlain: function (transaction) {
      var msg = this.envelop('transaction');
      msg.text = 'I sent ' + transaction.symbol + " " + (transaction.value / transaction.unit).toFixed(6) + '&#x1F4B8;';
      msg.attach = transaction;
      msg.to = [transaction.addr,AppService.account()];
      var svc = this;

      var payload = web3.fromUtf8(JSON.stringify(msg));
      var message = svc.wrap(payload);
    
      svc.pushChatDM(msg,payload);

      web3.shh.post(message, function(err,res){
        //console.log(err,res);
      });
    },
    sendTransactionNote: function (transaction) {
      var toKey = Friends.get(transaction.to);
      //sesinamiku
      if(typeof toKey == "undefined") return;

      var msg = this.envelop('transaction');
      msg.text = 'I sent ' + transaction.symbol + " " + (transaction.value / transaction.unit).toFixed(6) + '&#x1F4B8;';
      msg.attach = transaction;
      msg.to = [transaction.addr,AppService.account()];
      var svc = this;

      lightwallet.keystore.deriveKeyFromPassword(JSON.parse(localStorage.AppCode).code, function (err, pwDerivedKey) {
        var encNote = angular.copy(msg);
        encNote.text = lightwallet.encryption.multiEncryptString(local_keystore,pwDerivedKey,msg.text,AppService.idkey(),[toKey.idkey.replace("0x",""),AppService.idkey()],hdPath); 
        encNote.attach = lightwallet.encryption.multiEncryptString(local_keystore,pwDerivedKey,JSON.stringify(transaction),AppService.idkey(),[toKey.idkey.replace("0x",""),AppService.idkey()],hdPath);

        var payload = web3.fromUtf8(JSON.stringify(encNote));
        var message = svc.wrap(payload);
  
        svc.pushChatDM(msg,payload);

        web3.shh.post(message, function(err,res){
          //console.log(err,res);
        });
      });
    },      
    sendContact: function () {
      var msg = this.envelop('contact');
      msg.text = 'My addresses ' + '&#x1F464;';
      var svc = this;

      var payload = web3.fromUtf8(JSON.stringify(msg));
      var message = svc.wrap(payload);
      
      svc.pushChat(msg,payload);

      web3.shh.post(message, function(err,res){
        //console.log(err,res);
      }); 

      
    },      
    sendPosition: function (toAddr, position) {
      var msg = this.envelop('geolocation');
      msg.text = "Here I am! " + '&#x1F4CD;';
      msg.attach = position;
      var svc = this;

      var payload = web3.fromUtf8(JSON.stringify(msg));
      var message = svc.wrap(payload);
      
      svc.pushChat(msg,payload);

      web3.shh.post(message, function(err,res){
        //console.log(err,res);
      }); 
    },
    sendCryptedPosition: function (toAddr, position) {
      var msg = this.envelop('geolocation');
      msg.text = "Here I am! " + '&#x1F4CD;';
      msg.attach = position;
      msg.to = [toAddr,AppService.account()];
      var svc = this;
    
      var toKey = Friends.get(toAddr).idkey;

      lightwallet.keystore.deriveKeyFromPassword(JSON.parse(localStorage.AppCode).code, function (err, pwDerivedKey) {
        var encMsg = angular.copy(msg);
        encMsg.text = lightwallet.encryption.multiEncryptString(local_keystore,pwDerivedKey,msg.text,AppService.idkey(),[toKey.replace("0x",""),AppService.idkey()],hdPath); 
        encMsg.attach = lightwallet.encryption.multiEncryptString(local_keystore,pwDerivedKey,JSON.stringify(position),AppService.idkey(),[toKey.replace("0x",""),AppService.idkey()],hdPath);

        var payload = web3.fromUtf8(JSON.stringify(encMsg));
        var message = svc.wrap(payload);
  
        svc.pushChatDM(msg,payload);

        web3.shh.post(message, function(err,res){
          //console.log(err,res);
        });
      });      
    },
    sendDappMessageShh: function (text, dapp) {
      var msg = this.envelop('dappMessage');
      msg.text = text;
      msg.from = dapp.Address;
      var svc = this;

      var payload = web3.fromUtf8(JSON.stringify(msg));
      var message = svc.wrap(payload);
      
      web3.shh.post(message); 

      chatsDAPP.push({
        identity: blockies.create({ seed: msg.from}).toDataURL("image/jpeg"),
        timestamp: Date.now(),
        message: msg
      });
    },
    sendDappMessage: function (event, guid) {
      var msg = this.envelop('dappMessage');
      msg.text = event.text;
      msg.from = event.from;

      chatsDAPP.push({
        guid: guid,
        identity: blockies.create({ seed: msg.from}).toDataURL("image/jpeg"),
        timestamp: Date.now(),
        message: msg
      });
    },
    listenMessage: function($scope){
      var svc = this;
      filter =  web3.shh.newMessageFilter({symKeyID: this.identity(), topic: topics}, null, function(error) {console.log(error);});
      
      filter.watch(function (error, result) {
        //exit on error
        if(error) return; 

        var payload = JSON.parse(web3.toUtf8(result.payload));

        //if ack message
        if(payload.mode=="ack"){
          chats.filter(function (c) {
            if(c.hash === payload.attach){
              c.delivered=true;
              exist=true;
            }
          })
          
          chatsDM.filter(function (c) {
            if(c.hash === payload.attach){
              c.delivered=true;
              exist=true;
            }
          })
          
          if(exist) return;
        };

        //if just in chats array exit
        var exist=false;
        chats.filter(function (c) {
          if(c.hash === result.payload){
            exist=true;
          }
        })
        chatsDM.filter(function (c) {
          if(c.hash === result.payload){
            exist=true;
          }
        })

        //exit if exist in chats/chatsDM array
        if(exist) return;

        //if in blacklist exit
        var isBanned=false;
        var blist = JSON.parse(localStorage.Blacklist);
        blist.filter(function (val) {
          if(val.addr === payload.from) 
            isBanned=true;
        });
        if(isBanned) return;

        //exit if outdated  get only 1 hour before last msg
        if(payload.time*3600 < JSON.parse(localStorage.LastMsg).time){return;} 
        
        //if is public
        if(!payload.to[0]){
          if(payload.image != ''){
            SwarmService.download(payload.image).then(function(val){
              payload.image = val;
              svc.pushChat(payload, result.payload);
              $scope.$broadcast("incomingMessage", payload);
              svc.sendACK(result.payload, null);
            }).catch(console.log);
          }else{
            svc.pushChat(payload, result.payload);
            $scope.$broadcast("incomingMessage", payload);
            svc.sendACK(result.payload, null);

          }
        };
        
        //if is DM encrypted
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
                $scope.$broadcast("incomingMessage", payload);
                svc.sendACK(result.payload, payload.to[1]);

              }, function(err){
                payload.image = lightwallet.encryption.multiDecryptString(local_keystore,pwDerivedKey,payload.image, payload.senderKey,AppService.idkey(),hdPath);
                svc.pushChatDM(payload, result.payload);
                $scope.$broadcast("incomingMessage", payload);
                svc.sendACK(result.payload, payload.to[1]);
              }).catch(console.log);
            }else
              svc.pushChatDM(payload, result.payload);
              $scope.$broadcast("incomingMessage", payload);
              svc.sendACK(result.payload, payload.to[1]);
          });
        }

      });  
    },
    retrieveImage: function(){

    },
    unlistenMessage: function(){
      if(filter.filterId!=null)
        filter.stopWatching();
    },
    flush: function(){
      chats=[];
      chatsDM=[];
      chatsDAPP=[];
    }

  }
})
