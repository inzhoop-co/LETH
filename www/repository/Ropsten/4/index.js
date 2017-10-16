var dappleth = (function(){ 
    var dappContract;
    var $scope;
    var $service;
    var path = "repository/Ropsten/4/";
    var video;

    var divH = document.getElementsByClassName('scroll')[0].clientHeight;
    var divW = document.getElementsByClassName('scroll')[0].clientWidth;
    

    var _init = function(core) {
        $scope = core.scope;
        $service = core.service;

        Dapp = $scope.Dapp.activeApp;

        _start();       
    }


    var _start = function() {
        $scope.dappRefresh = function(value){
            $scope.$broadcast('scroll.refreshComplete');
        }

        var game = new Phaser.Game(divW, divH, Phaser.CANVAS, 'gameDiv', { preload: preload, create: create });

        function preload() {

            game.add.text(150, 150, "Loading videos...", { font: "25px Arial", fill: "#ff0044" });

            game.load.video('space', path + 'assets/wormhole.mp4');
        }

        var video;

        function create() {

            video = game.add.video('space');

            video.play(true);
            
            //  x, y, anchor x, anchor y, scale x, scale y
            video.addToWorld();

        }
    };

    return {
        run: _init
    };

})();
