class BlightBeam extends Attack{
    constructor(scene, x, y, texture, frame, user, rotation){
        super(scene, x, y, texture, frame, user)

        //properties
        let speed = 300;
        this.range = this.y - range;
        this.damage = 5;
        this.user = user;
        this.exploded = false;
        this.body.setSize(5, 5);
        this.body.isCircle = true;
        this.rotation = rotation
        scene.physics.velocityFromAngle(this.rotation + 90, -speed, this.body.velocity);

        //This will get replaced with an animation event, once the animations exist
        this.blastDuration = Phaser.Utils.Array.Add(this.timers, this.scene.addEvent({
            delay: 250,
            callback: () => {
                this.emit('dreadeyes_attackcomplete');
                this.removeSelf();
            },
            callbackScope: this,
            loop: 0,
            paused: true
        }))[0];
    }

    //what happens when the attack collides with a target
    strike(target){
        if(!this.exploded){
            this.explode();
            target.takeDamage(this.damage * 2);
        }

        target.takeDamage(this.damage);
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
        this.setSize(64, 64);
        //play explosion animation
        this.blastDuration.paused = false;
    }
}