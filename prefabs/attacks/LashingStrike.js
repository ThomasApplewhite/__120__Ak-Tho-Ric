class LashingStrike extends Attack{
    constructor(scene, x, y, texture, frame, user){
        super(scene, x, y, texture, frame, user);

        //properties
        this.hookedTarget;
        this.active = false;
        this.homeX = x;
        this.homeY = y;
        this.destX = this.scene.player.x;
        this.destY = this.scene.player.y;
        this.user = user;
        this.setAlpha(0.2);

        //sets a timer to launch the hook in 3/4 of a second
        Phaser.Utils.Array.Add(this.timers, this.scene.time.addEvent({
            delay: 750,
            callback: () => {
                this.setAlpha(1);
                this.active = true;
                this.rotation = this.scene.physics.moveTo(this, this.destX, this.destY, 125, 500);
            },
            callbackScope: this
        }));
    }

    //what happens when the attack collides with a target
    strike(target){
        //if this hits the player
        if(this.active && target === this.scene.player){
            //hook 'em. Launch both the player and the hook towards the boss
            console.log("hooked!");
            this.hookedTarget = this.scene.player;
            this.rotation = this.scene.physics.moveTo(this, this.homeX, this.homeY, 125, 500);
            this.hookedTarget.startStun(2000);
            this.scene.physics.moveTo(this.hookedTarget, this.homeX, this.homeY, 125, 500);
            this.active = false;
        }
        //if this hits the boss and the player's been hooked
        else if(this.hookedTarget == this.scene.player && target == this.user){
            this.removeSelf();
        }
    }

    //frame-by-frame movement
    movementPattern(){
        //DEPRECIATED
        //this.rotation = Phaser.Math.Angle.Between(this.x, this.y, this.scene.player.x, this.scene.player.y);

        /*if(this.hookedTarget == null && this.y ==this.homeY && this.x == this.homeX){
            this.removeSelf()
        }

        if(this.hookedTarget != null && this.y == this.homeY && this.x == this.homeX){
            this.removeSelf();
        }*/
    }

    //what happens when this attack is finished
    removeSelf(){
        this.destroy();
        this.user.attacking = false;
    }
}