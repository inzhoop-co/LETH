var dappleth = (function(){
	var GUID;
	var dappContract;
	var Dapp;
	var ABI;
	
	return {
		run:function($D){
			Dapp = $D.scope.Dapp.activeApp;
			Dapp.Address = "0xf8374f01dd4960a6ea6192f36f451e111cabf3b3";
			Dapp.ABI = '[{"constant":false,"inputs":[],"name":"kill","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"greet","outputs":[{"name":"","type":"string"}],"type":"function"},{"inputs":[{"name":"_greeting","type":"string"}],"type":"constructor"}]';
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
	};

})();

