class StatDisplay{
    //StatDisplay extends nothing, since it's just a container for other objects. It itself does nothing.
    constructor(scene){
        this.scene = scene;
        this.player = scene.player;
        //this.cameraView = scene.cameras.main

        //display the score text
        this.scoreText = scene.add.text(20, 20, "Score: 0", {
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
            scene.add.sprite(game.config.width - 40, 110, 
                'magic_missileUI').setScrollFactor(0),//.setScale(this.cameraZoom - 1, this.cameraZoom - 1),
            scene.add.sprite(game.config.width - 110, 110, 
                'magic_missileUI').setScrollFactor(0),//.setScale(this.cameraZoom - 1, this.cameraZoom - 1),
            scene.add.sprite(game.config.width - 180, 110, 
                'magic_missileUI').setScrollFactor(0)//.setScale(this.cameraZoom - 1, this.cameraZoom - 1)
        ];
        this.magicMissileMeter[0].depth = 1;
        this.magicMissileMeter[1].depth = 1;
        this.magicMissileMeter[2].depth = 1;

        //display the Health Bar
        this.healthBar = scene.add.sprite(game.config.width - 100, 40, 
            'health_bar').setScrollFactor(0);//.setScale(this.cameraZoom - 1, this.cameraZoom - 1);
        this.healthBar.depth = 1;
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
