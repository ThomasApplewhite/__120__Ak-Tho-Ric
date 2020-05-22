class BlightBeam extends Attack{
    constructor(scene, x, y, texture, frame, user, rotation){
        super(scene, x, y, texture, frame, user)

        //properties
        let speed = 300;
        this.range = 64 * 4; //current range is 4 tiles
        this.damage = 5;
        this.user = user;
        this.exploded = false;
        this.body.setCircle(5);
        this.angle = user.angle + rotation;
        this.xLaunch = x;
        this.yLaunch = y;
        scene.physics.velocityFromAngle(this.angle - 90, -speed, this.body.velocity);

        //This will get replaced with an animation event, once the animations exist
        this.blastDuration =  this.scene.time.addEvent({
            delay: 250,
            callback: () => {
                this.user.emit('dreadeyes_attackcomplete')
                this.removeSelf();
            },
            callbackScope: this,
            loop: 0,
            paused: true
        });
        Phaser.Utils.Array.Add(this.timers, this.blastDuration);
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
        this.body.stop();
        this.body.setCircle(64, -64, -64);
        //play explosion animation
        this.blastDuration.paused = false;
    }
}