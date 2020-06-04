class RedScreenEffect extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, duration){
        super(scene, x, y, 'red_screen_effect', 0);

        scene.add.existing(this);           //add the sprite

        scene.time.delayedCall(
            duration,
            this.destroy,
            null,
            this
        );
    }
}

//the red screen just generates and then deletes itself