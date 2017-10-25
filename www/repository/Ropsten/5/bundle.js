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
  var CONTRACTS = [];
  var DAPP = void 0;
  var $SCOPE = void 0;
  var $SERVICE = void 0;
  var card = void 0;

  // Todo: Popoliamo manualmente functions e data. Trovare un modo per popolare automaticamente le variabili functions e data.
  var functions = {
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
    listParticipants: function(index){
      var contract = CONTRACTS[index];
      var list=[];
      var count = contract.registered().toNumber();
      for(var i=1;i<=count;i++){
          var addr = contract.participantsIndex(i); //iterate for list
          var user = contract.participants(addr);
          list.push(user);
          console.log(user[0],user[1],user[2],user[3]);
      }
      return list;
    },
    register: function(index,nickname){
      var deposit = web3.toWei(0.05);
      var name = nickname;
      var gasLimit = 3000000; // gas limit
      var gasPrice = 50000000000; //gas price in wei
      $SERVICE.transactionCall(CONTRACTS[index],'register',name, deposit, gasLimit, gasPrice).then(function(res){
        console.log(res);
      });
    },
    attende: function(index,addr){
      var deposit = web3.toWei(0.05);
      var name = nickname;
      var gasLimit = 3000000; // gas limit
      var gasPrice = 50000000000; //gas price in wei
      $SERVICE.transactionCall(CONTRACTS[index],'register',name, deposit, gasLimit, gasPrice).then(function(res){
        console.log(res);
      });
    },
    dappRefresh: function(value){
      $SCOPE.$broadcast('scroll.refreshComplete');
    }

  };
  

  var _init = function _init(core) {
    $SCOPE = core.scope;
    $SERVICE = core.service;
    DAPP = $SCOPE.Dapp.activeApp;

    //RETRIEVE THE CONTRACT
    CONTRACT = web3.eth.contract(DAPP.Contracts[0].ABI).at(DAPP.Contracts[0].Address);

    var data = {
      events: []
    };
    

    for(var i=0; i< DAPP.Contracts.length; i++){
      var c = web3.eth.contract(DAPP.Contracts[i].ABI).at(DAPP.Contracts[i].Address);
      CONTRACTS.push(c);

      var l = functions.listParticipants(i);
      console.log(l);

      data.events.push({
        id: i,
        name: c.name(),
        description: c.Address,
        status: { id: 0 },
        position: { location: "No place", city: "No City", lat: "", long: "" },
        date: "00/00/0000",
        hour: "0:00",
        users: c.registered().toNumber(),
        assets: { banner: "https://ethereum.org/images/assets/1900/Ethereum-homestead-background-38.jpg", logo: "https://ethereum.org/images/logos/ETHEREUM-ICON_Black_small.png" }
      })
    }  

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