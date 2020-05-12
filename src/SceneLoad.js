class SceneLoad extends Phaser.Scene{
    /*
    SceneLoad isn't actually a scene, rather it has access to
        scene functionality so it can handle loading and
        propagation/creation instead of the scene
    */

    //preloads generic scene assets
    static genericPreload(scene){
        //most generic preloading is handled in Load,
        //  but I'm leaving this method here just in case
    }

    //creates generic scene elements
    static genericCreate(scene, tilemap){
        //setting keyboard controls
        keyLEFT  =  scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT =  scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP    =  scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN  =  scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyQ     =  scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        keyE     =  scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);   //magic missile

        //setting background
        if(tilemap == null){
            scene.background = scene.add.tileSprite(
                0, 
                0, 
                config.width/2, 
                config.height/2, 
                'backgroundTile'
            ).setOrigin(0, 0).setScale(4);
        }
        else{
            ///generate background off of tilemap
        }
        
        
        //creating particle manager

        //creating sounds
        scene.punchSFX = scene.sound.add('punchSound');
        scene.mmShotSFX = scene.sound.add('magic_missile_firingSound');
        scene.mmBlastSFX = scene.sound.add('magic_missile_explosionSound');
        scene.bossLaughSFX = scene.sound.add('bossLaugh');

        //creating the player
        scene.player = new Player(
            scene, 
            config.width/2, 
            config.height*2/3, 
            'player',
            'back_walk8'
        );

        //starting camera follow
        scene.cameras.main.startFollow(scene.player);

        //game-over flag
        scene.gameOver = false;

        //boss-spawning variables
        scene.bossLevel = 1;         //should start at 1
        scene.killsUntilBoss = 15;    //should start at 15
        scene.bossActive = false;
        scene.boss;
    }
}