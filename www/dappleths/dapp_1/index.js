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
		btnCenter.html(' Test me!');
		btnCenter.attr('class','button button-smal button-icon icon ion-play');
		btnCenter.attr('onclick','dappleth.greet()');
	}

	function update(){
		console.log("update");
		apiUI.loadFade("loading...",2000);

		console.log(apiNFC.tagNFC);

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

	function greet(){
		console.log("greet");

		var m1 = {
			from: dappContract.address,
		    text: "Calling contract at " +  dappContract.address + "...",
		    date: new Date()
		};

      	apiChat.sendDappMessage(m1, GUID);  

    	var m2 = { 
			from: dappContract.address,
		    text: "Response is <br/>" + dappContract.greet(),
		    date: new Date()
		};

      	apiChat.sendDappMessage(m2, GUID);  

		update();
      	
      	/*
      	var e1 = new CustomEvent('dappMessage', {
	     "detail": {
	        from: dappContract.address,
	        text: "Calling contract at " +  dappContract.address + "...",
	        date: new Date()
	    	}
		});

    	var e2 = new CustomEvent('dappMessage', { 
    	"detail": {
	        from: dappContract.address,
	        text: "Response is <br/>" + dappContract.greet(),
	        date: new Date()}
	    });

	    document.body.dispatchEvent(new CustomEvent('dappMessage', {
	     "detail": {
	        from: dappContract.address,
	        text: "Calling contract at " +  dappContract.address + "...",
	        date: new Date()
	    	}
		}));
	    document.body.dispatchEvent(new CustomEvent('dappMessage', { 
    	"detail": {
	        from: dappContract.address,
	        text: "Response is <br/>" + dappContract.greet(),
	        date: new Date()}
	    }));	
	    */
	}

	return {
	    update: update,
	    run: run,
	    destroy: destroy,
	    greet: greet
	};

})();
