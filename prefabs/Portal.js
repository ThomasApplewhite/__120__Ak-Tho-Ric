class Portal extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame, destination){
        super(scene, x, y, texture, frame);

        //destination is the key of the scene that the player will be sent when touched.

        scene.physics.add.existing(this);
        scene.add.existing(this);

        this.player = this.scene.player;
        this.destination = destination;
        this.body.isCircle = true;
        this.body.setImmovable(true);

        this.scene.tweens.add({
            targets: this,
            angle: {
                from: 0,
                to: 360
            },
            ease: 'linear',
            duration: 2000,
            repeat: -1
        });

    }

    onPickup(){
        //turns off collision for this portal
        this.body.checkCollision.none = true;

        //moves the player to the portal center over the course of a second
        this.player.controlLock = true;
        this.player.rotation = this.scene.physics.moveToObject(this.scene.player, this, this.player.speed, 1000);

        //save the player's score
        let scores = this.scene.player.exportScores();
        game.registry.set("score", scores[0]);
        game.registry.set("bodyCount", scores[1]);

        //fade the camera to black, then switch scenes
        this.scene.cameras.main.fade(
            1000,       //duration of fade
            0,          //red
            0,          //blue
            0,          //green
            false,      //won't start again if already going
            (camera, complete) => {if(complete == 1){
                console.log(this);
                this.scene.sound.removeByKey(this.scene.backgroundMusic);
                this.scene.scene.start(this.destination)}}
        );
    }
}