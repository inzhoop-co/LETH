angular.module('leth.services')
.factory('Transactions', function (Chat) {
  var transactions = [];

  return {
    all: function () {
      if (localStorage.Transactions != undefined && localStorage.Transactions[0] !="{") {
        transactions = JSON.parse(localStorage.Transactions);
      } else {
        transactions = [];
      }
  
      return transactions;
    },
    delAll: function () {
      transactions=[];
      localStorage.Transactions = JSON.stringify(transactions);
    },
    add: function (t) {
      transactions.push(t);
      localStorage.Transactions = JSON.stringify(transactions);
    },
    upd: function (t) {
      transactions.filter(function (val) {
        if(val.id === t.id)
          val=t;

        localStorage.Transactions = JSON.stringify(transactions);
      });
    },
    del: function (t) {
      transactions.splice(transactions.indexOf(t),1);
      localStorage.Transactions = JSON.stringify(transactions);
    }
  };
})
