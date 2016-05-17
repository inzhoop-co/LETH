angular.element(document).ready(function() {
	updateData();
})

function getBalance()
{
    var balance = "TOTAL ETH "  + parseFloat(web3.eth.web3.fromWei(web3.eth.getBalance("0xbb9bc244d798123fde783fcc1c72d3bb8c189413"))).toFixed(0);
    angular.element(document.querySelector('#balance')).html(balance);

}

function updateData(){
    getBalance();

}

function buy(amount)
{
    var fromAddr = global_keystore.getAddresses()[0];
    var amount = parseFloat(angular.element(document.querySelector('#amountCoins')).val());
    var toAddr = "0xbb9bc244d798123fde783fcc1c72d3bb8c189413";
    var gasPrice = 50000000000;
    var gas = 3000000;
    
    web3.eth.sendTransaction({
      from: fromAddr,
      to: toAddr,
      value: amount,
      gasPrice: gasPrice,
      gas: gas
    });

    updateData(); 

    angular.element(document.querySelector('#amountCoins')).val('');
    return true;
    
}