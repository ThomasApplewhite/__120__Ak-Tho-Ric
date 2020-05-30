class Load extends Phaser.Scene{
    constructor(){
        super('loadScene');

        this.textConfig = {
            color: '#ffffff',
            align: 'left'
        }
        this.textSpace = 20;
        this.textShift = 20;

        this.starting = false;
    }

    preload(){
        this.add.text(this.textShift, this.textSpace, "Loading images...", this.textConfig);
        this.textSpace += 20;

        this.load.image('title', './assets/Title.png');
        //this.load.image('start_button', './assets/start_button.png');

        //placeholder assets   
        this.load.image('placeholder_map_tiles', './assets/placeholders/tiles_placeholder.png');
        this.load.tilemapTiledJSON('placeholder_map', './assets/placeholders/tilemap_placeholder.json'); 
        this.load.image('breakable_wall', './assets/placeholders/breakableWall_placeholder.png');
        this.load.image('dread_eyes', './assets/placeholders/dread_eyes_placeholder.png');
        this.load.image('blight_beam', './assets/placeholders/blight_beam_placeholder.png');
        this.load.image('shattering_stone', './assets/placeholders/shattering_stones_placeholder.png');
        this.load.image('cardinal_ray', './assets/placeholders/cardinal_ray_placeholder.png');
        this.load.image('health_orb', './assets/placeholders/health_orb_placeholder.png');
        this.load.image('health_bar', './assets/placeholders/health_bar_placeholder.png');
        this.load.image('frog', './assets/placeholders/frog_placeholder.png');
        this.load.image('acid_spit', './assets/placeholders/acid_spit_placeholder.png');
        this.load.image('distortion_effect', './assets/placeholders/distortion_placeholder.png');
        this.load.image('portal', './assets/placeholders/portal_placeholder.png');
        this.load.image('particle', './assets/placeholders/particle_placeholder.png');
        this.load.image('spark', './assets/placeholders/blue_placeholder.png');

        //background images
        this.load.image('backgroundTile', './assets/cave_tiles_standard.png');

        //map assets
        //--level 1--
        this.load.image('level_one_map_tiles', './assets/tilemaps/cave_texture.png');
        this.load.tilemapTiledJSON('level_one_map', './assets/tilemaps/level_1_map.json');
        //--level 2--
        this.load.image('level_two_map_tiles', './assets/tilemaps/cave_texture.png');
        this.load.tilemapTiledJSON('level_two_map', './assets/tilemaps/level_2_map.json');
        //--level 3--
        this.load.image('level_three_map_tiles', './assets/tilemaps/cave_texture.png');
        this.load.tilemapTiledJSON('level_three_map', './assets/tilemaps/level_3_map.json');

  
        //entity images
        this.load.atlas({
            key: 'entities',
            textureURL: './assets/atlases/all_animations.png',
            atlasURL: './assets/atlases/all_animations.json'
        });
        this.load.spritesheet(
            'breakable_wall_tiles', 
            './assets/breakable_wall.png',
            //they're numbered 1-15 in Tiled, but phaser counts from 0
            {
                frameWidth: 64,
                frameHeight: 64,
                startFrame: 0,
                endFrame: 14
            }
        );

        //attack images
        this.load.atlas({
            key: 'attacks',
            textureURL: './assets/atlases/attacks.png',
            atlasURL: './assets/atlases/attacks.json'
        });
        this.load.image('lashing_strike', './assets/hook.png');
        this.load.image('magic_missile', './assets/missle.png');
        this.load.image('dominating_strike', './assets/dominating_strike.png');
        this.load.image('sweeping_strike', './assets/sweeping_strike.png');

        //DEPRECIATED
        //obstacle images
        /*this.load.atlas({
            key: 'obstacles',
            textureURL: './assets/atlases/obstacles.png',
            atlasURL: './assets/atlases/obstacles.json'
        });*/

        //UI images
        this.load.image('heartUI', './assets/heart.png');
        this.load.image('magic_missileUI', './assets/missle_charge.png');


        this.add.text(this.textShift, this.textSpace, "Complete", this.textConfig);
        this.textSpace += 20;
        this.add.text(this.textShift, this.textSpace, "Loading audio...", this.textConfig);
        this.textSpace += 20;

        //audio
        this.load.audio('bgm', './assets/sounds/BGM.mp3');
        this.load.audio('magic_missile_explosionSound', './assets/sounds/Magic Missile Explosion.mp3');
        this.load.audio('magic_missile_firingSound', './assets/sounds/Magic Missile Firing.mp3');
        this.load.audio('punchSound', './assets/sounds/Punch.mp3');
        this.load.audio('bossLaugh', './assets/sounds/Boss Laugh.mp3');

        this.add.text(this.textShift, this.textSpace, "Complete", this.textConfig);
        this.textSpace += 20;

        this.add.text(this.textShift, this.textSpace, "Generating animations...", this.textConfig);
        this.textSpace += 20;
    }

    create(){
        /*this.add.text(this.textShift, this.textSpace, "Mapping Controls...", this.textConfig);
        this.textSpace += 20;
        //setting keyboard controls
        keyLEFT  =  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT =  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP    =  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN  =  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyQ     =  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);   //punch
        keyE     =  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);   //magic missile
        this.add.text(this.textShift, this.textSpace, "Complete", this.textConfig);
        this.textSpace += 20;*/

        keyQ     =  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);

        /*this.add.text(this.textShift, this.textSpace, "Generating animations...", this.textConfig);
        this.textSpace += 20;*/

        //creating animations
        //---ORC ANIMS---
        this.anims.create({
            key: 'orc_punchAnim',
            frameRate: 12,
            frames: this.anims.generateFrameNames('entities', {
                start: 1,
                end: 6,
                prefix: 'om_punch'
            }),
            repeat: 0
        });
        this.anims.create({
            key: 'orc_stunAnim',
            frameRate: 12,
            frames: this.anims.generateFrameNames('entities', {
                start: 1,
                end: 3,
                prefix: 'om_stun'
            }),
            repeat: -1
        });
        this.anims.create({
            key: 'orc_walkAnim',
            frameRate: 10,
            frames: this.anims.generateFrameNames('entities', {
                start: 1,
                end: 6,
                prefix: 'om_run'
            }),
            repeat: -1
        });

        //---ATTACK ANIMS---
        this.anims.create({
            key: 'punch_effectAnim',
            frameRate: 10,
            frames: this.anims.generateFrameNames('attacks', {
                start: 1,
                end: 4,
                prefix: 'power_punch' 
            }),
        });
        this.anims.create({
            key: 'missle_blastAnim',
            frameRate: 10,
            frames: this.anims.generateFrameNames('attacks', {
                start: 1,
                end: 5,
                prefix: 'missle_explode' 
            }),
        });
        //---ENEMY ANIMS
        this.anims.create({
            key: 'zombie_walkAnim',
            frameRate: 12,
            frames: this.anims.generateFrameNames('entities', {
                start: 1,
                end: 12,
                prefix: 'zom_walk' 
            }),
            repeat: -1
        });
        this.anims.create({
            key: 'zombie_attackAnim',
            frameRate: 12,
            frames: this.anims.generateFrameNames('entities', {
                start: 1,
                end: 12,
                prefix: 'zom_attack' 
            }),
            repeat: -1
        });
        this.anims.create({
            key: 'boss_dominatingAnim',
            frameRate: 12,
            frames: this.anims.generateFrameNames('entities', {
                start: 1,
                end: 18,
                prefix: 'sb_dominating_strike'
            })
        });
        this.anims.create({
            key: 'boss_sweepingAnim',
            frameRate: 12,
            frames: this.anims.generateFrameNames('entities', {
                start: 1,
                end: 18,
                prefix: 'sb_slashing_strike'
            })
        });




        this.add.text(this.textShift, this.textSpace, "Complete", this.textConfig);
        this.textSpace += 20;
        
        //fun stuff for load screen
        this.messages = new Array(
            'Prepare for undead...',
            'Opening the pit...',
            'The gates are opening...', 
            'The DARKWORLD beckons...',
            'Damning your soul...',
            'Raising the dead...',
            'Sealing the pact...',
            'You won’t escape...',
            'There’s no salvation...',
            'Hook doesn’t hurt...',
            'Crimson brings pain...',
            'Delving the cave...',
            'Fleeing from misery...',
            'Three distortion guitars...',
            'You’re a cutecumber...',
            'Never waking up...',
            'Dive into the misery...',
            'A can of zombies...',
            'Akthoric is coming...',
            'Skeleton helmet ghost...'
        );

        this.nextSceneTime = this.time.addEvent({
            delay: 3000,
            callback: () => {
                //setting background music
                this.music = this.sound.add('bgm');
                this.music.play({
                    mute: false,
                    volume: 0.75,
                    rate: 1,
                    detune: 0,
                    seek: 0,
                    loop: true,
                    delay: 0
                });
                //CHANGE THIS TO CHANGE WHAT SCENE THE GAME STARTS IN
                this.scene.start("menuScene");},
            loop: false,
        });
        this.nextSceneTime.paused = true;

        this.add.text(this.textShift, this.textSpace, "Press (Q) to Continue...", this.textConfig);
        this.textSpace += 20;

        //if debugging mode is on, skip directly to menu
        if(game.config.physics.arcade.debug){
            this.scene.start("menuScene");
        }
    }

    update(){
        if(keyQ.isDown){
            this.oneShotStarts();
            this.starting = true;
        }

        if(this.starting){
            this.add.text(this.textShift, this.textSpace, Phaser.Math.RND.pick(this.messages), this.textConfig);
            this.textSpace += 20;
            if(this.textSpace > game.config.height){
                this.textSpace = 20;
                this.textShift += 200;
            }
        }
    }

    oneShotStarts(){
        if(!this.starting){
            this.sound.add('bossLaugh').play({volume: 0.25});
            this.nextSceneTime.paused = false;
        }
    }
}