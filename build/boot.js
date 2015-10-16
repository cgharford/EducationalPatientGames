module.exports = {
	/**
  *boot class. The boot object, boot state of the game
  
  *@class boot
  */
            /**
             * initialize 
             * @method init
             * 
             */
            init: function () {
                //this.JQuery.cookie('high_scores', [150, 80, 10])
                this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                this.scale.setMinMax(480, 260, 1024, 768);
                this.scale.pageAlignHorizontally = true;
                this.scale.pageAlignVertically = true;

                if (!(this.game.device.desktop)){
                    this.scale.forceOrientation(true, false);
                    this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
                    this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
                }

            },

            /**
             * Phaser create function, starts next state "Wrapper"
             * @method create
             * 
             */
            create: function () {

                this.game.state.start("Wrapper");
            },

            /**
             * fixes orientation of game
             * @method enterIncorrectOrientation
             * @return 
             */
            enterIncorrectOrientation: function () {
                document.getElementById('game-container').style.display = 'none';
                document.getElementById('orientation').style.display = 'block';

            },

            /**
             * preserves orientation of game
             * @method leaveIncorrectOrientation
             *  
             */
            leaveIncorrectOrientation: function () {
                document.getElementById('game-container').style.display = 'block';
                document.getElementById('orientation').style.display = 'none';
                window.location.reload();

            }

    };