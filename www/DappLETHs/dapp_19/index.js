var dappleth = (function(){
	return {
		run:function(Ð){
			Ð.scope.setId = function(){
				console.log("sono un metodo esterno");
				Ð.scope.activeApp.GUID=19;
				Ð.scope.hasLogged = false;
			}
		}
	};
})();