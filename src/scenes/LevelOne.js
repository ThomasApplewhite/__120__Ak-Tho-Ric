class LevelOne extends Phaser.Scene{
    constructor(){
        super("levelOneScene");
    }

    preload(){
    }

    create(){
        SceneLoad.genericCreate(this, 'cave_texture_map');

        //temporarily removing obstacle and spawn timers
        this.obstacleSpawnTimer.paused = true;
        this.enemySpawnTimer.paused = true;

        console.log(this.tilemap);
    }

    update(){
        //background scrolling
        //this.background.tilePositionY -= 1;

        //game functionality
        if(!this.gameOver){
            //entity updating
            this.player.update();
            this.textUpdate();

            //check to spawn boss
            /*if(!this.bossActive && this.killsUntilBoss <= this.player.bodyCount){
                this.boss = new SkeletonKnightBoss(
                    this,                                   //scene
                    config.width/2,                         //x
                    -325,                                    //y
                    'enemies',                   //sprite
                    'mid_attack1',                                      //start frame of anim
                    this.bossLevel
                    )
                this.enemyGroup.add(this.boss);
            }*/
        }
    }

    textUpdate(){
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
    }

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