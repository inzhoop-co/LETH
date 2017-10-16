var dappleth = (function(){
	var dappContract;
	var Dapp;
	var $scope;
	var $service;

	
	var _init = function(core) {
		$scope = core.scope;
		$service = core.service;

		Dapp = $scope.Dapp.activeApp;
		dappContract = web3.eth.contract(Dapp.Contracts[0].ABI).at(Dapp.Contracts[0].Address);

		angular.extend($scope, context);		
	}

	var context = {
		greet: function(){
			$service.popupConfirm("Call contract ", "Do you want to call contract " +  dappContract.address + "?").then(function(res){
				$scope.call = true;
				dappContract.greet(function(err,res){
					if(err){
						$service.popupAlert("ERROR",err);
						$scope.greeting = err.message;
					}
					if(res){
						$scope.greeting = res;
						$scope.$digest();
					}

				});
			}, function(err){
				$scope.call = false;
			})
		},
		clearResponse: function(){
			$scope.call = false;
		},
		dappRefresh: function(value){
			$scope.$broadcast('scroll.refreshComplete');
		}
	}

	return {
		run: _init
	};

})();