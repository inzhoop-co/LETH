var riacecoinAdr = "0x53c061067827efb7a31c9925a28588e594e053fc";
var riacecoinAdrAbi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"type":"function"},{"constant":true,"inputs":[],"name":"version","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"spentAllowance","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"inputs":[{"name":"initialSupply","type":"uint256"},{"name":"tokenName","type":"string"},{"name":"decimalUnits","type":"uint8"},{"name":"tokenSymbol","type":"string"},{"name":"versionOfTheCode","type":"string"}],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]

var riacecoin = web3.eth.contract(riacecoinAdrAbi).at(riacecoinAdr);

angular.element(document).ready(function() {
	updateData();
})

function updateData(){
	getBalance();

}


function buy(address,amount)
{
    var fromAddr = global_keystore.addresses[0];
	//var coin = amount.value*1; 
    var coin = parseFloat(angular.element(document.querySelector('#amountCoins')).val());
	var toAddr = address.value;
	var functionName = 'transfer';
    var args = JSON.parse('[]');
    var gasPrice = 50000000000;
    var gas = 3000000;
    args.push(toAddr,coin,{from: fromAddr, gasPrice: gasPrice, gas: gas});
    var callback = function (err, txhash) {
        console.log('error: ' + err);
        console.log('txhash: ' + txhash);
    }
    args.push(callback);
    riacecoin['transfer'].apply(this, args);
      
    
	 updateData(); 
	//0xc92af685c058197f22f432e33756409a7b10fb55
	//0xd1324ada7e026211d0cacd90cae5777e340de948
    angular.element(document.querySelector('#amountCoins')).val('');
    return true;
	
}

function getPOI()
{
	alert('Discover where you can buy');
}


function getBalance()
{
    var balance = "<b>" + parseFloat(riacecoin.balanceOf('0x' + global_keystore.addresses[0])).toFixed(2) + " " + riacecoin.symbol() + "</b> [" + riacecoin.name() + "]";
    angular.element(document.querySelector('#balance')).html(balance);

}

function writeHelp()
{
    var m = "Il coin di Riace per i rifugiati";
    angular.element(document.querySelector('#message')).html(m);

}
