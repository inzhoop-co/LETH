var dappleth = (function(){ 
    //standar variable
    var GUID;
    var dappContract;
    var btnLeft;
    var btnRight;
    //dapp variable
    var eMatchStarted;
    var eTimeElapsed;
    var eNewBet;
    var eBetRefused; 
    var eWinner;
    var elapsed;
    var countdown=0;
    var tickets=[];
    var idMatch;

    function init(id,ABI,Address){
        GUID=id;
        dappContract = web3.eth.contract(ABI).at(Address);

        btnLeft = angular.element(document.querySelector('#leftButton'));
        btnRight = angular.element(document.querySelector('#rightButton'));
    }

    function setup(){
        btnLeft.html(' Play now!');
        btnLeft.attr('class','button button-smal button-icon icon ion-play');
        btnLeft.attr('onclick','dappleth.play()');
        
        btnRight.html(' update');
        btnRight.attr('class','button button-smal button-icon icon ion-ios-refresh');
        btnRight.attr('onclick','dappleth.update()');

        if(apiBE.getKey(GUID,"tickets"))
            tickets=JSON.parse(apiBE.getKey(GUID,"tickets")).tickets;
        
    }

    function update(){
        apiUI.loadOn("loading...");
        var balance = parseFloat(apiApp.balance(1) / 1.0e+15).toFixed(2);
        idMatch = dappContract.getIdMatch();
        var price = parseFloat(dappContract.getPrice() / 1.0e+15);
        var amount = parseFloat((dappContract.getAmount() / 1.333) / 1.0e+15).toFixed(2);
        var numGiocate = dappContract.getNumGiocate() < dappContract.getMinGiocate() ? dappContract.getNumGiocate() - dappContract.getMinGiocate() : dappContract.getNumGiocate();
        var checkTime = dappContract.checkTime().toUpperCase();
 
        var vtime = (dappContract.getDuration() - (dappContract.getNow() - dappContract.getStart()))/1;
        time = vtime <=0 ? "-" : formatTimeStamp(vtime);
        if(vtime>0){
            elapsed = vtime;
            if(!countdown){
                countdown = setInterval(function () {
                    angular.element(document.querySelector('#time')).html(formatTimeStamp(elapsed-=1));
                }, 1000);
            }
        }else{
            angular.element(document.querySelector('#time')).html(time);
        }

        angular.element(document.querySelector('#match')).html('#'+idMatch+'#');
        angular.element(document.querySelector('#price')).html(price + ' finney');
        angular.element(document.querySelector('#amount')).html(amount + ' finney');
        angular.element(document.querySelector('#numGiocate')).html(numGiocate);
        angular.element(document.querySelector('#checkTime')).html(checkTime);
        angular.element(document.querySelector('#balance')).html('balance: ' + balance + ' finney');
        if(elapsed>=0)
            angular.element(document.querySelector('#time')).html(elapsed);
        else
            angular.element(document.querySelector('#time')).html("-");

        var lblTickets = '';
        
        angular.forEach(tickets, function(value, key) {
          lblTickets += '<span class="badge badge-calm">' + value + '</span> '
        });

        angular.element(document.querySelector('#myTickets')).html(lblTickets);

        apiUI.loadOff();

    }

    function destroy(){
        console.log("destroy");
        eMatchStarted.stopWatching();
        eNewBet.stopWatching();
        eTimeElapsed.stopWatching();
        eBetRefused.stopWatching();
        eWinner.stopWatching();
        apiBE.removeKey(GUID,"tickets");

        dappContract={};
    }

    function listner(){
        //event listner
        eMatchStarted = dappContract.MatchStarted().watch(function (error, result) {
            var idEvent = result.code;
            var idMatch = result.idMatch;
            var text = result.args.message;
            var msg = {
                from: result.address,
                text: text,
                date: new Date()
            };

            apiChat.sendDappMessage(msg, GUID);  

            tickets=[];
            clearInterval(countdown);

            update();
        });
    
        eTimeElapsed = dappContract.TimeElapsed().watch(function (error, result) {
            clearInterval(countdown);

            var msg = {
                from: result.address,
                text: "Time elapsed!",
                date: new Date()
            };

            apiChat.sendDappMessage(msg, GUID);  

            update();
        });

        eNewBet = dappContract.NewBet().watch(function (error, result) {
            var ticket = result.args.position;
            var player = result.args.sender;
            var msg = {
                from: player,
                text: 'New Bet #' + ticket + '!',
                date: new Date()
            };

            if(player==apiApp.account()){
                tickets.push(ticket); //store to localstorage with idmatch
                apiBE.storeData(GUID,"tickets",{match: idMatch, tickets: tickets});
            }

            apiChat.sendDappMessage(msg, GUID);  

            update();
        });

        eBetRefused = dappContract.BetRefused().watch(function (error, result) {
            var idEvent = result.arg.code;
            var msg = {
                from: result.address,
                text: 'Refused: ' + result.args.reason,
                date: new Date()
            };

            apiChat.sendDappMessage(msg, GUID);  
            
            update();
        });

        eWinner = dappContract.Winner().watch(function (error, result) {
            var winnerTicket = result.args.position;
            var winnerAddress = result.args.winner;
            var prize = parseFloat(result.args.prize / 1.0e+15);
            var msg = {
                from: winnerAddress,
                text: 'I Won ' + prize + ' finney with ticket #' + winnerTicket + '!',
                date: new Date()
            };

            apiChat.sendDappMessage(msg, GUID);  

            
            clearInterval(countdown);

            update();
        });
    }

    function showInfo(){
        if(document.getElementById('info').style == 'display:block')
            document.getElementById('info').style='display:none'; 
        else
            document.getElementById('info').style='display:block'; 
    }

    function formatTimeStamp(ts){
        var timestamp=ts;
        var date=new Date(timestamp*1000);
        var hours = date.getHours()-1; // minutes part from the timestamp (siamo in GMT+1)
        var minutes = date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes(); // seconds part from the timestamp
        var seconds = date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds(); // will display time in 10:30:23 format
        var formattedTime = hours + ':' + minutes + ':' + seconds;
        return formattedTime;
    }  

    function run(id,ABI,Address){
        init(id,ABI,Address);
        setup();
        listner();
        update();
    }


    function playLottery() {
        var fromAddr = apiApp.account();
        var functionName = 'play';
        var args = JSON.parse('[]');
        var value = dappContract['getPrice'].apply(this, args);
        var gasPrice = 50000000000;
        var gas = 3000000;
        args.push({from: fromAddr, value: value, gasPrice: gasPrice, gas: gas});
        var callback = function (err, txhash) {
            //console.log('error: ' + err);
            console.log('txhash: ' + txhash);
        }
        args.push(callback);
        dappContract['play'].apply(this, args);
        return true;
    }

    return {
        update: update,
        run: run,
        destroy: destroy,
        play: playLottery
    };

})();
