var contrAddr = '0xecdfc21f6394d67713fae31f448304ce5153bda0';
var contrAbi = eval('[{ constant: true, inputs: [], name: "getMinBal", outputs: [{ name: "bal", type: "uint256" }], type: "function" }, { constant: true, inputs: [], name: "getState", outputs: [{ name: "r", type: "uint256" }], type: "function" }, { constant: true, inputs: [], name: "getEnabledCount", outputs: [{ name: "r", type: "uint256" }], type: "function" }, { constant: false, inputs: [], name: "close", outputs: [], type: "function" }, { constant: true, inputs: [{ name: "addr", type: "address" }], name: "getOpCount", outputs: [{ name: "count", type: "uint256" }], type: "function" }, { constant: true, inputs: [], name: "getNumMaxOp", outputs: [{ name: "maxOp", type: "uint256" }], type: "function" }, { constant: false, inputs: [], name: "registerMe", outputs: [], type: "function" }, { constant: true, inputs: [], name: "getRegCost", outputs: [{ name: "cost", type: "uint256" }], type: "function" }, { constant: false, inputs: [{ name: "addr", type: "address" }], name: "registerAddr", outputs: [], type: "function" }, { constant: false, inputs: [], name: "reset", outputs: [], type: "function" }, { constant: true, inputs: [{ name: "addr", type: "address" }], name: "itsEnabled", outputs: [{ name: "enabledV", type: "bool" }], type: "function" }, { constant: false, inputs: [{ name: "mimBal", type: "uint256" }, { name: "regCost", type: "uint256" }, { name: "numOp", type: "uint256" }], name: "config", outputs: [], type: "function" }, { constant: false, inputs: [], name: "open", outputs: [], type: "function" }, { inputs: [], type: "constructor" }, { anonymous: false, inputs: [{ indexed: false, name: "state", type: "uint256" }], name: "State", type: "event" }, { anonymous: false, inputs: [{ indexed: false, name: "msg", type: "string" }], name: "Log", type: "event" }]');
var contract = web3.eth.contract(contrAbi).at(contrAddr);

angular.element(document).ready(function() {
	updateData();
})

contract.State().watch(function (error, result) {
	var s = result.args.state.toNumber();
    var msg = "";
    switch(s){
        case 0:
            msg = "Closed";
            break;
        case 1:
            msg = "Opened";
            break;
        case 2:
            msg = "Insufficent fund!";
            break;
        case 3:
            msg = "Not Enabled";
            break;
    }
    console.log("state: " + s); 
    if(msg!==""){
    	alert(msg);
    }

    updateData();	
});


function updateData(){
	var checkbox = getState() == 1;
	angular.element(document.querySelector('#counter')).html(getOpCount());
	angular.element(document.querySelector('#toggleState')).attr("checked",checkbox);
	angular.element(document.querySelector('#shots')).html(getShots());
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

function getState() {
    return contract.getState();
}

function getOpCount() {
    return contract.getOpCount('0x' + global_keystore.addresses[0]);
}

function doOpen() {
    var fromAddr = global_keystore.addresses[0];
    var functionName = 'open';
    var args = JSON.parse('[]');
    var gasPrice = 50000000000;
    var gas = 3000000;
    args.push({from: fromAddr, gasPrice: gasPrice, gas: gas});
    var callback = function (err, txhash) {
        console.log('error: ' + err);
        console.log('txhash: ' + txhash);
    }
    args.push(callback);
    contract['open'].apply(this, args);
    return true;
}

function doClose() {
    var fromAddr = global_keystore.addresses[0];
    var functionName = 'close';
    var args = JSON.parse('[]');
    var gasPrice = 50000000000;
    var gas = 3000000;
    args.push({from: fromAddr, gasPrice: gasPrice, gas: gas});
    var callback = function (err, txhash) {
        console.log('error: ' + err);
        console.log('txhash: ' + txhash);
    }
    args.push(callback);
    contract['close'].apply(this, args);
    return true;
}

function doRegister() {
    var fromAddr = global_keystore.addresses[0];
    var functionName = 'registerMe';
    var args = JSON.parse('[]');
    var gasPrice = 50000000000;
    var gas = 3000000;
    var value = contract['getRegCost'].apply(this, args);
    args.push({from: fromAddr, gasPrice: gasPrice, gas: gas, value: value});
    var callback = function (err, txhash) {
        console.log('error: ' + err);
        console.log('txhash: ' + txhash);
    }
    args.push(callback);
    contract['registerMe'].apply(this, args);
    return true;
}
