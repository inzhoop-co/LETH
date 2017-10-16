var dappleth = (function(){ 
    var dappContract;
    var path = "repository/Ropsten/3/assets/";
    var birdURI;
    var pipeURI;
    var jumpBtnURI;
    var jumpURI;
    var bkgTabletURI;
    var bkgPhoneURI;

    var divH = document.getElementsByClassName('scroll')[0].clientHeight;
    var divW = document.getElementsByClassName('scroll')[0].clientWidth;
    var blocks = Math.floor(divH/60);
    
    var game = new Phaser.Game(divW, divH, Phaser.AUTO, 'gameDiv');

    var mainState = {

        preload: function() {
            game.scale.pageAlignHorizontally = true;
            game.scale.pageAlignVertically = true;

            game.stage.backgroundColor = '#71c5cf';
            
           
            if(divH>600)
                game.load.image('sky',  path + 'sky_tablet.png');
            else
                game.load.image('sky',  path + 'sky_phone.png');

        
            game.load.image('bird',  path + 'eth.png');
            game.load.image('pipe', path + 'chain.png');
            game.load.image('jumpbutton', path + 'jump.png');

            // Load the jump sound
            game.load.audio('jump', path + 'jump.wav');
            
        },

        create: function() {
            game.add.image(0, 0, 'sky')

            game.physics.startSystem(Phaser.Physics.ARCADE);

            this.pipes = game.add.group();
            this.pipes.enableBody = true;
            this.pipes.createMultiple(20, 'pipe');
            this.timer = this.game.time.events.loop(1500, this.addRowOfPipes, this);

            this.bird = this.game.add.sprite(100, 245, 'bird');
            game.physics.arcade.enable(this.bird);
            this.bird.body.gravity.y = 1000;

            // New anchor position
            this.bird.anchor.setTo(-0.2, 0.5);

            var jumpbutton = game.add.button(game.world.centerX -50, divH -60, 'jumpbutton', this.jump, this, 2, 1, 0);
          
            var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            spaceKey.onDown.add(this.jump, this); 
            game.input.onDown.add(this.jump, this);
            
            this.score = 0;
            this.labelScore = this.game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });
            
            // Add the jump sound
            this.jumpSound = this.game.add.audio('jump');
            this.jumpSound.volume = 0.2;
        },

        update: function() {
            if (this.bird.inWorld == false)
                this.restartGame();

            game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);

            // Slowly rotate the bird downward, up to a certain point.
            if (this.bird.angle < 15)
                this.bird.angle += 1;
        },

        jump: function() {
            // If the bird is dead, he can't jump
            if (this.bird.alive == false)
                return;

            this.bird.body.velocity.y = -350;

            // Jump animation
            game.add.tween(this.bird).to({angle: -15}, 100).start();

            // Play sound
            this.jumpSound.play();
        },

        hitPipe: function() {
            // If the bird has already hit a pipe, we have nothing to do
            if (this.bird.alive == false)
                return;

            // Set the alive property of the bird to false
            this.bird.alive = false;

            // Prevent new pipes from appearing
            this.game.time.events.remove(this.timer);

            // Go through all the pipes, and stop their movement
            this.pipes.forEachAlive(function(p){
                p.body.velocity.x = 0;
            }, this);
        },

        restartGame: function() {
            game.state.start('main');
        },

        addOnePipe: function(x, y) {
            var pipe = this.pipes.getFirstDead();
            if(pipe){
                pipe.reset(x, y);
                pipe.body.velocity.x = -200;
                pipe.checkWorldBounds = true;
                pipe.outOfBoundsKill = true;
            }
        },

        addRowOfPipes: function() {
            var hole = Math.floor(Math.random()*5)+1;

            for (var i = 0; i < blocks; i++)
                if (i != hole && i != hole +1)
                    this.addOnePipe(divW, i*60+10);

            this.score += 1;
            this.labelScore.text = this.score;
    
         },
    };

    var _init = function(core) {
        $scope = core.scope;
        $service = core.service;
        Dapp = $scope.Dapp.activeApp;
        _start();
    };

    var _start = function() {
        game.state.add('main', mainState);
        game.state.start('main');
    };

    return {
        run: _init
    };

})();
