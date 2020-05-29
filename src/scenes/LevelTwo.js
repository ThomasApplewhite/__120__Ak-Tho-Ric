class LevelTwo extends Phaser.Scene{
    constructor(){
        super("levelTwoScene");
    }

    preload(){
        this.nextScene = "levelThreeScene";
        this.bossFactor = 1;
    }

    create(){
        SceneLoad.genericCreate(this, 'level_two_map');
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