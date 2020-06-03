class MagicMissile extends Attack{
    constructor(scene, x, y, texture, frame, user, range){
        super(scene, x, y, texture, frame, user);

        //properties
        let speed = 300;
        this.range = this.y - range;
        this.damage = 5;
        this.user = user;

        scene.physics.velocityFromAngle(this.angle + 90, -speed, this.body.velocity);
        
        this.xLaunch = x;
        this.yLaunch = y;

        if(this.x != x || this.y != y){
            console.log("missile moved during creation");
        }

        this.scene.mmShotSFX.play();

        //cuts 1 second off of dash cooldown
        if(this.user.actionTimers.dashCooldown != null){
            this.user.actionTimers.dashCooldown += 1000;
        }

        //if the missile spawns in something
        /*this.once('collide', () => {
            if(this.body.touching){
                this.strike(null)
            }
        });
        if(this.body.touching){
            //detonate it
            //this.strike(null);
            console.log("spawned in something");
        }*/
    }

    strike(target){
        if(target != this.user){
            //stop
            this.body.stop();
            //become invisible
            this.setVisible(false);
            //create the blast
            this.scene.attackGroup.add(new MagicMissileBlast(
                this.scene, 
                this.x, 
                this.y, 
                'attacks', 
                'missle_explode1',
                this, 
                this.damage
                )
            );
            //cease to be
            this.removeSelf();
        }
    }

    movementPattern(){
        //explode at max range
        if(Phaser.Math.Distance.Between(this.x, this.y, this.xLaunch, this.yLaunch) > this.range){
            this.strike(null);
        }
    }
}