var dappleth = (function(){ 
    var dappContract;
    var $scope;
    var $service;
    var path = "repository/Ropsten/4/";
    var video;

    var divH = document.getElementsByClassName('scroll')[0].clientHeight;
    var divW = document.getElementsByClassName('scroll')[0].clientWidth;
    var game;

    var _init = function(core) {
        $scope = core.scope;
        $service = core.service;

        Dapp = $scope.Dapp.activeApp;

        _start();       
    }

    var _exit = function(){
        video.stop();
        game.destroy();
    }

    var _start = function() {
        $scope.dappRefresh = function(value){
            $scope.$broadcast('scroll.refreshComplete');
        }

        game = new Phaser.Game(divW, divH, Phaser.CANVAS, 'gameDiv', { preload: preload, create: create });

        game.stateTransition = game.plugins.add(Phaser.Plugin.StateTransition);
        game.stateTransition.configure({
            duration: Phaser.Timer.SECOND * 0.8,
            ease: Phaser.Easing.Exponential.InOut,
            properties: {
                alpha: 0,
                scale: {
                    x: 1.4,
                    y: 1.4
                }
            }
        });
        
        stage.disableVisibilityChange = true;                         //Not pause the game if the browser tab loses focus
        scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;               //Shows the entire game while maintaining proportions
        scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        scale.pageAlignHorizontally = true;                           //Align the game
        scale.pageAlignVertically = true;
        if (game.device.desktop)                                     //In mobile force the orientation
        {
            scale.forceOrientation(true, false);
            scale.enterIncorrectOrientation.add(enterIncorrectOrientation, this);
            scale.leaveIncorrectOrientation.add(leaveIncorrectOrientation, this);
        }
        game.scale.setMaximum();
        scale.setScreenSize(true);

        function preload() {

            game.add.text(50, 250, "Loading...", { font: "25px Arial", fill: "#ff0044" });

            game.load.video('space', path + 'assets/Inzhoop_Leth.mp4');

        }


        function create() {

            

            video = game.add.video('space');

            video.play(true);
            
            //  x, y, anchor x, anchor y, scale x, scale y
            video.addToWorld();

        }
    };

    return {
        run: _init,
        exit: _exit
    };

})();
