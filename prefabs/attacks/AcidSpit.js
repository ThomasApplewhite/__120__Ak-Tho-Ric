class AcidSpit extends Attack{
    constructor(scene, x, y, texture, frame, user){
        super(scene, x, y, texture, frame, user);

        this.damage = 3;
        this.range = 5 * 64;            //range of the attack
        this.angle = user.angle;
        this.speed = 250;
        this.home = {x: x, y: y};       //where the attack was launched from
        this.scene = scene;

        scene.physics.velocityFromAngle(this.angle + 90, -this.speed, this.body.velocity);
    }

    //what happens when the attack collides with a target
    strike(target){
        if(target == this.scene.player){
            target.takeDamage(this.damage);
        }

        this.removeSelf();
    }

    //frame-by-frame movement
    movementPattern(){
        let distanceFromHome = Phaser.Math.Distance.Between(this.x, this.y, this.home.x, this.home.y);
        if(distanceFromHome > this.range){
            this.removeSelf();
        }
    }
}