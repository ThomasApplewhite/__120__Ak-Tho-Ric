class BlightBeam extends Attack{
    constructor(scene, x, y, texture, frame, user, rotation){
        super(scene, x, y, texture, frame, user)

        //properties
        let speed = 300;
        this.range = 64 * 4; //current range is 4 tiles
        this.damage = 5;
        this.user = user;
        this.exploded = false;
        this.body.setSize(24, 24);
        this.body.isCircle = true;
        this.angle = user.angle + rotation;
        this.xLaunch = x;
        this.yLaunch = y;
        scene.physics.velocityFromAngle(this.angle - 90, -speed, this.body.velocity);

        this.on('animationcomplete', () => {
            this.user.emit('dreadeyes_attackcomplete');
            //console.log("animation done");
            this.removeSelf();
        });

        this.anims.play('dreadAttack_blightAnim');
        this.anims.pause();
    }

    //what happens when the attack collides with a target
    strike(target){
        if(!this.exploded){
            this.explode();

            if(target != null){
                target.takeDamage(this.damage);
            }
            
        }

        if(target != null){
            target.takeDamage(this.damage);
        }
    }

    //frame-by-frame movement
    movementPattern(){
        //explode at max range
        if(Phaser.Math.Distance.Between(this.x, this.y, this.xLaunch, this.yLaunch) > this.range){
            this.explode();
        }
    }

    //time to explode
    explode(){
        this.exploded = true;
        this.body.stop();
        this.body.setSize(64, 64);
        this.body.isCircle = true;
        this.anims.resume();
    }
}