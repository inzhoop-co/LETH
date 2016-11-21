var contractAddr = '0x0B8A1D1Ea1F38D511e4991A815704464dDa17825';
var abi = JSON.parse('[{ "constant": true, "inputs": [], "name": "getPayed", "outputs": [{ "name": "r", "type": "bool" }], "type": "function" }, { "constant": true, "inputs": [{ "name": "pos", "type": "uint256" }], "name": "getGamer", "outputs": [{ "name": "r", "type": "address" }], "type": "function" }, { "constant": false, "inputs": [{ "name": "duration", "type": "uint256" }, { "name": "price", "type": "uint256" }], "name": "newMatch", "outputs": [], "type": "function" }, { "constant": false, "inputs": [{ "name": "x", "type": "address" }], "name": "save", "outputs": [], "type": "function" }, { "constant": false, "inputs": [], "name": "destroy", "outputs": [], "type": "function" }, { "constant": true, "inputs": [], "name": "getWinner", "outputs": [{ "name": "r", "type": "address" }], "type": "function" }, { "constant": false, "inputs": [], "name": "play", "outputs": [{ "name": "accepted", "type": "bool" }], "type": "function" }, { "constant": true, "inputs": [], "name": "getPrice", "outputs": [{ "name": "r", "type": "uint256" }], "type": "function" }, { "constant": true, "inputs": [], "name": "getDuration", "outputs": [{ "name": "r", "type": "uint256" }], "type": "function" }, { "constant": false, "inputs": [], "name": "checkWinner", "outputs": [{ "name": "ready", "type": "bool" }], "type": "function" }, { "constant": true, "inputs": [], "name": "getNow", "outputs": [{ "name": "r", "type": "uint256" }], "type": "function" }, { "constant": true, "inputs": [], "name": "getStart", "outputs": [{ "name": "r", "type": "uint256" }], "type": "function" }, { "constant": true, "inputs": [], "name": "getAmount", "outputs": [{ "name": "r", "type": "uint256" }], "type": "function" }, { "constant": true, "inputs": [], "name": "getNumGiocate", "outputs": [{ "name": "r", "type": "uint256" }], "type": "function" }, { "constant": true, "inputs": [], "name": "checkTime", "outputs": [{ "name": "r", "type": "string" }], "type": "function" }, { "inputs": [], "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "sender", "type": "address" }], "name": "NewBet", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "winner", "type": "address" }, { "indexed": false, "name": "position", "type": "uint256" }], "name": "Winner", "type": "event" }, { "anonymous": false, "inputs": [], "name": "TimeElapsed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "sender", "type": "address" }, { "indexed": false, "name": "reason", "type": "string" }], "name": "BetRefused", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "message", "type": "string" }], "name": "MatchStarted", "type": "event" }]');
var contract = web3.eth.contract(abi).at(contractAddr);


angular.element(document).ready(function() {
	updateData();
})



contract.MatchStarted().watch(function (error, result) {
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

    angular.element(document.querySelector('#icon')).attr('src','dappleths/dapp_4/img/info.png');
    angular.element(document.querySelector('#title')).html('Nuova partita');
    angular.element(document.querySelector('#text')).html(msg);
    angular.element(document.querySelector('#date')).html(new Date());

    updateData();

});

contract.TimeElapsed().watch(function (error, result) {
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


    angular.element(document.querySelector('#icon')).attr('src','dappleths/dapp_4/img/warning.png');
    angular.element(document.querySelector('#title')).html('Game Over!');
    angular.element(document.querySelector('#text')).html('Fai partire un nuovo giro, play now!');
    angular.element(document.querySelector('#date')).html(new Date());

    updateData();

});

contract.NewBet().watch(function (error, result) {
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


    angular.element(document.querySelector('#icon')).attr('src','dappleths/dapp_4/img/info.png');
    angular.element(document.querySelector('#title')).html('New Bet!');
    angular.element(document.querySelector('#text')).html('From ' + msg);
    angular.element(document.querySelector('#date')).html(new Date().toString('dd-MM-yyyy h:mm:ss a'));

    updateData();

});

contract.BetRefused().watch(function (error, result) {
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

    angular.element(document.querySelector('#icon')).attr('src','dappleths/dapp_4/img/alert.png');
    angular.element(document.querySelector('#title')).html('Ohooooooo!');
    angular.element(document.querySelector('#text')).html(msg);
    angular.element(document.querySelector('#date')).html(new Date());

    updateData();

});


contract.Winner().watch(function (error, result) {
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


    angular.element(document.querySelector('#icon')).attr('src','dappleths/dapp_4/img/winner.png');
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
    var price = parseFloat(contract.getPrice() / 1);
    var amount = parseFloat(contract.getAmount() / 2);
    var time = (contract.getDuration() - (contract.getNow() - contract.getStart()))/1
    time = time <=0 ? "Time over!" : formatTimeStamp(time);
    var numGiocate = contract.getNumGiocate() / 1;

    angular.element(document.querySelector('#price')).html(price);
    angular.element(document.querySelector('#amount')).html(amount);
    angular.element(document.querySelector('#time')).html(time);
    angular.element(document.querySelector('#numGiocate')).html(numGiocate);

}



function playLottery() {
    var fromAddr = global_keystore.getAddresses()[0];
    var functionName = 'play';
    var args = JSON.parse('[]');
    var value = contract['getPrice'].apply(this, args);//SparseFloat('0.0000000000000001')*1.0e18;
    var gasPrice = 50000000000;
    var gas = 3000000;
    args.push({from: fromAddr, value: value, gasPrice: gasPrice, gas: gas});
    var callback = function (err, txhash) {
        console.log('error: ' + err);
        console.log('txhash: ' + txhash);

    }
    args.push(callback);
    contract['play'].apply(this, args);
    return true;
}