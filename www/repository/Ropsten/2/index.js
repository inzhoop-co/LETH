var dappleth = (function(){
	var dappContract;
	var Dapp;
	var ABI;

	var _init = function(core) {
		$scope = core.scope;
		$service = core.service;

		Dapp = $scope.Dapp.activeApp;
		Dapp.Address = "0xf8374f01dd4960a6ea6192f36f451e111cabf3b3";
		Dapp.ABI = '[{"constant":false,"inputs":[],"name":"kill","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"greet","outputs":[{"name":"","type":"string"}],"type":"function"},{"inputs":[{"name":"_greeting","type":"string"}],"type":"constructor"}]';

		
		_start();		
	}

	var _exit = function(){
        //
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

		$scope.funCall = function(f) {
			if($scope.Dapp.read){
				var res = dappContract[f].apply();
				$service.popupAlert("Call " + f, res);
			}
		};
	}
	
	return {
		run: _init,
		exit: _exit
	};

})();

