var dappleth = (function(){
    var Dapp; 
    var dapp90;
    var dapp75;
    var dapp50;
    var dapp40;
    var dapp25;
    var dapp10;
    var dapp5;
    var lastBets=[];
           

    var _init = function(core) {
        $D = core;
        Dapp = $D.scope.Dapp.activeApp;

        $D.scope.DAPPchats = $D.service.readMessages();

        dapp90 = web3.eth.contract(Dapp.ABI).at('0x7DA90089A73edD14c75B0C827cb54f4248D47eCc');
        dapp75 = web3.eth.contract(Dapp.ABI).at('0x49fDdEae0b521dAb8d0c4b77E7161094F971320D');
        dapp50 = web3.eth.contract(Dapp.ABI).at('0xdd98b423dc61A756e1070De151b1485425505954');
        dapp40 = web3.eth.contract(Dapp.ABI).at('0x1E2Fbe6BE9Eb39Fc894d38be976111F332172d83');
        dapp25 = web3.eth.contract(Dapp.ABI).at('0xe642B6f79041C60d8447679B3a499F18D8B03b81');
        dapp10 = web3.eth.contract(Dapp.ABI).at('0xE8A51bE86ad96447D45DDEdDc55013f25157688c');
        dapp5  = web3.eth.contract(Dapp.ABI).at('0x4e646A576917a6A47D5B0896c3E207693870869D');
        
        //binding
        $D.scope.dappRefresh = _refresh;

    }

    var _refresh = function(){
        $D.scope.$broadcast('scroll.refreshComplete');
    }


    function isNewBet(target,result){
        var user = result.args.playerAddress;
        var amount = parseFloat(result.args.amount/1.0E18).toFixed(4);
        var msg = '&#x1F91E;<b>' + target + '%</b>&#x1F91E;<br/>Betting ' + amount + ' ETH';
        $D.service.sendMessage(Dapp.GUID, user, msg);
    }

    function isWinner(target,result){
        var user = result.args.playerAddress;
        var amount = parseFloat(result.args.amountWon/1.0E18).toFixed(4);
        var numberRolled = result.args.numberRolled;
        lastBets.push(numberRolled);
        var msg = '&#x1F3B2; <b>' + numberRolled + '</b> &#x1F3B2; '+ target +'% <br/>I won ' + amount + ' ETH &#x1F3C6;';
        $D.service.sendMessage(Dapp.GUID, user, msg);
        
    }

    function isLooser(target,result){
        var user = result.args.playerAddress;
        var numberRolled = result.args.numberRolled;
        lastBets.push(numberRolled);
        var msg = '&#x1F3B2; <b>' + numberRolled + '</b> &#x1F3B2; '+ target +'%<br/>I lost &#x1F622;';
        $D.service.sendMessage(Dapp.GUID, user, msg);

    }

    function _listner(){
        eNewBet90 = dapp90.LOG_NewBet().watch(function (error, result) {
            if(!error){
                isNewBet(90,result);
            }
        });

        eNewBet75 = dapp75.LOG_NewBet().watch(function (error, result) {
            if(!error){
                isNewBet(75,result);            }
        });

        eNewBet50 = dapp50.LOG_NewBet().watch(function (error, result) {
            if(!error){
                isNewBet(50,result);
            }
        });

        eNewBet40 = dapp40.LOG_NewBet().watch(function (error, result) {
            if(!error){
                isNewBet(40,result);
            }
        });

        eNewBet25 = dapp25.LOG_NewBet().watch(function (error, result) {
            if(!error){
                isNewBet(25,result);
            }
        });

        eNewBet10 = dapp10.LOG_NewBet().watch(function (error, result) {
            if(!error){
                isNewBet(10,result);
            }
        });

        eNewBet5 = dapp5.LOG_NewBet().watch(function (error, result) {
            if(!error){
                isNewBet(5,result);
            }
        });

        eBetWon90 = dapp90.LOG_BetWon().watch(function (error, result) {
            if(!error){
                isWinner(90,result);
            }
        });

        eBetWon75 = dapp75.LOG_BetWon().watch(function (error, result) {
            if(!error){
                isWinner(75,result);
            }
        });

        eBetWon50 = dapp50.LOG_BetWon().watch(function (error, result) {
            if(!error){
                isWinner(50,result);
            }
        });

        eBetWon40 = dapp40.LOG_BetWon().watch(function (error, result) {
            if(!error){
                isWinner(40,result);
            }
        });

        eBetWon25 = dapp25.LOG_BetWon().watch(function (error, result) {
            if(!error){
                isWinner(25,result);
            }
        });

        eBetWon10 = dapp10.LOG_BetWon().watch(function (error, result) {
            if(!error){
                isWinner(10,result);
            }
        });

        eBetWon5 = dapp5.LOG_BetWon().watch(function (error, result) {
            if(!error){
                isWinner(5,result);
            }
        });

        eBetLost90 = dapp90.LOG_BetLost().watch(function (error, result) {
            if(!error){            
                isLooser(90,result);
            }
        });

        eBetLost75 = dapp75.LOG_BetLost().watch(function (error, result) {
            if(!error){
                isLooser(75,result);
            }
        });

        eBetLost50 = dapp50.LOG_BetLost().watch(function (error, result) {
            if(!error){            
                isLooser(50,result);
            }
        });

        eBetLost40 = dapp40.LOG_BetLost().watch(function (error, result) {
            if(!error){            
                isLooser(40,result);
            }
        });

         eBetLost25 = dapp25.LOG_BetLost().watch(function (error, result) {
            if(!error){            
                isLooser(25,result);
            }
        });

        eBetLost10 = dapp10.LOG_BetLost().watch(function (error, result) {
            if(!error){            
                isLooser(10,result);
            }
        });

        eBetLost5 = dapp5.LOG_BetLost().watch(function (error, result) {
            if(!error){
                isLooser(5,result);
            }
        });
 
    };

    var _start = function() {
    
    }

    return {
        run:function(core){
            _init(core);
            _start();
            _listner();
        }
    };

})();


/*
var dappleth = (function(){ 
	var GUID;
	var dappContract;
    var sliderRange;
    var eSuccessSend;
	var btnLeft;
    var lastBets;

	function init(id,ABI,Address){
		console.log("init " + id);
		GUID=id;
        dappContract = apiApp.account();

        dapp90 = web3.eth.contract(ABI).at('0x7DA90089A73edD14c75B0C827cb54f4248D47eCc');
        dapp75 = web3.eth.contract(ABI).at('0x49fDdEae0b521dAb8d0c4b77E7161094F971320D');
        dapp50 = web3.eth.contract(ABI).at('0xdd98b423dc61A756e1070De151b1485425505954');
        dapp40 = web3.eth.contract(ABI).at('0x1E2Fbe6BE9Eb39Fc894d38be976111F332172d83');
        dapp25 = web3.eth.contract(ABI).at('0xe642B6f79041C60d8447679B3a499F18D8B03b81');
        dapp10 = web3.eth.contract(ABI).at('0xE8A51bE86ad96447D45DDEdDc55013f25157688c');
        dapp5 = web3.eth.contract(ABI).at('0x4e646A576917a6A47D5B0896c3E207693870869D');
		
		btnLeft = angular.element(document.querySelector('#leftButton'));
	}

	function setup(){
		console.log("setup");
		
		btnLeft.html(' Bet');
        btnLeft.attr('class','button button-smal button-icon icon ion-ios-play');
		btnLeft.attr('onclick','dappleth.play()');
        btnLeft.html(' Bet 0.22100 ETH');

        lastBets=[];
	}

	function update(){
        var rolls='';
        angular.forEach(lastBets, function(value, key) {
          rolls += '<span class="badge badge-calm">' + value + '</span> '
        });

        angular.element(document.querySelector('#rolls')).html(rolls) ;
        //apiUI.loadFade("loading...",100);
	}

	function destroy(){
		console.log("destroy");
		eNewBet90.stopWatching();
        eNewBet75.stopWatching();
        eNewBet50.stopWatching();
        eNewBet40.stopWatching();
        eNewBet25.stopWatching();
        eNewBet10.stopWatching();
        eNewBet5.stopWatching();
		
        eBetWon90.stopWatching();
        eBetWon75.stopWatching();
        eBetWon50.stopWatching();
        eBetWon40.stopWatching();
        eBetWon25.stopWatching();
        eBetWon10.stopWatching();
        eBetWon5.stopWatching();

		eBetLost90.stopWatching();
        eBetLost75.stopWatching();
        eBetLost50.stopWatching();
        eBetLost40.stopWatching();
        eBetLost25.stopWatching();
        eBetLost10.stopWatching();
        eBetLost5.stopWatching();

		dappContract={};

        dapp90 = {};
        dapp75 = {};
        dapp50 = {};
        dapp40 = {};
        dapp25 = {};
        dapp10 = {};
        dapp5 = {};
        
	}

    function sendMessage(fromAddr, msg){
        var mres = {
            from: fromAddr,
            text: msg ,
            date: new Date()
        };

        apiChat.sendDappMessage(mres, GUID); 
        apiUI.scrollTo('chatDappScroll','bottom');
        apiUI.loadFade(mres.text,3000);

        update();
    }

    function isNewBet(target,result){
        var user = result.args.playerAddress;
        var amount = parseFloat(result.args.amount/1.0E18).toFixed(4);
        sendMessage(user,'&#x1F91E;<b>' + target + '%</b>&#x1F91E;<br/>Betting ' + amount + ' ETH')
    }

    function isWinner(target,result){
        var user = result.args.playerAddress;
        var amount = parseFloat(result.args.amountWon/1.0E18).toFixed(4);
        var numberRolled = result.args.numberRolled;
        lastBets.push(numberRolled);
        var msg = '&#x1F3B2; <b>' + numberRolled + '</b> &#x1F3B2; '+ target +'% <br/>I won ' + amount + ' ETH &#x1F3C6;';
        sendMessage(user,msg);
    }

    function isLooser(target,result){
        var user = result.args.playerAddress;
        var numberRolled = result.args.numberRolled;
        lastBets.push(numberRolled);
        sendMessage(user,'&#x1F3B2; <b>' + numberRolled + '</b> &#x1F3B2; '+ target +'%<br/>I lost &#x1F622;');
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
        

		eNewBet90 = dapp90.LOG_NewBet().watch(function (error, result) {
            if(!error){
                isNewBet(90,result);
            }
        });

        eNewBet75 = dapp75.LOG_NewBet().watch(function (error, result) {
            if(!error){
                isNewBet(75,result);            }
        });

        eNewBet50 = dapp50.LOG_NewBet().watch(function (error, result) {
            if(!error){
                isNewBet(50,result);
            }
        });

        eNewBet40 = dapp40.LOG_NewBet().watch(function (error, result) {
            if(!error){
                isNewBet(40,result);
            }
        });

        eNewBet25 = dapp25.LOG_NewBet().watch(function (error, result) {
            if(!error){
                isNewBet(25,result);
            }
        });

        eNewBet10 = dapp10.LOG_NewBet().watch(function (error, result) {
            if(!error){
                isNewBet(10,result);
            }
        });

        eNewBet5 = dapp5.LOG_NewBet().watch(function (error, result) {
            if(!error){
                isNewBet(5,result);
            }
        });

        eBetWon90 = dapp90.LOG_BetWon().watch(function (error, result) {
            if(!error){
                isWinner(90,result);
            }
        });

        eBetWon75 = dapp75.LOG_BetWon().watch(function (error, result) {
            if(!error){
                isWinner(75,result);
            }
        });

        eBetWon50 = dapp50.LOG_BetWon().watch(function (error, result) {
            if(!error){
                isWinner(50,result);
            }
        });

        eBetWon40 = dapp40.LOG_BetWon().watch(function (error, result) {
            if(!error){
                isWinner(40,result);
            }
        });

        eBetWon25 = dapp25.LOG_BetWon().watch(function (error, result) {
            if(!error){
                isWinner(25,result);
            }
        });

        eBetWon10 = dapp10.LOG_BetWon().watch(function (error, result) {
            if(!error){
                isWinner(10,result);
            }
        });

        eBetWon5 = dapp5.LOG_BetWon().watch(function (error, result) {
            if(!error){
                isWinner(5,result);
            }
        });

        eBetLost90 = dapp90.LOG_BetLost().watch(function (error, result) {
            if(!error){            
                isLooser(90,result);
            }
        });

        eBetLost75 = dapp75.LOG_BetLost().watch(function (error, result) {
            if(!error){
                isLooser(75,result);
            }
        });

        eBetLost50 = dapp50.LOG_BetLost().watch(function (error, result) {
            if(!error){            
                isLooser(50,result);
            }
        });

        eBetLost40 = dapp40.LOG_BetLost().watch(function (error, result) {
            if(!error){            
                isLooser(40,result);
            }
        });

         eBetLost25 = dapp25.LOG_BetLost().watch(function (error, result) {
            if(!error){            
                isLooser(25,result);
            }
        });

        eBetLost10 = dapp10.LOG_BetLost().watch(function (error, result) {
            if(!error){            
                isLooser(10,result);
            }
        });

        eBetLost5 = dapp5.LOG_BetLost().watch(function (error, result) {
            if(!error){
                isLooser(5,result);
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
                sendMessage(dappContract.address,"&#x1F3B2; " + err);
            }

            if(txhash!=undefined){
                sendMessage(dappContract.address,"Bet on going...");
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

*/
