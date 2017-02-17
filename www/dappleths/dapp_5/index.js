var dappleth = (function(){ 
	var GUID;
	var dappContract;
	var btnLeft;
	var btnCenter;

	 function init(id,ABI,Address){
		console.log("init " + id);
		GUID=id;
        dappContract = web3.eth.contract(ABI).at(Address);

		btnCenter = angular.element(document.querySelector('#centerButton'));

	}

	function setup(){
		console.log("setup");
		btnCenter.html(' Check registerd!');
		btnCenter.attr('class','button button-smal button-icon icon ion-play');
		btnCenter.attr('onclick','dappleth.play()');
	}

	function update(){
		console.log("update");
		apiUI.loadFade("loading...",2000);
	}

	function destroy(){
		console.log("destroy");
		dappContract={};
	}

	function run(id,ABI,Address){
        init(id,ABI,Address);
		setup();
		update();
	}

	function play(){
		console.log("play");

		var m1 = {
			from: apiApp.account(),
		    text: "Check registerd...",
		    date: new Date()
		};

      	apiChat.sendDappMessage(m1, GUID);  

      	var count = dappContract.registered(); //
    	var m2 = { 
			from: dappContract.address,
		    text: "Total registered <b># " + count + "</b>",
		    date: new Date()
		};

      	apiChat.sendDappMessage(m2, GUID);  

      	var p = dappContract.participantsIndex(count); //iterate for list
		var m3 = { 
			from: dappContract.address,
		    text: "Partecipant address</br><b>" + p + "</b>",
		    date: new Date()
		};

      	apiChat.sendDappMessage(m3, GUID);  

		update();
	}

	return {
	    update: update,
	    run: run,
	    destroy: destroy,
	    play: play
	};

})();
