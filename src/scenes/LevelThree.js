class LevelThree extends Phaser.Scene{
    constructor(){
        super("levelThreeScene");
    }

    preload(){
        this.nextScene = "levelFourScene";
        this.bossFactor = 2;
    }

    create(){
        SceneLoad.genericCreate(this, 'level_three_map');
    }

    update(){
        //game functionality
        if(!this.gameOver){
            //entity updating
            this.player.update();
        }
    }

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