class Attack extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame, user){
        super(scene, x, y, texture, frame);
        
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.rotation = user.rotation;
        this.body.rotation = user.rotation;

        this.timers = new Array();

        //Attacks are like advertisements: they are specifically designed to hurt people
        //Unlike advertisements, attacks posses methods to handle hitbox/hurtbox interaction 
    }

    update(){
        this.movementPattern();
    }

    //what happens when the attack collides with a target
    strike(target){
        this.removeSelf();
    }

    //frame-by-frame movement
    movementPattern(){

    }

    //what happens when this attack is finished
    removeSelf(){
        this.timers.forEach((item) => {item.remove()})
        this.destroy();
    }
}