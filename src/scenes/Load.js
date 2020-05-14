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

        //background images
        //this.load.image('backgroundTile', './assets/dirt.png');

        //placeholder assets
        this.load.image('invisible_wall', './assets/placeholders/invisible_wall.png');
        this.load.image('invisible_wall_rotated', './assets/placeholders/invisible_wall_rotated.png');     
        this.load.image('placeholder_map_tiles', './assets/placeholders/tiles_placeholder.png');
        this.load.tilemapTiledJSON('placeholder_map', './assets/placeholders/tilemap_placeholder.json'); 

        //background images
        this.load.image('backgroundTile', './assets/cave_tiles_standard.png');
  
        //player images
        this.load.atlas({
            key: 'player',
            textureURL: './assets/atlases/orc_monk.png',
            atlasURL: './assets/atlases/orc_monk.json'
        });

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

        //obstacle images
        this.load.atlas({
            key: 'obstacles',
            textureURL: './assets/atlases/obstacles.png',
            atlasURL: './assets/atlases/obstacles.json'
        });
        

        //enemy images
        this.load.image('zombie', './assets/zombie.png');
        this.load.atlas({
            key: 'enemies',
            textureURL: './assets/atlases/enemies.png',
            atlasURL: './assets/atlases/enemies.json'
        })

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
            frameRate: 5,
            frames: this.anims.generateFrameNames('player', {
                start: 1,
                end: 4,
                prefix: 'back_punch'
            }),
            repeat: 0
        });
        this.anims.create({
            key: 'orc_stunAnim',
            frameRate: 5,
            frames: this.anims.generateFrameNames('player', {
                start: 1,
                end: 4,
                prefix: 'back_stun'
            }),
            repeat: -1
        });
        this.anims.create({
            key: 'orc_walkAnim',
            frameRate: 10,
            frames: this.anims.generateFrameNames('player', {
                start: 1,
                end: 8,
                prefix: 'back_walk'
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
            frameRate: 10,
            frames: this.anims.generateFrameNames('enemies', {
                start: 1,
                end: 5,
                prefix: 'forward_walk' 
            }),
            repeat: -1
        });
        this.anims.create({
            key: 'zombie_attackAnim',
            frameRate: 10,
            frames: this.anims.generateFrameNames('enemies', {
                start: 1,
                end: 3,
                prefix: 'forward_attack' 
            }),
            repeat: -1
        });
        this.anims.create({
            key: 'boss_dominatingAnim',
            frameRate: 10,
            frames: this.anims.generateFrameNames('enemies', {
                start: 1,
                end: 4,
                prefix: 'mid_attack'
            })
        });
        this.anims.create({
            key: 'boss_sweepingAnim',
            frameRate: 10,
            frames: this.anims.generateFrameNames('enemies', {
                start: 1,
                end: 4,
                prefix: 'skelly_boss_sweep'
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
                this.scene.start("testMapScene");},
            loop: false,
        });
        this.nextSceneTime.paused = true;

        this.add.text(this.textShift, this.textSpace, "Press (Q) to Continue...", this.textConfig);
        this.textSpace += 20;
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