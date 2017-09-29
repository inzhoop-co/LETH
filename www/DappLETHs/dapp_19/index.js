var dappleth = (function(){
	return {
		run:function(panino){
			panino.data.setId = function(){
				console.log("sono un metodo esterno");
				panino.data.activeApp.GUID=19;
				panino.data.hasLogged = false;
				console.log(panino.services.account());
			}
		}
	};
})();