class LashingStrike extends Attack{
    constructor(scene, x, y, texture, frame, user){
        super(scene, x, y, texture, frame, user);

        this.hookedTarget;
        this.active = false;
        this.homeX = x;
        this.homeY = y;

        this.setAlpha(0.2);
        this.scene.time.addEvent({
            delay: 750,
            callback: () => {
                this.setAlpha(1);
                this.active = true;
                this.rotation = this.scene.physics.moveTo(this, this.scene.player.x, this.scene.player.y, 125, 500);
            },
            callbackScope: this
        });
    }

    //what happens when the attack collides with a target
    strike(target){
        if(this.active && target === this.scene.player){
            this.hookedTarget = this.scene.player;
            this.rotation = this.scene.physics.moveTo(this, this.homeX, this.homeY, 125, 500);
            this.hookedTarget.startStun(2000);
            this.scene.physics.moveTo(this.hookedTarget, this.homeX, this.homeY, 125, 500);
        }
    }

    //frame-by-frame movement
    movementPattern(){
        //this.rotation = Phaser.Math.Angle.Between(this.x, this.y, this.scene.player.x, this.scene.player.y);

        if(this.hookedTarget == null && this.y > game.config.height){
            this.removeSelf()
        }

        if(this.hookedTarget != null && this.y <= this.homeY + 1){
            this.removeSelf();
        }
    }

    //what happens when this attack is finished
    removeSelf(){
        this.destroy();
    }
}