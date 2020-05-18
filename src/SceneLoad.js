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
        keyQ     =  scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);   //punch
        keyE     =  scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);   //magic missile
        keyW     =  scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);   //dash

        /*
            creating object groups
        */
        //DEPRECIATED 
        //creating the group to hold all the obstacles
        scene.obstacleGroup = scene.add.group({
            classType: Phaser.GameObjects.Sprite.Obstacle,
            defaultKey: null,               //default texture to use
            defaultFrame: null,             //default animation frame start to use
            active: true,
            maxSize: 15,
            runChildUpdate: true,
            createCallback: null,           //what to do when an object is added to the group
            removeCallback: null,           //what to do when an object is removed from the group
            createMultipleCallback: null    //what to do when multiple objects are added to the group
        });

        //creating the group to hold all the enemies
        scene.enemyGroup = scene.add.group({
            classType: Phaser.GameObjects.Sprite.Enemy,
            active: true,
            maxSize: -1,
            runChildUpdate: true
        });

        //creating the group to hold all the attacks
        scene.attackGroup = scene.add.group({
            classType: Phaser.GameObjects.Sprite,
            active: true,
            maxSize: -1,
            runChildUpdate: true
        });

        //creating particle manager


        
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

            scene.tilemap = scene.add.tilemap(tilemapKey);
            scene.tilemap.addTilesetImage(tilesetName, tileset,);

            let tileCenterX = (game.config.width + scene.tilemap.widthInPixels) / 2;
            let tileCenterY = (game.config.height + scene.tilemap.heightInPixels) / 2;
            //tileCenterX, tileCenterY

            scene.tilemap.createStaticLayer("Floor", scene.tilemap.tilesets[0]);
            scene.tilemap.createStaticLayer("Walls", scene.tilemap.tilesets[0]).setCollisionByProperty({collides: true});
            scene.tilemap.createDynamicLayer("Entities", scene.tilemap.tilesets[0]).forEachTile(
                SceneLoad.tileMapEntitySpawn, scene
            );
        }

        //starting camera follow
        scene.cameras.main.startFollow(scene.player).setBounds(
            0, 
            0,
            scene.tilemap.widthInPixels,
            scene.tilemap.heightInPixels
        );

        /*
            creating spawning timers
            DEPRECIATED
        */
        //obstacle spawning timer
        scene.obstacleSpawnTimer = scene.time.addEvent({
            delay: 500,                // ms
            callback: scene.createObstacle,
            //args: [],
            callbackScope: scene,
            loop: true
        });
        
        //enemy spawning timer
        scene.enemySpawnTimer = scene.time.addEvent({
            delay: 750,
            callback: scene.createEnemy,
            //args: [],
            callbackScope: scene,
            loop: true
        });
        
        /*
            creating colliders
        */
        scene.physics.add.collider(scene.player, scene.obstacleGroup, function(player){
            player.startStun(250);
        });
        scene.physics.add.collider(scene.player, scene.enemyGroup, function(player, enemy){
            enemy.onAttack(player);
        });
            //bUt tHOMAs scene Is AN oVeRlAP!!!1!111!! fuck outta here
            //fuck outta here colliders are ineffective
        scene.physics.add.overlap(scene.attackGroup, scene.enemyGroup, function(attack, enemy){
            attack.strike(enemy);
        })
        scene.physics.add.collider(scene.attackGroup, scene.tilemap.getLayer("Walls").tilemapLayer, function(attack, enemy){
            //to simulate that it has struck nothing
            attack.strike(null);
        })
        scene.physics.add.overlap(scene.attackGroup, scene.player, function(attack, player){
            //to simulate that it has struck nothing
            attack.strike(player);
        })
        //creating colliders for things that just need to collide
        scene.physics.add.collider(scene.player, scene.tilemap.getLayer("Walls").tilemapLayer);
        scene.physics.add.collider(scene.enemyGroup, scene.tilemap.getLayer("Walls").tilemapLayer);
        scene.physics.add.collider(scene.enemyGroup, scene.enemyGroup);
        //scene.physics.add.collider(scene.enemyGroup, scene.invisibleWallsGroup);

        /*
            creating UI
            NEEDS IMPROVEMENT
        */
        scene.uiConfig = {
            fontFamily: 'PermanentMarker',
            fontSize: '28px',
            //backgroundColor: '#F3B141',
            color: '#6ABE30',
            align: 'left',
            stroke: '#000000',
            strokeThickness: 10,
            fixedWidth: 0
        }
        //METER COUNTER DEPRECIATED
        //scene.meterText = scene.add.text(20, 20, "Meters: 0", scene.uiConfig).setScrollFactor(0);
        //scene.meterText.depth = 1;
        //scene.uiConfig.color = '#D62109';
        //scene.uiConfig.align = 'right';
        scene.scoreText = scene.add.text(20, 20, "Score: 0", scene.uiConfig,).setScrollFactor(0);
        scene.scoreText.depth = 1;
        scene.magicMissileMeter = [
            scene.add.sprite(game.config.width - 40, 110, 'magic_missileUI').setScrollFactor(0),
            scene.add.sprite(game.config.width - 110, 110, 'magic_missileUI').setScrollFactor(0),
            scene.add.sprite(game.config.width - 180, 110, 'magic_missileUI').setScrollFactor(0)
        ];
        scene.magicMissileMeter[0].depth = 1;
        scene.magicMissileMeter[1].depth = 1;
        scene.magicMissileMeter[2].depth = 1;
        scene.heartMeter = [
            scene.add.sprite(game.config.width - 40, 40, 'heartUI').setScrollFactor(0),
            scene.add.sprite(game.config.width - 110, 40, 'heartUI').setScrollFactor(0),
            scene.add.sprite(game.config.width - 180, 40, 'heartUI').setScrollFactor(0)
        ]
        scene.heartMeter[0].depth = 1;
        scene.heartMeter[1].depth = 1;
        scene.heartMeter[2].depth = 1;

        //game-over flag
        scene.gameOver = false;

        //MIGHT BE DEPRECIATED
        //boss-spawning variables
        scene.bossLevel = 1;         //should start at 1
        scene.killsUntilBoss = 15;    //should start at 15
        scene.bossActive = false;
        scene.boss;

        
    }

    defineGroups(){
        //INVISIBLE WALLS DEPCRECIATED. MARKING FOR CLEANUP
        //creating invisible walls
        //don't forget to make these, ya know, actually invisible
        scene.invisibleWallsGroup = scene.add.group({
            classType: Phaser.Physics.Arcade.Sprite,
            active: true,
            runChildUpdate: false
        }).addMultiple([
            scene.physics.add.sprite(-50, config.height/2, 'invisible_wall').setImmovable().setVisible(false),
            scene.physics.add.sprite(config.width+50, config.height/2, 'invisible_wall').setImmovable().setVisible(false),
            scene.physics.add.sprite(config.width/2, 149, 'invisible_wall_rotated').setImmovable().setVisible(false)
        ]);
        
        //creating the group to hold all the obstacles
        scene.obstacleGroup = scene.add.group({
            classType: Phaser.GameObjects.Sprite.Obstacle,
            defaultKey: null,               //default texture to use
            defaultFrame: null,             //default animation frame start to use
            active: true,
            maxSize: 15,
            runChildUpdate: true,
            createCallback: null,           //what to do when an object is added to the group
            removeCallback: null,           //what to do when an object is removed from the group
            createMultipleCallback: null    //what to do when multiple objects are added to the group
        });

        //creating the group to hold all the enemies
        scene.enemyGroup = scene.add.group({
            classType: Phaser.GameObjects.Sprite.Enemy,
            active: true,
            maxSize: -1,
            runChildUpdate: true
        });

        //creating the group to hold all the attacks
        scene.attackGroup = scene.add.group({
            classType: Phaser.GameObjects.Sprite,
            active: true,
            maxSize: -1,
            runChildUpdate: true
        });        
    }

    //DEPRECIATED. MARKING FOR CLEANUP
    defineSpawnTimers(){
        //obstacle spawning timer
        scene.obstacleSpawnTimer = scene.time.addEvent({
            delay: 500,                // ms
            callback: scene.createObstacle,
            //args: [],
            callbackScope: scene,
            loop: true
        });
        
        //enemy spawning timer
        scene.enemySpawnTimer = scene.time.addEvent({
            delay: 750,
            callback: scene.createEnemy,
            //args: [],
            callbackScope: scene,
            loop: true
        });
    }

    defineColliders(){
        scene.physics.add.collider(scene.player, scene.obstacleGroup, function(player){
            player.startStun(250);
        });
        scene.physics.add.collider(scene.player, scene.enemyGroup, function(player, enemy){
            enemy.onAttack(player);
        });
            //bUt tHOMAs scene Is AN oVeRlAP!!!1!111!! fuck outta here
            //fuck outta here colliders are ineffective
        scene.physics.add.overlap(scene.attackGroup, scene.enemyGroup, function(attack, enemy){
            attack.strike(enemy);
        })
        scene.physics.add.overlap(scene.attackGroup, scene.obstacleGroup, function(attack, enemy){
            //to simulate that it has struck nothing
            attack.strike(null);
        })
        scene.physics.add.overlap(scene.attackGroup, scene.player, function(attack, player){
            //to simulate that it has struck nothing
            attack.strike(player);
        })
        //creating colliders for things that just need to collide
        scene.physics.add.collider(scene.player, scene.invisibleWallsGroup);
        scene.physics.add.collider(scene.enemyGroup, scene.obstacleGroup);
        scene.physics.add.collider(scene.enemyGroup, scene.enemyGroup);
        //scene.physics.add.collider(scene.enemyGroup, scene.invisibleWallsGroup);
    }

    defineUI(){
        scene.uiConfig = {
            fontFamily: 'PermanentMarker',
            fontSize: '28px',
            //backgroundColor: '#F3B141',
            color: '#6ABE30',
            align: 'left',
            stroke: '#000000',
            strokeThickness: 10,
            fixedWidth: 0
        }
        scene.meterText = scene.add.text(20, 20, "Meters: 0", scene.uiConfig).setScrollFactor(0);
        scene.meterText.depth = 1;
        scene.uiConfig.color = '#D62109';
        //scene.uiConfig.align = 'right';
        scene.scoreText = scene.add.text(20, 60, "Score: 0", scene.uiConfig,).setScrollFactor(0);
        scene.scoreText.depth = 1;
        scene.magicMissileMeter = [
            scene.add.sprite(game.config.width - 40, 110, 'magic_missileUI').setScrollFactor(0),
            scene.add.sprite(game.config.width - 110, 110, 'magic_missileUI').setScrollFactor(0),
            scene.add.sprite(game.config.width - 180, 110, 'magic_missileUI').setScrollFactor(0)
        ];
        scene.magicMissileMeter[0].depth = 1;
        scene.magicMissileMeter[1].depth = 1;
        scene.magicMissileMeter[2].depth = 1;
        scene.heartMeter = [
            scene.add.sprite(game.config.width - 40, 40, 'heartUI').setScrollFactor(0),
            scene.add.sprite(game.config.width - 110, 40, 'heartUI').setScrollFactor(0),
            scene.add.sprite(game.config.width - 180, 40, 'heartUI').setScrollFactor(0)
        ]
        scene.heartMeter[0].depth = 1;
        scene.heartMeter[1].depth = 1;
        scene.heartMeter[2].depth = 1;
    }

    //spawn entities on the map based on tile placements
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
        else if(entityName == "SkeletonKnightBoss"){
            this.boss = new SkeletonKnightBoss(
                this,               //scene
                tile.pixelX,        //x
                tile.pixelY-64,     //y
                'entities',          //sprite
                'sb_dominating_strike18',      //start frame of anim
                3
                );
            this.enemyGroup.add(this.boss);
        }
        else if(entityName == "BreakableWall"){
            this.enemyGroup.add(new BreakableWall(
                this,               //scene
                tile.pixelX+32,        //x
                tile.pixelY+32,     //y
                'breakable_wall'
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
}