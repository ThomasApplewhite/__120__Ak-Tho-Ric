class End extends Phaser.Scene{
    constructor(scores){
        super("endScene");
    }

    preload(){

    }

    create(){
        //setting text properties
        let colorRed = '#D62109';
        let colorPurple = '#C756E3';
        let colorGreen = '#6ABE30';
        let colorBlue = '#2ACADB';

        this.distance = game.registry.get("distance");
        this.bodyCount = game.registry.get("bodyCount");
        if(isNaN(this.bodyCount)){
            this.bodyCount = 0;
        }
        this.score = game.registry.get("score");
         
        let textConfig = {
            fontFamily: 'PermanentMarker',
            fontSize: '140px',
            //backgroundColor: '#F3B141',
            color: colorRed,
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
 
        keyQ    =  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        keyDOWN  =  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
 
        let centerX = game.config.width/2;
        let centerY = game.config.height/2;
        let textSpacer = 48;
 
        this.add.text(centerX, game.config.height/4, 'GAME OVER', textConfig).setOrigin(0.5);
        textConfig.color = colorBlue;
        textConfig.fontSize = '28px';
        textConfig.color = colorPurple;
        this.add.text(centerX, centerY + 3/2 * textSpacer, this.bodyCount + ' enemies were destroyed', textConfig).setOrigin(0.5);
        this.add.text(centerX, centerY + 5/2 * textSpacer, 'for ' + this.score + ' points', textConfig).setOrigin(0.5);
        textConfig.color = colorGreen;
        textConfig.fontSize = '56px';
        this.add.text(centerX, centerY + 5 * textSpacer, 'Press (Q) to Restart!', textConfig).setOrigin(0.5);

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
    }

    update(){
        this.background.tilePositionY -= 1;

        if(keyQ.isDown){
            this.scene.start("menuScene");
        }

        if(keyDOWN.isDown){
            this.scene.start("creditsScene");
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
            this.sound.play(this.music.key, {loop: true});
            menuMusicPlaying = true;
        }
    }
    
}