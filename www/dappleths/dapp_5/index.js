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
		
		confAddr = "0x5f27df285a59ff4aeb00f05b017bb9768f2b0931"
		deposit = 1000000000000000000;

		btnCenter = angular.element(document.querySelector('#centerButton'));
		btnRight = angular.element(document.querySelector('#rightButton'));
		btnReg = angular.element(document.querySelector('#registerButton'));
		//btnWithdraw = angular.element(document.querySelector('#withdrawButton'));
		
	}

	function setup(){
		console.log("setup");
		
		btnCenter.html(' check');
        btnCenter.attr('class','button button-smal button-icon icon ion-ios-refresh');
		btnCenter.attr('onclick','dappleth.play()');

		btnRight.html(' withdraw');
        btnRight.attr('class','button button-smal button-icon icon ion-ios-play');
        btnRight.attr('onclick','dappleth.withdraw()');

		btnReg.attr('onclick','dappleth.register()');
		//btnWithdraw.attr('onclick','dappleth.withdraw()');

	}

	function update(){
		console.log("update");
		apiUI.loadFade("loading...",2000);
		var addr = apiApp.account();
		var isRegistered = dappContract.isRegistered(addr);
		var isAttended = dappContract.isAttended(addr);
		var isPaid = dappContract.isPaid(addr);
		

		angular.element(document.querySelector('#Status')).html(status);

		if (isAttended){
			angular.element(document.querySelector('#Status')).html('attended');
		}

		if (isPaid){
			angular.element(document.querySelector('#Status')).html('paid');
		}		

		if (isRegistered){
			angular.element(document.querySelector('#Status')).html('registered');
			document.getElementById('handleTwitter').style='visibility:hidden';
			//btnReg.attr('style','visibility:hidden');
			//btnWithdraw.attr('style','visibility:true');
		}else{
			document.getElementById('handleTwitter').style='visibility:true';
			//btnReg.attr('style','visibility:true');
			//btnWithdraw.attr('style','visibility:hidden');
		}


	}

	function destroy(){
		console.log("destroy");
		dappContract={};
	}

	function listner(){
        //event listner
        eRegister = dappContract.Register().watch(function (error, result) {
      
            var user = result.participantName;
            var msg = {
                from: result.address,
                text: 'Here I am!',
                date: new Date()
            };

            apiChat.sendDappMessage(msg, GUID);  

            update();
        });

        eAttend = dappContract.Attend().watch(function (error, result) {
      
            var addr = result.addr;
            var msg = {
                from: addr,
                text: 'New Attend!',
                date: new Date()
            };

            apiChat.sendDappMessage(msg, GUID);  

            update();
        });

        ePayback = dappContract.Attend().watch(function (error, result) {
            var addr = result.addr;
            var msg = {
                from: result.address,
                text: 'Payback ' + result._payout + '!',
                date: new Date()
            };

            apiChat.sendDappMessage(msg, GUID);  

            update();
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
		    text: "Check registerd...",
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
			var m3 = { 
				from: addr,
			    text: "I'm registered like </br><b>" + u[0] + "</b>",
			    date: new Date()
			};

	      	apiChat.sendDappMessage(m3, GUID);  	    	
    	}

		apiChat.clearDAPP();
		update();
	}

	function register() {
		var name = angular.element(document.querySelector('#handleName'))[0].value;
        var fromAddr = apiApp.account();
        var functionName = 'register';
        var args = JSON.parse('[]');
        var value = deposit;
        var gasPrice = 50000000000;
        var gas = 3000000;
        args.push(name,{from: fromAddr, to: confAddr, value: value, gasPrice: gasPrice, gas: gas});
        var callback = function (err, txhash) {
            //console.log('error: ' + err);
            console.log('txhash: ' + txhash);
        }
        args.push(callback);
        dappContract['register'].apply(this, args);
        return true;
    }

    function withdraw() {
        var fromAddr = apiApp.account();
        var functionName = 'withdraw';
        var args = JSON.parse('[]');
        var gasPrice = 50000000000;
        var gas = 3000000;
        args.push({from: fromAddr, gasPrice: gasPrice, gas: gas});
        var callback = function (err, txhash) {
            //console.log('error: ' + err);
            console.log('txhash: ' + txhash);
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
