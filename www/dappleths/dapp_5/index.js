var dappleth = (function(){
	var GUID;
	var dappContract;
	var btnRight;
	var btnCenter;
	var btnReg;
	var btnWithdraw;
	var confAddr;
	var eRegister;
	var eAttend;
	var ePayback;
	var deposit;

	 function init(id,ABI,Address){
		console.log("init " + id);
		GUID=id;
        dappContract = web3.eth.contract(ABI).at(Address);

		confAddr = "0x7b249881af36cccd1ab2e4325a8eed2a7848b263" ; //"5f27df285a59ff4aeb00f05b017bb9768f2b0931"
		deposit = 1000000000000000000;

		btnCenter = angular.element(document.querySelector('#centerButton'));
		btnRight = angular.element(document.querySelector('#rightButton'));
		btnReg = angular.element(document.querySelector('#registerButton'));
	}

	function setup(){
		console.log("setup");

		btnCenter.html(' check');
        btnCenter.attr('class','button button-smal button-icon icon ion-ios-refresh');
		btnCenter.attr('onclick','dappleth.play()');

		btnRight.html(' withdraw');
        btnRight.attr('class','button button-smal button-icon icon ion-ios-play');
        btnRight.attr('onclick','dappleth.withdraw()');
        btnRight.attr('style','visibility:hidden');

		btnReg.attr('onclick','dappleth.register()');
	}

	function update(){
		console.log("update");
		apiUI.loadFade("loading...",2000);
		var addr = apiApp.account();
		var isRegistered = dappContract.isRegistered(addr);
		var isAttended = dappContract.isAttended(addr);
		var isPaid = dappContract.isPaid(addr);
		var payout = dappContract.participants(addr);

		angular.element(document.querySelector('#Status')).html(status);

		if (isAttended){
        	btnRight.attr('style','visibility:true');
		}

		if (isPaid){
        	btnRight.attr('style','visibility:hidden');
		}

		if (isRegistered){
			angular.element(document.querySelector('#Status')).html('registered');
			document.getElementById('handleTwitter').style='visibility:hidden';
		}else{
			angular.element(document.querySelector('#Status')).html('not registered');
			document.getElementById('handleTwitter').style='visibility:true';
		}

		/*
		1. 'not registered' if isRegistered(address) == false
		2. 'registered' if isRegistered(address) == true && isAttended(address) == false
		3. 'attended' if isAttended(address) == true && participants[address].payout == 0 isPaid(address) == false
		4. 'won' if isAttended(address) == true && participants[address].payout > 0 isPaid(address) == false
		5. 'earned' if isPaid(address) == true
		*/

		var myStatus;
		if(!isRegistered)
			myStatus = "not registered";

		if(isRegistered && !isAttended && payout == 0){
			myStatus="registered"
		}

		if(isAttended && payout == 0 && !isPaid){
			myStatus="attended"
		}

		if(isAttended && payout > 0 && !isPaid ){
			myStatus="won"
		}
		if(isPaid){
			myStatus="earned"
		}

		angular.element(document.querySelector('#Status')).html(myStatus);

	}

	function destroy(){
		console.log("destroy");
		dappContract={};
	}

	function listner(){
        //event listner
        eRegister = dappContract.RegisterEvent().watch(function (error, result) {
	      if(!error){
			var addr = result.addr;
            var user = result.participantName;
            var msg = {
                from: addr,
                text: 'Here I am, registered!',
                date: new Date()
            };

            apiChat.sendDappMessage(msg, GUID);

            update();
          }
        });

        eAttend = dappContract.AttendEvent().watch(function (error, result) {
		  if(!error){      
            var addr = result.addr;
            var msg = {
                from: addr,
                text: 'New Attend!',
                date: new Date()
            };

            apiChat.sendDappMessage(msg, GUID);

            update();
          }
        });

        ePayback = dappContract.PaybackEvent().watch(function (error, result) {
		   if(!error){
			var addr = result.addr;
            var msg = {
                from: addr,
                text: 'Payback ' + result._payout + '!',
                date: new Date()
            };

            apiChat.sendDappMessage(msg, GUID);

            update();
           }
        });
    }

	function run(id,ABI,Address){
        init(id,ABI,Address);
		setup();
		listner();
		update();
	}

	function play(){
		console.log("play");

		var m1 = {
			from: apiApp.account(),
		    text: "Who is registered?",
		    date: new Date()
		};

      	apiChat.sendDappMessage(m1, GUID);

      	var count = dappContract.registered(); //
      	var m2 = {
				from: dappContract.address,
			    text: "Total registered <b># " + count + "</b>",
			    date: new Date()
			};

		apiChat.sendDappMessage(m2, GUID);

    	for(var i=1;i<=count;i++){
	      	var addr = dappContract.participantsIndex(i); //iterate for list
	      	var u = dappContract.participants(addr);

	      	var profile = "I'm registered as <b>" + u[0] + "</b>";
	      	if(u[2] && u[3]==0 && !u[4])
	      		profile +="<br/>I'm attended";
	      	if(u[2] && u[3]>0 && !u[4])
	      		profile +="<br/>I won";
	      	if(u[4])
	      		profile +="<br/>I earned " + parseFloat(u[3] / 1.0e+18).toFixed(2);


			var m3 = {
				from: addr,
			    text: profile,
			    date: new Date()
			};

	      	apiChat.sendDappMessage(m3, GUID);
    	}

		//apiChat.clearDAPP();
		update();
	}

	function register() {
		var name = angular.element(document.querySelector('#handleName'))[0].value;
        var fromAddr = apiApp.account();
        var functionName = 'register';
        var args = JSON.parse('[]');
        var value = deposit;
        var gasPrice = web3.eth.gasPrice;
        var gas = 300000;
        args.push(name,{from: fromAddr, to: confAddr, value: value, gasPrice: gasPrice, gas: gas});
        var callback = function (err, txhash) {
            if(err){
	            console.log('error: ' + err);

            	var mE = {
					from: dappContract.address,
			    	text: "Ops! <b>" + err + "</b>",
			    	date: new Date()
				};

	      		apiChat.sendDappMessage(mE, GUID);
            }

            console.log('txhash: ' + txhash);

            if(txhash!=undefined){
				var mT = {
					from: dappContract.address,
			    	text: "sending tx " + txhash + "...",
			    	date: new Date()
				};

	      		apiChat.sendDappMessage(mT, GUID);
            }
        }
        args.push(callback);
        dappContract['register'].apply(this, args);
        return true;
    }

    function withdraw() {
        var fromAddr = apiApp.account();
        var functionName = 'withdraw';
        var args = JSON.parse('[]');
        var gasPrice = web3.eth.gasPrice;
        var gas = 300000;
        args.push({from: fromAddr, gasPrice: gasPrice, gas: gas});
        var callback = function (err, txhash) {
			if(err){
	            console.log('error: ' + err);

            	var mE = {
					from: dappContract.address,
			    	text: "Ops! <b>" + err + "</b>",
			    	date: new Date()
				};

	      		apiChat.sendDappMessage(mE, GUID);
            }

            console.log('txhash: ' + txhash);

            if(txhash!="undefined"){
				var mT = {
					from: dappContract.address,
			    	text: "sending tx " + txhash + "...",
			    	date: new Date()
				};

	      		apiChat.sendDappMessage(mT, GUID);
            }
        }
        args.push(callback);
        dappContract['withdraw'].apply(this, args);
        return true;
    }

	return {
	    update: update,
	    run: run,
	    destroy: destroy,
	    play: play,
	    register: register,
	    withdraw: withdraw
	};

})();
