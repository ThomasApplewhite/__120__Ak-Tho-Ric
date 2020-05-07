class Credits extends Phaser.Scene{
    constructor(){
        super('creditsScene');
    }

    preload(){
    }

    create(){
        //setting text properties
        let colorRed = '#EE0000';
        let colorPurple = '#C756E3';
        let colorGreen = '#6ABE30';
        let colorBlue = '#2ACADB';
        let colorMagenta = '#b400de';
        let colorOrange = '#ff9900';

         
        let textConfig = {
            fontFamily: 'PermanentMarker',
            fontSize: '28px',
            //backgroundColor: '#F3B141',
            color: colorBlue,
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
            ).setOrigin(0, 0).setScale(5.625);
 
        let centerX = game.config.width/2;
        let centerY = game.config.height/2;
        let textInterval = 30;
        let textSpacer = textInterval;

        this.add.text(centerX, textSpacer, 'Thanks for playing!', {
            fontFamily: 'PermanentMarker',
            fontSize: '48px',
            //backgroundColor: '#F3B141',
            color: colorGreen,
            align: 'center',
            padding: {
                top: 5,
                bototm: 5,
            },
            stroke: '#000000',
            strokeThickness: 10,
            fixedWidth: 0
        }).setOrigin(0.5);

        textSpacer += textInterval;
        /*
        textConfig.color = colorOrange;
        this.add.text(centerX, textSpacer, "Thomas Applewhite", textConfig).setOrigin(0.5);
        textSpacer += textInterval;
        ---
        textConfig.color = colorMagenta;
        this.add.text(centerX, textSpacer, "Eric Long", textConfig).setOrigin(0.5);
        textSpacer += textInterval;
        ---
        textConfig.color = colorRed;
        this.add.text(centerX, textSpacer, "Akash D. Kapadia", textConfig).setOrigin(0.5);
        textSpacer += textInterval;
        ---
        textSpacer += textInterval;
        textConfig.color = colorBlue;
        this.add.text(centerX, textSpacer, "header", textConfig).setOrigin(0.5);
        textSpacer += textInterval;
        */
        //---DESIGN---
        textSpacer += textInterval;
        textConfig.color = colorBlue;
        this.add.text(centerX, textSpacer, "DESIGN", textConfig).setOrigin(0.5);
        textSpacer += textInterval;
        textConfig.color = colorRed;
        this.add.text(centerX, textSpacer, "Akash D. Kapadia", textConfig).setOrigin(0.5);
        textSpacer += textInterval;
        textConfig.color = colorMagenta;
        this.add.text(centerX, textSpacer, "Eric Long", textConfig).setOrigin(0.5);
        textSpacer += textInterval;
        textConfig.color = colorOrange;
        this.add.text(centerX, textSpacer, "Thomas Applewhite", textConfig).setOrigin(0.5);
        textSpacer += textInterval;
        //---PROGRAMING---
        textSpacer += textInterval;
        textConfig.color = colorBlue;
        this.add.text(centerX, textSpacer, "PROGRAMMING", textConfig).setOrigin(0.5);
        textSpacer += textInterval;
        textConfig.color = colorOrange;
        this.add.text(centerX, textSpacer, "Thomas Applewhite", textConfig).setOrigin(0.5);
        textSpacer += textInterval;
        //---ART---
        textSpacer += textInterval;
        textConfig.color = colorBlue;
        this.add.text(centerX, textSpacer, "ART", textConfig).setOrigin(0.5);
        textSpacer += textInterval;
        textConfig.color = colorMagenta;
        this.add.text(centerX, textSpacer, "Eric Long", textConfig).setOrigin(0.5);
        textSpacer += textInterval;
        //---MUSIC---
        textSpacer += textInterval;
        textConfig.color = colorBlue;
        this.add.text(centerX, textSpacer, "MUSIC", textConfig).setOrigin(0.5);
        textSpacer += textInterval;
        textConfig.color = colorOrange;
        this.add.text(centerX, textSpacer, "Thomas Applewhite", textConfig).setOrigin(0.5);
        textSpacer += textInterval;
        //---SOUND DESIGN---
        textSpacer += textInterval;
        textConfig.color = colorBlue;
        this.add.text(centerX, textSpacer, "SOUND DESIGN", textConfig).setOrigin(0.5);
        textSpacer += textInterval;
        textConfig.color = colorRed;
        this.add.text(centerX, textSpacer, "Akash D. Kapadia", textConfig).setOrigin(0.5);
        textSpacer += textInterval;
        //---PRODUCTION---
        textSpacer += textInterval;
        textConfig.color = colorBlue;
        this.add.text(centerX, textSpacer, "PRODUCTION", textConfig).setOrigin(0.5);
        textSpacer += textInterval;
        textConfig.color = colorMagenta;
        this.add.text(centerX, textSpacer, "Eric Long", textConfig).setOrigin(0.5);
        textSpacer += textInterval;
        //---FONT---
        textSpacer += textInterval;
        textConfig.color = colorBlue;
        this.add.text(centerX, textSpacer, "PERMENANT MARKER FONT", textConfig).setOrigin(0.5);
        textSpacer += textInterval;
        textConfig.color = colorPurple;
        this.add.text(centerX, textSpacer, "Font Diner", textConfig).setOrigin(0.5);
        textSpacer += textInterval;

        //credits text
        this.add.text(game.config.width - 75, game.config.height - 50, 'Press the\n Down Arrow\n for Menu',{
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

        keyDOWN  =  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    }

    update(){
        this.background.tilePositionY -= .75;

        if(keyDOWN.isDown){
            this.scene.start("menuScene");
        }
    }
}