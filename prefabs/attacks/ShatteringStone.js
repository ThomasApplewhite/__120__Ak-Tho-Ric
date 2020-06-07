class ShatteringStone extends Attack{
    constructor(scene, x, y, texture, frame, user, scale){
        super(scene, x, y, texture, frame, user);

        this.damage = 3;
        this.hostile = false;
        this.setScale(scale, scale);
        this.body.isCircle = true;
        this.setAlpha(0.2);

        //this timer will also be replaced with an animation event
        this.telegraphTimer =  this.scene.time.addEvent({
            delay: 750,
            callback: () => {
                this.setAlpha(1);
                this.hostile = true;
                this.durationTimer.paused = false;
                this.scene.sound.play('dreadStone');
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

        this.anims.play('dreadAttack_stonesAnim', true, 0);
    }

    strike(target){
        if(this.hostile && target != null){
            target.takeDamage(this.damage);
        }
    }
}