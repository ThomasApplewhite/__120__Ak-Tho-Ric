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
        }
        else{
            this.body.setSize(64, 64);
            this.alignHitCircle();
        }
        this.body.isCircle = true;

        //setting timers so the attack happens in-sync with the animation
        this.scene.boss.anims.play(this.bossAnim);
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
            //stun them if they're close for sweeping
            if(this.type == 1 && Phaser.Math.Distance.Between(target.x, target.y, this.x, this.y) < 64 * 2.5){
                this.scene.player.startStun(1500);
            //kill 'em if they're far for sweeping
            }
            else if(this.type == 1){
                this.scene.player.takeDamage(15);   //sweeping strike does 15 damage
            }
            //kill 'em if they get hit by dominating at all
            else{
                this.scene.player.takeDamage(10);   //dominating strike does 10 damage
            }
        }
    }

    //what happens when this attack is finished
    removeSelf(){
        this.destroy();
        this.user.emit('skeleton_attackComplete');
    }

    //Aligns the hitCircle with where it should end up in world space.
    //Took much longer to figure out than I wanted.
    alignHitCircle(){
        let finalPoint = Phaser.Math.RotateAroundDistance(
            new Phaser.Geom.Point(this.x, this.y), 
            this.user.x, 
            this.user.y,
            this.user.rotation + (Math.PI/2),
            64 * 3      //how far the hitCircle should be from the boss
        );
        this.x = finalPoint.x;
        this.y = finalPoint.y;
    }
}