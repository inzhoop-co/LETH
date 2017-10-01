var dappleth = (function(){
	var GUID;
	var dappContract;
	var Dapp;
	
	return {
		run:function($D){
			Dapp = $D.scope.Dapp.activeApp;
			//dappContract = web3.eth.contract(Dapp.ABI).at(Dapp.Address)
			
			$D.scope.next = function() {
				$D.plugin._instances[0].next();
			};

			$D.scope.previous = function() {
			   $D.plugin._instances[0].previous();
			};

			$D.scope.slideChanged = function(index) {
			   $D.scope.slideIndex = index;
			};

		}
	};

})();

