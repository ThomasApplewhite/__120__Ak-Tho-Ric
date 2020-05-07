/*
In a perfect world, most obstacles with strange behaviors will just inherit from this class
    and define their behavior in different files. Makes things easy, yeah?
*/
class Obstacle extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame);

        scene.physics.add.existing(this);
        scene.add.existing(this);

        this.configureMovement();
    }

    update(){
        this.movementPattern();
        //destroys the obstacle if it exits the screen.
        if(this.y > game.config.height){
            this.destroy();
        }
    }

    //how the obstacle will move by default
    configureMovement(){
        this.body.setVelocityY(250);
        this.body.setImmovable();
    }

    //frame-by-frame movement
    movementPattern(){

    }
}