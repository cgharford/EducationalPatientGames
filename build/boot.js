module.exports = {

            init: function () {

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

            create: function () {

                this.game.state.start("Wrapper");
            },

            enterIncorrectOrientation: function () {
                document.getElementById('game-container').style.display = 'none';
                document.getElementById('orientation').style.display = 'block';

            },

            leaveIncorrectOrientation: function () {
                document.getElementById('game-container').style.display = 'block';
                document.getElementById('orientation').style.display = 'none';
                window.location.reload();

            }

    };