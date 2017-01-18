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
		btnCenter.html(' Show Tag!');
		btnCenter.attr('class','button button-smal button-icon icon ion-play');
		btnCenter.attr('onclick','dappleth.test()');

		document.addEventListener("deviceready", function () {
		    nfc.addNdefListener(function(nfcEvent) {
		        console.log(nfcEvent.tag);
		        var eventMsg = {
					from: apiApp.account(),
				    text: "TagId: " + nfc.bytesToHexString(nfcEvent.tag.id),
				    date: new Date()
				};
		        apiChat.sendDappMessage(eventMsg, GUID);
		    }, function () {
		        console.log("Listening for NDEF Tags.");
		    }, function (reason) {
		        console.log("Error adding NFC Listener " + reason);
		    });
		}, false)
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

	function test(){
		console.log("greet");
		var m1 = {
			from: apiApp.account(),
		    text: "Last TagId: " + nfc.bytesToHexString(apiNFC.tagNFC.id),
		    date: new Date()
		};
      	apiChat.sendDappMessage(m1, GUID);  

		update();
	}

	return {
	    update: update,
	    run: run,
	    destroy: destroy,
	    test: test
	};

})();
