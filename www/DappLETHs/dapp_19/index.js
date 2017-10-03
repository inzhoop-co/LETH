var dappleth = (function(){
	return {
		run:function($D){
			$D.scope.setId = function(){
				console.log("sono un metodo esterno");
				$D.scope.Dapp.activeApp.GUID=19;
				$D.scope.hasLogged = false;
			}
		}
	};
})();