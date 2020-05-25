class DominatingStrike extends Attack{
    constructor(scene, x, y, texture, frame, user, type){
        super(scene, x, y, texture, frame, user);

        //properties
        this.setAlpha(0);
        this.active = false;
        this.user = user;
        this.type = type;
        this.bossAnim;

        //choosing animation based on type
        if(this.type == 1){
            this.bossAnim = 'boss_sweepingAnim';
        }
        else{
            this.bossAnim = 'boss_dominatingAnim';
        }

        //type determines the nature of the attack
        //type 0 = DominatingStrike, type 1 = SweepingStrike
        if(this.type == 1){
            this.body.setSize(512, 512);
            this.body.isCircle = true;
            
        }

        //setting timers so the attack happens in-sync with the animation
        this.scene.boss.anims.delayedPlay(250, this.bossAnim);
        Phaser.Utils.Array.Add(this.timers, this.scene.time.addEvent({
            delay: 750,
            callback: this.activateMove,
            callbackScope: this
        }));
        Phaser.Utils.Array.Add(this.timers, this.scene.time.addEvent({
            delay: 1000,
            callback: this.removeSelf,
            callbackScope: this
        }));
    }

    //turns on the 'hurt' part of the hurtbox
    activateMove(){
        this.setAlpha(0);
        this.active = true;
    }

    //what happens when the attack collides with a target
    strike(target){
        //if this hits the player...
        if(this.active && target === this.scene.player){
            //stun them if they're close
            if(this.type == 1 && Phaser.Math.Distance.Between(target.x, target.y, this.x, this.y) < 64 * 2.5){
                this.scene.player.startStun(1500);
            //kill 'em if they're far
            }else{
                this.scene.player.takeDamage(15);   //boss attacks do 15 damages
            }
        }
    }

    //what happens when this attack is finished
    removeSelf(){
        this.destroy();
        this.user.attacking = false;
    }
}