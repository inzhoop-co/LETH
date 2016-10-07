angular.module('leth.services')
.factory('Transactions', function (Chat) {
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
    add: function (t) {
      transactions.push(t);
      localStorage.Transactions = JSON.stringify(transactions);
    }
  };
})
