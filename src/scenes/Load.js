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

        //placeholder assets   
        this.load.image('placeholder_map_tiles', './assets/placeholders/tiles_placeholder.png');
        this.load.tilemapTiledJSON('placeholder_map', './assets/placeholders/tilemap_placeholder.json'); 

        //misc. images
        this.load.image('background', './assets/cave_entrance_background.png');
        this.load.image('backgroundTile', './assets/cave_tiles_standard.png'); 
        this.load.image('red_screen_effect', './assets/red_screen.png');

        //map assets
        //--level 1--
        this.load.image('level_one_map_tiles', './assets/tilemaps/cave_texture_v2.png');
        this.load.tilemapTiledJSON('level_one_map', './assets/tilemaps/level_1_map.json');
        //--level 2--
        this.load.image('level_two_map_tiles', './assets/tilemaps/cave_texture_v2.png');
        this.load.tilemapTiledJSON('level_two_map', './assets/tilemaps/level_2_map.json');
        //--level 3--
        this.load.image('level_three_map_tiles', './assets/tilemaps/cave_texture_v2.png');
        this.load.tilemapTiledJSON('level_three_map', './assets/tilemaps/level_3_map.json');
        //--level 4--
        this.load.image('level_four_map_tiles', './assets/tilemaps/cave_texture_v2.png');
        this.load.tilemapTiledJSON('level_four_map', './assets/tilemaps/level_4_map.json');
        //--level 5--
        this.load.image('level_five_map_tiles', './assets/tilemaps/cave_texture_v2.png');
        this.load.tilemapTiledJSON('level_five_map', './assets/tilemaps/level_5_map.json');
        //--level 6--
        this.load.image('level_six_map_tiles', './assets/tilemaps/cave_texture_v2.png');
        this.load.tilemapTiledJSON('level_six_map', './assets/tilemaps/level_6_map.json');

        //UI assets
        this.load.atlas({
            key: 'UI',
            textureURL: './assets/atlases/UI.png',
            atlasURL: './assets/atlases/UI.json'
        });
  
        //entity images
        this.load.atlas({
            key: 'entities',
            textureURL: './assets/atlases/entities.png',
            atlasURL: './assets/atlases/entities.json'
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
        this.load.image('sweeping_strike', './assets/sweeping_strike.png');

        this.add.text(this.textShift, this.textSpace, "Complete", this.textConfig);
        this.textSpace += 20;
        this.add.text(this.textShift, this.textSpace, "Loading audio...", this.textConfig);
        this.textSpace += 20;

        //audio
        //--music--
        this.load.audio('into_darkworld', './assets/sounds/INTO_DARKWORLD.mp3');
        this.load.audio('extreme_foe', './assets/sounds/VERSUS_EXTREME_FOE.mp3');
        this.load.audio('pulsating_wrists', './assets/sounds/Pulsating_Wrists.mp3');
        //--player sounds--
        this.load.audio('magic_missile_explosionSound', './assets/sounds/Magic Missile Explosion.mp3');
        this.load.audio('magic_missile_firingSound', './assets/sounds/Magic Missile Firing.mp3');
        this.load.audio('punchSound', './assets/sounds/Punch.mp3');
        //--enemy sounds--
        this.load.audio('frog_spit', './assets/sounds/frog_spit.mp3');
        this.load.audio('frog_death', './assets/sounds/frog_death.mp3');
        this.load.audio('zombie_attack', './assets/sounds/zombie_attack.mp3');
        this.load.audio('zombie_death', './assets/sounds/zombie_death.mp3');
        //--boss sounds--
        //-Skeleton
        this.load.audio('bossLaugh', './assets/sounds/Boss Laugh.mp3');
        this.load.audio('skeletonDom', './assets/sounds/skeleton_dominating_strike_v2.mp3');
        this.load.audio('skeletonSweep', './assets/sounds/skeleton_sweeping_strike.mp3');
        this.load.audio('skeletonLash', './assets/sounds/skeleton_lashing_strike.mp3');
        this.load.audio('skeletonDeath', './assets/sounds/skeleton_death.mp3');
        //-DreadEyes
        this.load.audio('dreadLaugh', './assets/sounds/dreadeyes_wakeup.mp3');
        this.load.audio('dreadBlightShot', './assets/sounds/dreadeyes_blight_shot.mp3');
        this.load.audio('dreadBlightSplash', './assets/sounds/dreadeyes_blight_splash.mp3');
        this.load.audio('dreadStone', './assets/sounds/dreadeyes_rocks.mp3');
        this.load.audio('dreadRay', './assets/sounds/dreadeyes_laser.mp3');
        this.load.audio('dreadDeath', './assets/sounds/dreadeyes_death.mp3');

        this.add.text(this.textShift, this.textSpace, "Complete", this.textConfig);
        this.textSpace += 20;

        this.add.text(this.textShift, this.textSpace, "Generating animations...", this.textConfig);
        this.textSpace += 20;
    }

    create(){
        keyQ     =  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);

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
        this.anims.create({
            key: 'orc_dashAnim',
            frameRate: 10,
            frames: this.anims.generateFrameNames('entities', {
                start: 1,
                end: 3,
                prefix: 'om_dash' 
            }),
        });
        this.anims.create({
            key: 'orc_idleAnim',
            frameRate: 12,
            frames: this.anims.generateFrameNames('entities', {
                start: 1,
                end: 15,
                prefix: 'om_idle' 
            }),
            repeat: -1
        });
        this.anims.create({
            key: 'orc_deathAnim',
            frameRate: 12,
            frames: this.anims.generateFrameNames('entities', {
                start: 1,
                end: 12,
                prefix: 'om_death' 
            }),
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
            key: 'frog_walkAnim',
            frameRate: 12,
            frames: this.anims.generateFrameNames('entities', {
                start: 1,
                end: 12,
                prefix: 'fm_walk' 
            }),
            repeat: -1
        });
        this.anims.create({
            key: 'frog_spitAnim',
            frameRate: 12,
            frames: this.anims.generateFrameNames('entities', {
                start: 1,
                end: 9,
                prefix: 'fm_spit' 
            }),
            repeat: 0
        });
        this.anims.create({
            key: 'skeleton_dominatingAnim',
            frameRate: 12,
            frames: this.anims.generateFrameNames('entities', {
                start: 1,
                end: 18,
                prefix: 'sb_dominating_strike'
            })
        });
        this.anims.create({
            key: 'skeleton_sweepingAnim',
            frameRate: 12,
            frames: this.anims.generateFrameNames('entities', {
                start: 1,
                end: 18,
                prefix: 'sb_slashing_strike'
            })
        });
        this.anims.create({
            key: 'skeleton_lashingAnim',
            frameRate: 12,
            frames: this.anims.generateFrameNames('entities', {
                start: 1,
                end: 9,
                prefix: 'sb_lashing_strike'
            })
        });
        this.anims.create({
            key: 'dread_blightAnim',
            frameRate: 12,
            frames: this.anims.generateFrameNames('entities', {
                start: 1,
                end: 15,
                prefix: 'de_blight_beams'
            }),
            repeat: 0
        });
        this.anims.create({
            key: 'dread_cardinalAnim',
            frameRate: 12,
            frames: this.anims.generateFrameNames('entities', {
                start: 1,
                end: 21,
                prefix: 'de_cardinal_rays'
            }),
            repeat: 0
        });
        this.anims.create({
            key: 'dread_stonesAnim',
            frameRate: 12,
            frames: this.anims.generateFrameNames('entities', {
                start: 1,
                end: 18,
                prefix: 'de_shattering_stones'
            }),
            repeat: 0
        });
        //------
        this.anims.create({
            key: 'dreadAttack_blightAnim',
            frameRate: 12,
            frames: this.anims.generateFrameNames('attacks', {
                start: 1,
                end: 5,
                prefix: 'dread_eyes_projectile'
            }),
            repeat: 0
        });
        this.anims.create({
            key: 'dreadAttack_cardinalAnim',
            frameRate: 12,
            frames: this.anims.generateFrameNames('attacks', {
                start: 1,
                end: 18,
                prefix: 'dread_eyes_laser'
            }),
            repeat: 0,
            delay: 0
        });
        this.anims.create({
            key: 'dreadAttack_stonesAnim',
            frameRate: 12,
            frames: this.anims.generateFrameNames('attacks', {
                start: 1,
                end: 15,
                prefix: 'dread_eyes_stones'
            }),
            repeat: 0
        });
        //OTHER ANIMS--
        this.anims.create({
            key: 'fogAnim',
            frameRate: 12,
            frames: this.anims.generateFrameNames('attacks', {
                start: 1,
                end: 6,
                prefix: 'distortion_fog'
            }),
            repeat: -1
        });
        this.anims.create({
            key: 'wall_breakAnim',
            frameRate: 12,
            frames: this.anims.generateFrameNames('entities', {
                start: 1,
                end: 4,
                prefix: 'bw_break'
            }),
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