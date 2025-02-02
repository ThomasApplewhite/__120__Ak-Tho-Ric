class LevelSix extends Phaser.Scene{
    constructor(){
        super("levelSixScene");
    }

    preload(){
        this.nextScene = "menuScene";
        this.bossFactor = 3;
        this.backgroundMusic = 'extreme_foe';
        this.distortionFactor = {count: 60, damage: 3};
    }

    create(){
        SceneLoad.genericCreate(this, 'level_six_map');
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
                this.sound.removeByKey(this.backgroundMusic);
                this.scene.start("endScene");
            },
            callbackScope: this,
            loop: false
        });
    }
}