"use strict";
var lockScreenService = function(n) {
    return {
        show: function(o) {
            n.$broadcast("ionic-lock-screen:show", {
                touchId: o.touchId || !1,
                ACDelbuttons: o.ACDelbuttons || !1,
                passcode: o.code,
                onCorrect: o.onCorrect || null,
                onWrong: o.onWrong || null,
                passcodeLabel: o.passcodeLabel || "Enter Passcode",
                touchLabel: o.touchLabel,
                backgroundColor: o.backgroundColor || "#EF473a",
                textColor: o.textColor || "#FFFFFF",
                buttonColor: o.buttonColor || "#F8F8F8",
                buttonTextColor: o.buttonTextColor || "#464646",
                buttonPressed: o.buttonPressed || "#E0E0E0",
                buttonACColor: o.buttonACColor || "#EF473a",
                buttonACTextColor: o.buttonACTextColor || "#FFFFFF",
                buttonDelColor: o.buttonDelColor || "#EF473a",
                buttonDelTextColor: o.buttonDelTextColor || "#FFFFFF"
            })
        }
    }
};
lockScreenService.$inject = ["$rootScope"];
var lockScreenDirective = function(n) {
    return {
        restrict: "E",
        scope: {},
        link: function(o) {
            var e = 0;
            o.enteredPasscode = "", o.$on("ionic-lock-screen:show", function(e, t) {
                o._showLockScreen = !0, o.ACDelbuttons = t.ACDelbuttons, o.passcode = t.passcode, o.onCorrect = t.onCorrect, o.onWrong = t.onWrong, o.passcodeLabel = t.passcodeLabel, o.touchLabel = t.touchLabel, o.backgroundColor = t.backgroundColor, o.textColor = t.textColor, o.buttonColor = t.buttonColor, o.buttonTextColor = t.buttonTextColor, o.buttonPressed = t.buttonPressed, o.buttonACColor = t.buttonACColor, o.buttonACTextColor = t.buttonACTextColor, o.buttonDelColor = t.buttonDelColor, o.buttonDelTextColor = t.buttonDelTextColor, n(function() {
                    t.touchId && window.touchid && window.touchid.checkSupport(function() {
                        window.touchid.authenticate(function() {
                            o.$apply(function() {
                                o._showLockScreen = !1
                            }), o.onCorrect && o.onCorrect()
                        }, function() {}, o.touchLabel)
                    }, function() {
                        console.info("touch id is not supported on your device")
                    })
                }, 50)
            }), o.all_clear = function() {
                o.enteredPasscode = ""
            }, o["delete"] = function() {
                o.enteredPasscode = o.enteredPasscode.slice(0, -1)
            }, o.digit = function(t) {
                o.selected = +t, o.passcodeWrong || (o.enteredPasscode += "" + t, o.enteredPasscode.length >= 4 && (o.enteredPasscode === "" + o.passcode ? (o.enteredPasscode = "", e = 0, o.onCorrect && o.onCorrect(), o._showLockScreen = !1) : (o.passcodeWrong = !0, e++, o.onWrong && o.onWrong(e), n(function() {
                    o.enteredPasscode = "", o.passcodeWrong = !1
                }, 800))))
            }
        },
        template: '\n      <style>\n          /* Animations*/\n          @keyframes ILS_shake {\n            from, to {\n              transform: translate3d(0, 0, 0);\n            }\n            10%, 30%, 50%, 70%, 90% {\n              transform: translate3d(-10px, 0, 0);\n            }\n            20%, 40%, 60%, 80% {\n              transform: translate3d(10px, 0, 0);\n            }\n          }\n          @keyframes ILS_buttonPress {\n            0% {\n              background-color: {{buttonPressed}};\n            }\n            100% {\n              background-color: {{buttonColor}};\n            }\n          }\n          /* Lock Screen Layout*/\n          .ILS_lock {\n            display: flex;\n            flex-direction: column;\n            justify-content: center;\n            position: absolute;\n            width: 100%;\n            height: 100%;\n            z-index: 999;\n            background-color: {{backgroundColor}};\n          }\n          .ILS_lock-hidden {\n            display: none;\n          }\n          .ILS_label-row {\n            height: 50px;\n            width: 100%;\n            text-align: center;\n            font-size: 23px;\n            padding-top: 10px;\n            color: {{textColor}};\n          }\n          .ILS_circles-row {\n            display: flex;\n            flex-direction: row;\n            justify-content: center;\n            width: 100%;\n            height: 60px;\n          }\n          .ILS_circle {\n            background-color: {{backgroundColor}}!important;\n            border-radius: 50%;\n            width: 10px;\n            height: 10px;\n            border:solid 1px {{textColor}};\n            margin: 0 15px;\n          }\n          .ILS_numbers-row {\n            display: flex;\n            flex-direction: row;\n            justify-content: center;\n            width: 100%;\n            height: 100px;\n          }\n          .ILS_digit {\n            margin: 0 14px;\n            width: 80px;\n            border-radius: 50%;\n            height: 80px;\n            text-align: center;\n            padding-top: 29px;\n            font-size: 21px;\n            color: {{buttonTextColor}};\n            background-color: {{buttonColor}};\n          }\n          .ILS_digit_text {\n            margin: 0 14px;\n            width: 80px;\n            height: 80px;\n            text-align: center; border-radius: 10%;\n            padding-top: 29px;\n            font-size: 21px;\n            color: {{buttonTextColor}};\n    background-color: {{backgroundColor}};\n    }\n   .ILS_digit.activated {\n            -webkit-animation-name: ILS_buttonPress;\n            animation-name: ILS_buttonPress;\n            -webkit-animation-duration: 0.3;\n            animation-duration: 0.3s;\n          }\n          .ILS_ac {\n            color: {{buttonACTextColor}};\n            background-color: {{buttonACColor}};\n            }\n          .ILS_del {\n            color: {{buttonDelTextColor}};\n            background-color: {{buttonDelColor}};\n            }\n          .ILS_full {\n            background-color:{{textColor}}!important;\n          }\n          .ILS_shake {\n            -webkit-animation-name: ILS_shake;\n            animation-name: ILS_shake;\n            -webkit-animation-duration: 0.5;\n            animation-duration: 0.5s;\n            -webkit-animation-fill-mode: both;\n            animation-fill-mode: both;\n          }\n      </style>\n      <div class="ILS_lock" ng-class="!_showLockScreen ?  \'ILS_lock-hidden\' : \'\'">\n        <div class="ILS_label-row">\n          {{passcodeLabel}}\n        </div>\n        <div class="ILS_circles-row" ng-class="passcodeWrong ?  \'ILS_shake\' : \'\'">\n          <div class="ILS_circle" ng-class=" enteredPasscode.length>0 ? \'ILS_full\' : \'\'"></div>\n          <div class="ILS_circle" ng-class=" enteredPasscode.length>1 ? \'ILS_full\' : \'\'"></div>\n          <div class="ILS_circle" ng-class=" enteredPasscode.length>2 ? \'ILS_full\' : \'\'"></div>\n          <div class="ILS_circle" ng-class=" enteredPasscode.length>3 ? \'ILS_full\' : \'\'"></div>\n        </div>\n        <div class="ILS_numbers-row">\n          <div ng-click="digit(1)" class="ILS_digit">1</div>\n          <div ng-click="digit(2)" class="ILS_digit">2</div>\n          <div ng-click="digit(3)" class="ILS_digit">3</div>\n        </div>\n        <div class="ILS_numbers-row">\n          <div ng-click="digit(4)" class="ILS_digit">4</div>\n          <div ng-click="digit(5)" class="ILS_digit">5</div>\n          <div ng-click="digit(6)" class="ILS_digit">6</div>\n        </div>\n        <div class="ILS_numbers-row">\n          <div ng-click="digit(7)" class="ILS_digit">7</div>\n          <div ng-click="digit(8)" class="ILS_digit">8</div>\n          <div ng-click="digit(9)" class="ILS_digit">9</div>\n        </div>\n        <div class="ILS_numbers-row">\n          <div ng-show="ACDelbuttons" ng-click="all_clear()" class="ILS_digit_text ILS_ac">AC</div>\n          <div ng-click="digit(0)" class="ILS_digit">0</div>\n          <div ng-show="ACDelbuttons" ng-click="delete()" class="ILS_digit_text ILS_del">DEL</div>\n        </div>\n      </div>\n    '
    }
};
lockScreenDirective.$inject = ["$timeout"], angular.module("ionic-lock-screen", []), angular.module("ionic-lock-screen").directive("lockScreen", lockScreenDirective), angular.module("ionic-lock-screen").service("$lockScreen", lockScreenService);