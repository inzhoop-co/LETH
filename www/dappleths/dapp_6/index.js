var dappleth = (function(){ 
	var GUID;
	var dappContract;
	var btnLeft;
	var eBetWon;
	var eBetLost;
	var eNewBet;
	var eSuccessSend;

	 function init(id,ABI,Address){
		console.log("init " + id);
		GUID=id;
        dappContract = web3.eth.contract(ABI).at(Address);
		
		btnLeft = angular.element(document.querySelector('#leftButton'));
	}

	function setup(){
		console.log("setup");
		
		btnLeft.html(' Bet');
        btnLeft.attr('class','button button-smal button-icon icon ion-ios-play');
		btnLeft.attr('onclick','dappleth.play()');
	}

	function update(){
		console.log("update");
		apiUI.loadFade("loading...",100);
		var addr = apiApp.account();
		var betValue = document.getElementById('betAmount').value;
		btnLeft.html(' Bet ' + betValue + ' ETH');

		console.log(betValue);
	}

	function destroy(){
		console.log("destroy");
		dappContract={};
	}

	function listner(){
        //event listner

        /*
		    event LOG_NewBet(address playerAddress, uint amount);
		    event LOG_BetWon(address playerAddress, uint numberRolled, uint amountWon);
		    event LOG_BetLost(address playerAddress, uint numberRolled);
        */

		eNewBet = dappContract.LOG_NewBet().watch(function (error, result) {
            var user = result.args.playerAddress;
            var amount = parseFloat(result.args.amount/1.0E18).toFixed(6);

            var msg = {
                from: user,
                text: 'I\'m betting ' + amount + ' ETH &#x1F91E;',
                date: new Date()
            };

            apiChat.sendDappMessage(msg, GUID);  

            update();
        });

		/*
        eSuccessSend = dappContract.LOG_SuccessfulSend().watch(function (error, result) {
            var user = result.args.addr;
            var amount = parseFloat(result.args.amount/1.0E18).toFixed(6);

            var msg = {
                from: result.address,
                text: amount + ' ETH received &#x1F91E; from ' + user,
                date: new Date()
            };

            apiChat.sendDappMessage(msg, GUID);  

            update();
        });
		*/

        eBetWon = dappContract.LOG_BetWon().watch(function (error, result) {
            var user = result.args.playerAddress;
            var amount = parseFloat(result.args.amountWon/1.0E18).toFixed(6);
            var numberRolled = result.args.numberRolled
            var msg = {
                from: user,
                text: '&#x1F3B2; <b>' + numberRolled + '</b> &#x1F3B2;<br/>I won ' + amount + ' ETH &#x1F3C6;',
                date: new Date()
            };

            apiChat.sendDappMessage(msg, GUID);  

            update();
        });

        eBetLost = dappContract.LOG_BetLost().watch(function (error, result) {
            var user = result.args.playerAddress;
            var numberRolled = result.args.numberRolled
            var msg = {
                from: user,
                text: '&#x1F3B2; <b>' + numberRolled + '</b> &#x1F3B2;<br/>I lost &#x1F3C6;',
                date: new Date()
            };

            apiChat.sendDappMessage(msg, GUID);  

            update();
        });

        
    }

	function run(id,ABI,Address){
        init(id,ABI,Address);
		setup();
		listner();
		update();
	}
	
    function play() {
        var fromAddr = apiApp.account();
        var functionName = 'bet';
        var args = JSON.parse('[]');
        var gasPrice = web3.eth.gasPrice;
        var gas = 180000;
		var amount = web3.toWei(document.getElementById('betAmount').value);
        args.push({from: fromAddr, value: amount, gasPrice: gasPrice, gas: gas});
        var callback = function (err, txhash) {
			if(err){
	            console.log('error: ' + err);

            	var mE = { 
					from: dappContract.address,
			    	text: "&#x1F3B2; " + err,
			    	date: new Date()
				};

	      		apiChat.sendDappMessage(mE, GUID); 
            }

            console.log('txhash: ' + txhash);

            if(txhash!=undefined){
				var mT = { 
					from: dappContract.address,
			    	text: "Bet on going...",
			    	date: new Date()
				};

	      		apiChat.sendDappMessage(mT, GUID); 
            }
        }
        args.push(callback);
        dappContract['bet'].apply(this, args);
        return true;
    }

	return {
	    update: update,
	    run: run,
	    destroy: destroy,
	    play: play
	};

})();
