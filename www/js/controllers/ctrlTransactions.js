angular.module('leth.controllers')
.controller('TransactionCtrl', function ($scope, $ionicHistory, $state, $stateParams, $ionicPopup, $ionicListDelegate, Transactions) {
  
  /*
  var backView = $ionicHistory.backView().url;

  $scope.goBack = function(){
    $location.path(backView);
  }
  */

  $scope.isFromTo = function(item) {
      if($stateParams.addr!="")
        return (item.to == $stateParams.addr || item.from == $stateParams.addr);
      return item;
  }

 $scope.checkStatus = function(t){
    web3.eth.getTransaction(t.id, function(err,res){
      if(res){
        t.block = res.blockNumber;
        Transactions.upd(t);
        $scope.transactions = Transactions.all();
        $scope.$digest(); 
      }
    });

    $ionicListDelegate.closeOptionButtons();
 }

  $scope.deleteTransaction = function(t){
    var confirmPopup = $ionicPopup.confirm({
      title: 'Delete Transaction',
      template: 'Are you sure you want to delete this transaction?'
    });

    confirmPopup.then(function(res) {
     if(res) {
        Transactions.del(t);
     }

     $ionicListDelegate.closeOptionButtons();
   });
  }

  $scope.deleteAllTransactions = function(){
    var confirmPopup = $ionicPopup.confirm({
      title: 'Delete Transactions',
      template: 'Are you sure you want to delete all transactions?'
    });

    confirmPopup.then(function(res) {
     if(res) {
        Transactions.delAll();
        $scope.transactions = Transactions.all();
     }
   });
  }

})