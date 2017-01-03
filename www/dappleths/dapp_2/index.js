

function init()
{
    //define center button
    /*
    var btnCenter = angular.element(document.querySelector('#centerButton'));
    btnCenter.html(' Play now!');
    btnCenter.attr('class','button button-smal button-icon icon ion-play');
    btnCenter.attr('onclick','playLottery()');
    */

    //define left button
    
    var btnLeft = angular.element(document.querySelector('#leftButton'));
    btnLeft.html(' Play now!');
    btnLeft.attr('class','button button-smal button-icon icon ion-play');
    btnLeft.attr('onclick','playLottery()');
    
    //define right button
    
    var btnRight = angular.element(document.querySelector('#rightButton'));
    btnRight.html(' update');
    btnRight.attr('class','button button-smal button-icon icon ion-ios-refresh');
    btnRight.attr('onclick','updateData()');
}

angular.element(document).ready(function() {
	updateData();
})


function getTimeRemaining(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);
  var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  var days = Math.floor(t / (1000 * 60 * 60 * 24));
  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}

function initializeClock(id, endtime) {
  var clock = document.getElementById(id);
  var daysSpan = clock.querySelector('.days');
  var hoursSpan = clock.querySelector('.hours');
  var minutesSpan = clock.querySelector('.minutes');
  var secondsSpan = clock.querySelector('.seconds');

  function updateClock() {
    var t = getTimeRemaining(endtime);

    daysSpan.innerHTML = t.days;
    hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

    if (t.total <= 0) {
      clearInterval(timeinterval);
    }
  }

  updateClock();
  var timeinterval = setInterval(updateClock, 1000);
}



dappContract.MatchStarted().watch(function (error, result) {
	var msg = result.args.msg;
    /*
    type: "info",
    title: 'Nuova partita',
    subtitle: 'Via al gioco',
    text: r.args.message,
    date: new Date()
    */
    console.log("Nuova partita: " + msg); 

    var e = new CustomEvent('dappMessage', { "detail": "New match started"});
    document.body.dispatchEvent(e);

    angular.element(document.querySelector('#icon')).attr('src','dappleths/dapp_2/img/info.png');
    angular.element(document.querySelector('#title')).html('Nuova partita');
    angular.element(document.querySelector('#text')).html(msg);
    angular.element(document.querySelector('#date')).html(new Date());

    updateData();

});

dappContract.TimeElapsed().watch(function (error, result) {
    var msg = result.args.msg;
    /*
    type: "warning",
    title: 'Game Over!',
    subtitle: 'Try again',
    text: 'Fai partire un nuovo giro, play now!',
    date: new Date()
    */
    console.log("TimeElapsed: " + msg); 
    
    var e = new CustomEvent('dappMessage', { "detail": "TimeElapsed"});
    document.body.dispatchEvent(e);


    angular.element(document.querySelector('#icon')).attr('src','dappleths/dapp_2/img/warning.png');
    angular.element(document.querySelector('#title')).html('Game Over!');
    angular.element(document.querySelector('#text')).html('Let start new round: play now!');
    angular.element(document.querySelector('#date')).html(new Date());

    updateData();

});

dappContract.NewBet().watch(function (error, result) {
    var msg = result.args.sender;
    /*
    type: "info",
    title: 'NewBet!',
    subtitle: 'Compra un altro biglietto',
    text: 'from:' + r.args.sender,
    date: new Date()
    */
    console.log("NewBet: " + msg); 

    var e = new CustomEvent('dappMessage', { "detail": "New bet"});
    document.body.dispatchEvent(e);


    angular.element(document.querySelector('#icon')).attr('src','dappleths/dapp_2/img/info.png');
    angular.element(document.querySelector('#title')).html('New Bet!');
    angular.element(document.querySelector('#text')).html('From ' + msg);
    angular.element(document.querySelector('#date')).html(new Date().toString('dd-MM-yyyy h:mm:ss a'));

    updateData();

});

dappContract.BetRefused().watch(function (error, result) {
    var msg = result.args.reason;
    /*
    type: "alert",
    title: 'Ohooooooo',
    subtitle: 'Puntata non valida!',
    text: r.args.reason,
    date: new Date()
    */
     console.log("BetRefused: " + msg);

    var e = new CustomEvent('dappMessage', { detail: "Bet refused!" });
    document.body.dispatchEvent(e);

    angular.element(document.querySelector('#icon')).attr('src','dappleths/dapp_2/img/alert.png');
    angular.element(document.querySelector('#title')).html('Ohooooooo!');
    angular.element(document.querySelector('#text')).html(msg);
    angular.element(document.querySelector('#date')).html(new Date());

    updateData();

});


dappContract.Winner().watch(function (error, result) {
    var msg = result.args.winner;
    /*
    type: "info",
    title: 'The Winner is',
    subtitle: 'Ticket #' + r.args.position,
    text: r.args.winner,
    date: new Date()
    */    
    console.log("WinnerIs :" + msg); 

    var e = new CustomEvent('dappMessage', { detail: "The winner is" });
    document.body.dispatchEvent(e);


    angular.element(document.querySelector('#icon')).attr('src','dappleths/dapp_2/img/winner.png');
    angular.element(document.querySelector('#title')).html('The Winner is');
    angular.element(document.querySelector('#text')).html(msg);
    angular.element(document.querySelector('#date')).html(new Date());

    updateData();

});

 function formatTimeStamp(ts){
    var timestamp=ts;
    var date=new Date(timestamp*1000);
    var hours = date.getHours()-1; // minutes part from the timestamp (siamo in GMT+1)
    var minutes = date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes(); // seconds part from the timestamp
    var seconds = date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds(); // will display time in 10:30:23 format
    var formattedTime = hours + ':' + minutes + ':' + seconds;
    return formattedTime;
}                

function updateData(){
    var price = parseFloat(dappContract.getPrice() / 1.0e+15);
    var amount = parseFloat((dappContract.getAmount() / 1.333) / 1.0e+15).toFixed(2);
    var vtime = (dappContract.getDuration() - (dappContract.getNow() - dappContract.getStart()))/1;
    time = vtime <=0 ? "Game over!" : formatTimeStamp(vtime) + ' sec.';
    var numGiocate = dappContract.getNumGiocate() < dappContract.getMinGiocate() ? dappContract.getNumGiocate() - dappContract.getMinGiocate() : dappContract.getNumGiocate();
    
    console.log(vtime);
    if(vtime>0){
        var elapsed = vtime;
        setInterval(function () {
            angular.element(document.querySelector('#time')).html(formatTimeStamp(elapsed-=1));
        }, 1000);
    }
    
    angular.element(document.querySelector('#price')).html(price + ' finney');
    angular.element(document.querySelector('#amount')).html(amount + ' finney');
    angular.element(document.querySelector('#time')).html(time);
    angular.element(document.querySelector('#numGiocate')).html(numGiocate);

}


function playLottery() {
    var fromAddr = global_keystore.getAddresses()[0];
    var functionName = 'play';
    var args = JSON.parse('[]');
    var value = dappContract['getPrice'].apply(this, args);
    var gasPrice = 50000000000;
    var gas = 3000000;
    args.push({from: fromAddr, value: value, gasPrice: gasPrice, gas: gas});
    var callback = function (err, txhash) {
        console.log('error: ' + err);
        console.log('txhash: ' + txhash);

    }
    args.push(callback);
    dappContract['play'].apply(this, args);
    return true;
}