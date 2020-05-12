class TestMap extends Phaser.Scene{
    constructor(){
        super("testMapScene");
    }

    preload(){
        //helpful array for obstacle generation
        this.obstacleList = ['rock1', 'rock2', 'rock3', 'rock4', 'rock5', 'rock6'];
    }

    create(){
        SceneLoad.genericCreate(this, null);
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
            if(!this.bossActive && this.killsUntilBoss <= this.player.bodyCount){
                this.boss = new SkeletonKnightBoss(
                    this,                                   //scene
                    config.width/2,                         //x
                    -325,                                    //y
                    'enemies',                   //sprite
                    'mid_attack1',                                      //start frame of anim
                    this.bossLevel
                    )
                this.enemyGroup.add(this.boss);
            }
        }
    }

    createObstacle(){
        let obstacle = this.obstacleList[Phaser.Math.Between(0, this.obstacleList.length-1)];
        if(!this.gameOver && !this.obstacleGroup.isFull()){
            this.obstacleGroup.add(new Obstacle(
                this,                                   //scene
                Phaser.Math.Between(0, config.width),   //x
                -32,                                    //y
                'obstacles',                                //sprite
                obstacle
                )
            );
        }
    }

    createEnemy(){
        if(!this.gameOver && !this.enemyGroup.isFull()){
            this.enemyGroup.add(new Zombie(
                this,                                   //scene
                Phaser.Math.Between(0, config.width),    //x
                -32,                                    //y
                'enemies',                               //sprite
                'forward_walk1',                                      //start frame of anim
                )
            );
        }
    }

    textUpdate(){
        this.meterText.setText("Meters: " + this.player.distance);
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