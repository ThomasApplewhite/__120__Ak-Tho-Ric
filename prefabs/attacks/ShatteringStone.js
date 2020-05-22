class ShatteringStone extends Attack{
    constructor(scene, x, y, texture, frame, user, scale){
        super(scene, x, y, texture, frame, user);

        this.damage = 3;
        this.active = false;
        this.setScale(scale, scale);
        this.body.setCircle(scale/2 * this.width/2, -scale * this.width/4, -scale * this.width/4);
        this.setAlpha(0.2);

        //this timer will also be replaced with an animation event
        this.telegraphTimer =  this.scene.time.addEvent({
            delay: 750,
            callback: () => {
                this.setAlpha(1);
                this.active = true;
                this.durationTimer.paused = false;
            },
            callbackScope: this
        });
        //wil probably remain a timer
        this.durationTimer = this.scene.time.addEvent({
            delay: 250,
            callback: () => {
                user.emit('dreadeyes_attackcomplete');
                this.removeSelf();
            },
            callbackScope: this,
            paused: true
        });

        Phaser.Utils.Array.Add(this.timers, this.telegraphTimer);
        Phaser.Utils.Array.Add(this.timers, this.durationTimer);
    }

    strike(target){
        if(this.active && target != null){
            target.takeDamage(this.damage);
        }
    }
}