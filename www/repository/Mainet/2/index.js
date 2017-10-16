var dappleth = (function(){
	var dappContract;
	var Dapp;
	var ABI;

	var _init = function(core) {
		$scope = core.scope;
		$service = core.service;

		Dapp = $scope.Dapp.activeApp;
		Dapp.Address = "0xe6517b766E6Ee07f91b517435ed855926bCb1AaE";
		//"0xf45a8e4161007754ff0b7a85eac47ea857590836";
		Dapp.ABI = '[{"constant":true,"inputs":[],"name":"maxProfitAsPercentOfHouse","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newHouseEdge","type":"uint256"}],"name":"ownerSetHouseEdge","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"myid","type":"bytes32"},{"name":"result","type":"string"}],"name":"__callback","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"payoutsPaused","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newTreasury","type":"address"}],"name":"ownerSetTreasury","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"ownerAddBankroll","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"myid","type":"bytes32"},{"name":"result","type":"string"},{"name":"proof","type":"bytes"}],"name":"__callback","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"maxBetDivisor","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"maxNumber","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"addressToCheck","type":"address"}],"name":"playerGetPendingTxByAddress","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newPayoutStatus","type":"bool"}],"name":"ownerPausePayouts","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"ownerChangeOwner","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"minNumber","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newMaxProfitAsPercent","type":"uint256"}],"name":"ownerSetMaxProfitAsPercentOfHouse","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"treasury","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newMinimumBet","type":"uint256"}],"name":"ownerSetMinBet","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newStatus","type":"bool"}],"name":"ownerPauseGame","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"gasForOraclize","outputs":[{"name":"","type":"uint32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"sendTo","type":"address"},{"name":"amount","type":"uint256"}],"name":"ownerTransferEther","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"contractBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"minBet","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"playerWithdrawPendingTransactions","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"maxProfit","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalUserProfit","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalBets","outputs":[{"name":"","type":"int256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"gamePaused","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"originalPlayerBetId","type":"bytes32"},{"name":"sendTo","type":"address"},{"name":"originalPlayerProfit","type":"uint256"},{"name":"originalPlayerBetValue","type":"uint256"}],"name":"ownerRefundPlayer","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newSafeGasToOraclize","type":"uint32"}],"name":"ownerSetOraclizeSafeGas","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"ownerkill","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"houseEdge","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"rollUnder","type":"uint256"}],"name":"playerRollDice","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"houseEdgeDivisor","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"maxPendingPayouts","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"BetID","type":"bytes32"},{"indexed":true,"name":"PlayerAddress","type":"address"},{"indexed":true,"name":"RewardValue","type":"uint256"},{"indexed":false,"name":"ProfitValue","type":"uint256"},{"indexed":false,"name":"BetValue","type":"uint256"},{"indexed":false,"name":"PlayerNumber","type":"uint256"}],"name":"LogBet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"BetID","type":"bytes32"},{"indexed":true,"name":"PlayerAddress","type":"address"},{"indexed":true,"name":"PlayerNumber","type":"uint256"},{"indexed":false,"name":"DiceResult","type":"uint256"},{"indexed":false,"name":"Value","type":"uint256"},{"indexed":false,"name":"Status","type":"int256"},{"indexed":false,"name":"Proof","type":"bytes"}],"name":"LogResult","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"BetID","type":"bytes32"},{"indexed":true,"name":"PlayerAddress","type":"address"},{"indexed":true,"name":"RefundValue","type":"uint256"}],"name":"LogRefund","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"SentToAddress","type":"address"},{"indexed":true,"name":"AmountTransferred","type":"uint256"}],"name":"LogOwnerTransfer","type":"event"}]';
		//'[{"constant":false,"inputs":[],"name":"kill","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"greet","outputs":[{"name":"","type":"string"}],"type":"function"},{"inputs":[{"name":"_greeting","type":"string"}],"type":"constructor"}]';

		_start();		
	}

	var _start = function() {
		$scope.slideIndex=0;
		$scope.Dapp.read = true;

		$scope.dappRefresh = function(value){
			$D.scope.$broadcast('scroll.refreshComplete');
		}

		$scope.isRead = function(value){
			$scope.Dapp.read = value;
		}

		$scope.next = function() {
			$service.nextSlide();
		};

		$scope.previous = function() {
			$service.prevSlide();
			$scope.start= false;
		};

		$scope.startApp = function() {
			$scope.start= true;
		};

		$scope.slideChanged = function(index) {
		   $scope.slideIndex = index;
		};

		$scope.install = function() {
			$scope.Dapp.functions = JSON.parse(Dapp.ABI);
			dappContract = web3.eth.contract($scope.Dapp.functions).at(Dapp.Address);
			$service.nextSlide();
		};

		$scope.toggleGroup = function(group) {
		    if ($scope.isGroupShown(group)) {
		      $scope.shownGroup = null;
		    } else {
		      $scope.shownGroup = group;
			}
		};
		
		$scope.isGroupShown = function(group) {
			return $scope.shownGroup === group;
		};

		$scope.funCall = function(f) {
			if($scope.Dapp.read){
				var res = dappContract[f].apply();
				$service.popupAlert("Call " + f, res);
			}
		};
	}
	
	return {
		run: _init
	};

})();

