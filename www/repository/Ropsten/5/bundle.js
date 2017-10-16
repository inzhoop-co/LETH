var dappleth =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = run;

var _Card = __webpack_require__(1);

function run(core) {
  var CONTRACT = void 0;
  var DAPP = void 0;
  var $SCOPE = void 0;
  var $SERVICE = void 0;
  var card = void 0;

  // Todo: Popoliamo manualmente functions e data. Trovare un modo per popolare automaticamente le variabili functions e data.
  var functions = {
    greet: function greet(name) {
      $SERVICE.popupConfirm("Popup Test").then(function (res) {
        // Call Contracts Methods
        CONTRACT.greet(function (err, res) {
          if (err) {
            $SERVICE.popupAlert("ERROR", err);
            $SCOPE.greeting = err.message;
          }
          if (res) {
            $SCOPE.greeting = res;
            $SCOPE.$digest();
          }
        });
      }, function (err) {
        console.log(err);
      });
    },
    showDetails: function showDetails(idEvent, event) {
      event.currentTarget.classList.add('opened');
      document.querySelector('.eventscontainer').classList.add('hasOpenedEvent');
      $SCOPE.center = {
        lat: 51.505,
        lon: -0.09,
        zoom: 8
      };
      card = new _Card.Card(idEvent);
    },
    hideDetails: function hideDetails(idEvent, event) {
      document.querySelector("[data-id-event=\"" + idEvent + "\"]").classList.remove('opened');
      document.querySelector('.eventscontainer').classList.remove('hasOpenedEvent');
      event.stopPropagation();
    },
    dappRefresh: function(value){
      $SCOPE.$broadcast('scroll.refreshComplete');
    }
  };
  var data = {
    events: [{
      id: "12",
      name: "Evento x",
      description: "the best event x",
      status: { id: 0 },
      position: { location: "Auditorium", city: "London", lat: "", long: "" },
      date: "10/11/2017",
      hour: "9:00",
      users: "12",
      assets: { banner: "https://ethereum.org/images/assets/1900/Ethereum-homestead-background-38.jpg", logo: "" }
    }, {
      id: "13",
      name: "Evento Y",
      description: "the best event y",
      status: { id: 1 },
      position: { location: "Auditorium", city: "Zurich", lat: "", long: "" },
      date: "13/11/2017",
      hour: "10:00",
      users: "45",
      assets: { banner: "https://ethereum.org/images/assets/1900/Ethereum-homestead-background-36.jpg", logo: "" }
    }, {
      id: "14",
      name: "Evento Z",
      description: "the best event z",
      status: { id: 1 },
      position: { location: "Sushi Bar", city: "Tokyo", lat: "", long: "" },
      date: "11/12/2017",
      hour: "11:00",
      users: "43",
      assets: { banner: "https://ethereum.org/images/assets/1900/Ethereum-homestead-background-33.jpg", logo: "" }
    }]
  };

  var _init = function _init(core) {
    $SCOPE = core.scope;
    $SERVICE = core.service;
    DAPP = $SCOPE.Dapp.activeApp;

    //RETRIEVE THE CONTRACT
    CONTRACT = web3.eth.contract(DAPP.Contracts[0].ABI).at(DAPP.Contracts[0].Address);

    if (angular !== undefined) {
      angular.extend($SCOPE, functions);
      angular.extend($SCOPE, data);
    } else {
      console.log("Angular is required!");
    }
  };

  return _init(core);
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Card = exports.Card = function () {
  function Card(idevent) {
    _classCallCheck(this, Card);

    this.idevent = idevent;
    this.init();
  }

  _createClass(Card, [{
    key: "init",
    value: function init() {
      this.el = document.querySelector("[data-id-event=\"" + this.idevent + "\"]");
      console.log(this.idevent);
    }
  }, {
    key: "events",
    value: function events() {}
  }]);

  return Card;
}();

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map