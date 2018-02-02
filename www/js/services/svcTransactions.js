angular.module('leth.services')
.factory('Transactions', function ($q, Chat, AppService) {
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
    },
    getMyTransactions: function(startBlockNumber, endBlockNumber) {
      var promises = [];
      
      var q = $q.defer()
      myaccount = AppService.account();

      if (endBlockNumber == null) {
        endBlockNumber = web3.eth.blockNumber;
        console.log("Using endBlockNumber: " + endBlockNumber);
      }

      if (startBlockNumber == null) {
        startBlockNumber = endBlockNumber - 1000;
        console.log("Using startBlockNumber: " + startBlockNumber);
      }

      console.log("Searching for transactions to/from account \"" + myaccount + "\" within blocks "  + startBlockNumber + " and " + endBlockNumber);

      for (var i = startBlockNumber; i <= endBlockNumber; i++) {
        if (i % 1000 == 0) {
          console.log("Searching block " + i);
        }
        var block = web3.eth.getBlock(i, true);
        if (block != null && block.transactions != null) {
          block.transactions.forEach( function(e) {
            if (myaccount == "*" || myaccount == e.from || myaccount == e.to) {

              console.log("  tx hash          : " + e.hash + "\n"
                + "   nonce           : " + e.nonce + "\n"
                + "   blockHash       : " + e.blockHash + "\n"
                + "   blockNumber     : " + e.blockNumber + "\n"
                + "   transactionIndex: " + e.transactionIndex + "\n"
                + "   from            : " + e.from + "\n" 
                + "   to              : " + e.to + "\n"
                + "   value           : " + e.value + "\n"
                + "   time            : " + block.timestamp + " " + new Date(block.timestamp * 1000).toGMTString() + "\n"
                + "   gasPrice        : " + e.gasPrice + "\n"
                + "   gas             : " + e.gas + "\n"
                + "   input           : " + e.input);
              
              q.notify(e);
            }
          })
        }

        if(i==endBlockNumber)
          q.resolve(i);

      }

      return q.promise;
    }

  };
})
