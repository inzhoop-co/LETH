var dappleth = (function(){
	var dappContract;
	var Dapp;
	
	var _init = function(core) {
		$D = core;

		Dapp = $D.scope.Dapp.activeApp;
		dappContract = web3.eth.contract(Dapp.Contracts[0].ABI).at(Dapp.Contracts[0].Address);		
	}

	var _start = function(){
		$D.scope.greet = function(){
			$D.service.popupConfirm("Call contract ", "Do you want to call contract " +  dappContract.address + "?").then(function(res){
				$D.scope.call = true;
				dappContract.greet(function(err,res){
					if(err){
						$D.service.popupAlert("ERROR",err);
						$D.scope.greeting = err.message;
					}
					if(res)
						$D.scope.greeting = res;
				});
			}, function(err){
				$D.scope.call = false;
			})
		}

		$D.scope.clearResponse = function(){
			$D.scope.call=false;
		}

	}
			

	return {
		run:function(core){
			_init(core);
			_start();
		}
	};

})();