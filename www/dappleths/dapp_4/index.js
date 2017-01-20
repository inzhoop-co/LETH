var dappleth = (function(){ 
	var GUID;
	var dappContract;
	var btnLeft;
	var btnCenter;
	var tagRecord;

	 function init(id,ABI,Address){
		console.log("init " + id);
		GUID=id;
        dappContract = web3.eth.contract(ABI).at(Address);

		btnCenter = angular.element(document.querySelector('#centerButton'));
	}

	function setup(){
		console.log("setup");
		btnCenter.html(' Show Last Tag!');
		btnCenter.attr('class','button button-smal button-icon icon ion-play');
		btnCenter.attr('onclick','dappleth.readed()');

		//document.addEventListener("deviceready", function () {
			try{
			    nfc.addNdefListener(function(nfcEvent) {
			        //console.log(nfcEvent.tag);
					apiUI.loadOn();

			        tagRecord = nfcEvent.tag;

			        var eventMsg = {
						from: dappContract.address,
					    text: "TagId: " + nfc.bytesToHexString(tagRecord.id),
					    date: new Date()
					};

			        apiChat.sendDappMessage(eventMsg, GUID);

			        apiUI.scrollTo('chatDappScroll','bottom');

					apiUI.loadOff();
			    }, function () {
			        console.log("Listening for NDEF Tags.");
			    }, function (reason) {
			    	apiUI.loadOn();
			    	var m2 = {
						from: apiApp.account(),
					    text: reason,
					    date: new Date()
					};

			      	apiChat.sendDappMessage(m2, GUID); 
			      	apiUI.scrollTo('chatDappScroll','bottom');

					apiUI.loadOff();
			        console.log("Error adding NFC Listener " + reason);
			    });
		    }catch(e){
		    	apiUI.loadOn();
		    	var mEx = {
					from: apiApp.account(),
				    text: e,
				    date: new Date()
				};

		      	apiChat.sendDappMessage(mEx, GUID); 
		      	apiUI.scrollTo('chatDappScroll','bottom');

				apiUI.loadOff();
		    }
		//}, false)
	}

	function update(){
		console.log("update");
		//apiUI.loadFade("loading...",1000);
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

	function readed(){
		var msg = "No TAG readed! <br/>Bring NFC Tag on the back";
		if(tagRecord){
			msg = "Last TagId: " + nfc.bytesToHexString(tagRecord.id);
		}

		apiUI.loadOn();

		var m1 = {
			from: apiApp.account(),
		    text: msg,
		    date: new Date()
		};

      	apiChat.sendDappMessage(m1, GUID);  

		apiUI.scrollTo('chatDappScroll','bottom');

		apiUI.loadOff();
				
	}

	return {
	    update: update,
	    run: run,
	    destroy: destroy,
	    readed: readed
	};

})();
