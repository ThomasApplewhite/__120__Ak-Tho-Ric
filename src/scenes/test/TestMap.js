class TestMap extends Phaser.Scene{
    constructor(){
        super("testMapScene");
    }

    preload(){
        this.nextScene = "levelOneScene";
        this.bossFactor = 1;
    }

    create(){
        console.log(this);
        

        //var particles = this.add.particles('particle');
        //this.particleManager = this.add.particles('particle');
        /*var emitter = this.particleManager.createEmitter();
        emitter.setPosition(600, 600);
        emitter.setSpeed(200);
        emitter.setBlendMode(Phaser.BlendModes.ADD);*/
        
        SceneLoad.genericCreate(this, 'placeholder_map');

        //particle Logic
        /*console.log("particling");
        if(this.scene.particleManager == null){
            console.log("Something's wrong with the manager");
        }
        console.log(this.scene.particleManager.texture);
        this.particleEmitter = this.particleManager.createEmitter();
        this.particleEmitter.setLifespan(1000);
        this.particleEmitter.startFollow(this.player);
        
        {
            x: this.player.x,
            y: this.particleEmitter.player.y,
            follow: this.player,
            frame: 0,
            lifespan: 1000,
            scale: 10,
            speed: 100,
            quantity: 100,
            blendMode: 'ADD'
        }
        
        console.log("particling done");*/

        this.boss = new SkeletonKnightBoss(
            this,               //scene
            300,        //x
            300,     //y
            'entities',          //sprite
            'sb_dominating_strike18',      //start frame of anim
            1           //level
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