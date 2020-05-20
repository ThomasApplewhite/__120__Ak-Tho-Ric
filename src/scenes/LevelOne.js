class LevelOne extends Phaser.Scene{
    constructor(){
        super("levelOneScene");
    }

    preload(){
    }

    create(){
        SceneLoad.genericCreate(this, 'cave_texture_map');
    }

    update(){
        //game functionality
        if(!this.gameOver){
            //entity updating
            this.player.update();
            //this.textUpdate();
        }
    }

    /*//Will be moved to a UI group eventually
    textUpdate(){
        this.scoreText.setText("Score: " + this.player.score);
    }

    //Will be moved to a UI group eventually
    meterUpdate(param){
        if(param == 0){
            this.magicMissileMeter[0].visible = false;
            this.magicMissileMeter[1].visible = false;
            this.magicMissileMeter[2].visible = false;
        }else if(param <= 3){
            this.magicMissileMeter[param-1].visible = true;
        }
    }

    //Will be moved to a UI group eventually
    healthUpdate(param){
        this.heartMeter[param-1].visible = false;
    }*/

    finishGame(){
        let scores = this.player.exportScores();
        game.registry.set("score", scores[0]);
        game.registry.set("bodyCount", scores[1]);
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.scene.start("endScene");
            },
            callbackScope: this,
            loop: false
        });
    }
}