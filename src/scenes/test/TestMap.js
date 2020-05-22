class TestMap extends Phaser.Scene{
    constructor(){
        super("testMapScene");
    }

    preload(){
        //helpful array for obstacle generation
        this.obstacleList = ['rock1', 'rock2', 'rock3', 'rock4', 'rock5', 'rock6'];
    }

    create(){
        SceneLoad.genericCreate(this, 'placeholder_map');

        this.enemyGroup.add(new DreadEyes(this, 0, 0, 'dread_eyes', 0, 3));
    }

    update(){
        //game functionality
        if(!this.gameOver){
            //entity updating
            this.player.update();
            //this.textUpdate();
        }
    }

    /*textUpdate(){
        //this.meterText.setText("Meters: " + this.player.distance);
        this.scoreText.setText("Score: " + this.player.score);
    }

    meterUpdate(param){
        if(param == 0){
            this.magicMissileMeter[0].visible = false;
            this.magicMissileMeter[1].visible = false;
            this.magicMissileMeter[2].visible = false;
        }else if(param <= 3){
            this.magicMissileMeter[param-1].visible = true;
        }
    }

    healthUpdate(param){
        this.heartMeter[param-1].visible = false;
    }*/

    finishGame(){
        let scores = this.player.exportScores();
        game.registry.set("score", scores[0]);
        game.registry.set("distance", scores[1]);
        game.registry.set("bodyCount", scores[2]);
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