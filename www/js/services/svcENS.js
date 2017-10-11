angular.module('leth.services')
.factory('ENSService', function ($rootScope, $q, AppService) {    
    var contract; 
    var address;
    var ens;
    var resolverContract ;
    var setResolver;
    var setAddress;
    var publicResolver;
    var testRegistrar;
    var publicResolver;
    var suffix;
    var namehash;
/*
    var auctionRegistrarContract;
    var deedContract;
    var reverseRegistrar;

    auctionRegistrarContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"releaseDeed","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"getAllowedTime","outputs":[{"name":"timestamp","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"unhashedName","type":"string"}],"name":"invalidateName","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"hash","type":"bytes32"},{"name":"owner","type":"address"},{"name":"value","type":"uint256"},{"name":"salt","type":"bytes32"}],"name":"shaBid","outputs":[{"name":"sealedBid","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"bidder","type":"address"},{"name":"seal","type":"bytes32"}],"name":"cancelBid","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"entries","outputs":[{"name":"","type":"uint8"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"ens","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"},{"name":"_value","type":"uint256"},{"name":"_salt","type":"bytes32"}],"name":"unsealBid","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"transferRegistrars","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"name":"sealedBids","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"state","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"},{"name":"newOwner","type":"address"}],"name":"transfer","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_hash","type":"bytes32"},{"name":"_timestamp","type":"uint256"}],"name":"isAllowed","outputs":[{"name":"allowed","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"finalizeAuction","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"registryStarted","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"sealedBid","type":"bytes32"}],"name":"newBid","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"labels","type":"bytes32[]"}],"name":"eraseNode","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hashes","type":"bytes32[]"}],"name":"startAuctions","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"hash","type":"bytes32"},{"name":"deed","type":"address"},{"name":"registrationDate","type":"uint256"}],"name":"acceptRegistrarTransfer","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"startAuction","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"rootNode","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"hashes","type":"bytes32[]"},{"name":"sealedBid","type":"bytes32"}],"name":"startAuctionsAndBid","outputs":[],"payable":true,"type":"function"},{"inputs":[{"name":"_ens","type":"address"},{"name":"_rootNode","type":"bytes32"},{"name":"_startDate","type":"uint256"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":false,"name":"registrationDate","type":"uint256"}],"name":"AuctionStarted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":true,"name":"bidder","type":"address"},{"indexed":false,"name":"deposit","type":"uint256"}],"name":"NewBid","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":true,"name":"owner","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"status","type":"uint8"}],"name":"BidRevealed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":true,"name":"owner","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"registrationDate","type":"uint256"}],"name":"HashRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":false,"name":"value","type":"uint256"}],"name":"HashReleased","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":true,"name":"name","type":"string"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"registrationDate","type":"uint256"}],"name":"HashInvalidated","type":"event"}]);
    deedContract = web3.eth.contract([{"constant":true,"inputs":[],"name":"creationDate","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"destroyDeed","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"registrar","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"value","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"previousOwner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newValue","type":"uint256"},{"name":"throwOnFailure","type":"bool"}],"name":"setBalance","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"refundRatio","type":"uint256"}],"name":"closeDeed","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"newRegistrar","type":"address"}],"name":"setRegistrar","outputs":[],"payable":false,"type":"function"},{"inputs":[{"name":"_owner","type":"address"}],"payable":true,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newOwner","type":"address"}],"name":"OwnerChanged","type":"event"},{"anonymous":false,"inputs":[],"name":"DeedClosed","type":"event"}]);
    reverseRegistrarContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"owner","type":"address"}],"name":"claim","outputs":[{"name":"node","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"ens","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"node","outputs":[{"name":"ret","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"rootNode","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"inputs":[{"name":"ensAddr","type":"address"},{"name":"node","type":"bytes32"}],"payable":false,"type":"constructor"}]);
    reverseRegistrar = reverseRegistrarContract.at(ens.owner(namehash('addr.reverse')));

*/
    return {
        contract: contract,
        address: address,
        namehash: namehash,
        registrarTest: testRegistrar,
        setResolver: setResolver,
        publicResolver: publicResolver,
        setAddress: setAddress,
        ens: ens,
        suffix: suffix,

        init: function(networktype) {
            this.contract = web3.eth.contract([{"constant":true,"inputs":[{"name":"node","type":"bytes32"}],"name":"resolver","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"node","type":"bytes32"}],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"node","type":"bytes32"},{"name":"label","type":"bytes32"},{"name":"owner","type":"address"}],"name":"setSubnodeOwner","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"node","type":"bytes32"},{"name":"ttl","type":"uint64"}],"name":"setTTL","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"node","type":"bytes32"}],"name":"ttl","outputs":[{"name":"","type":"uint64"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"node","type":"bytes32"},{"name":"resolver","type":"address"}],"name":"setResolver","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"node","type":"bytes32"},{"name":"owner","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"node","type":"bytes32"},{"indexed":false,"name":"owner","type":"address"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"node","type":"bytes32"},{"indexed":true,"name":"label","type":"bytes32"},{"indexed":false,"name":"owner","type":"address"}],"name":"NewOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"node","type":"bytes32"},{"indexed":false,"name":"resolver","type":"address"}],"name":"NewResolver","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"node","type":"bytes32"},{"indexed":false,"name":"ttl","type":"uint64"}],"name":"NewTTL","type":"event"}]);
            this.resolverContract = web3.eth.contract([{"constant":true,"inputs":[{"name":"interfaceID","type":"bytes4"}],"name":"supportsInterface","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"node","type":"bytes32"}],"name":"addr","outputs":[{"name":"ret","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"node","type":"bytes32"},{"name":"kind","type":"bytes32"}],"name":"has","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"node","type":"bytes32"},{"name":"addr","type":"address"}],"name":"setAddr","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"node","type":"bytes32"}],"name":"content","outputs":[{"name":"ret","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"node","type":"bytes32"},{"name":"hash","type":"bytes32"}],"name":"setContent","outputs":[],"payable":false,"type":"function"},{"inputs":[{"name":"ensAddr","type":"address"}],"type":"constructor"},{"payable":false,"type":"fallback"}]);
            this.fifsRegistrarContract = web3.eth.contract([{"constant":true,"inputs":[],"name":"ens","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"expiryTimes","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"subnode","type":"bytes32"},{"name":"owner","type":"address"}],"name":"register","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"rootNode","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"inputs":[{"name":"ensAddr","type":"address"},{"name":"node","type":"bytes32"}],"type":"constructor"}]);

            if(networktype=="Mainet"){
                this.suffix ="eth";
                this.address="0x314159265dd8dbb310642f98f50c066173c1259b";
                this.publicResolver = this.resolverContract.at('0x1da022710df5002339274aadee8d58218e9d6ab5');
            }
            if(networktype=="Ropsten"){
                this.suffix ="test"
                this.address="0x112234455c3a32fd11230c42e7bccd4a84e02010";
                this.publicResolver = this.resolverContract.at('0x4c641fb9bad9b60ef180c31f56051ce826d21a9a');
            }
            if(networktype=="Rinkeby"){
                this.suffix ="test"
                this.address="0xe7410170f87102DF0055eB195163A03B7F2Bff4A";
                this.publicResolver = this.resolverContract.at('0xb14fdee4391732ea9d2267054ead2084684c0ad8');
            }

            this.ens = this.contract.at(this.address);
            this.testRegistrar = this.fifsRegistrarContract.at(this.ens.owner(this.namehash(this.suffix)));

        },
        namehash: function(name) {
            var node = '0x0000000000000000000000000000000000000000000000000000000000000000';
            if(name != '') {
                var labels = name.split(".");
                for(var i = labels.length - 1; i >= 0; i--) {
                    node = web3.sha3(node + web3.sha3(labels[i]).slice(2), {encoding: 'hex'});
                }
            }
            return node.toString();
        },
        getAddress: function(name){
            var node = this.namehash(name)
            var resolverAddress = this.ens.resolver(node);
            if(resolverAddress == '0x0000000000000000000000000000000000000000') {
                //console.log(ens.address + " not found");
                return "not found"; 
            }
            var result = this.resolverContract.at(resolverAddress).addr(node);

            //console.log("Address " + result);

            return result;
        },
        getOwner: function(name){
          var owner = this.ens.owner(this.namehash(name));
          if(owner == "0x0000000000000000000000000000000000000000")
              return "Not found";
          else
              return owner;
        },
        setResolver: function (name){
            var q = $q.defer();

            var addr = AppService.account() ; //limited only to your wallet addr
            var hname = this.namehash(name);
            this.ens.setResolver(hname, this.publicResolver.address, 
                {from: AppService.account(), gas: 180000, gasPrice: web3.eth.gasPrice}, 
                function(err,res){
                    if(err) q.reject(err.message);
                    if(res) q.resolve("Resolver setted! " + res);
                }
            );
            return q.promise;
        },
        setAddress: function(name, addr){
            var q = $q.defer();
            var hname = this.namehash(name);
            this.publicResolver.setAddr(hname, addr, 
                {from: AppService.account(), gas: 180000, gasPrice: web3.eth.gasPrice}, 
                function(err,res){
                    if(err) q.reject(err.message);
                    if(res) q.resolve("Resolver setted! " + res);
                }
            );
            return q.promise;
        },
        registrarTest: function(name, address){
            var q = $q.defer();

            //var expire = new Date(testRegistrar.expiryTimes(web3.sha3(name)).toNumber() * 1000)
            this.testRegistrar.register(web3.sha3(name), address, 
                {from: AppService.account(), gas: 180000, gasPrice: web3.eth.gasPrice}, 
                function(err,res){
                    if(err) q.reject(err.message);
                    if(res) q.resolve(res);
                }
            );
            return q.promise;

        }
    };
})
