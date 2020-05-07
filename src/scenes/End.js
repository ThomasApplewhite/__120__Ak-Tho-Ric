class End extends Phaser.Scene{
    constructor(scores){
        super("endScene");
    }

    preload(){
        //this.load.image('title', './assets/Title_Large.png');
        //this.load.image('start_button', './assets/start_button.png');

        //background images
        //this.load.image('backgroundTile', './assets/dirt.png');
    }

    create(){
        //setting text properties
        let colorRed = '#D62109';
        let colorPurple = '#C756E3';
        let colorGreen = '#6ABE30';
        let colorBlue = '#2ACADB';

        this.distance = game.registry.get("distance");
        this.bodyCount = game.registry.get("bodyCount");
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
        this.add.text(centerX, centerY + (-1/2 * textSpacer), 'You have delved', textConfig).setOrigin(0.5);
        this.add.text(centerX, centerY + 1/2 * textSpacer, this.distance + ' meters into the darkness.', textConfig).setOrigin(0.5);
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

    }

    update(){
        this.background.tilePositionY -= 1;

        if(keyQ.isDown){
            this.scene.start("playScene");
        }

        if(keyDOWN.isDown){
            this.scene.start("creditsScene");
        }
    }
    
}