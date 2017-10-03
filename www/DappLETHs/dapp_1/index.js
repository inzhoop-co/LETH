var dappleth = (function(){
	var GUID;
	var dappContract;
	var Dapp;
	
	return {
		run:function($D){
			Dapp = $D.scope.Dapp.activeApp;
			dappContract = web3.eth.contract(Dapp.ABI).at(Dapp.Address)
			
			$D.scope.greet = function(){
				$D.service.popupConfirm("Call contract ", "Do you want to call contract " +  dappContract.address + "?").then(function(res){
					$D.scope.call = true;
					$D.scope.greeting = dappContract.greet();
				}, function(err){
					$D.scope.call = false;
				})
			}

			$D.scope.clearResponse = function(){
				$D.scope.call=false;
			}
		}
	};

})();