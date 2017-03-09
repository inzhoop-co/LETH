var dappleth = (function(){ 
    //standar variable
    var GUID;
    var dappContract;
    var btnCenter;
    //dapp variable
    var maxBet;
    var minBet;
    var eLogBet;
    var eLogResult;

    var elapsed;
    var countdown=0;
    var idMatch;
    var path = "dappleths/dapp_13/assets/";
    var rockURI;
    var scissorURI;
    var paperURI;
    var playBtnURI;
    var sliderRange;
    var labelAmount;

    function init(id,ABI,Address){
        GUID=id;
        dappContract = web3.eth.contract(ABI).at(Address);

        btnCenter = angular.element(document.querySelector('#centerButton'));
 
        /*
        rockURI =  'data:image/png;base64,'+
        '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';
        */
    }

    function setup(){
        btnCenter.html(' Play now!');
        btnCenter.attr('class','button button-smal button-icon icon ion-play');
        btnCenter.attr('onclick','dappleth.playerPlay()');

        labelAmount = angular.element(document.querySelector('#labelAmount'));

    }

       function update(){
        apiUI.loadOn("loading...");
        var balance = parseFloat(apiApp.balance(1) / 1.0e+18).toFixed(2);
        maxBet = parseFloat(dappContract.maxBet() / 1.0e+18);
		minBet = parseFloat(dappContract.minBet() / 1.0e+18);
		var gamePaused=dappContract.gamePaused();
        var totalBets = dappContract.totalBets();
		var profit = 0;

        sliderRange.max = maxBet;
        sliderRange.min = minBet;

        angular.element(document.querySelector('#minBet')).html(minBet + ' finney');
        angular.element(document.querySelector('#maxBet')).html(maxBet + ' finney');
		angular.element(document.querySelector('#profit')).html(profit + ' finney');
        angular.element(document.querySelector('#totalBets')).html(totalBets);
        angular.element(document.querySelector('#balance')).html('balance: ' + balance + ' finney');

        apiUI.loadOff();

    }

    function destroy(){
        console.log("destroy");
        eLogResult.stopWatching();
        eLogBet.stopWatching();

        dappContract={};
    }

    function listner(){
        //event listner
        var bal = apiApp.balance('1.0e18');
        sliderRange = document.getElementById('betAmount');
        
        
        if(bal < sliderRange.min){
            labelAmount.html(' Insufficent ETH');
            btnCenter.attr('onclick','alert("Insufficent balance!")');
        }else{
            sliderRange.addEventListener('touchmove',function(e){
                labelAmount.html(' Bet ' + this.value + ' ETH');
            ;})
            sliderRange.addEventListener('touchend',function(e){
                labelAmount.html(' Bet ' + this.value + ' ETH');
            ;})
            sliderRange.addEventListener('change',function(e){
                labelAmount.html(' Bet ' + this.value + ' ETH');
            ;})
        }  

        eLogBet = dappContract.LogBet().watch(function (error, result) {
            if(!error && result.args.playerAddress==apiApp.account()){
                apiUI.loadOn("waiting...");

                console.log(result.args.PlayerAddress + ' choosed ' + result.args.PlayerNumber  )
                console.log(result.args.PlayerAddress + ' bet ' + result.args.BetValue  );
                console.log('BetId: ' + result.args.BetID);

               

                /*
    			var betId = result.args.BetID;
                var playerAddress = result.args.PlayerAddress;
    			var rewardValue = result.args.RewardValue;
    			var profitValue = result.args.ProfitValue;
    			var betValue = result.args.BetValue;
    			var PlayerNumber=result.args.PlayerNumber;
    			var PlayerNumberText="sasso";
    			if(PlayerNumber==2) PlayerNumberText="carta";
    			if(PlayerNumber==3) PlayerNumberText="forbice";
    			var text="I play '"+PlayerNumberText+"' and bet "+betValue;
                */
                                
                update();
            }
        });
    
        eLogResult = dappContract.LogResult().watch(function (error, result) {
            if(!error && result.args.playerAddress==apiApp.account()){
                apiUI.loadOff();
                
                console.log(result.Address + ' choosed ' + result.args.DiceResult  )
                console.log(result.args.PlayerAddress + ' exit ' + result.args.status );
                var cardHouse;

                switch(result.args.DiceResult){
                    case 1:
                        cardHouse='rock';
                        break;
                    case 2:
                        cardHouse='paper';
                        break;
                    case 3:
                        cardHouse='scissor';
                        break;
                }

                game.add.sprite(50, 245, cardHouse);

                /*
    			var betId = result.args.BetID;
                var playerAddress = result.args.PlayerAddress;
    			var diceResult = result.args.DiceResult;
    			var status = result.args.Status;
    			var value = result.args.Value;
    			var PlayerNumber=result.args.BetValue;
    			var PlayerNumberText="sasso";
    			if(PlayerNumber==2) PlayerNumberText="carta";
    			if(PlayerNumber==3) PlayerNumberText="forbice";
    			var diceResultText="sasso";
    			if(diceResult) diceResultText="carta";
    			if(diceResult==3) diceResultText="forbice";
    			var statusText="LOSE";
    			if(status==1) statusText="WIN";
    			if(status==2) statusText="WIN but a problem occurs during payment";
    			if(status==3) statusText="receive REFUND";
    			if(status==4) statusText="receive REFUND in future";
    			*/
                
                update();
            }
        });
    
    }

    function showInfo(){
        
    }


    function run(id,ABI,Address){
        init(id,ABI,Address);
        setup();
        listner();
        update();

        game.state.add('main', mainState);
        game.state.start('main');
    }


    function playerPlay() {
        var fromAddr = apiApp.account();
        var functionName = 'playerPlay';
        var args = JSON.parse('[]');
        var gasPrice = web3.eth.gasPrice;
        var gas = 300000;
		var amount = web3.toWei(document.getElementById('betAmount').value);
        args.push(selectedId,{from: fromAddr, value: amount, gasPrice: gasPrice, gas: gas});
        var callback = function (err, txhash) {
			if(err){
	            console.log('error: ' + err);

            }

            if(txhash!=undefined){
                console.log('txhash: ' + txhash);
			
            }
        }
        args.push(callback);
        dappContract['playerPlay'].apply(this, args);
        
        return true;
    }

    var divH = document.getElementsByClassName('scroll')[0].clientHeight;
    var divW = document.getElementsByClassName('scroll')[0].clientWidth;
    
    var game = new Phaser.Game(divW, divH, Phaser.AUTO, 'appContainer');
    var group;
    var selectedId=0;

    var mainState = {

        preload: function() {
            game.stage.backgroundColor = '#0066cc';


            game.load.image('rock', path + 'rock_won.png');
            game.load.image('scissor', path + 'scissor_won.png');
            game.load.image('paper', path + 'paper_won.png');
            game.load.image('playbutton', path + 'play.png');

            
        },

        create: function() {
        
            this.rockB = game.add.button(5, 10, 'rock', onSelect, this, 2, 1, 0);
            this.rockB.scale.setTo(0.45, 0.45);

            this.rockP = game.add.button(120, 10, 'paper', onSelect, this, 2, 1, 0);
            this.rockP.scale.setTo(0.45, 0.45);

            this.rockS = game.add.button(225, 10, 'scissor', onSelect, this, 2, 1, 0);
            this.rockS.scale.setTo(0.45, 0.45);

            group = game.add.group();
            group.add(this.rockB);
            group.add(this.rockP);
            group.add(this.rockS);

        }
    }

    function onSelect(button) {
        for (var i = 0; i < 3; i++){
            group.children[i].scale.setTo(0.45, 0.45);
        }
        button.scale.setTo(0.6, 0.6);
        selectedId=group.children.indexOf(button)+1;
    };

	return {
	    update: update,
	    run: run,
	    destroy: destroy,
	    playerPlay: playerPlay
	};

})();
