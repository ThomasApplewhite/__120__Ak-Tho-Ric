class TestMap extends Phaser.Scene{
    constructor(){
        super("testMapScene");
    }

    preload(){
        this.nextScene = "levelOneScene";
        this.bossFactor = 1;
        this.distortionFactor = {count: 0, damage: 3};
    }

    create(){
        
        SceneLoad.genericCreate(this, 'placeholder_map');

        //this.cameras.main.setTint('#FF0000')

        /*this.boss = new DreadEyes(
            this,               //scene
            500,        //x
            500,     //y
            'entities',          //sprite
            'de_blight_beams1',      //start frame of anim
            this.bossFactor                   //boss level
            );
        this.enemyGroup.add(this.boss);*/

        //new Portal(this, 300, 300, 'attacks', 'portal', 'menuScene');

        /*this.boss = new SkeletonKnightBoss(
            this,               //scene
            500,        //x
            500,     //y
            'entities',          //sprite
            'sb_dominating_strike18',      //start frame of anim
            this.bossFactor                   //boss level
            );
        this.enemyGroup.add(this.boss);*/

        /*this.enemyGroup.add(new Frog(
            this,               //scene
            64*3,        //x
            64*3,     //y
            'entities',          //sprite
            'fm_walk1',    //start frame of anim
            )
        );*/

        this.enemyGroup.add(new Zombie(
            this,               //scene
            300,        //x
            300,     //y
            'entities',          //sprite
            'zom_walk1',    //start frame of anim
            )
        );

        //this.add.sprite(this.player.x, this.player.y, 'entities', 'bw_break1').anims.play('wall_breakAnim');

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