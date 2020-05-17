class DominatingStrike extends Attack{
    constructor(scene, x, y, texture, frame, user, type){
        super(scene, x, y, texture, frame, user);

        this.setAlpha(0.2);
        this.active = false;
        this.user = user;
        this.bossAnim;
        //console.log(this.boss);*/

        if(this.type == 1){
            this.bossAnim = 'boss_sweepingAnim';
        }
        else{
            this.bossAnim = 'boss_dominatingAnim';
        }

        //type determines the nature of the attack
        //type 0 = DominatingStrike, type 1 = SweepingStrike
        this.type = type;
        if(this.type == 1){
            this.body.isCircle = true;
        }
        this.scene.boss.anims.delayedPlay(250, this.bossAnim);
        this.scene.time.addEvent({
            delay: 750,
            callback: this.activateMove,
            callbackScope: this
        });
        this.scene.time.addEvent({
            delay: 1000,
            callback: this.removeSelf,
            callbackScope: this
        });
    }

    activateMove(){
        this.setAlpha(0);
        this.active = true;
    }

    //what happens when the attack collides with a target
    strike(target){
        if(this.active && target === this.scene.player){
            if(this.type == 1 && Phaser.Math.Distance.Between(target.x, target.y, this.x, this.y) < 50){
                this.scene.player.startStun(1500);
            }else{
                this.scene.player.defeat();
            }
        }
    }

    //what happens when this attack is finished
    removeSelf(){
        this.destroy();
        this.user.attacking = false;
    }
}