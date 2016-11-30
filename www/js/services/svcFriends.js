angular.module('leth.services')
.factory('Friends', function ($rootScope, $http, $q) {
  return {
    all: function () {
      return JSON.parse(localStorage.Friends);
    },
    add: function(name,addr,idkey,comment) {
      var addressbook = JSON.parse(localStorage.Friends);

      var icon = blockies.create({ 
      seed: addr, 
      //color: '#ff9933', 
      //bgcolor: 'red', 
      //size: 15, // width/height of the icon in blocks, default: 8
      //scale: 2, 
      //spotcolor: '#000' 
      });

      var friend = {"addr": addr, "idkey": idkey, "comment": comment, "name": name, "icon":icon.toDataURL("image/jpeg"), "unread":0};
      addressbook.push(friend);
      localStorage.Friends = JSON.stringify(addressbook);

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
    update: function(name,addr,idkey,comment) {
      var addressbook = JSON.parse(localStorage.Friends);
      addressbook.filter(function (val) {
        if(val.addr === addr){
          val.name=name;
          val.comment=comment;

          localStorage.Friends = JSON.stringify(addressbook);
        }
      });
    }, 
    increaseUnread: function(address) {
      var addressbook = JSON.parse(localStorage.Friends);
      addressbook.filter(function (val) {
        if(val.addr === address){
          val.unread+=1;
          localStorage.Friends = JSON.stringify(addressbook);
        }
      });
    },      
    clearUnread: function(address) {
      var addressbook = JSON.parse(localStorage.Friends);
      addressbook.filter(function (val) {
        if(val.addr === address)
          val.unread=0;

        localStorage.Friends = JSON.stringify(addressbook);
      });
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