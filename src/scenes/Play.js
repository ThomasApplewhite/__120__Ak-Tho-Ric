class Play extends Phaser.Scene{
    constructor(){
        super("playScene");
    }
    
    //for loading assets
    preload(){
        //helpful array for obstacle generation
        this.obstacleList = ['rock1', 'rock2', 'rock3', 'rock4', 'rock5', 'rock6'];
    }

    //placing scene objects before game start
    create(){
        //setting keyboard controls
        keyLEFT  =  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT =  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP    =  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN  =  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyQ     =  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        keyE     =  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);   //magic missile
        
        //setting background tiles
        this.background = this.add.tileSprite(
            0, 
            0, 
            config.width/2, 
            config.height/2, 
            'backgroundTile'
        ).setOrigin(0, 0).setScale(4);
        
        //creating particle manager

        //creating sounds
        this.punchSFX = this.sound.add('punchSound');
        this.mmShotSFX = this.sound.add('magic_missile_firingSound');
        this.mmBlastSFX = this.sound.add('magic_missile_explosionSound');
        this.bossLaughSFX = this.sound.add('bossLaugh');

        //creating the player
        this.player = new Player(
            this, 
            config.width/2, 
            config.height*2/3, 
            'player',
            'back_walk8'
        );

        //starting camera follow
        this.cameras.main.startFollow(this.player);
        
        //creating object groups
        this.defineGroups();

        //creating spawning timers
        this.defineSpawnTimers();
        
        //creating colliders
        this.defineColliders();

        //creating UI
        this.defineUI();
        
        //game-over flag
        this.gameOver = false;

        //boss-spawning variables
        this.bossLevel = 1;         //should start at 1
        this.killsUntilBoss = 15;    //should start at 15
        this.bossActive = false;
        this.boss;
    }

    //called once a frame
    update(){
        //background scrolling
        this.background.tilePositionY -= 1;

        //game functionality
        if(!this.gameOver){
            //entity updating
            this.player.update();
            this.textUpdate();

            //check to spawn boss
            if(!this.bossActive && this.killsUntilBoss <= this.player.bodyCount){
                this.boss = new SkeletonKnightBoss(
                    this,                                   //scene
                    config.width/2,                         //x
                    -325,                                    //y
                    'enemies',                   //sprite
                    'mid_attack1',                                      //start frame of anim
                    this.bossLevel
                    )
                this.enemyGroup.add(this.boss);
            }
        }
    }

    createObstacle(){
        let obstacle = this.obstacleList[Phaser.Math.Between(0, this.obstacleList.length-1)];
        if(!this.gameOver && !this.obstacleGroup.isFull()){
            this.obstacleGroup.add(new Obstacle(
                this,                                   //scene
                Phaser.Math.Between(0, config.width),   //x
                -32,                                    //y
                'obstacles',                                //sprite
                obstacle
                )
            );
        }
    }

    createEnemy(){
        if(!this.gameOver && !this.enemyGroup.isFull()){
            this.enemyGroup.add(new Zombie(
                this,                                   //scene
                Phaser.Math.Between(0, config.width),    //x
                -32,                                    //y
                'enemies',                               //sprite
                'forward_walk1',                                      //start frame of anim
                )
            );
        }
    }

    textUpdate(){
        this.meterText.setText("Meters: " + this.player.distance);
        this.scoreText.setText("Score: " + this.player.score);
    }

    meterUpdate(param){
        if(param == 0){
            this.magicMissileMeter[0].visible = false;
            this.magicMissileMeter[1].visible = false;
            this.magicMissileMeter[2].visible = false;
        }else if(param <= 3){
            this.magicMissileMeter[param-1].visible = true;
        }
    }

    healthUpdate(param){
        this.heartMeter[param-1].visible = false;
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

    //And now, a whole bunch of loading methods. Might just do this in a different file... nah...
    defineGroups(){
        //creating invisible walls
        //don't forget to make these, ya know, actually invisible
        this.invisibleWallsGroup = this.add.group({
            classType: Phaser.Physics.Arcade.Sprite,
            active: true,
            runChildUpdate: false
        }).addMultiple([
            this.physics.add.sprite(-50, config.height/2, 'invisible_wall').setImmovable().setVisible(false),
            this.physics.add.sprite(config.width+50, config.height/2, 'invisible_wall').setImmovable().setVisible(false),
            this.physics.add.sprite(config.width/2, 149, 'invisible_wall_rotated').setImmovable().setVisible(false)
        ]);
        
        //creating the group to hold all the obstacles
        this.obstacleGroup = this.add.group({
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
        this.enemyGroup = this.add.group({
            classType: Phaser.GameObjects.Sprite.Enemy,
            active: true,
            maxSize: 5,
            runChildUpdate: true
        });

        //creating the group to hold all the attacks
        this.attackGroup = this.add.group({
            classType: Phaser.GameObjects.Sprite,
            active: true,
            maxSize: -1,
            runChildUpdate: true
        });        
    }

    defineSpawnTimers(){
        //obstacle spawning timer
        this.obstacleSpawnTimer = this.time.addEvent({
            delay: 500,                // ms
            callback: this.createObstacle,
            //args: [],
            callbackScope: this,
            loop: true
        });
        
        //enemy spawning timer
        this.enemySpawnTimer = this.time.addEvent({
            delay: 750,
            callback: this.createEnemy,
            //args: [],
            callbackScope: this,
            loop: true
        });
    }

    defineColliders(){
        this.physics.add.collider(this.player, this.obstacleGroup, function(player){
            player.startStun(250);
        });
        this.physics.add.collider(this.player, this.enemyGroup, function(player, enemy){
            enemy.onAttack(player);
        });
            //bUt tHOMAs tHiS Is AN oVeRlAP!!!1!111!! fuck outta here
            //fuck outta here colliders are ineffective
        this.physics.add.overlap(this.attackGroup, this.enemyGroup, function(attack, enemy){
            attack.strike(enemy);
        })
        this.physics.add.overlap(this.attackGroup, this.obstacleGroup, function(attack, enemy){
            //to simulate that it has struck nothing
            attack.strike(null);
        })
        this.physics.add.overlap(this.attackGroup, this.player, function(attack, player){
            //to simulate that it has struck nothing
            attack.strike(player);
        })
        //creating colliders for things that just need to collide
        this.physics.add.collider(this.player, this.invisibleWallsGroup);
        this.physics.add.collider(this.enemyGroup, this.obstacleGroup);
        this.physics.add.collider(this.enemyGroup, this.enemyGroup);
        //this.physics.add.collider(this.enemyGroup, this.invisibleWallsGroup);
    }

    defineUI(){
        this.uiConfig = {
            fontFamily: 'PermanentMarker',
            fontSize: '28px',
            //backgroundColor: '#F3B141',
            color: '#6ABE30',
            align: 'left',
            stroke: '#000000',
            strokeThickness: 10,
            fixedWidth: 0
        }
        this.meterText = this.add.text(20, 20, "Meters: 0", this.uiConfig)
        this.meterText.depth = 1;
        this.uiConfig.color = '#D62109';
        //this.uiConfig.align = 'right';
        this.scoreText = this.add.text(20, 60, "Score: 0", this.uiConfig,)
        this.scoreText.depth = 1;
        this.magicMissileMeter = [
            this.add.sprite(game.config.width - 40, 110, 'magic_missileUI'),
            this.add.sprite(game.config.width - 110, 110, 'magic_missileUI'),
            this.add.sprite(game.config.width - 180, 110, 'magic_missileUI'),
        ];
        this.magicMissileMeter[0].depth = 1;
        this.magicMissileMeter[1].depth = 1;
        this.magicMissileMeter[2].depth = 1;
        this.heartMeter = [
            this.add.sprite(game.config.width - 40, 40, 'heartUI'),
            this.add.sprite(game.config.width - 110, 40, 'heartUI'),
            this.add.sprite(game.config.width - 180, 40, 'heartUI')
        ]
        this.heartMeter[0].depth = 1;
        this.heartMeter[1].depth = 1;
        this.heartMeter[2].depth = 1;
    }
}