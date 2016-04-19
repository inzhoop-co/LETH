var contrAddr = '0xd58cae29b2ecc6e25cb3d180fec570ea4fbc0096';
var contrAbi = eval('[{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"enableAddr","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"getMinBal","outputs":[{"name":"bal","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"getEnabledCount","outputs":[{"name":"r","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"getSubscriptionCost","outputs":[{"name":"cost","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"getCurrentCaller","outputs":[{"name":"r","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"status","type":"uint256"}],"name":"__callback","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"x","type":"address"}],"name":"save","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"idOp","type":"uint256"}],"name":"open","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"oracleFornoAddr","type":"address"}],"name":"setOracle","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"isBusy","outputs":[{"name":"r","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"getProgramSelected","outputs":[{"name":"r","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"subscribe","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"getNumMaxOp","outputs":[{"name":"maxOp","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"reset","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"getRemainingShot","outputs":[{"name":"count","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"itsEnabled","outputs":[{"name":"enabledV","type":"bool"}],"type":"function"},{"constant":false,"inputs":[{"name":"mimBal","type":"uint256"},{"name":"regCost","type":"uint256"},{"name":"numOp","type":"uint256"}],"name":"config","outputs":[],"type":"function"},{"inputs":[{"name":"oracleFornoAddr","type":"address"}],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"}],"name":"Open","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"msg","type":"string"}],"name":"OperationDenied","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"msg","type":"string"}],"name":"Log","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"msg","type":"string"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Log2","type":"event"}]');
var contract = web3.eth.contract(contrAbi).at(contrAddr);

angular.element(document).ready(function() {
	updateData();
})


contract.Open().watch(function (error, result) {
	var s = result.args.id.toNumber();
    var msg = "";
    switch(s){
        case 1:
            msg = "Pizza 1:00";
            break;
        case 2:
            msg = "Sausages 1:30";
            break;
        case 3:
            msg = "Meal 2:20";
            break;
        case 4:
            msg = "Chicken 3:00";
            break;
    }
    console.log("timer: " + s); 
    if(msg!==""){
    	alert(msg);
    }

    updateData();	
});


contract.Log().watch(function (error, result) {
    var msg = result.args.msg;
    console.log("msg: " + msg); 
    angular.element(document.querySelector('#log')).html(msg);

});

contract.Log2().watch(function (error, result) {
    var msg = result.args.msg;
    var val = result.args.value;
    console.log("msg: " + msg + " value:"+ val); 
    angular.element(document.querySelector('#log')).html(msg);

});

contract.OperationDenied().watch(function (error, result) {
    var msg = result.args.msg;
    console.log("msg: " + msg); 
    if(msg!==""){
        alert(msg);
    }

    updateData();   
});

function updateData(){
    var checkbox = isBusy() == 1 ? 0 : 1;
    angular.element(document.querySelector('#toggleState')).attr("checked",checkbox);
	angular.element(document.querySelector('#counter')).html(getRemainingShot());
	angular.element(document.querySelector('#shots')).html(getShots());
    angular.element(document.querySelector('#wei')).html(getSubscriptionCost());
    var register = isEnabled() == 1;
	if(register)
		angular.element(document.querySelector('#btnRegister')).css('visibility','hidden');

}

function getShots(){
	return contract.getNumMaxOp()*1;
}

function isEnabled(){
	 return contract.itsEnabled('0x' + global_keystore.addresses[0]);
}

function isBusy(){
     return contract.isBusy();
}

function getRemainingShot() {
    return contract.getRemainingShot('0x' + global_keystore.addresses[0]);
}

function getSubscriptionCost(){
    return parseFloat(contract.getSubscriptionCost()) / 1.0e18;
}

function doOpen(program) {
    var fromAddr = global_keystore.addresses[0];
    var functionName = 'open';
    var args = JSON.parse('[]');
    var gasPrice = 50000000000;
    var gas = 3000000;
    args.push(program,{from: fromAddr, gasPrice: gasPrice, gas: gas});
    var callback = function (err, txhash) {
        console.log('error: ' + err);
        console.log('txhash: ' + txhash);
    }
    args.push(callback);
    contract['open'].apply(this, args);
    return true;
}

function doRegister() {
    var fromAddr = global_keystore.addresses[0];
    var functionName = 'subscribe';
    var args = JSON.parse('[]');
    var gasPrice = 50000000000;
    var gas = 3000000;
    var value = contract['getSubscriptionCost'].apply(this, args);
    args.push({from: fromAddr, gasPrice: gasPrice, gas: gas, value: value});
    var callback = function (err, txhash) {
        console.log('error: ' + err);
        console.log('txhash: ' + txhash);
    }
    args.push(callback);
    contract['subscribe'].apply(this, args);
    return true;
}
