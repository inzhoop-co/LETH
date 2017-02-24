var dappleth = (function(){ 
	var GUID;
	var dappContract;
	var btnLeft;
	var eBetWon;
	var eBetLost;
	var eNewBet;
	var eSuccessSend;
    var sliderRange;

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
        btnLeft.html(' Bet 0.22100 ETH');
	}

	function update(){
		console.log("update");
		apiUI.loadFade("loading...",100);
		var addr = apiApp.account();
	}

	function destroy(){
		console.log("destroy");
		eNewBet.stopWatching();
		eBetWon.stopWatching();
		eBetLost.stopWatching();

		dappContract={};
	}

	function listner(){
        //event listner
        var bal = apiApp.balance('1.0e18');

        sliderRange = document.getElementById('betAmount');
        
        sliderRange.max = bal;
        
        if(bal < sliderRange.min){
            btnLeft.html(' Insufficent ETH');
            btnLeft.attr('onclick','alert("Insufficent balance!")');
        }else{
            sliderRange.addEventListener('touchmove',function(e){
                btnLeft.html(' Bet ' + this.value + ' ETH');
            ;})
            sliderRange.addEventListener('touchend',function(e){
                btnLeft.html(' Bet ' + this.value + ' ETH');
            ;})
            sliderRange.addEventListener('change',function(e){
                btnLeft.html(' Bet ' + this.value + ' ETH');
            ;})
        }        
        

		eNewBet = dappContract.LOG_NewBet().watch(function (error, result) {
            if(!error){
                var user = result.args.playerAddress;
                var amount = parseFloat(result.args.amount/1.0E18).toFixed(6);

                var msg = {
                    from: user,
                    text: 'I\'m betting ' + amount + ' ETH &#x1F91E;',
                    date: new Date()
                };

                apiChat.sendDappMessage(msg, GUID);  

                update();
            }
        });

        eBetWon = dappContract.LOG_BetWon().watch(function (error, result) {
            if(!error){
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
            }
        });

        eBetLost = dappContract.LOG_BetLost().watch(function (error, result) {
            if(!error){            
                var user = result.args.playerAddress;
                var numberRolled = result.args.numberRolled
                var msg = {
                    from: user,
                    text: '&#x1F3B2; <b>' + numberRolled + '</b> &#x1F3B2;<br/>I lost &#x1F622;',
                    date: new Date()
                };

                apiChat.sendDappMessage(msg, GUID);  

                update();
            }
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
