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
    url: 'https://www.inzhoop.com/dappleths'
  })
  .run(function ($ionicPlatform, $ionicActionSheet, $rootScope, $ionicLoading, $localstorage,
                $lockScreen,$state,$window, $location) {
    $ionicPlatform.ready(function () {      
      if (typeof localStorage.LastMsg == 'undefined') {
        localStorage.LastMsg= JSON.stringify({time:0, hash:"0x"});
      }
      if (typeof localStorage.BackMode == 'undefined') {
        localStorage.BackMode="false";
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
        localStorage.Coins = '[]';
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
          $location.path('/tab/login');
        }
        else {
          console.log("login successfully");
          $rootScope.hasLogged = true;  
          localStorage.HasLogged = $rootScope.hasLogged;
          $location.path('/tab/dappleths');
      } 

      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.disableScroll(true);        
      }
      if (window.StatusBar) {
        StatusBar.styleLightContent();
        //StatusBar.styleBlackOpaque()
        //StatusBar.styleBlackTranslucent();
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
          $state.go('tab.wallet', {addr: page});
      }); 

    });
  })
  .config(function ($ionicConfigProvider, $stateProvider, $urlRouterProvider) {
    // $ionicConfigProvider.views.maxCache(10);
    $ionicConfigProvider.views.transition('platform');
    // $ionicConfigProvider.views.forwardCache(false);
    $ionicConfigProvider.backButton.icon('ion-ios-arrow-back');
    $ionicConfigProvider.backButton.text('');                  // default is 'Back'
    $ionicConfigProvider.backButton.previousTitleText(false);  // hides the 'Back' text
    // $ionicConfigProvider.templates.maxPrefetch(20);

    $stateProvider
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html',
        controller: 'AppCtrl'  
      })
      .state('tab.login', {
        url: '/login',
        views: {
          'login': {
            templateUrl: 'templates/login.html'          
          }
        }
      }) 
      .state('tab.wallet', {
        url: '/wallet/:addr',
        views: {
          'wallet': {
            templateUrl: 'templates/wallet.html',
            controller: 'WalletCtrl'
          }
        }
      })
      .state('tab.settings', {
        url: '/settings',
        views: {
          'settings': {
            templateUrl: 'templates/settings.html',
            controller: 'SettingsCtrl'
          }
        }
      })
      .state('tab.transactions', {
        url: '/transactions/:addr',
        views: {
          'friends': {
            templateUrl: 'templates/transactions.html',
            controller: 'TransactionCtrl'
          }
        }
      })
      .state('tab.transall', {
        url: '/transactions/:addr',
        views: {
          'wallet': {
            templateUrl: 'templates/transactions.html',
            controller: 'TransactionCtrl'
          }
        }
      })      
      .state('tab.dappleths', {
        url: '/dappleths',
        views: {
          'dappleths': {
            templateUrl: 'templates/dappleths.html',
            controller: "DapplethsCtrl"
          }
        }
      }) 
      .state('tab.dappleth-run', {
        cache: false,
        url: '/dappleth-run/:Id',
        views: {
          'dappleths': {
            templateUrl: 'templates/dappleth-run.html',
            controller: "DapplethRunCtrl"
          }
        }
      }) 
      .state('tab.feed', {
        url: '/feed/:Item',
        views: {
          'feed': {
            templateUrl: 'templates/feed-detail.html',
            controller: 'FeedCtrl'
          }
        }
      })     
      .state('tab.address', {
        url: '/address',
        views: {
          'address': {
            templateUrl: 'templates/address.html',
            controller: 'AddressCtrl'
          }
        }
      })
      .state('tab.friends', {
        url: '/friends',
        views: {
          'friends': {
            templateUrl: 'templates/friends.html',
            controller: 'FriendsCtrl'
          }
        }
      })
      .state('tab.chats', {
        url: '/chats',
        views: {
          'chats': {
            templateUrl: 'templates/chats.html',
            controller: 'ChatsCtrl'
          }
        }
      })
      .state('tab.friend', {
        url: '/friends/:Friend',
        views: {
          'friends': {
            templateUrl: 'templates/friend-detail.html',
            controller: 'FriendCtrl'
          }
        }
      })
      ;
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab');
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
  .directive('hideTabs', function($rootScope) {
    return {
      restrict: 'A',
      link: function($scope, $el) {
        $rootScope.hideTabs = 'tabs-item-hide';
        $scope.$on('$destroy', function() {
            $rootScope.hideTabs = '';
        });
        $scope.$on('$ionicView.beforeLeave', function() {
            $rootScope.hideTabs = '';
        });
        $scope.$on('$ionicView.beforeEnter', function() {
            $rootScope.hideTabs = 'tabs-item-hide';
        });
      }
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