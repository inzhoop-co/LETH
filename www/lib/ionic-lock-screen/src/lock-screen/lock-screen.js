const lockScreenService = ($rootScope) => {
  return {
    show(settings) {
      $rootScope.$broadcast('ionic-lock-screen:show', {
        touchId         : settings.touchId || false,
        passcode        : settings.code,
        onCorrect       : settings.onCorrect || null,
        onWrong         : settings.onWrong || null,
        passcodeLabel   : settings.passcodeLabel || 'Enter Passcode',
        touchLabel      : settings.passcodeLabel || 'Verify Passcode',
        backgroundColor : settings.backgroundColor || '#F1F1F1',
        textColor       : settings.textColor || '#464646',
        buttonColor     : settings.buttonColor || '#F8F8F8',
        buttonTextColor : settings.buttonTextColor || '#464646',
        buttonPressed   : settings.buttonPressed || '#E0E0E0',
      });
    },
  };
};

const lockScreenDirective = ($timeout) => {
  return {
    restrict: 'E',
    scope : {},
    link (scope) {
      let passcodeAttempts = 0;
      scope.enteredPasscode = '';
      scope.$on('ionic-lock-screen:show', (e, data) => {
        scope._showLockScreen = true;
        scope.passcode        = data.passcode;
        scope.onCorrect       = data.onCorrect;
        scope.onWrong         = data.onWrong;
        scope.passcodeLabel   = data.passcodeLabel;
        scope.backgroundColor = data.backgroundColor;
        scope.textColor       = data.textColor;
        scope.buttonColor     = data.buttonColor;
        scope.buttonTextColor = data.buttonTextColor;
        scope.buttonPressed   = data.buttonPressed;
        $timeout(() => {
          if (data.touchId && window.touchid) {
            window.touchid.authenticate(() => {
              // success
              scope.$apply(() => {
                scope._showLockScreen = false;
              });
              scope.onCorrect && scope.onCorrect();
            }, () => {
              // failure
            }, scope.passcodeLabel);
          }
        }, 50);
      });
      scope.digit = (digit) => {
        scope.selected = +digit;
        if (scope.passcodeWrong) {
          return;
        }
        scope.enteredPasscode += '' + digit;
        if (scope.enteredPasscode.length >= 4) {
          if (scope.enteredPasscode === '' + scope.passcode) {
            scope.enteredPasscode = '';
            passcodeAttempts = 0;
            scope.onCorrect && scope.onCorrect();
            scope._showLockScreen = false;
          } else {
            scope.passcodeWrong = true;
            passcodeAttempts++;
            scope.onWrong && scope.onWrong(passcodeAttempts);
            $timeout(() => {
              scope.enteredPasscode = '';
              scope.passcodeWrong = false;
            }, 800);
          }
        }
      };
    },
    template: `
      <style>
          /* Animations*/
          @keyframes ILS_shake {
            from, to {
              transform: translate3d(0, 0, 0);
            }
            10%, 30%, 50%, 70%, 90% {
              transform: translate3d(-10px, 0, 0);
            }
            20%, 40%, 60%, 80% {
              transform: translate3d(10px, 0, 0);
            }
          }
          @keyframes ILS_buttonPress {
            0% {
              background-color: {{buttonPressed}};
            }
            100% {
              background-color: {{buttonColor}};
            }
          }
          /* Lock Screen Layout*/
          .ILS_lock {
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 999;
            background-color: {{backgroundColor}};
          }
          .ILS_lock-hidden {
            display: none;
          }
          .ILS_label-row {
            height: 50px;
            width: 100%;
            text-align: center;
            font-size: 23px;
            padding-top: 10px;
            color: {{textColor}};
          }
          .ILS_circles-row {
            display: flex;
            flex-direction: row;
            justify-content: center;
            width: 100%;
            height: 60px;
          }
          .ILS_circle {
            background-color: {{backgroundColor}}!important;
            border-radius: 50%;
            width: 10px;
            height: 10px;
            border:solid 1px {{textColor}};
            margin: 0 15px;
          }
          .ILS_numbers-row {
            display: flex;
            flex-direction: row;
            justify-content: center;
            width: 100%;
            height: 100px;
          }
          .ILS_digit {
            margin: 0 14px;
            width: 80px;
            border-radius: 10%;
            height: 80px;
            text-align: center;
            padding-top: 29px;
            font-size: 21px;
            color: {{buttonTextColor}};
            background-color: {{buttonColor}};
          }
          .ILS_digit.activated {
            -webkit-animation-name: ILS_buttonPress;
            animation-name: ILS_buttonPress;
            -webkit-animation-duration: 0.3;
            animation-duration: 0.3s;
          }
          .ILS_full {
            background-color:{{textColor}}!important;
          }
          .ILS_shake {
            -webkit-animation-name: ILS_shake;
            animation-name: ILS_shake;
            -webkit-animation-duration: 0.5;
            animation-duration: 0.5s;
            -webkit-animation-fill-mode: both;
            animation-fill-mode: both;
          }
      </style>
      <div class="ILS_lock" ng-class="!_showLockScreen ?  'ILS_lock-hidden' : ''">
        <div class="ILS_label-row">
          {{passcodeLabel}}
        </div>
        <div class="ILS_circles-row" ng-class="passcodeWrong ?  'ILS_shake' : ''">
          <div class="ILS_circle" ng-class=" enteredPasscode.length>0 ? 'ILS_full' : ''"></div>
          <div class="ILS_circle" ng-class=" enteredPasscode.length>1 ? 'ILS_full' : ''"></div>
          <div class="ILS_circle" ng-class=" enteredPasscode.length>2 ? 'ILS_full' : ''"></div>
          <div class="ILS_circle" ng-class=" enteredPasscode.length>3 ? 'ILS_full' : ''"></div>
        </div>
        <div class="ILS_numbers-row">
          <div ng-click="digit(1)" class="ILS_digit">1</div>
          <div ng-click="digit(2)" class="ILS_digit">2</div>
          <div ng-click="digit(3)" class="ILS_digit">3</div>
        </div>
        <div class="ILS_numbers-row">
          <div ng-click="digit(4)" class="ILS_digit">4</div>
          <div ng-click="digit(5)" class="ILS_digit">5</div>
          <div ng-click="digit(6)" class="ILS_digit">6</div>
        </div>
        <div class="ILS_numbers-row">
          <div ng-click="digit(7)" class="ILS_digit">7</div>
          <div ng-click="digit(8)" class="ILS_digit">8</div>
          <div ng-click="digit(9)" class="ILS_digit">9</div>
        </div>
        <div class="ILS_numbers-row">
          <div ng-click="digit(0)" class="ILS_digit">0</div>
        </div>
      </div>
    `,
  };
};

angular.module('ionic-lock-screen', []);
angular.module('ionic-lock-screen').directive('lockScreen', lockScreenDirective);
angular.module('ionic-lock-screen').service('$lockScreen', lockScreenService);
