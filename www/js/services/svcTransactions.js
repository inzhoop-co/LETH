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
  
      return transactions; //.filter( function(val) {return val.Network==network;});
    },
    delAll: function () {
      transactions=[];
      localStorage.Transactions = JSON.stringify(transactions);
    },
    add: function (t) {
      if(this.get(t) != null)
        return;

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
    get: function (t) {
      var obj = transactions.filter(function (val) {
          return val.id === t.id;
      });
      return obj[0];         
    },
    del: function (t) {
      transactions.splice(transactions.indexOf(t),1);
      localStorage.Transactions = JSON.stringify(transactions);
    },
    getMyTransactions: function(startBlockNumber, endBlockNumber) {
      var svc = this;
      var promises = [];
      
      var q = $q.defer()
      myaccount = AppService.account();

      /*
      if (startBlockNumber < localStorage.txBlockNumber) {
        startBlockNumber = localStorage.txBlockNumber;
        console.log("Using startBlockNumber: " + startBlockNumber);
      }
      */

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
              /*
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
              */

              var t = {from: e.from, to: e.to, id: e.hash, value: e.value, unit: 1e18, symbol: "Ξ", time: new Date(block.timestamp * 1000).getTime(), block: e.blockNumber};
              svc.add(t);

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
