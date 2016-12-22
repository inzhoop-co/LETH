var svcApp = angular.element(document.body).injector().get("AppService");
var svcChat = angular.element(document.body).injector().get("Chat");


exports.appService = function() {
    return svcChat;
};

exports.chatService = function() {
    return svcChat;
};

