angular.module('leth.services')
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