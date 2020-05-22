class AcidSpit extends Attack{
    constructor(scene, x, y, texture, frame, user){
        super(scene, x, y, texture, frame, user);

        this.damage = 3;
        this.range = 5 * 64;
        this.angle = user.angle + 90;
        this.speed = 250;

        scene.physics.velocityFromAngle(this.angle, -this.speed, this.body.velocity);
    }

    //what happens when the attack collides with a target
    strike(target){
        if(target == this.scene.player){
            target.takeDamage(this.damage);
        }

        this.removeSelf();
    }
}