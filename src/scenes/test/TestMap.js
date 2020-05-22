class TestMap extends Phaser.Scene{
    constructor(){
        super("testMapScene");
    }

    preload(){

    }

    create(){
        SceneLoad.genericCreate(this, 'placeholder_map');

        this.boss = new SkeletonKnightBoss(
            this,               //scene
            100,        //x
            100,     //y
            'entities',          //sprite
            'sb_dominating_strike18',      //start frame of anim
            3
            );
        this.enemyGroup.add(this.boss);
    }

    update(){
        //game functionality
        if(!this.gameOver){
            //entity updating
            this.player.update();
            //this.textUpdate();
        }
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