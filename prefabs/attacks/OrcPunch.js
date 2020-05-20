class OrcPunch extends Attack{
    constructor(scene, x, y, texture, frame, user, damage){
        super(scene, x, y, texture, frame, user);

        //attack properties
        this.damage = damage;
        this.mmGiven = false;
        this.user = user;
        
        //physical properties
        this.body.setSize(16, 16);
        this.setOrigin(0.5, 0.5);
        this.distX = user.x - this.x;
        this.distY = user.y - this.y;
        this.body.setImmovable();

        //animation and sound
        this.scene.punchSFX.play();
        this.anims.play('punch_effectAnim');

        this.destroyTimer = this.scene.time.addEvent({
            delay: 1/3 * 1000,       //active for 20 frames (1/3 of a second)
            callback: this.removeSelf,
            callbackScope: this,
            loops: false
        });
        Phaser.Utils.Array.Add(this.timers, this.destroyTimer);
    }

    strike(target){
        //console.log(target);
        //if you actually hit someone, damage them
        if(target !== null && target !== this.user){
            target.onDamage(this.damage, this.destroyTimer.elapsed);
            //recharge the magic missile if this punch hasn't already
            if(!this.mmGiven){
                ++this.user.canSpecial;
                //this.scene.meterUpdate(this.user.canSpecial);
                this.mmGiven = true;
            }
            //cuts 0.5 seconds off of dash cooldown
            if(this.user.actionTimers.dashCooldown != null){
                this.user.actionTimers.dashCooldown += 500;
            }
        }
    }

    movementPattern(){
        //unlike most movement, the hitbox here MUST follow the player, 
        //  so its position is directly influenced
        this.x = this.user.x - this.distX;
        this.y = this.user.y - this.distY; //this.playerReference.sourceHeight/4;
    }
}