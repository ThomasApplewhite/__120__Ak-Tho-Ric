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

        //this.cameras.main.setTint('#FF0000')

        this.enemyGroup.addMultiple([
            new Zombie(
                this,               //scene
                600,        //x
                500,     //y
                'entities',          //sprite
                'zom_walk1',    //start frame of anim
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