class LashingStrike extends Attack{
    constructor(scene, x, y, texture, frame, user){
        super(scene, x, y, texture, frame, user);

        //properties
        this.hookedTarget;  //what's been grabbed
        this.speed = 300;
        this.active = false;
        this.user = user;
        this.range = 64 * 7;         //range of the attack
        this.launchTime = -1;        //the time at which the hook was launched
        this.home = {x: x, y: y};       //where the attack was launched from
        this.setAlpha(0.2);

        //sets a timer to launch the hook in 3/4 of a second
        Phaser.Utils.Array.Add(this.timers, this.scene.time.addEvent({
            delay: 750,
            callback: () => {
                this.setAlpha(1);
                this.active = true;
                this.rotation = this.scene.physics.moveToObject(this, this.scene.player, this.speed);
                this.launchTime = this.scene.time.now;
            },
            callbackScope: this
        }));
    }

    //what happens when the attack collides with a target
    strike(target){
        //we always need to check if the hook is active, but there are only
        //  2 possible targets: walls and the player

        //if this hits a wall
        if(this.active && target == null){
            this.removeSelf();
        }
        //if this hits the boss and the player's been hooked
        else if (this.active){
            //hook 'em. Launch both the player and the hook towards the boss
            this.user.emit('skeleton_hooked!');
            this.hookedTarget = this.scene.player;

            this.rotation = this.scene.physics.moveToObject(this, this.user, this.speed);//this.scene.physics.moveTo(this, this.homeX, this.homeY, 125, 500);
                       
            //need to stun, then launch, as stunning stops the player
            //this.hookedTarget.startStun(this.scene.time.now - this.launchTime + 1000);
            this.hookedTarget.controlLock = true;
            this.hookedTarget.anims.play('orc_stunAnim');
            Phaser.Utils.Array.Add(this.timers, this.scene.time.delayedCall(
                this.scene.time.now - this.launchTime + 1000,
                () => {this.hookedTarget.controlLock = false;},
                null,
                this
            ));
            this.scene.physics.moveToObject(this.hookedTarget, this.user, this.speed);
            this.active = false;

            this.scene.physics.add.collider(this, this.user, (hook) => {
                hook.hookedTarget.body.stop();
                hook.removeSelf();
            });

            //backup timer if the hook somehow misses the boss
            Phaser.Utils.Array.Add(this.timers, this.scene.time.delayedCall(
                this.scene.time.now - this.launchTime,
                () => {
                    this.hookedTarget.body.stop();
                    this.removeSelf();
                },
                null,
                this
            ));
        }
    }

    //frame-by-frame movement
    movementPattern(){
        let distanceFromHome = Phaser.Math.Distance.Between(this.x, this.y, this.home.x, this.home.y);
        if(distanceFromHome > this.range){
            this.removeSelf();
        }
    }

    //what happens when this attack is finished
    removeSelf(){
        this.user.emit('skeleton_attackComplete');
        this.destroy();
    }
}