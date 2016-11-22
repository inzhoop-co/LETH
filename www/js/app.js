web3 = new Web3();
hdPath = "m/44'/60'/0";

var app = angular.module('leth', ['ionic', 'ngTagsInput', 'angularLoad','ionic.contrib.ui.cards', 'ngSanitize', 'ionic.service.core', 'ngCordova', 'ja.qr', 'leth.controllers', 'leth.services','ionic-lock-screen'])
  .constant('$ionicLoadingConfig', {
    template: 'Loading...'
  })
  .constant('FeedEndpoint', {
    //url: 'http://localhost:8100/feed'
    url: 'https://blog.ethereum.org/feed'
    //url: 'http://us11.campaign-archive1.com/feed'
  })
  .constant('StoreEndpoint', {
    //url: 'dappleths'
    url: 'http://www.inzhoop.com/dappleths'
  })
  .run(function ($ionicPlatform, $ionicActionSheet, $rootScope, $ionicLoading, $localstorage,
                $lockScreen,$state,$window, $location) {
    $ionicPlatform.ready(function () {      
      if (typeof localStorage.LastMsgTms == 'undefined') {
        localStorage.LastMsgTms="";
      }
      if (typeof localStorage.PinOn == 'undefined') {
        localStorage.PinOn="false";
      }
      if (typeof localStorage.TouchOn == 'undefined') {
        localStorage.TouchOn="false";
      }
      if (typeof localStorage.GeoOn == 'undefined') {
        localStorage.GeoOn="false";
      }
      if (typeof localStorage.Coins == 'undefined') {
        localStorage.Coins = '[{ "Name": "ZhoopCoin", "GUID": "T01", "Network": "Morden", "Company": "Inzhoop", "Logo": "http://www.inzhoop.com/dappleths/inzhoop-tazza.png", "Symbol": "₴", "Abstract": "Coin NetCommerce", "Address": "0x5401C2370abafa499254c6f3837407cEa64d132f", "Installed": true, "ABI": [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string", "value": "ZhoopCoin", "displayName": "" }], "type": "function", "displayName": "name" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256", "value": "19000000", "displayName": "" }], "type": "function", "displayName": "total Supply" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address", "index": 0, "typeShort": "address", "bits": "", "displayName": "_from", "template": "elements_input_address" }, { "name": "_to", "type": "address", "index": 1, "typeShort": "address", "bits": "", "displayName": "_to", "template": "elements_input_address" }, { "name": "_value", "type": "uint256", "index": 2, "typeShort": "uint", "bits": "256", "displayName": "_value", "template": "elements_input_uint" }], "name": "transferFrom", "outputs": [{ "name": "success", "type": "bool" }], "type": "function", "displayName": "transfer From" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8", "value": "2", "displayName": "" }], "type": "function", "displayName": "decimals" }, { "constant": true, "inputs": [], "name": "version", "outputs": [{ "name": "", "type": "string", "value": "1.0", "displayName": "" }], "type": "function", "displayName": "version" }, { "constant": true, "inputs": [{ "name": "", "type": "address", "index": 0, "typeShort": "address", "bits": "", "displayName": "", "template": "elements_input_address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256", "value": "0", "displayName": "" }], "type": "function", "displayName": "balance Of" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string", "value": "₴", "displayName": "" }], "type": "function", "displayName": "symbol" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address", "index": 0, "typeShort": "address", "bits": "", "displayName": "_to", "template": "elements_input_address" }, { "name": "_value", "type": "uint256", "index": 1, "typeShort": "uint", "bits": "256", "displayName": "_value", "template": "elements_input_uint" }], "name": "transfer", "outputs": [], "type": "function", "displayName": "transfer" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address", "index": 0, "typeShort": "address", "bits": "", "displayName": "_spender", "template": "elements_input_address" }, { "name": "_value", "type": "uint256", "index": 1, "typeShort": "uint", "bits": "256", "displayName": "_value", "template": "elements_input_uint" }, { "name": "_extraData", "type": "bytes", "index": 2, "typeShort": "bytes", "bits": "", "displayName": "_extra Data", "template": "elements_input_bytes" }], "name": "approveAndCall", "outputs": [{ "name": "success", "type": "bool" }], "type": "function", "displayName": "approve And Call" }, { "constant": true, "inputs": [{ "name": "", "type": "address", "index": 0, "typeShort": "address", "bits": "", "displayName": "", "template": "elements_input_address" }, { "name": "", "type": "address", "index": 1, "typeShort": "address", "bits": "", "displayName": "", "template": "elements_input_address" }], "name": "spentAllowance", "outputs": [{ "name": "", "type": "uint256", "value": "0", "displayName": "" }], "type": "function", "displayName": "spent Allowance" }, { "constant": true, "inputs": [{ "name": "", "type": "address", "index": 0, "typeShort": "address", "bits": "", "displayName": "", "template": "elements_input_address" }, { "name": "", "type": "address", "index": 1, "typeShort": "address", "bits": "", "displayName": "", "template": "elements_input_address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256", "value": "0", "displayName": "" }], "type": "function", "displayName": "allowance" }, { "inputs": [{ "name": "initialSupply", "type": "uint256", "index": 0, "typeShort": "uint", "bits": "256", "displayName": "initial Supply", "template": "elements_input_uint", "value": "19000000" }, { "name": "tokenName", "type": "string", "index": 1, "typeShort": "string", "bits": "", "displayName": "token Name", "template": "elements_input_string", "value": "ZhoopCoin" }, { "name": "decimalUnits", "type": "uint8", "index": 2, "typeShort": "uint", "bits": "8", "displayName": "decimal Units", "template": "elements_input_uint", "value": "2" }, { "name": "tokenSymbol", "type": "string", "index": 3, "typeShort": "string", "bits": "", "displayName": "token Symbol", "template": "elements_input_string", "value": "₴" }, { "name": "versionOfTheCode", "type": "string", "index": 4, "typeShort": "string", "bits": "", "displayName": "version Of The Code", "template": "elements_input_string", "value": "1.0" }], "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }], "Send": "transfer", "Eevents": [{ "Transfer": "address indexed from, address indexed to, uint256 value" }, { "FrozenFunds": "address target, bool frozen" }], "Units": [{ "multiplier": "1", "unitName": "Coins" }] }]';
      }
      if (typeof localStorage.NodeHost == 'undefined') {
        localStorage.NodeHost = "http://wallet.inzhoop.com:8546";
      }
      if (typeof localStorage.HostsList == 'undefined') {
        localStorage.HostsList=JSON.stringify([localStorage.NodeHost]);
      }
      if (typeof localStorage.BaseCurrency == 'undefined') {
        localStorage.BaseCurrency = JSON.stringify({ name: 'EUR', symbol:'€', value: 'ZEUR'});
      }      
	    if(localStorage.PinOn=="true"){
    		$lockScreen.show({
    			code: JSON.parse(localStorage.AppCode).code,
          touchId: JSON.parse(localStorage.TouchOn),
    			ACDelbuttons: true,
    			onCorrect: function () {
    			  //console.log('correct!');
    			},
    			onWrong: function (attemptNumber) {
    			  //console.log(attemptNumber + ' wrong passcode attempt(s)');
    			},
  		  });
		  }

      if (typeof localStorage.AppKeys == 'undefined') {
        console.log("wallet not found");
        $rootScope.hasLogged = false;
        localStorage.HasLogged = $rootScope.hasLogged;          
        $location.path('/app/login');
      }
      else {
        console.log("login successfully");
        $rootScope.hasLogged = true;  
        localStorage.HasLogged = $rootScope.hasLogged;
        $location.path('/app/dappleths');
      }	  

      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.disableScroll(true);        

        cordova.getAppVersion(function (version) {
          alert(version);
        });
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
      
      $rootScope.$on('loading:show', function () {
        $ionicLoading.show({template: 'Loading...'})
      })

      $rootScope.$on('loading:hide', function () {
        $ionicLoading.hide()
      })

      $window.addEventListener('LaunchUrl', function(event) {
        // gets page name from url
        var page =/.*:[/]{2}([^?]*)[?]?(.*)/.exec(event.detail.url)[1];
        // redirects to page specified in url
        if(event.detail.url.split(':')[0] == "ethereum")
          $state.go('app.wallet', {addr: page});
      }); 

    });
  })
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })
      .state('app.login', {
        url: '/login',
        views: {
          'menuContent': {
            templateUrl: 'templates/login.html'
          }
        }
      }) 
      .state('app.wallet', {
        url: '/wallet/:addr',
        views: {
          'menuContent': {
            templateUrl: 'templates/wallet.html',
            controller: 'WalletCtrl',
          }
        }
      })
      .state('app.settings', {
        url: '/settings',
        views: {
          'menuContent': {
            templateUrl: 'templates/settings.html',
            controller: 'SettingsCtrl'
          }
        }
      })
      .state('app.transactions', {
        url: '/transactions/:addr',
        views: {
          'menuContent': {
            templateUrl: 'templates/transactions.html',
            controller: 'TransactionCtrl'
          }
        }
      })
      .state('app.dappleths', {
        url: '/dappleths',
        views: {
          'menuContent': {
            templateUrl: 'templates/dappleths.html',
            controller: "DapplethsCtrl"
          }
        }
      }) 
      .state('app.dappleth-run', {
        url: '/dappleth-run/:Id',
        views: {
          'menuContent': {
            templateUrl: 'templates/dappleth-run.html',
            controller: "DapplethRunCtrl"
          }
        }
      }) 
      .state('app.feed', {
        url: '/feed/:Item',
        views: {
          'menuContent': {
            templateUrl: 'templates/feed-detail.html',
            controller: 'FeedCtrl'
          }
        }
      })     
      .state('app.address', {
        url: '/address',
        views: {
          'menuContent': {
            templateUrl: 'templates/address.html',
            controller: 'AddressCtrl'
          }
        }
      })
      .state('app.friends', {
        url: '/friends',
        views: {
          'menuContent': {
            templateUrl: 'templates/friends.html',
            controller: 'FriendsCtrl'
          }
        }
      })
      .state('app.chats', {
        url: '/chats',
        views: {
          'menuContent': {
            templateUrl: 'templates/chats.html',
            controller: 'ChatsCtrl'
          }
        }
      })
      .state('app.single', {
        url: '/friends/:Friend',
        views: {
          'menuContent': {
            templateUrl: 'templates/friend-detail.html',
            controller: 'FriendCtrl'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/appleths');
  })
  .config(function($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');
	})
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push(function ($rootScope) {
      return {
        request: function (config) {
          $rootScope.$broadcast('loading:show')
          return config
        },
        response: function (response) {
          $rootScope.$broadcast('loading:hide')
          return response
        }
      }
    })

     $httpProvider.defaults.useXDomain = true;
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
  })
  .config(function( $controllerProvider, $provide, $compileProvider ) {
        // Since the "shorthand" methods for component 
        // definitions are no longer valid, we can just 
        // override them to use the providers for post-
        // bootstrap loading.
        console.log( "Config method executed." );

        // Let's keep the older references.
        app._controller = app.controller;
        // Provider-based controller.
        app.controller = function( name, constructor ) {

          $controllerProvider.register( name, constructor );
          return( this );

        };
  })
  .directive('dappTemplate', ['$http','$compile', function($http,$compile){
  return {
      restrict : 'A',
      scope : {},
      controller : "@",
      name:"controllerName",  
      link: function(scope, element, attrs){
        scope.message = "direttiva";  

       },
      templateUrl: function(elem,attrs) {
           return "dappleths/" + attrs.templateUrl || 'template/notfound.html'
      }
    }
  }]) 
  .directive('appDirective', function($rootScope, Chat, AppService){
    return {
      restrict : 'A',
      link: function(scope, element, attrs){
        element.bind('dappMessage', function(e){
          $rootScope.$broadcast('dappEvent', { data: e});
          
        })        
      }
    }
  })  
  /*.directive('msgDirective', function(){
  return {
      restrict : 'A',
      scope : true, 
      link: function(scope, element, attrs){
        scope.$on('dappEvent',function(){
          console.log('caught event from dapp');
        });  

       }
    }
  }) */
  .filter('strLimit', ['$filter', function($filter) {
   return function(input, beginlimit, endlimit) {
      if (! input) return;
      if (input.length <= beginlimit + endlimit) {
          return input;
      }

      return $filter('limitTo')(input, beginlimit) + '...' + $filter('limitTo')(input, -endlimit) ;
   };
  }])
  .filter('calendar', calendar);
    function calendar () {
      return function (time) {
        if (! time) return;

        return moment(time).calendar(null, {
          lastDay : '[Yesterday]',
          sameDay : 'LT',
          lastWeek : 'dddd',
          sameElse : 'DD/MM/YY'
        });
      };
    }
  function handleOpenURL(url) {
    setTimeout(function() {
        var event = new CustomEvent('LaunchUrl', {detail: {'url': url}});
        window.dispatchEvent(event);
    }, 0);
  }
;