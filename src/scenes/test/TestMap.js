class TestMap extends Phaser.Scene{
    constructor(){
        super("testMapScene");
    }

    preload(){
        this.nextScene = "levelOneScene";
        this.bossFactor = 1;
    }

    create(){
        
        SceneLoad.genericCreate(this, 'placeholder_map');

        this.enemyGroup.addMultiple([
            new Frog(
                this,               //scene
                1000,        //x
                500,     //y
                'frog',          //sprite
                0,    //start frame of anim
            ),
            new Frog(
                this,               //scene
                1250,        //x
                500,     //y
                'frog',          //sprite
                0,    //start frame of anim
            ),
            new Frog(
                this,               //scene
                1500,        //x
                500,     //y
                'frog',          //sprite
                0,    //start frame of anim
            ),
        ]);

        this.keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update(){
        //game functionality
        if(!this.gameOver){
            //entity updating
            this.player.update();
            //this.textUpdate();
        }

        if(this.keySPACE.isDown){
            this.cameras.main.setZoom(1);
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