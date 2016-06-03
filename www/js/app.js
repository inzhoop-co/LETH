web3 = new Web3();
angular.module('leth', ['ionic', 'oc.lazyLoad', 'angularLoad','ionic.contrib.ui.cards', 'ngSanitize', 'ionic.service.core', 'ngCordova', 'ja.qr', 'leth.controllers', 'leth.services','ionic-lock-screen'])
  .constant('$ionicLoadingConfig', {
    template: 'Loading...'
  })
  .run(function ($ionicPlatform, $ionicActionSheet, $rootScope, $ionicLoading, $localstorage,
                $lockScreen,$state,$window, $location) {
    $ionicPlatform.ready(function () {
        /*
        angularLoad.loadScript("http://www.inzhoop.com/dappleths/CustomCtrl.js").then(function() {
            console.log('OK :');
          }).catch(function(error, result) {
            console.log('ERROR :');
        }); 
      */
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
      if (typeof localStorage.BaseCurrency == 'undefined') {
        localStorage.BaseCurrency = JSON.stringify({ name: 'EUR', symbol:'€', value: 'ZEUR'});
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
      }	  

      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.disableScroll(true);
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
  .directive('dappTemplate', ['$http','$compile', function($http,$compile){
  return {
      restrict : 'A',
      scope : {},
      controller : "@",
      name:"controllerName",  
      link: function(scope, element, attrs){
        scope.message = "prima";          
        /*
        scope.test = function(){
          scope.message = "test OK";
          scope.scanTo();
        };
          $http.jsonp("dappleths/dapp_1/controller.js?callback=pippo").success(function(data) {
            console.log("Request ok");
            $compile(scope.$scope)(data.data);
          }).error(function (data) {
            console.error("Request failed");
          });
          */
       },
      templateUrl: function(elem,attrs) {
           return "dappleths/" + attrs.templateUrl || 'template/notfound.html'
      }
    }
  }]) 

  function handleOpenURL(url) {
    setTimeout(function() {
        var event = new CustomEvent('LaunchUrl', {detail: {'url': url}});
        window.dispatchEvent(event);
    }, 0);
  }

  ;


