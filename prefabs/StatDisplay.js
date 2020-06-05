class StatDisplay{
    //StatDisplay extends nothing, since it's just a container for other objects. It itself does nothing.
    constructor(scene){
        this.scene = scene;
        this.player = scene.player;
        //this.cameraView = scene.cameras.main

        //I've hardcoded the positions. Please forgive me

        //display the score text
        this.scoreText = scene.add.text(188, 110, "Score: 0", {
            fontFamily: 'PermanentMarker',
            fontSize: '28px',
            //backgroundColor: '#F3B141',
            color: '#6ABE30',
            align: 'left',
            stroke: '#000000',
            strokeThickness: 10,
            fixedWidth: 0
        }).setScrollFactor(0)
        this.scoreText.depth = 1;

        //display the Magic Missile charge
        this.magicMissileMeter = [
            scene.add.sprite(game.config.width - 208, 190, 
                'UI', 'Magic_Missile_Icon').setScrollFactor(0),//.setScale(this.cameraZoom - 1, this.cameraZoom - 1),
            scene.add.sprite(game.config.width - 278, 190, 
                'UI', 'Magic_Missile_Icon').setScrollFactor(0),//.setScale(this.cameraZoom - 1, this.cameraZoom - 1),
            scene.add.sprite(game.config.width - 348, 190, 
                'UI', 'Magic_Missile_Icon').setScrollFactor(0)//.setScale(this.cameraZoom - 1, this.cameraZoom - 1)
        ];
        this.magicMissileMeter[0].depth = 1;
        this.magicMissileMeter[1].depth = 1;
        this.magicMissileMeter[2].depth = 1;

        //display the Health Bar
        this.healthBar = scene.add.sprite(game.config.width - 278, 140, 
            'UI', 'Health_Bar').setScrollFactor(0);//.setScale(this.cameraZoom - 1, this.cameraZoom - 1);
        this.healthBar.depth = 1;
        //and its border, which we can forget because it's static
        scene.add.sprite(game.config.width - 278, 140, 
            'UI', 'Health_Bar_Outline').setScrollFactor(0).depth = 1;

        //display the dash icon
        this.dashIcon = scene.add.sprite(game.config.width - 208, 255,
            'UI', 'Dash_Icon').setScrollFactor(0);
        this.dashIcon.depth = 1;
        console.log(this.dashIcon);
        this.dashIcon.on('dashStarted', () => {this.dashIcon.visible = false;});
        this.dashIcon.on('dashReady', () => {this.dashIcon.visible = true;})
    }

    update(){
        this.scoreText.setText("Score: " + this.player.score);
        this.meterUpdate(this.player.canSpecial);
        this.healthUpdate(this.player.health / this.player.maxHealth);
        
    }

    //toggles each mm icon, one after the other
    meterUpdate(param){
        if(param == 0){
            this.magicMissileMeter[0].visible = false;
            this.magicMissileMeter[1].visible = false;
            this.magicMissileMeter[2].visible = false;
        }else if(param <= 3){
            this.magicMissileMeter[param-1].visible = true;
        }
    }

    //sets the scale of the health bar
    healthUpdate(param){
        this.healthBar.setScale(param, 1);
    }
}
