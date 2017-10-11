var dappleth = (function(){
	var GUID;
	var dappContract;
	var Dapp;
	var ABI;
	var $D;

	var _init = function(core) {
		$D = core;

		Dapp = $D.scope.Dapp.activeApp;
		Dapp.Address = "0xf45a8e4161007754ff0b7a85eac47ea857590836";
		Dapp.ABI = '[{"constant":false,"inputs":[],"name":"kill","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"greet","outputs":[{"name":"","type":"string"}],"type":"function"},{"inputs":[{"name":"_greeting","type":"string"}],"type":"constructor"}]';

	}

	var _start = function() {
		$D.scope.slideIndex=0;
		$D.scope.Dapp.read = true;

		$D.scope.isRead = function(value){
			$D.scope.Dapp.read = value;
		}

		$D.scope.next = function() {
			$D.service.nextSlide();
		};

		$D.scope.previous = function() {
			$D.service.prevSlide();
			$D.scope.start= false;
		};

		$D.scope.startApp = function() {
			$D.scope.start= true;
		};

		$D.scope.slideChanged = function(index) {
		   $D.scope.slideIndex = index;
		};

		$D.scope.install = function() {
			$D.scope.Dapp.functions = JSON.parse(Dapp.ABI);
			dappContract = web3.eth.contract($D.scope.Dapp.functions).at(Dapp.Address);
			$D.service.nextSlide();
		};

		$D.scope.funCall = function(f) {
			if($D.scope.Dapp.read){
				var res = dappContract[f].apply();
				$D.service.popupAlert("Call " + f, res);
			}
		};
	}
	
	return {
		run:function(core){
			_init(core);
			_start();
		}
	};

})();

