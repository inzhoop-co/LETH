web3 = new Web3();
angular.module('leth', ['ionic', 'angularLoad','ionic.contrib.ui.cards', 'ngSanitize', 'ionic.service.core', 'ngCordova', 'ja.qr', 'leth.controllers', 'leth.services','ionic-lock-screen'])
  .constant('$ionicLoadingConfig', {
    template: 'Loading...'
  })
  .run(function ($ionicPlatform, $ionicActionSheet, $rootScope, $ionicLoading, $localstorage,$lockScreen,$state,$window, $location) {
    $ionicPlatform.ready(function () {
      //global control and settings
      if (typeof localStorage.PinOn == 'undefined') {
        localStorage.PinOn="false";
      }
      if (typeof localStorage.TouchOn == 'undefined') {
        localStorage.TouchOn="false";
      }
      if (typeof localStorage.NodeHost == 'undefined') {
        localStorage.NodeHost = "http://wallet.inzhoop.com:8545";
    
      }
      if (typeof localStorage.HostsList == 'undefined') {
        localStorage.HostsList=JSON.stringify([localStorage.NodeHost]);
      }
      
	    if(localStorage.PinOn=="true"){
    		$lockScreen.show({
    			code: JSON.parse(localStorage.AppCode).code,
          touchId: JSON.parse(localStorage.TouchOn),
    			ACDelbuttons: true,
    			onCorrect: function () {
    			  console.log('correct!');
    			},
    			onWrong: function (attemptNumber) {
    			  console.log(attemptNumber + ' wrong passcode attempt(s)');
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
/*
        var ls = JSON.parse(localStorage.AppKeys);
        global_keystore = new lightwallet.keystore.deserialize(ls.data);
        global_keystore.passwordProvider = customPasswordProvider;

        var web3Provider = new HookedWeb3Provider({
          host: localStorage.NodeHost,
          transaction_signer: global_keystore
        });
        web3.setProvider(web3Provider);
  

        */
      }	  

      if (window.cordova && window.cordova.plugins.Keyboard) {
        //cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

      $rootScope.$on('loading:show', function () {
        $ionicLoading.show({template: 'Loading...'})
        //console.log("Carico");
      })

      $rootScope.$on('loading:hide', function () {
        $ionicLoading.hide()
        //console.log("Completo");
      })

      $window.addEventListener('LaunchUrl', function(event) {
        // gets page name from url
        var page =/.*:[/]{2}([^?]*)[?]?(.*)/.exec(event.detail.url)[1];
        // redirects to page specified in url
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
        url: '/transactions',
        views: {
          'menuContent': {
            templateUrl: 'templates/transactions.html',
            controller: 'TransactionCtrl'
          }
        }
      })
      .state('app.about', {
        url: '/about',
        views: {
          'menuContent': {
            templateUrl: 'templates/about.html',
            controller: "AboutCtrl"
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

  function handleOpenURL(url) {
    setTimeout(function() {
        var event = new CustomEvent('LaunchUrl', {detail: {'url': url}});
        window.dispatchEvent(event);
    }, 0);
  }
  ;


