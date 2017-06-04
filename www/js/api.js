/* 
*	API Wrapper for Angularjs Services
*
*/
var apiApp = angular.element(document.body).injector().get("AppService");
var apiChat = angular.element(document.body).injector().get("Chat");
var apiFriends = angular.element(document.body).injector().get("Friends");
var apiUI = angular.element(document.body).injector().get("UIService");
var apiBE = angular.element(document.body).injector().get("BEService");
var apiNFC = angular.element(document.body).injector().get("nfcService");
var apiENS = angular.element(document.body).injector().get("ENSService");