angular.module('leth.services')
.factory('Friends', function ($rootScope, $http, $q) {
  return {
    all: function () {
      return JSON.parse(localStorage.Friends);
    },
    add: function(name,addr,idkey,comment) {
      var addressbook = JSON.parse(localStorage.Friends);

      var icon = hqx(blockies.create({ 
      seed: addr, 
      //color: '#ff9933', 
      //bgcolor: 'red', 
      //size: 15, // width/height of the icon in blocks, default: 8
      //scale: 2, 
      //spotcolor: '#000' 
      }),4).toDataURL("image/jpeg");

      var friend = {"addr": addr, "idkey": idkey, "comment": comment, "name": name, "icon":icon, "unread":0};
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
    remove_old: function(addressbook, index) {
      addressbook.splice(index, 1);
      return addressbook;
    },
    remove: function(friend){
      var addressbook = JSON.parse(localStorage.Friends);
      var indexOfFriend = addressbook.findIndex(i => i.addr === friend.addr);

      addressbook.splice(indexOfFriend,1);
      localStorage.Friends = JSON.stringify(addressbook);
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
      var q = $q.defer();      
          web3.eth.getBalance(friend.addr, function(err, res){
            if(!err)
              q.resolve((parseFloat(res) / 1.0e18).toFixed(6));
            else
              q.reject(err); 
          });
      return q.promise;
    }
  };
})