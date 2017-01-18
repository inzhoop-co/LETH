var dappleth = (function(){ 
	var GUID;
	var dappContract;
	var btnLeft;
	var btnCenter;

	 function init(id,ABI,Address){
		console.log("init " + id);
		GUID=id;
        dappContract=Address;

		btnCenter = angular.element(document.querySelector('#centerButton'));
	}

	function setup(){
		btnCenter.html(' Pay me!');
		btnCenter.attr('class','button button-smal button-icon icon ion-play');
		btnCenter.attr('onclick','dappleth.apply()');
		
		var balance = web3.fromWei(web3.eth.getBalance(dappContract)).toFixed(6);
        angular.element(document.querySelector('#faucet')).html(balance);

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

	function httpGetAsync(theUrl, callback)
	{
	    var xmlHttp = new XMLHttpRequest();
	    xmlHttp.onreadystatechange = function() { 
	        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
	            callback(xmlHttp.responseText);
	    }
	    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
	    xmlHttp.send(null);
	}

	function apply(){
		var myAddr = apiApp.account();
		var callFaucet = "http://faucet.ropsten.be:3001/donate/" + myAddr;

		var m1 = {
			from: apiApp.account(),
		    text: "Requesting payment at " +  dappContract + "...",
		    date: new Date()
		};
      	apiChat.sendDappMessage(m1, GUID);  
		
		httpGetAsync(callFaucet, function(r){
			var result = JSON.parse(r)
			var amount = parseFloat(web3.fromWei(result.amount)).toFixed(6);
			var msg = result.message;
			if(!result.message)
				msg="We put your address " + myAddr + " in queue!<br/> You'll receive " + amount +  " Eth";

	    	var m2 = { 
				from: dappContract,
			    text: msg,
			    date: r.paydate
			};

	      	apiChat.sendDappMessage(m2, GUID);  
		})
		
		update();
      	
	}

	return {
	    update: update,
	    run: run,
	    destroy: destroy,
	    apply: apply
	};

})();
