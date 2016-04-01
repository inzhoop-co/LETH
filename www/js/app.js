web3 = new Web3();
if (typeof localStorage.PinOn == 'undefined') {
localStorage.PinOn=false;
}
if (typeof localStorage.NodeHost == 'undefined') {
  localStorage.NodeHost = "http://wallet.inzhoop.com:8545";
}
angular.module('leth', ['oc.lazyLoad', 'ionic', 'angularLoad', 'ionic.contrib.ui.cards', 'ngSanitize', 'ionic.service.core', 'ngCordova', 'ja.qr', 'leth.controllers', 'leth.services','ionic-lock-screen'])
  .constant('FeedEndpoint', {
    url: '/feed'
  })
  .constant('DappPath',{
    url : "/dappleth" 
  })
  .constant('CountDapp',4)

  .run(function ($ionicPlatform, $rootScope, $ionicLoading, $localstorage,$lockScreen) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
	    if(localStorage.PinOn=="true"){
		  $lockScreen.show({
			code: JSON.parse(localStorage.AppCode).code,
			ACDelbuttons: true,
			onCorrect: function () {
			  console.log('correct!');
			},
			onWrong: function (attemptNumber) {
			  console.log(attemptNumber + ' wrong passcode attempt(s)');
			},
		  });
		}
	  
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
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

    });
  })
  /*
  .directive('noScroll', function($document) {
  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {

        $document.on('touchmove', function(e) {
          e.preventDefault();
        });
      }
    }
  })
*/
  .directive("templapp", function($compile){
      //recupera quello che ti serve da un servizio angular

      //definisciti lo scope

      return{
          link: function(scope, element){
              var template = "<button ng-click='doSomething()'>{{label}}</button>";
              var linkFn = $compile(template);
              var content = linkFn(scope);
              element.append(content);
          }
      }
/**/
  })
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
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
            templateUrl: 'templates/transactions.html'
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
      .state('app.appleth', {
        url: '/appleth',
        views: {
          'menuContent': {
            templateUrl: 'templates/appleth.html',
            controller: "ApplethCtrl"
          }
        }
      }) 
      .state('app.appleth-run', {
        url: '/appleth-run/:Id',
        views: {
          'menuContent': {
            templateUrl: 'templates/appleth-run.html',
            controller: "ApplethRunCtrl"
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
      .state('app.items', {
        url: '/items',
        views: {
          'menuContent': {
            templateUrl: 'templates/items.html',
            controller: 'ItemsCtrl'
          }
        }
      })
      .state('app.detail', {
        url: '/items/:Item/:Card',
        views: {
          'menuContent': {
            templateUrl: 'templates/item-detail.html',
            controller: 'ItemCtrl'
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
    $urlRouterProvider.otherwise('/app/appleth');
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
  });


