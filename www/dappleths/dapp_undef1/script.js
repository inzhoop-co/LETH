// Set some initial variables

var ethervote, ethervoteContract, proposalHash, totalVotes, proposal, totalPro, totalAgainst;
var voteMap = {};

var contractAddress = '0x1e9d5e4ed8ef31cfece10b4c92c9057f991f36bc';
var contractAddressTestnet = '0x47ab800a75990b0bd5bb4a54cfbec777972c973c';

var startingBlock = 1800000;

var contractABI = [{"constant":false,"inputs":[{"name":"proposalHash","type":"bytes32"},{"name":"pro","type":"bool"}],"name":"vote","outputs":[],"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"proposalHash","type":"bytes32"},{"indexed":false,"name":"pro","type":"bool"},{"indexed":false,"name":"addr","type":"address"}],"name":"LogVote","type":"event"}];
var history = [];

function init() {
    // Get parameters and set up the basic structure
    proposal = decodeURI(getParameterByName('proposal'));
    document.getElementById('proposal').textContent = proposal;
    
    // Add event listeners
    document.getElementById('see-results').addEventListener('click', function(){
        document.getElementById("results").style.opacity = "1";
        document.getElementById("see-results").style.opacity = "0";
    } , false);
    document.getElementById('vote-support').addEventListener('click', function(){ vote(true);}, false);
    document.getElementById('vote-against').addEventListener('click', function(){ vote(false);}, false);
    var newProposalInput = document.getElementById('new-proposal');    
    newProposalInput.addEventListener('keypress', function() {
        document.getElementById("new-proposal-link").style.display = "block";
    });
    newProposalInput.addEventListener('blur', newProposal);


    // Checks Web3 support
    if(typeof web3 !== 'undefined' && typeof Web3 !== 'undefined') {
        // If there's a web3 library loaded, then make your own web3
        web3 = new Web3(web3.currentProvider);
    } else if (typeof Web3 !== 'undefined') {
        // If there isn't then set a provider
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    } else if(typeof web3 == 'undefined' && typeof Web3 == 'undefined') {
        // If there is neither then this isn't an ethereum browser
        document.getElementById("results").style.display = "none";
        document.getElementById("see-results").style.display = "none";
        document.getElementById("vote-support").style.display = "none";
        document.getElementById("vote-against").style.display = "none";
        document.getElementById("subtitle").style.display = "none";
        document.getElementById("proposal").textContent = "Give Stakers a Voice";
        var message = document.getElementById("message");
        message.style.display = "block";
        return;    
    }
    
    // If no accounts are present, show the floating baloon
    if (!web3.eth.accounts || web3.eth.accounts.length == 0) {
        // document.getElementById("vote-support").style.display = "none";
        // document.getElementById("vote-against").style.display = "none";
        document.getElementById("add-account").style.display = "block";
    }

    // Get the proposal
    proposalHash = web3.sha3(proposal);
    document.body.style.background = "#" + proposalHash.substr(2,6);

    if (typeof proposal == 'undefined' || proposal == 'null' || proposal == '') {
        // No Proposals are set
        document.getElementById("results").style.display = "none";
        document.getElementById("see-results").style.display = "none";
        document.getElementById("vote-support").style.display = "none";
        document.getElementById("vote-against").style.display = "none";
        document.getElementById("subtitle").style.display = "none";
        document.getElementById("proposal").textContent = "Give Stakers a Voice";
        var message = document.getElementById("message");
        message.style.display = "block";
        message.textContent = "This tool will enable anyone to create any statement that ethereum token holders can voice their support or opposition to. Statements are not binding and represent only the opinion of those who support it.";
    } else {
        // If proposal is valid, start watching the chain
        web3.eth.filter('latest').watch(function(e, res){
            if(!e) {
                console.log('Block arrived ', res);
                document.getElementById('status').textContent = 'Calculating votes...';
                calculateVotes();
            }
        });        
    }

    // Load the contract
    web3.eth.getCode(contractAddress, function(e, r) { 
        if (!e) {
            // if bytecode is small, then try switching networks
            if (r.length < 3) {
                contractAddress = contractAddressTestnet;
                startingBlock = 1000000;
            }

            // Load the contract
            ethervoteContract = web3.eth.contract(contractABI);
            ethervote = ethervoteContract.at(contractAddress);

            // Watch Votes
            if (proposal && proposal.length > 0 && proposal != 'null')
                watchVotes();  
        }
    }) 



    // Build Mist Menu
    // Add proposal to history
    if (typeof(Storage) !== "undefined" && typeof(mist) !== "undefined") {
        // Code for localStorage/sessionStorage.
        var propHistory = localStorage.propHistory ? localStorage.propHistory.split(',') : [];
        if (proposal && proposal.length > 0 && propHistory.indexOf(proposal)<0)
            propHistory.unshift(proposal);

        propHistory = propHistory.slice(0, 10);
        localStorage.setItem('propHistory', propHistory.join(','));

        // mist.menu.clear(); 
        mist.menu.add( 'main' ,{
            position: 0,
            name: 'Main Page',
            selected: typeof proposal == 'undefined' || proposal == 'null'
        }, function(){
            window.location.search = '';
        });

        var n = 1;
        for (item of propHistory) {
            if (item.length > 0 && item != 'null') {
                mist.menu.add( item ,{
                    name: item,
                    position: n++,
                    selected: item == proposal 
                }, function(){
                    window.location.search = '?proposal=' + encodeURI(this.name);
                });
            }
        }

    }

}


function watchVotes() {        
    // Set the texts and variables
    document.getElementById('status').textContent = 'Calculating votes...';

    setTimeout(function(){
        // If the app doesn't respond after a timeout it probably has no votes
        document.getElementById('status').textContent = "";
    }, 3000);


    // LogVote is an event on the contract. Read all since block 1 million
    var logVotes = ethervote.LogVote({proposalHash: proposalHash}, {fromBlock: startingBlock});
    
    // Wait for the events to be loaded
    console.time('watch')
    logVotes.watch(function(error, res){

        console.log('event received');

        // Each vote will execute this function 
        if (!error) {            
            // Get the current balance of a voter            
            var bal = Number(web3.fromWei(web3.eth.getBalance(res.args.addr), "finney"));

            voteMap[res.args.addr] = {balance: bal, support: res.args.pro}; 

            // Check if the current owner has already voted and show that on the interface
            if (web3.eth.accounts && web3.eth.accounts[0] == res.args.addr) {
                if (res.args.pro) {
                    document.getElementById('vote-support').classList.add("pressed");
                    document.getElementById('vote-against').classList.remove("pressed");
                } else {
                    document.getElementById('vote-support').classList.remove("pressed");
                    document.getElementById('vote-against').classList.add("pressed");
                }
            }


            calculateVotes();
            console.timeEnd('watch');
        }
    })
}

function convertToString(vote, total){
    // how many 0's are we dealing with
    var magnitude = Math.floor(Math.log10(total));

    // Select the right unit
    if (magnitude <= 3) {
        return Math.round(vote*10)/10 + " finney";
    } else if (magnitude < 6) {
        return Math.round(vote/10)/100 + " ether";
    } else if (magnitude < 9) {
        return Math.round(vote/10000)/100 + "k ether";
    } else {
        return Math.round(vote/10000000)/100 + " million ether";
    }

}

function calculateVotes() {
    totalPro = 0;
    totalAgainst = 0;
    totalVotes = 0;

    Object.keys(voteMap).map(function(a) { 
        // call the function asynchronously 
        web3.eth.getBalance(a, function(e,r) {
            voteMap[a].balance = Number(web3.fromWei(r, 'finney'));

            if (voteMap[a].support)
                totalPro += parseFloat(voteMap[a].balance); 
            else
                totalAgainst += parseFloat(voteMap[a].balance);

            updateTotals()             
        });         
        
        
    });

    // End the calculation
    document.getElementById("message").style.display = "none";
    
    setTimeout(function(){
        // If the app doesn't respond after a timeout it probably has no votes
        document.getElementById('status').textContent = "";

        if (!(totalVotes > 0)){
            document.getElementById("results").style.display = "none";
            var message = document.getElementById("message");
            message.textContent = "No votes yet. Vote now!";
            message.style.display = "block";
        }
    }, 2000);    
}

function updateTotals() {
    totalVotes = totalPro + totalAgainst;

    // Show a colored bar with the result
    document.getElementById("results").style.display = "block";                
    var proResult = document.getElementById('support');
    proResult.textContent = convertToString(totalPro, totalVotes);
    proResult.style.width = Math.round(totalPro*100/totalVotes) + "%";            
    var againstResult = document.getElementById('opposition');
    againstResult.textContent = convertToString(totalAgainst, totalVotes);
    againstResult.style.width = Math.round(totalAgainst*100/totalVotes) + "%";

    if (totalVotes>0)
        mist.menu.update( proposal ,{ badge: Math.round(totalPro*100/totalVotes) + "%" });
    
}

function vote(support) {
   console.log('vote', web3.eth.accounts.length);
 
    // Check if there are accounts available
    if (web3.eth.accounts && web3.eth.accounts.length > 0) {
        
        // Create a dialog requesting the transaction
        ethervote.vote(proposalHash, support, {from: web3.eth.accounts[0]})
        document.getElementById('status').textContent = 'Waiting for new block...';

      } else {
        console.log('callbacks', mist.callbacks);
        mist.requestAccount(function(e, account) {
            console.log('return account', e, account);
            if(!e) {
                // Create a dialog requesting the transaction
                ethervote.vote(proposalHash, support, {from: account.toLowerCase()})
                document.getElementById('status').textContent = 'Waiting for new block...';
            }
        });
        console.log('callbacks', mist.callbacks);

      }

    document.getElementById("results").style.opacity = "1";
    document.getElementById("see-results").style.opacity = "0";
}


function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function newProposal() {
    // When typing a new proposal, generate new dinamic urls
    var newProposal = document.getElementById('new-proposal');
    var newProposalLink = document.getElementById('new-proposal-link');
    newProposalLink.href = '?proposal=' + encodeURI(newProposal.value);
}
