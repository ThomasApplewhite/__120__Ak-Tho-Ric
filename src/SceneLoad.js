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
    static genericCreate(scene, tilemap, tileset){
        //setting keyboard controls
        keyLEFT  =  scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT =  scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP    =  scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN  =  scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyQ     =  scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);   //punch
        keyE     =  scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);   //magic missile
        keyW     =  scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);   //dash

        /*
            creating object groups
        */

        //creating the group to hold all the enemies
        scene.enemyGroup = scene.add.group({
            classType: Phaser.GameObjects.Sprite.Enemy,
            active: true,
            maxSize: -1,
            runChildUpdate: true
        });

        //creating the group to hold all the friendly attacks
        scene.attackGroup = scene.add.group({
            classType: Phaser.GameObjects.Attack,
            active: true,
            maxSize: -1,
            runChildUpdate: true
        });

        //creating the group to hold all the friendly attacks
        scene.hostileAttackGroup = scene.add.group({
            classType: Phaser.GameObjects.Attack,
            active: true,
            maxSize: -1,
            runChildUpdate: true
        });

        //creating the group to hold all the 'collectable' entities
        scene.collectableGroup = scene.add.group({
            classType: Phaser.GameObjects.Sprite,
            active: true,
            maxSize: -1,
            runChildUpdate: false   //I'll set this to true if I need to later
        });

        //creating the group to hold fogs (items that do effects when stood in)
        scene.fogGroup = scene.add.group({
            classType: Phaser.GameObjects.Sprite.Enemy,
            active: true,
            maxSize: -1,
            runChildUpdate: false   //I'll set this to true if I need to later
        })

        //creating particle manager
        //scene.particleManager = scene.add.particles('particle');

        //creating sounds
        scene.punchSFX = scene.sound.add('punchSound');
        scene.mmShotSFX = scene.sound.add('magic_missile_firingSound');
        scene.mmBlastSFX = scene.sound.add('magic_missile_explosionSound');
        scene.bossLaughSFX = scene.sound.add('bossLaugh');

        /*
            creating entities and their logic
        */
        //setting background and also spawning entities
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
            //generate background off of tilemap
            let tilemapKey = new String(tilemap);
            let tileset = tilemapKey.concat("_tiles");
            let tilesetName = tilemap.substring(0, tilemap.length - 4);

            console.log("trying to build " + tilemapKey + " with " + tilesetName + ": " + tileset);

            scene.tilemap = scene.add.tilemap(tilemapKey);
            scene.tilemap.addTilesetImage(tilesetName, tileset,);
            console.log(scene.tilemap.getTilesetIndex(tilesetName));
            console.log(scene.tilemap.getTileset(tilesetName));

            let tileCenterX = (game.config.width + scene.tilemap.widthInPixels) / 2;
            let tileCenterY = (game.config.height + scene.tilemap.heightInPixels) / 2;
            //tileCenterX, tileCenterY

            scene.tilemap.createStaticLayer("Floor", scene.tilemap.tilesets[0]);
            scene.tilemap.createStaticLayer("Walls", scene.tilemap.tilesets[0]).setCollisionByProperty({collides: true});
            scene.tilemap.createDynamicLayer("Entities", scene.tilemap.tilesets[0]).forEachTile(
                SceneLoad.tileMapEntitySpawn, scene
            );
        }

        //create stat display
        scene.player.stats = new StatDisplay(scene);

        //starting camera follow
        scene.cameras.main.startFollow(scene.player).setBounds(
            0, 
            0,
            scene.tilemap.widthInPixels,
            scene.tilemap.heightInPixels
        ).setZoom(1.5); //how far in the camera is zoomed in by default

        //create distortion fog
        SceneLoad.distortionGenerator(scene, scene.distortionFactor.count, scene.tilemap);
        //The 20 is how many clouds are made. They're made on every level right now
        
        /*
            creating colliders
            these should be specifically idenntified
        */
        scene.physics.add.collider(scene.player, scene.obstacleGroup, function(player){
            player.startStun(250);
        });
        //Might be depreceated?
        scene.physics.add.collider(scene.player, scene.enemyGroup, function(player, enemy){
            enemy.onAttack(player);
        });
            //bUt tHOMAs scene Is AN oVeRlAP!!!1!111!! fuck outta here
            //fuck outta here colliders are ineffective
        scene.physics.add.overlap(scene.attackGroup, scene.enemyGroup, function(attack, target){
            attack.strike(target);
        });
        scene.physics.add.overlap(scene.hostileAttackGroup, scene.player, function(attack, target){
            attack.strike(target);
        });
        scene.physics.add.overlap(scene.fogGroup, scene.player, function(fog, player){
            fog.onAttack(player);
        });
        scene.physics.add.collider(scene.attackGroup, scene.tilemap.getLayer("Walls").tilemapLayer, function(attack, target){
            //to simulate that it has struck nothing
            attack.strike(null);
        });
        scene.physics.add.collider(scene.hostileAttackGroup, scene.tilemap.getLayer("Walls").tilemapLayer, function(attack, target){
            //to simulate that it has struck nothing
            attack.strike(null);
        });
        scene.physics.add.collider(scene.collectableGroup, scene.player, function(collectable){
            collectable.onPickup();
        });
        //creating colliders for things that just need to collide
        scene.physics.add.collider(scene.player, scene.tilemap.getLayer("Walls").tilemapLayer);
        scene.physics.add.collider(scene.enemyGroup, scene.tilemap.getLayer("Walls").tilemapLayer);
        scene.physics.add.collider(scene.enemyGroup, scene.enemyGroup);

        //background music
        if(scene.backgroundMusic != null){
            scene.bgm = scene.sound.add(scene.backgroundMusic);
            scene.sound.play(scene.bgm.key, {loop: true});
        }

        //game-over flag
        scene.gameOver = false;

        //MIGHT BE DEPRECIATED
        //boss-spawning variables
        scene.bossLevel = 1;         //should start at 1
        scene.killsUntilBoss = 15;    //should start at 15
        scene.bossActive = false;
        scene.boss;

        
    }

    static tileMapEntitySpawn(tile){
        let entityName = tile.properties.entity;

        //unlike everything else in this script,
        //this method is called on an object, thus
        //everything is created by using 'this'
        //rather than 'scene'

        //it also checks entities directly by name,
        //which isn't super efficient but the amount of
        //enemies is small. I'm sure I can set it some other way too.

        if(entityName == "Player"){
            //creating the player
            this.player = new Player(
                this, 
                tile.pixelX, 
                tile.pixelY-64, 
                'entities',
                'om_punch4'
            );
        }
        else if(entityName == "Zombie"){
            this.enemyGroup.add(new Zombie(
                this,               //scene
                tile.pixelX,        //x
                tile.pixelY-64,     //y
                'entities',          //sprite
                'zom_walk1',    //start frame of anim
                )
            );
        }
        else if(entityName == "Frog"){
            this.enemyGroup.add(new Frog(
                this,               //scene
                tile.pixelX,        //x
                tile.pixelY-64,     //y
                'entities',          //sprite
                'fm_walk1',    //start frame of anim
                )
            );
        }
        else if(entityName == "SkeletonKnightBoss"){
            this.boss = new SkeletonKnightBoss(
                this,               //scene
                tile.pixelX,        //x
                tile.pixelY-64,     //y
                'entities',          //sprite
                'sb_dominating_strike18',      //start frame of anim
                this.bossFactor                   //boss level
                );
            this.enemyGroup.add(this.boss);
        }
        else if(entityName == "DreadEyes"){
            this.boss = new DreadEyes(
                this,               //scene
                tile.pixelX,        //x
                tile.pixelY-64,     //y
                'entities',          //sprite
                'de_blight_beams1',      //start frame of anim
                this.bossFactor                   //boss level
                );
            this.enemyGroup.add(this.boss);
        }
        else if(entityName == "BreakableWall"){
            this.enemyGroup.add(new BreakableWall(
                this,               //scene
                tile.pixelX+32,        //x
                tile.pixelY+32,     //y
                'breakable_wall_tiles',
                //tiled counts these from one, but phaser counts them from zero.
                tile.properties.orientation-1
                )
            );
        }
        else if(entityName != null){
            console.log("TILE " + entityName + " NOT FOUND. ENEMY NOT SPAWNED");
        }

        if(tile != null){
            tile.setAlpha(0);
            tile.destroy();
        }
    }

    static distortionGenerator(scene, count, tilemap){
        let coords;
        while(count > 0){
            coords = {
                x: Phaser.Math.Between(0, tilemap.widthInPixels),
                y: Phaser.Math.Between(0, tilemap.heightInPixels)
            }
            //only spawn the fog if it spawns within half a tile of the player
            if(Phaser.Math.Distance.Between(coords.x, coords.y, scene.player.x, scene.player.y) > 32){
                scene.fogGroup.add(new Distortion(scene, coords.x, coords.y, 'distortion_effect'));
                --count;
            }
        }
    }
}