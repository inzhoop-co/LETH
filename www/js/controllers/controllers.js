angular.module('leth.controllers', [])
.controller('AppCtrl', function ($ionicHistory, $interval, $scope, $rootScope, $ionicModal,  $cordovaDeviceMotion, $ionicPlatform, 
                                $ionicPopup, $ionicTabsDelegate, $timeout, $cordovaBarcodeScanner, $state, 
                                $ionicActionSheet, $cordovaEmailComposer, $cordovaContacts, $q, $ionicLoading, 
                                $ionicLoadingConfig, $location, $sce, $lockScreen, $cordovaInAppBrowser,$cordovaLocalNotification,
                                $cordovaBadge,$translate,tmhDynamicLocale,$ionicScrollDelegate, $ionicListDelegate, $cordovaClipboard, $cordovaVibration,
                                StoreEndpoint, ENSService, AppService, Chat, PasswordPopup, Transactions, Friends, ExchangeService, Geolocation, nfcService, SwarmService) {

  $scope.filterStoreCoins = 'button button-small button-outline button-positive';
  $scope.filterStoreApps = 'button button-small button-outline button-positive';

  window.refresh = function () {
    $ionicLoading.show();
    $scope.shhEnabled = Chat.isEnabled();
    if($scope.idCoin==0 || $scope.idCoin==undefined)  //buggy from wallet refresh  
      $scope.balance = AppService.balance($scope.unit);
    else
      $scope.balance = AppService.balanceOf($scope.contractCoin,$scope.unit + 'e+' + $scope.decimals);

    ExchangeService.getTicker($scope.xCoin, JSON.parse(localStorage.BaseCurrency).value).then(function(value){
      $scope.balanceExc = JSON.parse(localStorage.BaseCurrency).symbol + " " + parseFloat(value * $scope.balance).toFixed(2) ;
    });
    $scope.account = AppService.account();
    $scope.nick = AppService.idkey();
    $scope.qrcodeString = $scope.account + "/" + $scope.nick ;
    AppService.getNetwork().then(function(res){

      $scope.nameNetwork = res.name;
      $scope.classNetwork = res.class;               
      $scope.badgeNetwork = res.badge;
      getSync();

      $scope.readCategoryList(res.name);
      if($scope.isDapp)
        $scope.readDappsList(res.name);
      else
        $scope.readCoinsList(res.name);    
    }, function(err){
        console.log('no Network');
    });

    $scope.loadFriends();
    $scope.transactions = Transactions.all();
    localStorage.Transactions = JSON.stringify($scope.transactions);
    isNfcAvailable();
    $scope.blacklisted = JSON.parse(localStorage.Blacklist);

    tmhDynamicLocale.set(localStorage.Language);
    $translate.use(localStorage.Language);

    $timeout(function() {$ionicLoading.hide();}, 1000);
  };

  $scope.getDappPath = function(id,asset){
    return StoreEndpoint.url + "/" + $scope.nameNetwork + "/" + id + "/" + asset;
  }

  $scope.deppoi = function(){
    var _name = "TestEvent" ;
    var _deposit = 1 ;
    var _limitOfParticipants = 3 ;
    var _coolingPeriod = 1 ;
    var _confirmation_repository_address = 0x65ddc3a1f2762f3d0669bbeea44e16b2b38090a5 ;
    var _encryption = "leth" ;
    
    var param = [];
    param.push(_name);
    param.push(_deposit);
    param.push(_limitOfParticipants);
    param.push(_coolingPeriod);
    param.push(_confirmation_repository_address);
    param.push(_encryption);

    var abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"participants","outputs":[{"name":"participantName","type":"string"},{"name":"addr","type":"address"},{"name":"attended","type":"bool"},{"name":"paid","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_confirmation","type":"bytes32"}],"name":"attendWithConfirmation","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"ended","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"registered","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"endedAt","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"clear","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_participant","type":"string"},{"name":"_encrypted","type":"string"}],"name":"registerWithEncryption","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"payout","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"payoutAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"limitOfParticipants","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"}],"name":"isPaid","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"confirmation","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"destroy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"payback","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"coolingPeriod","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_addresses","type":"address[]"}],"name":"attend","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_limitOfParticipants","type":"uint256"}],"name":"setLimitOfParticipants","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"cancelled","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"participantsIndex","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"}],"name":"isAttended","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"encryption","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"confirmationRepository","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"attended","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"}],"name":"isRegistered","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"deposit","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"cancel","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_participant","type":"string"}],"name":"register","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_name","type":"string"},{"name":"_deposit","type":"uint256"},{"name":"_limitOfParticipants","type":"uint256"},{"name":"_coolingPeriod","type":"uint256"},{"name":"_confirmation_repository_address","type":"address"},{"name":"_encryption","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"participantName","type":"string"},{"indexed":false,"name":"_encryption","type":"string"}],"name":"RegisterEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"}],"name":"AttendEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_payout","type":"uint256"}],"name":"PaybackEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"_payout","type":"uint256"}],"name":"WithdrawEvent","type":"event"},{"anonymous":false,"inputs":[],"name":"CancelEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"leftOver","type":"uint256"}],"name":"ClearEvent","type":"event"}];
    var code = '0x606060405234156200001057600080fd5b6040516200218a3803806200218a83398101604052808051820191906020018051906020019091908051906020019091908051906020019091908051906020019091908051820191905050336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060008651141515620000c6578560019080519060200190620000bf92919062000215565b5062000115565b6040805190810160405280600481526020017f5465737400000000000000000000000000000000000000000000000000000000815250600190805190602001906200011392919062000215565b505b6000851415156200012d57846002819055506200013c565b66b1a2bc2ec500006002819055505b6000841415156200015457836003819055506200015d565b60146003819055505b60008314151562000175578260088190555062000180565b62093a806008819055505b60008151141515620001a65780600b9080519060200190620001a492919062000215565b505b60008273ffffffffffffffffffffffffffffffffffffffff16141515620002095781600a60006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b505050505050620002c4565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200025857805160ff191683800117855562000289565b8280016001018555821562000289579182015b82811115620002885782518255916020019190600101906200026b565b5b5090506200029891906200029c565b5090565b620002c191905b80821115620002bd576000816000905550600101620002a3565b5090565b90565b611eb680620002d46000396000f30060606040523615610194576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806306fdde031461019957806309e69ede146102275780630bfcbc5d1461033f57806312fa6feb146103665780632de40ce3146103935780633ccfd60b146103bc5780633d6a71e4146103d157806352efea6e146103fa5780635d27bff31461040f57806363bd1d4a146104a45780636b46c8c3146104cd5780636d006ae8146104f65780636ded82f81461051f5780637eef61771461057057806383197ef01461059d578063854bec87146105b25780638da5cb5b146105c75780639328beee1461061c578063982495c7146106455780639989a5ae1461069f5780639a82a09a146106c25780639b25cacb146106ef578063a07f3a5614610752578063a531d362146107a3578063a5bc1e8414610831578063ad7a672f14610886578063b5e10e9a146108af578063c3c5a547146108d8578063d0e30db014610929578063ea8a1af014610952578063f2c298be14610967578063f2fde38b146109b9575b600080fd5b34156101a457600080fd5b6101ac6109f2565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156101ec5780820151818401526020810190506101d1565b50505050905090810190601f1680156102195780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561023257600080fd5b61025e600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610a90565b60405180806020018573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001841515151581526020018315151515815260200182810382528681815460018160011615610100020316600290048152602001915080546001816001161561010002031660029004801561032d5780601f106103025761010080835404028352916020019161032d565b820191906000526020600020905b81548152906001019060200180831161031057829003601f168201915b50509550505050505060405180910390f35b341561034a57600080fd5b610364600480803560001916906020019091905050610af9565b005b341561037157600080fd5b610379610d0c565b604051808215151515815260200191505060405180910390f35b341561039e57600080fd5b6103a6610d1f565b6040518082815260200191505060405180910390f35b34156103c757600080fd5b6103cf610d25565b005b34156103dc57600080fd5b6103e4610f3a565b6040518082815260200191505060405180910390f35b341561040557600080fd5b61040d610f40565b005b6104a2600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919050506110e1565b005b34156104af57600080fd5b6104b7611247565b6040518082815260200191505060405180910390f35b34156104d857600080fd5b6104e0611277565b6040518082815260200191505060405180910390f35b341561050157600080fd5b61050961127d565b6040518082815260200191505060405180910390f35b341561052a57600080fd5b610556600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050611283565b604051808215151515815260200191505060405180910390f35b341561057b57600080fd5b6105836112ed565b604051808215151515815260200191505060405180910390f35b34156105a857600080fd5b6105b0611346565b005b34156105bd57600080fd5b6105c56113db565b005b34156105d257600080fd5b6105da6114bd565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561062757600080fd5b61062f6114e2565b6040518082815260200191505060405180910390f35b341561065057600080fd5b61069d6004808035906020019082018035906020019080806020026020016040519081016040528093929190818152602001838360200280828437820191505050505050919050506114e8565b005b34156106aa57600080fd5b6106c06004808035906020019091905050611695565b005b34156106cd57600080fd5b6106d5611716565b604051808215151515815260200191505060405180910390f35b34156106fa57600080fd5b6107106004808035906020019091905050611729565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561075d57600080fd5b610789600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061175c565b604051808215151515815260200191505060405180910390f35b34156107ae57600080fd5b6107b66117c6565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156107f65780820151818401526020810190506107db565b50505050905090810190601f1680156108235780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561083c57600080fd5b610844611864565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561089157600080fd5b61089961188a565b6040518082815260200191505060405180910390f35b34156108ba57600080fd5b6108c26118a9565b6040518082815260200191505060405180910390f35b34156108e357600080fd5b61090f600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506118af565b604051808215151515815260200191505060405180910390f35b341561093457600080fd5b61093c61194a565b6040518082815260200191505060405180910390f35b341561095d57600080fd5b610965611950565b005b6109b7600480803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091905050611a3b565b005b34156109c457600080fd5b6109f0600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050611b47565b005b60018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610a885780601f10610a5d57610100808354040283529160200191610a88565b820191906000526020600020905b815481529060010190602001808311610a6b57829003601f168201915b505050505081565b600c60205280600052604060002060009150905080600001908060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060010160149054906101000a900460ff16908060010160159054906101000a900460ff16905084565b600660009054906101000a900460ff16151515610b1557600080fd5b610b1e336118af565b1515610b2957600080fd5b610b323361175c565b151515610b3e57600080fd5b600a60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166396c144f082336000604051602001526040518363ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004018083600019166000191681526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200192505050602060405180830381600087803b1515610c1357600080fd5b6102c65a03f11515610c2457600080fd5b505050604051805190501515610c3957600080fd5b6001600c60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160146101000a81548160ff0219169083151502179055506005600081548092919060010191905055507f1c5e7a37dd4095194684d8f835d2c81b686d64d685032055a7cd02edc7c49ed833604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a150565b600660009054906101000a900460ff1681565b60045481565b6000600660009054906101000a900460ff161515610d4257600080fd5b6000600954111515610d5357600080fd5b600c60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002090503373ffffffffffffffffffffffffffffffffffffffff168160010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16141515610df257600080fd5b600660019054906101000a900460ff1680610e1b57508060010160149054906101000a900460ff165b1515610e2657600080fd5b600015158160010160159054906101000a900460ff161515141515610e4a57600080fd5b60018160010160156101000a81548160ff0219169083151502179055508060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc6009549081150290604051600060405180830381858888f193505050501515610eca57fe5b7f5dba113b49cfa7c90315e8e604e6b506f7abcb909b01dcb19ec39005086e68fc33600954604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a150565b60075481565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610f9d57600080fd5b600660009054906101000a900460ff161515610fb857600080fd5b6008546007540142111515610fcc57600080fd5b600660009054906101000a900460ff161515610fe757600080fd5b610fef61188a565b90506000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050151561105257600080fd5b7f61355a34c3bc2e502a24eba7ad2fb0fd0d05c4f71de8cb041fbe39cd3649665e6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1682604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a150565b600660009054906101000a900460ff161515156110fd57600080fd5b61110682611c21565b7f8d272c75acbe64f584f00b43ea2e4ac139abac8e8b8f118e5588e14bbb5c4031338383604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018060200180602001838103835285818151815260200191508051906020019080838360005b838110156111a0578082015181840152602081019050611185565b50505050905090810190601f1680156111cd5780820380516001836020036101000a031916815260200191505b50838103825284818151815260200191508051906020019080838360005b838110156112065780820151818401526020810190506111eb565b50505050905090810190601f1680156112335780820380516001836020036101000a031916815260200191505b509550505050505060405180910390a15050565b600080600554141561125c5760009050611274565b60055461126761188a565b81151561127057fe5b0490505b90565b60095481565b60035481565b600061128e826118af565b80156112e65750600c60008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160159054906101000a900460ff165b9050919050565b60008073ffffffffffffffffffffffffffffffffffffffff16600a60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415905090565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156113a157600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561143657600080fd5b600660009054906101000a900460ff1615151561145257600080fd5b61145a611247565b6009819055506001600660006101000a81548160ff021916908315150217905550426007819055507fb7152de35affc741a6b2355d37e9caf51fe847cacfccd414be5e15996ff7e6c66009546040518082815260200191505060405180910390a1565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60085481565b6000806000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561154657600080fd5b600660009054906101000a900460ff1615151561156257600080fd5b600091505b825182101561169057828281518110151561157e57fe5b906020019060200201519050611593816118af565b151561159e57600080fd5b6115a78161175c565b1515156115b357600080fd5b7f1c5e7a37dd4095194684d8f835d2c81b686d64d685032055a7cd02edc7c49ed881604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a16001600c60008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160146101000a81548160ff0219169083151502179055506005600081548092919060010191905055508180600101925050611567565b505050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156116f057600080fd5b600660009054906101000a900460ff1615151561170c57600080fd5b8060038190555050565b600660019054906101000a900460ff1681565b600d6020528060005260406000206000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000611767826118af565b80156117bf5750600c60008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160149054906101000a900460ff165b9050919050565b600b8054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561185c5780601f106118315761010080835404028352916020019161185c565b820191906000526020600020905b81548152906001019060200180831161183f57829003601f168201915b505050505081565b600a60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60003073ffffffffffffffffffffffffffffffffffffffff1631905090565b60055481565b60008073ffffffffffffffffffffffffffffffffffffffff16600c60008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614159050919050565b60025481565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156119ab57600080fd5b600660009054906101000a900460ff161515156119c757600080fd5b6002546009819055506001600660016101000a81548160ff0219169083151502179055506001600660006101000a81548160ff021916908315150217905550426007819055507faac5ae2dfd439bb6c2f88b2d8af5b285cfee7584ad0d13ae7c00c1226c7c4c7b60405160405180910390a1565b600660009054906101000a900460ff16151515611a5757600080fd5b611a6081611c21565b7f8d272c75acbe64f584f00b43ea2e4ac139abac8e8b8f118e5588e14bbb5c40313382604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018060200180602001838103835284818151815260200191508051906020019080838360005b83811015611af9578082015181840152602081019050611ade565b50505050905090810190601f168015611b265780820380516001836020036101000a031916815260200191505b5083810382526000815260200160200194505050505060405180910390a150565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515611ba257600080fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614151515611bde57600080fd5b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b60025434141515611c3157600080fd5b600354600454101515611c4357600080fd5b611c4c336118af565b151515611c5857600080fd5b60046000815480929190600101919050555033600d6000600454815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506080604051908101604052808281526020013373ffffffffffffffffffffffffffffffffffffffff16815260200160001515815260200160001515815250600c60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000820151816000019080519060200190611d57929190611de5565b5060208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060408201518160010160146101000a81548160ff02191690831515021790555060608201518160010160156101000a81548160ff02191690831515021790555090505050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10611e2657805160ff1916838001178555611e54565b82800160010185558215611e54579182015b82811115611e53578251825591602001919060010190611e38565b5b509050611e619190611e65565b5090565b611e8791905b80821115611e83576000816000905550600101611e6b565b5090565b905600a165627a7a72305820f861ace657b3f38eb82ec8c7a6f61ffe7e05549b0bef82047c0a6c8421b5fd150029';
    var gas = 2700000;
    var fee = 2060020000000000;
    AppService.contractNew(param,abi,code,gas,fee).then(function (res){
        console.log(res);
    }, function(err){
        var alertPopup = $ionicPopup.show({
          title: 'Error',
          template: 'Something is wrong! <br/>' + err.message   
        });

        alertPopup.then(function(res) {
           alertPopup.close();
        });
      
        $timeout(function() {
           alertPopup.close(); 
        }, 3000);

    });
  }

  $scope.deployTest = function(){
    var myPopup = $ionicPopup.prompt({
      title: 'Deploy your Greet',
      subTitle: 'Enter your greet message',
      inputType: 'text',
      inputPlaceholder: 'type a greet...'
    }).then(function(res) {
      console.log('Your message is', res);
      if(res){
        var param = [res];
        var abi = [{"constant":false,"inputs":[],"name":"destroy","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getMsg","outputs":[{"name":"r","type":"string"}],"payable":false,"type":"function"},{"inputs":[{"name":"m","type":"string"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"message","type":"string"}],"name":"Log","type":"event"}];
        var code = '0x6060604052341561000c57fe5b6040516103aa3803806103aa833981016040528080518201919050505b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508060019080519060200190610080929190610088565b505b5061012d565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106100c957805160ff19168380011785556100f7565b828001600101855582156100f7579182015b828111156100f65782518255916020019190600101906100db565b5b5090506101049190610108565b5090565b61012a91905b8082111561012657600081600090555060010161010e565b5090565b90565b61026e8061013c6000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806383197ef014610046578063b5fdeb2314610058575bfe5b341561004e57fe5b6100566100f1565b005b341561006057fe5b610068610185565b60405180806020018281038252838181518152602001915080519060200190808383600083146100b7575b8051825260208311156100b757602082019150602081019050602083039250610093565b505050905090810190601f1680156100e35780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561018257600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b565b61018d61022e565b60018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156102235780601f106101f857610100808354040283529160200191610223565b820191906000526020600020905b81548152906001019060200180831161020657829003601f168201915b505050505090505b90565b6020604051908101604052806000815250905600a165627a7a72305820da3a000078a8eaf2f978db0e1f347a381c9e29bf60d6d245e3a65c51b642be130029';
        var gas = 4700000;
        var fee = 1060020000000000;
        AppService.contractNew(param,abi,code,gas,fee).then(function (res){
            console.log(res);
        }, function(err){
            var alertPopup = $ionicPopup.show({
              title: 'Error',
              template: 'Something is wrong! <br/>' + err.message   
            });

            alertPopup.then(function(res) {
               alertPopup.close();
            });
          
            $timeout(function() {
               alertPopup.close(); 
            }, 3000);
        });
      }
    });

  }

  $scope.tesdeploy = function(){
    var abi = [{"constant":false,"inputs":[],"name":"destroy","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getMsg","outputs":[{"name":"r","type":"string"}],"payable":false,"type":"function"},{"inputs":[{"name":"m","type":"string"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"message","type":"string"}],"name":"Log","type":"event"}];
    var addr = "0xf76a7beffecee307fd6c51206b38ba57433fe36b"; //"0x327104dafb98dcd577efaee44528838cf8859643";
    var dappContract = web3.eth.contract(abi).at(addr);
    console.log(dappContract.getMsg());

    var alertPopup = $ionicPopup.show({
      title: 'Greet',
      template: 'Your Dappleth says <br/><b>' + dappContract.getMsg()  + '</b>' 
    });

    alertPopup.then(function(res) {
       alertPopup.close();
    });

    $ionicListDelegate.closeOptionButtons();

   $timeout(function() {
       alertPopup.close(); 
    }, 3000);
    
  }

  $scope.checkContract = function(hash){
    if(web3.eth.getTransactionReceipt(hash))
      $scope.newContract = web3.eth.getTransactionReceipt(hash).contractAddress;
  }

  function keyboardShowHandler(e){
    //patch on open
    
    if($ionicHistory.currentView().stateName== "tab.chats"){
      $scope.scrollTo('chatScroll','bottom');
      //$rootScope.hideTabs = 'tabs-item-hide';
    }

    if($ionicHistory.currentView().stateName== "tab.friend"){
      $scope.scrollTo('chatDMScroll','bottom');
      //$rootScope.hideTabs = 'tabs-item-hide';
    }
  }

  function keyboardHideHandler(e){
    if($ionicHistory.currentView().stateName== "tab.chats"){
      $scope.scrollTo('chatScroll','bottom');
    }

    if($ionicHistory.currentView().stateName== "tab.friend"){
      $scope.scrollTo('chatDMScroll','bottom');
    }
  }

  window.addEventListener('native.keyboardshow', keyboardShowHandler);     
  window.addEventListener('native.keyboardhide', keyboardHideHandler);     

  
  var flushChats = function(){
    //Flush chat messages
    Chat.flush();
    $scope.DMchats = Chat.findDM(); 
    $scope.chats = Chat.find();
    //$scope.DAPPchats = Chat.findDAPP(); 
  }

  window.resetChatFilter = function(){
    //stop listening shh
    Chat.unlistenMessage();
    //Flush chat messages
    flushChats();
  }

  window.setChatFilter = function(){
    //start listening message shh
    Chat.listenMessage($scope);
  }

  $scope.loadFriends = function(){
    $scope.friends = Friends.all();
  }
  
  window.customPasswordProvider = function (callback) {
    var pw;
    PasswordPopup.open("Digit your wallet password", "unlock account to proceed").then(
      function (result) {
        pw = result;
        if (pw != undefined) {
          try {
            callback(null, pw);

          } catch (err) {
            var alertPopup = $ionicPopup.alert({
              title: 'Error',
              template: err.message

            });
            alertPopup.then(function (res) {
              console.log(err);
            });
          }
        }
      },
      function (err) {
        pw = "";
      })
  };
  

  $scope.openInEtherscan = function(path,addr){
    var etherscanUrl;
    if($scope.nameNetwork=="Ropsten")
      etherscanUrl="https://ropsten.etherscan.io/" + path +"/";
    if($scope.nameNetwork=="Mainet")
      etherscanUrl="https://etherscan.io/" + path +"/";
    
    var pinUrl = etherscanUrl + addr;    
      var options = {
        location: 'yes',
        clearcache: 'yes',
        toolbar: 'yes'
      };

      if (AppService.isPlatformReady()){
        $cordovaInAppBrowser.open(pinUrl, '_system', options)
          .then(function(event) {
            // success
          })
          .catch(function(event) {
            // error
          }); 
      }
  }

  var getSync = function(){
    if(!web3.currentProvider) return;

    try {    
        if(web3.eth.syncing)
          $scope.syncStatus = "icon ion-eye-disabled ";
        else
          $scope.syncStatus = "icon ion-eye ";

        $scope.lastBlock = web3.eth.blockNumber;
    } catch (err) {
      var alertPopup = $ionicPopup.show({
        title: 'Error',
        template: 'Something is wrong! <br/>' + err.message   
      });

      alertPopup.then(function(res) {
         alertPopup.close();
      });
    
      $timeout(function() {
         alertPopup.close();
      }, 3000);
    }
  }

  $scope.infoSync = function(){
     var alertPopup = $ionicPopup.alert({
        title: 'Info Sync Node',
        template: web3.eth.syncing=='false' ? 'Sync status: OK' : 'Sync status: progress' + '<br/>BlockNumber: ' + web3.eth.blockNumber + '<br/>Network: ' + $scope.nameNetwork
      });

      alertPopup.then(function(res) {
        
      });
  }

  $scope.readCategoryList = function(){
    AppService.getStoreCategories($scope.nameNetwork).then(function(response){
      $scope.listCategory = response;
    }) 
  };

  $scope.readDappsList = function(){
    $scope.filterStoreCoins = 'button button-small button-outline button-positive';
    $scope.filterStoreApps = 'button button-small button button-positive';
    $scope.isDapp = true;
    $scope.isCoin = false;

    AppService.getStoreApps($scope.nameNetwork).then(function(response){
      $scope.listApps = response;
    }) 

  }; 

  $scope.readCoinsList = function(){
    $scope.filterStoreCoins = 'button button-small button button-positive';
    $scope.filterStoreApps = 'button button-small button-outline button-positive';
    $scope.isDapp = false;
    $scope.isCoin = true;

    AppService.getAllTokens($scope.nameNetwork).then(function(response){
      $scope.listTokens = response;
    }, function(err){
      $scope.listTokens=null;
    });

    /*
    $scope.listTokens = AppService.getLocalCoins($scope.nameNetwork);
    AppService.getStoreCoins($scope.nameNetwork).then(function(response){
      angular.merge($scope.listTokens,response);
    }) 
    */
  };      

  $scope.shareByChat = function (friend,payment) {
    Chat.sendCryptedPaymentReq("Please send me " + payment + " eth &#x1F4B8; !", payment, friend.addr,friend.idkey);
    $state.go('tab.friend', {Friend: friend.addr});
  };

 $scope.inviteFriend = function (friend,param) {
    Chat.sendInviteToDapp(param,friend.addr,friend.idkey);
    $ionicLoading.show({ template: "Done!", noBackdrop: true, duration: 2000 })
    
  };

  var codeModal;
  var createCodeModal = function() {
    $ionicModal.fromTemplateUrl('templates/changeCode.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      codeModal = modal;
      codeModal.show();
    });
  };
  $scope.openChangeCodeModal = function () {
    createCodeModal();
  };
  $scope.closeChangeCodeModal = function () {
    codeModal.hide();
  };

  var saveAddressModal;
  var createSaveAddressModal = function(name,comment,address,key) {
    $ionicModal.fromTemplateUrl('templates/addFriend.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      if(name != undefined) {
        $scope.name = name;
      }
      if(comment != undefined) {
        $scope.comment = comment;
      }
      if(address != undefined) {
        $scope.addr = address;
      }
      if(key != undefined) {
        $scope.idkey = key;
      }

      saveAddressModal = modal;
      saveAddressModal.show();
    });
  };

  var addrsModal;
  $scope.openFriendsModal = function (param) {
    createModalFriends(param);
  };
  $scope.closeFriendsModal = function () {
    addrsModal.hide();
    addrsModal.remove();
  };
  var createModalFriends = function(param) {
    $scope.param = param;
    $ionicModal.fromTemplateUrl('templates/addressbook.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      addrsModal = modal;
      addrsModal.show();
    });
  };
  $scope.chooseFriend = function (friend) {
    if($ionicHistory.currentStateName()=="tab.wallet"){
     $scope.addrTo = friend.addr;
    }
    if($ionicHistory.currentStateName()=="tab.address")
      $scope.shareByChat(friend, $scope.param);
    if($ionicHistory.currentStateName()=="tab.dappleths")
      $scope.shareCustomToken(friend, $scope.param);
    if($ionicHistory.currentStateName() == "tab.dappleth-run"){
      if($scope.param.action=="invite")
        $scope.inviteFriend(friend, $scope.param);
    }

    $scope.closeFriendsModal();
  };

  var tokenModal;
  $scope.openTokenModal = function () {
    createModalToken();
  };
  $scope.closeTokenModal = function () {
    tokenModal.hide();
    tokenModal.remove();
  };
  var createModalToken = function() {
    $ionicModal.fromTemplateUrl('templates/token.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      tokenModal = modal;
      tokenModal.show();
    });
  };

  var loadTokenData=function(contractAddress){
      var addr = AppService.account();
      //ERC20Abi
      var abi = [{"constant": true,"inputs": [],"name": "name","outputs": [{"name": "","type": "string"}],"payable": false,"type": "function"},{"constant": false,"inputs": [{"name": "_spender","type": "address"},{"name": "_value","type": "uint256"}],"name": "approve","outputs": [{"name": "success","type": "bool"}],"payable": false,"type": "function"},{"constant": true,"inputs": [],"name": "totalSupply","outputs": [{"name": "","type": "uint256"}],"payable": false,"type": "function"},{"constant": false,"inputs": [{"name": "_from","type": "address"},{"name": "_to","type": "address"},{"name": "_value","type": "uint256"}],"name": "transferFrom","outputs": [{"name": "success","type": "bool"}],"payable": false,"type": "function"},{"constant": true,"inputs": [],"name": "decimals","outputs": [{"name": "","type": "uint8"}],"payable": false,"type": "function"},{"constant": true,"inputs": [],"name": "version","outputs": [{"name": "","type": "string"}],"payable": false,"type": "function"},{"constant": true,"inputs": [{"name": "_owner","type": "address"}],"name": "balanceOf","outputs": [{"name": "balance","type": "uint256"}],"payable": false,"type": "function"},{"constant": true,"inputs": [],"name": "symbol","outputs": [{"name": "","type": "string"}],"payable": false,"type": "function"},{"constant": false,"inputs": [{"name": "_to","type": "address"},{"name": "_value","type": "uint256"}],"name": "transfer","outputs": [{"name": "success","type": "bool"}],"payable": false,"type": "function"},{"constant": false,"inputs": [{"name": "_spender","type": "address"},{"name": "_value","type": "uint256"},{"name": "_extraData","type": "bytes"}],"name": "approveAndCall","outputs": [{"name": "success","type": "bool"}],"payable": false,"type": "function"},{"constant": true,"inputs": [{"name": "_owner","type": "address"},{"name": "_spender","type": "address"}],"name": "allowance","outputs": [{"name": "remaining","type": "uint256"}],"payable": false,"type": "function"},{"inputs": [{"name": "_initialAmount","type": "uint256"},{"name": "_tokenName","type": "string"},{"name": "_decimalUnits","type": "uint8"},{"name": "_tokenSymbol","type": "string"}],"type": "constructor"},{"payable": false,"type": "fallback"},{"anonymous": false,"inputs": [{"indexed": true,"name": "_from","type": "address"},{"indexed": true,"name": "_to","type": "address"},{"indexed": false,"name": "_value","type": "uint256"}],"name": "Transfer","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "_owner","type": "address"},{"indexed": true,"name": "_spender","type": "address"},{"indexed": false,"name": "_value","type": "uint256"}],"name": "Approval","type": "event"}];

      var token = web3.eth.contract(abi).at(contractAddress);

      $scope.token.abi=token.abi;

      // Get the token name
      token.name.call(function(err, name) {
        if(err) { console.log(err) }
        if(name) { 
          console.log('The token name is: ' + name);
          $scope.token.name = name;
        }
      })

      token.decimals.call(function(err, decimals) {
        if(err) { console.log(err) }
        if(decimals) { 
          console.log('The decimals are: ' + decimals.toNumber()) 
          $scope.token.decimals = decimals.toNumber();
        }
      })

      // Get the token symbol
      token.symbol.call({from: addr}, function(err, symbol) {
        //ABI expects string here,
        if(err) { console.log(err) }
        if(symbol){
          console.log('Token symbol: ' + symbol)
          $scope.token.symbol = symbol;
        }
      })

      token.totalSupply.call({from: addr}, function(err, totalSupply) {
        console.log(totalSupply)
      })

      token.balanceOf.call(addr, function (err, bal) {
        if (err) { console.error(err) }
        console.log('balance is ' + bal.toString(10))
      })

      console.log($scope.token);

  }
  $scope.loadCustomToken = function(){
    $scope.token = {};

    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="token.address" autofocus="true">',
      title: 'ERC20 Token Address',
      subTitle: 'Enter contract token address',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Load</b>',
          type: 'button-balanced',
          onTap: function(e) {
            if (!$scope.token.address) {
              e.preventDefault();
            } else {
              return $scope.token.address;
            }
          }
        }
      ]
    });

    myPopup.then(function(res) {
      console.log('Tapped!', res);
      if(res){
        loadTokenData($scope.token.address);
        createModalToken();
      }
    });

  }

  $scope.addCustomToken = function (token) {
    var customToken = {
      "Name" : $scope.token.name,
      "GUID" : "C" + $scope.listTokens.length+1,
      "Network" : $scope.nameNetwork, 
      "Company" : $scope.token.company,
      "Logo" : $scope.token.logo,
      "Symbol" : $scope.token.symbol,
      "Decimals" : $scope.token.decimals,
      "Abstract" : $scope.token.abstract,
      "Address" : $scope.token.address,
      "ABI" : $scope.token.abi,
      "Send" : "transfer",
      "Events" : [{"Transfer":"address indexed from, address indexed to, uint256 value"}],
      "Units":[{"multiplier": "1", "unitName": "Token"}],
      "Custom" : true,
      "Installed" : true
    }

    $scope.listTokens.push(customToken);

    AppService.addLocalToken(customToken);

    $scope.closeTokenModal();
  };

  $scope.removeCustomToken = function (token) {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Delete Custom Token',
      template: 'Are you sure you want to delete this Token?'
    });

    confirmPopup.then(function(res) {
      if(res) {
        $scope.listTokens.splice($scope.listTokens.indexOf(token),1);
        AppService.deleteLocalToken(token);
      }
    
      $scope.readCoinsList();
      $ionicListDelegate.closeOptionButtons();
   });
   
  }

  $scope.shareCustomToken = function (friend,token) {
    Chat.sendCryptedCustomToken("Use this token " + token.Name + " !", token, friend.addr,friend.idkey);

    $ionicListDelegate.closeOptionButtons();
  }

  $scope.showCustomTokenInfo = function(param) {
    $scope.token = param;
    $ionicModal.fromTemplateUrl('templates/token-info.html', {
      scope: $scope,
      animation: 'slide-in-right'
    }).then(function (modal) {
      tokenModal = modal;
      tokenModal.show();
    });
  };

  $scope.isValidAddr = function(addr){
    if(addr){      
      if(typeof addr.split('.')[1] != 'undefined' && addr.split('.')[1]==ENSService.suffix){
        //not able to change addrTo scope wallet variable!
        addr = ENSService.getAddress(angular.lowercase(addr));
        $scope.ENSResolved = addr;
      } 
      else
        $scope.ENSResolved="";
    }

    if(!web3.isAddress(addr)) {return false};

    return true;
  };

  var isNfcAvailable = function(){
    if (AppService.isPlatformReady()){
    
      try{
        nfc.enabled(function(){
          $scope.nfcAvailable = true;
        },function(e){
          var ermsg;
          if(e === "NO_NFC")
            $scope.nfcAvailable = false;
          if(e === "NO_DISABLED"){
            ermsg='Not enabled on Device!'
          } else{
            ermsg = e;
            $scope.nfcAvailable = false;        
          }
          if(!ermsg){   
            var alertPopup = $ionicPopup.show({
              title: 'NFC Error',
              template: ermsg   
            });

            alertPopup.then(function(res) {
               alertPopup.close();
            });

            $timeout(function() {
               alertPopup.close(); 
            }, 3000);
          }
        })
      }catch(e){
      }
    }
    
    return false;
  };
  

  $scope.scanTo = function () {
    if (AppService.isPlatformReady()){
      $cordovaBarcodeScanner
      .scan()
      .then(function (barcodeData) {
        if(barcodeData.text!= ""){
          $state.go('tab.wallet', {addr: barcodeData.text});
          console.log('read code: ' + barcodeData.text);
        }
      }, function (error) {
        // An error occurred
        console.log('Error!' + error);
      });
    }
  };

  $scope.lat = "N/A";
  $scope.long = "";
  $scope.geoWatch;    
  
  $scope.watchLocation = function(){
    $scope.geoWatch = Geolocation.watchPosition();
    $scope.geoWatch.then(
      null,
      function (err) {
        //console.log(err);
        $scope.geoWatch.clearWatch();
        $scope.watchLocation();
      },
      function (position) {
        console.log(position);
        $scope.lat  = position.coords.latitude.toFixed(4);
        $scope.long = position.coords.longitude.toFixed(4);
        //Chat.sendPosition(position);
      });
  }
  

  $scope.sendFeedback = function(){
    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: '<i class="ion-sad-outline"></i> Poor'  },
        { text: '<i class="ion-happy-outline"></i> Good' },
        { text: '<i class="ion-help-buoy"></i> Make donation' }

      ],
      destructiveText: (ionic.Platform.isAndroid()?'<i class="icon ion-android-exit assertive"></i> ':'')+'Cancel',
      titleText: 'Send your mood to Inzhoop',
      destructiveButtonClicked:  function() {
        hideSheet();
      },
      buttonClicked: function(index) {
        if(index==2){
            $state.go('tab.wallet', {addr: "0xd1324ada7e026211d0cacd90cae5777e340de948"});
        }else{
          var mood = index == 0 ? "Poor" : "Good";
          $cordovaEmailComposer.isAvailable().then(function() {
            var emailOpts = {
              to: ['info@inzhoop.com'],
              subject: 'Feedback  from LETH',
              body: 'The user ' + $scope.account + ' said: ' +  mood,
              isHtml: true
            };

            $cordovaEmailComposer.open(emailOpts).then(null, function () {
              console.log('email view dismissed');
            });

            hideSheet();
            return;
          }, function (error) {
            console.log("cordovaEmailComposer not available");
            return;
          });
        }
       // For example's sake, hide the sheet after two seconds
       $timeout(function() {
         hideSheet();
        }, 20000);
      }
    })
  };



  $scope.scanAddr = function () {
    if (AppService.isPlatformReady()){
     $cordovaBarcodeScanner
      .scan()
      .then(function (barcodeData) {
        $scope.addr = barcodeData.text.split('#')[0];
        $scope.idkey = barcodeData.text.split('#')[1];
        console.log('Success! ' + barcodeData.text);
      }, function (error) {
        // An error occurred
        console.log('Error!' + error);
      });
    }
  };

  $scope.exitApp = function () {
    ionic.Platform.exitApp();
  };

  $scope.createWallet = function (seed, password, code) { 
    if(!lightwallet.keystore.isSeedValid(seed)){
      var alertPopup = $ionicPopup.alert({
        title: 'Invalid Seed',
        template: 'The Seed provided is not valid!'
      });

      alertPopup.then(function(res) {
        createEntropyModal();
      });
    }else{
      var infoPopup = $ionicPopup.alert({
        title: 'Creating wallet...',
        template: 'The process can take a while (about 2 minutes), please wait until the end of loading!'  
      });

      infoPopup.then(function(res) {
        $ionicLoading.show();
         //register inzhoop user in addressbook
        var usrInzhoop = {"addr":"0xd1324ada7e026211d0cacd90cae5777e340de948","idkey":"0xc34293fdf389d8d5c0dd852d0e858576d367342777a57347e2407f64b1446b1c","name":"inzhoop","icon":"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAAgACADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD7M8D+B/8AhDPtv/E0+2fbPL/5YeXs2bv9o5zu/SuW/wCSM/8AUY/tj/t38ryv++92fN9sY754x/2kP2b/APhoP/hHf+Kz/sD+wPtf/MO+1ed5/k/9NU27fJ987u2OeW+LHxY/4ZK/sr/iQf8ACVf8JV5//L19h+zfZvL/ANiXfu+0f7ONnfPH5NkeZ/257arjcT9axGK5faYXk9n7X2d1D9+kow5IpVPdtzW5HdsvM8t/s72NLBUfY06PNyV+bn9nz2cv3bbc+dtw1vy35lax6D/yWb/qD/2P/wBvHm+b/wB8bceV75z2xz1PjjwP/wAJn9i/4mn2P7H5n/LDzN+/b/tDGNv614r8J/ix/wANa/2r/wASD/hFf+EV8j/l6+3faftPmf7EWzb9n/2s7+2Oep/Zv/Zv/wCGfP8AhIv+Kz/t/wDt/wCyf8w77L5Pked/01fdu872xt754M8zP+w/Y1cFifquIwvN7PC8ntPZe0sp/v2nGfPFup71+W/IrNBlmW/2j7aljaPtqdbl56/Nye05LuP7tNOHI0oaW5rczvc5b9sj4sf8Kv8A+EQ/4kH9p/2n/aH/AC9eT5fl/Z/9hs58z2xj3rz7/lH1/wBT7/wnv/cL+xfYf+//AJm/7Z/s7fL/AIt3HoP7ZHxY/wCFX/8ACIf8SD+0/wC0/wC0P+XryfL8v7P/ALDZz5ntjHvXlnwn+LH/AAtD+1f+JB/Zn9meR/y9ed5nmeZ/sLjHl++c+1fdcF5DHiThfAYPEV7UF7Xnpcvx/vJOPvpqUeWS5tHrs9D5ziPNZ5FnGKxdHD3m+S1Tn291J+6007p8u2m5pf8AKQX/AKkL/hAv+4p9t+3f9+PL2fY/9rd5n8O3n0H9jf4sf8LQ/wCEv/4kH9mf2Z/Z/wDy9ed5nmfaP9hcY8v3zn2ryz4sfFj/AIVf/ZX/ABIP7T/tPz/+XryfL8vy/wDYbOfM9sY969T/AGN/ix/wtD/hL/8AiQf2Z/Zn9n/8vXneZ5n2j/YXGPL9859qONMhjw3wvj8Hh696D9lyUuX4P3kXL323KXNJ82r02WgcO5rPPc4wuLrYe01z3qc+/utL3UklZLl213P/2Q==","unread":0}
        $scope.friends.push(usrInzhoop);

        var opts={}; //option for wallet creation
        if($scope.legacy){
          opts={
            password: password,
            seedPhrase: seed
          }
        }else{
          opts={
            password: password,
            seedPhrase: seed,
            hdPathString: hdPath2
          }
        }
        
        lightwallet.keystore.createVault(opts, function (err, ks) {
          ks.keyFromPassword(password, function (err, pwDerivedKey) {
            if (err) throw err;
            ks.generateNewAddress(pwDerivedKey, 1);

            ks.passwordProvider = customPasswordProvider;

            global_keystore = ks;

            //add keystore for encryption
            lightwallet.keystore.deriveKeyFromPassword(code, function (err, pw2DerivedKey) {
              local_keystore = new lightwallet.keystore(seed, pw2DerivedKey,hdPath);
              var info={curve: 'curve25519', purpose: 'asymEncrypt'};
              local_keystore.passwordProvider = code; //customPasswordProvider;
              local_keystore.addHdDerivationPath(hdPath,pw2DerivedKey,info);
              local_keystore.generateNewEncryptionKeys(pw2DerivedKey, 1, hdPath);
              local_keystore.setDefaultHdDerivationPath(hdPath);
            

              AppService.setWeb3Provider(global_keystore);

              localStorage.AppKeys = JSON.stringify({data: global_keystore.serialize()});
              localStorage.EncKeys = JSON.stringify({data: local_keystore.serialize()});
              localStorage.AppCode = JSON.stringify({code: code});
              localStorage.HasLogged = JSON.stringify(true);
              localStorage.Transactions = JSON.stringify({});
              localStorage.Friends = JSON.stringify($scope.friends);

              $rootScope.hasLogged = true;

              var msg = 'new user added';
              Chat.sendMessage(msg);
              
              refresh();
              setChatFilter();
              $state.go('tab.dappleths');

            });

          });
        });
        
      });
      
      $timeout(function() {
         infoPopup.close(); 
      }, 5000);
    }
  };

  $scope.ChangeCode = function(oldCode, newCode) {
    if(code !== newCode && code === oldCode) {
     code = newCode;
     localStorage.AppCode = JSON.stringify({code: code});
      codeModal.hide();
      codeModal.remove();
    }
  };

  $scope.refresh = function () {
    refresh();
    $scope.$broadcast('scroll.refreshComplete');
  };

  $scope.addAddress = function(name,comment,address,key) {
    createSaveAddressModal(name,comment,address,key);
  }

  $scope.closeSaveAddressModal = function() {
    $scope.name = "";
    $scope.addr = "";
    $scope.comment ="";
    $scope.idkey = "";
    saveAddressModal.remove();
  }

  $scope.isFriend = function(address) {
    var res = Friends.get(address);
    if(address == AppService.account())
        return "me" ; 
    if(res==undefined)
      return "";
    else         
      return res.name ;
  }

  $scope.saveAddr = function(name,addr,idkey,comment){
    if($scope.isValidAddr(addr)){
      if($scope.isFriend(addr))
        Friends.update(name,addr,idkey,comment);
      else
        Friends.add(name,addr,idkey,comment);      
    }
    
    $scope.closeSaveAddressModal(); 
    $scope.friends = Friends.all();
  };
  
  console.log("status login: " + $rootScope.hasLogged)

  //shake start
  // Watcher object
  $scope.watch = null;
  $scope.randomString="";
  $scope.shakeCounter=3;

  // watch Acceleration options
  $scope.options = { 
      frequency: 500, // Measure every 100ms
      deviation : 30  // We'll use deviation to determine the shake event, best values in the range between 25 and 30
  };
  // Current measurements
  $scope.measurements = {
      x : null,
      y : null,
      z : null,
      timestamp : null
  }
  // Previous measurements    
  $scope.previousMeasurements = {
      x : null,
      y : null,
      z : null,
      timestamp : null
  }   
  
  var hashCode = function(text) {
    var hash = 0, i, chr, len;
    if (text.length === 0) return hash;
    for (i = 0, len = text.length; i < len; i++) {
      chr   = text.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };

  var startWatching = function() { 
    if (AppService.isPlatformReady()){
      $scope.watch = $cordovaDeviceMotion.watchAcceleration($scope.options);
      $scope.watch.then(null, function(error) {
          console.log('Error');
      },function(result) {
          // Set current data  
          $scope.measurements.x = result.x;
          $scope.measurements.y = result.y;
          $scope.measurements.z = result.z;
          $scope.measurements.timestamp = result.timestamp;  
          // Detecta shake  
          detectShake(result);   
      });   
    };
  };       

  var stopWatching = function() {  
      $scope.watch.clearWatch();      
  }       

  var detectShake = function(result) {  
    var measurementsChange = {};
    // Calculate measurement change only if we have two sets of data, current and old
    if ($scope.previousMeasurements.x !== null) {
        measurementsChange.x = Math.abs($scope.previousMeasurements.x, result.x);
        measurementsChange.y = Math.abs($scope.previousMeasurements.y, result.y);
        measurementsChange.z = Math.abs($scope.previousMeasurements.z, result.z);
    }

    if (measurementsChange.x + measurementsChange.y + measurementsChange.z > $scope.options.deviation) {
        stopWatching();  // Stop watching because it will start triggering like hell
        console.log('Shake detected'); 
        $scope.classShake = "shakeit";       
        $scope.shakeCounter--;

        if ($scope.shakeCounter>0)
         setTimeout(startWatching(), 800);  // Again start watching after 1 sec

        $scope.randomString+=result.x+result.y+result.z;

        // Clean previous measurements after succesfull shake detection, so we can do it next time
        $scope.previousMeasurements = { 
            x: null, 
            y: null, 
            z: null
        } 

       if($scope.shakeCounter==0){
          $scope.randomString = hashCode($scope.randomString);
          $scope.goLogin($scope.randomString);
        }

    } else if (measurementsChange.x + measurementsChange.y + measurementsChange.z > $scope.options.deviation/2) {
        $scope.classShake = "shakeit"; 
        $scope.previousMeasurements = {
            x: result.x,
            y: result.y,
            z: result.z
        }
    } else {
      // On first measurements set it as the previous one
      $scope.classShake = ""; 
      $scope.previousMeasurements = {
          x: result.x,
          y: result.y,
          z: result.z
      }
    }           
  }        

  $scope.$on('$ionicView.beforeLeave', function(){
      if($scope.watch != undefined)
        $scope.watch.clearWatch(); 
  }); 

  var entropyModal;
  var createEntropyModal = function () {
    $ionicModal.fromTemplateUrl('templates/entropy.html', {
      scope: $scope,
      animation: 'slide-in-down',
      backdropClickToClose: false,
      hardwareBackButtonClose: false
    }).then(function (modal) {
      entropyModal = modal;
      entropyModal.show();
      startWatching();
    });
  };
  var closeEntropyModal = function () {
    entropyModal.hide();
  };

  var loginModal;
  var createLoginModal = function() {
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope,
      animation: 'slide-in-right',
      backdropClickToClose: false,
      hardwareBackButtonClose: false
    }).then(function (modal) {
      loginModal = modal;
      loginModal.show();
    });
  };
  $scope.openLoginModal = function () {
    loginModal.show();
  };
  $scope.closeLoginModal = function () {
    loginModal.hide();
  };

  var imageModal;
  var createImageModal = function(img) {
    $scope.imageSrc  = img;
    $ionicModal.fromTemplateUrl('templates/image-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      imageModal = modal;
      imageModal.show();
    });
  }

  $scope.openModalIMG = function(img) {
    $scope.imageSrc = img;
    imageModal.show();
  };

  $scope.closeModalIMG = function() {
    imageModal.hide();
  };

  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    imageModal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modalIMG.hide', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modalIMG.removed', function() {
    // Execute action
  });
  $scope.$on('modalIMG.shown', function() {
    //console.log('Modal is shown!');
  });

  $scope.goLogin = function(random){
    closeEntropyModal();
    // create keystore and account and store them
    var extraEntropy = random.toString();
    $scope.randomSeed = lightwallet.keystore.generateRandomSeed(extraEntropy);
    createLoginModal();
  }

  $scope.setLegacy = function(value) {
    $scope.legacy = value;
  };

  $scope.restoreLogin = function(seed){
    closeEntropyModal();
    // restore keystore from seed 
    $scope.randomSeed = seed;
    createLoginModal();
  }

  $scope.Login = function (seed, pw, cod) { 
    var err;
    if(!lightwallet.keystore.isSeedValid(seed))
      err = "Seed not valid <br/>";
    if(!pw || pw.length<8 || pw.length>20)
      err = "Password not valid <br/>";
    if(!cod || cod.length!=4)
      err = "Code not valid <br/>";

    if(err){
      var alertPopup = $ionicPopup.show({
        title: 'Error',
        template: 'Invalid data! <br/>' + err   
      });

      alertPopup.then(function(res) {
         alertPopup.close();
      });

      $timeout(function() {
         alertPopup.close(); 
      }, 3000);

    }else{
      $scope.createWallet(seed, pw, cod);
      $scope.closeLoginModal();      
    }
  };

  $scope.sendSeedByEmail = function(){
    if (AppService.isPlatformReady()){
      $cordovaEmailComposer.isAvailable().then(function() {
      var emailOpts = {
        to: [''],
        subject: 'Backup your Seed from LETH',
        body: 'Please write it down on paper or in a password manager, you will need it to access your keystore. Do not let anyone see this seed or they can take your Ether.<br/><br/>' + $scope.randomSeed,
        isHtml: true
      };

      $cordovaEmailComposer.open(emailOpts).then(null, function () {
        console.log('email view dismissed');
      });

      hideSheet();
      return;
      }, function (error) {
        console.log("cordovaEmailComposer not available");
        return;
      }); 
    };
  };

  $scope.installDapp = function(id) {
    var dappToInstall = $scope.listApps.filter( function(app) {return app.GUID==id;} )[0];

    if (AppService.isPlatformReady()){
      var directoryTemplate=cordova.file.dataDirectory;
      if(ionic.Platform.isAndroid()) {
        directoryTemplate = cordova.file.externalDataDirectory;
      }
      var templateName = dappToInstall.GUID + ".html";
      var templateContent ="";

      $http.get(dappToInstall.TemplateUrl) 
      .success(function(data){
        templateContent =  $sce.trustAsHtml(data);

        angularLoad.loadScript(dappToInstall.ScriptUrl).then(function() {
            console.log('loading ' + dappToInstall.ScriptUrl);
        }).catch(function() {
              console.log('ERROR :' + dappToInstall.ScriptUrl);
          });
      });

      $cordovaFile.writeFile(directoryTemplate,
                             templateName,
                             templateContent,
                             true)
        .then(function (success) {
          localStorage.DAppleths.push(dappToInstall);

          var alertPopup = $ionicPopup.alert({
            title: 'Install Dappleth',
              template: 'Dappleth ' + dappToInstall.Name + ' installed successfully!'
          });

          alertPopup.then(function(res) {
            console.log('dappleth ' + dappToInstall.Name + ' installed');
          });
        }, function () {
        // not available
      });
    };
  }

  $scope.readDapp = function(filename){
    if (AppService.isPlatformReady()){
      var directoryTemplate=cordova.file.dataDirectory;
      if(ionic.Platform.isAndroid()) {
        directoryTemplate = cordova.file.externalDataDirectory;
      }
      $cordovaFile.readAsText(directoryTemplate, filename)
        .then(function (success) {
          // success
          return $sce.trustAsHtml(success);
          console.log('read successfully');
        }, function (error) {
          // error
          console.log(error);
      });
    };
  }
  //init
  $scope.friends = [];    
  $scope.transactions = Transactions.all();

  $scope.currencies = ExchangeService.getCurrencies();
  $scope.xCoin = "XETH";
  
  if($rootScope.hasLogged ){
    var ls = JSON.parse(localStorage.AppKeys);
    var ks = JSON.parse(localStorage.EncKeys);
    code = JSON.parse(localStorage.AppCode).code;
    $scope.transactions = JSON.parse(localStorage.Transactions);

    global_keystore = new lightwallet.keystore.deserialize(ls.data);
    global_keystore.passwordProvider = customPasswordProvider;

    local_keystore = new lightwallet.keystore.deserialize(ks.data);
    local_keystore.passwordProvider = customPasswordProvider; //to verify

    AppService.setWeb3Provider(global_keystore);
    $scope.qrcodeString = AppService.account();

  setChatFilter();


  }else{
    createEntropyModal();
  }

  /**
  ** CHATS section
  */
  $scope.msgCounter = 0;
  $scope.DMCounter = 0;
  $scope.DMchats = Chat.findDM(); 
  //$scope.DAPPchats = Chat.findDAPP(); 
  $scope.chats = Chat.find(); 

  $scope.setBadge = function(value) {
    if (AppService.isPlatformReady()){
      $cordovaBadge.hasPermission().then(function(result) {
          $cordovaBadge.set(value);
      }, function(error) {
          console.log(error);
      });
    };
  }

  $scope.increaseBadge = function() {
    if (AppService.isPlatformReady()){
      $cordovaBadge.hasPermission().then(function(result) {
          $cordovaBadge.increase();
      }, function(error) {
          console.log(error);
      });
    };
  }

  $scope.clearBadge = function() {
    if (AppService.isPlatformReady()){
      $cordovaBadge.hasPermission().then(function(result) {
          $cordovaBadge.clear();
      }, function(error) {
          console.log(error);
      });
    };
  }

  $scope.scheduleSingleNotification = function (title, text, id) {
    if (AppService.isPlatformReady()){
      $cordovaLocalNotification.schedule({
          id: id,
          //title: title,
          text: text
        }).then(function (result) {
          //console.log('Notification 1 triggered');
        });
    };
  };

  $scope.scrollTo = function(handle,where){
    $timeout(function() {
      $ionicScrollDelegate.$getByHandle(handle).resize();
      $ionicScrollDelegate.$getByHandle(handle).scrollTo(where,350);
    }, 1000);

  }

  $scope.chooseAction = function(msg){
    var buttonsOpt= [{ text: '<i class="icon ion-ios-copy-outline"></i> Copy message', index: 1 }];

    if((msg.mode=='plain' || msg.mode=="contact") && msg.from && msg.senderKey){
      if($scope.isFriend(msg.from) && msg.from!=AppService.account())
        buttonsOpt.push({ text: '<i class="icon ion-ios-person-outline"></i>Go to Friend', index: 2 })
      else if(msg.from!=AppService.account()){
        buttonsOpt.push({ text: '<i class="icon ion-ios-personadd-outline"></i>Add to Friends', index: 3 })
      }
    }
    if(msg.mode=="geolocation" && msg.attach)
      buttonsOpt.push({ text: '<i class="icon ion-ios-navigate-outline"></i>Open location', index: 4 });
    if(msg.mode=="payment" && msg.attach)
      buttonsOpt.push({ text: '<i class="icon icon-wallet"></i>Pay request', index: 5 });
    if(msg.mode=="token" && msg.attach)
      buttonsOpt.push({ text: '<i class="icon ion-ios-circle-outline"></i>Install token', index: 6 });

    if(msg.image){
        buttonsOpt.push({ text: '<i class="icon ion-image"></i>Show Image', index: 7 })
    }
    //ban spammers
    if(msg.from!=AppService.account())
      buttonsOpt.push({ text: '<i class="icon ion-android-hand"></i>Ban User...', index: 8 })

    var hideSheet = $ionicActionSheet.show({
      buttons: buttonsOpt,
      destructiveText: (ionic.Platform.isAndroid()?'<i class="icon ion-android-exit assertive"></i> ':'')+'Cancel',
      titleText: 'Choose an action',
      destructiveButtonClicked:  function() {
        hideSheet();
      },
      buttonClicked: function(index) {
        switch(this.buttons[index].index){
          case 1: //copy message
            if (AppService.isPlatformReady()){
              if(msg.image){
                $cordovaClipboard.copy(msg.image).then(function () {
                  // success
                }, function () {
                  // error
                });
              }else{
                $cordovaClipboard.copy(msg.text).then(function () {
                    // success
                }, function () {
                    // error
                });
              }
            };
            break;
          case 2: //go to friend
            $state.go('tab.friend', {Friend: msg.from}, { relative: $state.$current.view});
            break;
          case 3: // add to friends
            $scope.addAddress(msg.from, msg.text, msg.from,msg.senderKey)
            break;
          case 4: // open location
            var pinUrl = "https://www.google.com/maps/place/" + msg.attach.latitude + "," + msg.attach.longitude
      
            var options = {
              location: 'yes',
              clearcache: 'yes',
              toolbar: 'yes'
            };

            if (AppService.isPlatformReady()){
              $cordovaInAppBrowser.open(pinUrl, '_blank', options)
                .then(function(event) {
                  // success
                })
                .catch(function(event) {
                  // error
                });
            };
            break;
          case 5: // pay request
            $state.go('tab.wallet', {addr: msg.from + "#" + msg.senderKey + "@" + msg.attach.payment}, { relative: $state.$current.view});
            break;
          case 6: // install token
            var msgTxt = "<h2 class='text-center'>Custom Token " + msg.attach.Name + " Shared! </h2>";
            msgTxt += "<p class='text-center'><img height='100px' width='auto' src='" + msg.attach.Logo + "'/></p>";
              
            var confirmPopup = $ionicPopup.confirm({
              title: 'Install Custom Token',
              template: 'A new Token shared with you!<br/>Do you want to add ' + msg.attach.Name + '?'
            });

            confirmPopup.then(function(res) {
              if(res) {
                if($scope.listTokens.indexOf(msg.attach)==-1)
                  $scope.listTokens.push(msg.attach);
                localStorage.listTokens = JSON.stringify($scope.listTokens);
                $state.go('tab.dappleths', { relative: $state.$current.view});
               }
            });
            break;
          case 7: // show image
            createImageModal(msg.image);
            break;
          case 8: // ban user
            var confirmBan = $ionicPopup.confirm({
              title: 'Block User',
              template: 'User gives you noise? <br/>Do you want to add to blacklist?'
            });

            confirmBan.then(function(res) {
              if(res) {
                //add user to black list
                if(!$scope.blacklisted.includes(msg.from)) {
                  var banned = {addr:msg.from, icon: blockies.create({seed: msg.from}).toDataURL("image/jpeg"),  date: Date.now(), comment: msg.text};
                  $scope.blacklisted.push(banned);
                  localStorage.Blacklist=JSON.stringify($scope.blacklisted);
                }
               }
            });
            break;

        }
        hideSheet();
       $timeout(function() {
         hideSheet();
        }, 20000);
      }
    });
  }

  $scope.chooseDappAction = function(dapp){
    var buttonsOpt= [{ text: '<i class="icon ion-android-share-alt"></i> Invite a friend', index: 1 }];
    
    var hideSheet = $ionicActionSheet.show({
      buttons: buttonsOpt,
      destructiveText: (ionic.Platform.isAndroid()?'<i class="icon ion-android-exit assertive"></i> ':'')+'Cancel',
      titleText: 'Choose an action',
      destructiveButtonClicked:  function() {
        hideSheet();
      },
      buttonClicked: function(index) {
        switch(this.buttons[index].index){
          case 1: // invite friend
            $scope.openFriendsModal({action:"invite", sender: dapp, message: "Come on " + dapp.Name });
            break;
        }
        hideSheet();
       $timeout(function() {
         hideSheet();
        }, 20000);
      }
    });
  }

  $scope.vibrate = function(){
    if(localStorage.Vibration){
      if (AppService.isPlatformReady()){
        $cordovaVibration.vibrate(100);
      };
    }
  }

  $scope.$on('incomingMessage', function (e, payload) {
    if(!payload.to[0]){
      //public msg
      if($ionicTabsDelegate.selectedIndex()==1) 
        $scope.scrollTo('chatScroll','bottom');
      else{
        if(payload.time > JSON.parse(localStorage.LastMsg).time){
          $scope.msgCounter += 1;
          localStorage.LastMsg = JSON.stringify({time: payload.time, hash: payload.hash});
        }
      }
      $scope.vibrate(); 
    }

    if(payload.to[0] && payload.to[0]==AppService.account()){
      //direct to me
      if(!$scope.isFriend(payload.from)){
        Friends.add(payload.from,payload.from,payload.senderKey,payload.text);
      }
      if($ionicHistory.currentView().stateName=='tab.friend' && 
        $ionicHistory.currentView().stateParams.Friend == payload.from)
        $scope.scrollTo('chatDMScroll','bottom');
      else{
        if(payload.time > JSON.parse(localStorage.LastMsg).time){
          $scope.DMCounter += 1;
          Friends.increaseUnread(payload.from);
          localStorage.LastMsg = JSON.stringify({time: payload.time, hash: payload.hash});
        }
      }

      if(payload.mode=="transaction")
        Transactions.add(payload.attach);

      if(payload.mode=="token"){
        //Token.add(payload.attach);
      }


      $scope.loadFriends();
      $scope.vibrate(); 
    }

    if(!$scope.$$phase) {
      $scope.$digest(); 
    }
  });


  if (AppService.isPlatformReady()){
    // Android customization
    cordova.plugins.backgroundMode.setDefaults({ text:'Doing heavy tasks.'});
    // Enable background mode
    if(localStorage.BackMode=="true"){
      cordova.plugins.backgroundMode.enable();
      console.log('device ready for background');
    }else
    console.log('backmode not activated');

    // Called when background mode has been activated
    cordova.plugins.backgroundMode.onactivate = function() {
      console.log('backgroundMode activated');
      $scope.$on('incomingMessage', function (e, payload) {
        var msg="new message on LETH";
        if(payload.text.length)
          msg = $sce.trustAsHtml(payload.text);
        if(payload.image.length)
          msg = "Image sent";

        var toNotify = false;
        if(!payload.to[0] || (payload.to[0] && payload.to.indexOf(AppService.account())!=-1)){
          toNotify=true;
        }

        //console.log('in backgroundMode:' + msg);    
        if(toNotify){
          $scope.scheduleSingleNotification(payload.from,msg,payload.hash);
          $scope.increaseBadge();
        }
      });
    }

    cordova.plugins.backgroundMode.ondeactivate = function() {
      console.log('backgroundMode deactivated');
      if(localStorage.PinOn=="true"){
        $lockScreen.show({
          code: JSON.parse(localStorage.AppCode).code,
          touchId: JSON.parse(localStorage.TouchOn),
          ACDelbuttons: true,
          onCorrect: function () {
            $scope.cancelAllNotifications();
            $scope.clearBadge();
          },
          onWrong: function (attemptNumber) {
          },
        });
      };
    };
  };

  $scope.cancelAllNotifications = function () {
    $scope.msgCounter = 0;
    if (AppService.isPlatformReady()){
      $cordovaLocalNotification.cancelAll().then(function (result) {
        console.log('All Notification Canceled');
      });
    };
  };

  $scope.cancelDMNotifications = function () {
    $scope.DMCounter = 0;
    if (AppService.isPlatformReady()){
      $cordovaLocalNotification.cancelAll().then(function (result) {
        console.log('DM Notification Canceled');
      });
    };
  };

  //clear notification and badge on click (todo: add on open)
  $rootScope.$on('$cordovaLocalNotification:click',
    function (event, notification, state) {
      $scope.cancelAllNotifications();
      $scope.clearBadge();
    }
  );     

}) //fine AppCtrl