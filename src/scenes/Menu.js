class Menu extends Phaser.Scene{
    constructor(){
        super("menuScene");
    }

    preload(){
        this.load.scenePlugin('rexuiplugin', './lib/rexuiplugin.min.js', 'rexUI', 'rexUI');
    }

    create(){
        //setting text properties
        let textConfig = {
            fontFamily: 'PermanentMarker',
            fontSize: '28px',
            //backgroundColor: '#F3B141',
            color: '#2ACADB',
            align: 'center',
            padding: {
                top: 5,
                bototm: 5,
            },
            stroke: '#000000',
            strokeThickness: 10,
            fixedWidth: 0
        }

        //setting background tiles
        this.background = this.add.tileSprite(
            0, 
            0, 
            config.width/2, 
            config.height/2, 
            'backgroundTile'
        ).setOrigin(0, 0).setScale(4);

        //listening for up and down key
        keyUP    =  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN  =  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyW     =  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

        let centerX = game.config.width/2;
        let centerY = game.config.height/2;
        let textSpacer = 48;

        this.add.text(centerX, centerY + 0 * textSpacer, '-Move with the Arrow Keys-', textConfig).setOrigin(0.5);
        this.add.text(centerX, centerY + 1 * textSpacer, '-Press (Q) to Punch-', textConfig).setOrigin(0.5);
        this.add.text(centerX, centerY + 2 * textSpacer, '-Press (E) to cast Magic Missile-', textConfig).setOrigin(0.5);
        textConfig.color = '#C756E3';
        this.add.text(centerX, centerY + 3 * textSpacer, '>Avoid the Obstacles<', textConfig).setOrigin(0.5);
        this.add.text(centerX, centerY + 4 * textSpacer, '>Slay your Foes<', textConfig).setOrigin(0.5);
        textConfig.color = '#D62109';
        this.add.text(centerX, centerY + 5 * textSpacer, '==Press the Up Arrow to Start==', textConfig).setOrigin(0.5);

        this.add.sprite(centerX, game.config.height/4, 'title');
        //this.add.sprite(centerX, game.config.height * 7/8, 'start_button').setScale(2);
        //credits text
        this.add.text(game.config.width - 75, game.config.height - 50, 'Press the\n Down Arrow\n for Credits',{
            fontFamily: 'PermanentMarker',
            fontSize: '14px',
            //backgroundColor: '#F3B141',
            color: '#ff9900',
            align: 'right',
            padding: {
                top: 5,
                bototm: 5,
            },
            stroke: '#000000',
            strokeThickness: 10,
            fixedWidth: 0
        }).setOrigin(0.5);

        //setting background music
        this.menuSoundSetter();

        //creating the volume slider
        //experimental stuff
        this.rexUI.add.slider({
            x: 50,
            y: game.config.height - 150,
            width: 100,
            height: 200,
            orientation: 'y',

            background: this.add.image(0, 0, 'UI', 'Volume_Bar'),
            //track: this.add.image(0, 0, 'UI', 'Volume_bar_Slider'), //this.rexUI.add.roundRectangle(0, 0, 0, 0, 6, COLOR_DARK),
            thumb: this.add.image(0, 0, 'UI', 'Volume_Knob'),

            value: musicVolume,
            valuechangeCallback: function (value, oldValue, slider) {
                //because for some reason, the top is 0 and the bottom is 1
                musicVolume = 1 - value;
                slider.scene.sound.volume = musicVolume;
            },
            space: {
                //top: -36,
                //bottom: -36,
            },
            input: 'drag', // 'drag'|'click'
        })
            .layout();

    }

    update(){
        this.background.tilePositionY -= 1;

        if(keyUP.isDown){
            this.sound.removeByKey('pulsating_wrists');
            menuMusicPlaying = false;
            this.scene.start("levelOneScene");
        }

        if(keyDOWN.isDown){
            //this.music.stop();
            this.scene.start("creditsScene");
        }

        //secret debug scene skipper!
        if(keyW.isDown){
            this.sound.removeByKey('pulsating_wrists');
            menuMusicPlaying = false;
            this.scene.start("levelSixScene");
            
        }
    }

    menuSoundSetter(){
        //okay fun fact phaser 3 doesn't have accessor functions for sound ANYMORE so instead...
        this.music = Phaser.Utils.Array.GetFirst(this.sound.sounds, 'key', 'pulsating_wrists');
        //I also need to use these global variables for if the sound is playing because phaser is a mess
        if(this.music == null && !menuMusicPlaying){
            this.music = this.sound.add('pulsating_wrists');
        }

        if(!this.music.isPlaying && !menuMusicPlaying){
            this.sound.play(this.music.key);
            menuMusicPlaying = true;
        }
    }
    
}