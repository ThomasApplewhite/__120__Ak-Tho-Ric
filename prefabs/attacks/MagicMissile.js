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

        this.scene.mmShotSFX.play();

        //cuts 1 second off of dash cooldown
        if(this.user.actionTimers.dashCooldown != null){
            this.user.actionTimers.dashCooldown += 1000;
        }

        //add to collision group
        //console.log(this.body);

        //I'd really like to group these two together but uhhhh
        /*this.missileCheckingEnemies = this.scene.physics.add.collider(this, this.scene.enemyGroup, this.detonate);
        this.missileCheckingObstacles = this.scene.physics.add.collider(this, this.scene.obstacleGroup, this.detonate);*/
    }

    strike(target){
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

    movementPattern(){
        if(Phaser.Math.Distance.Between(this.x, this.y, this.xLaunch, this.yLaunch) > this.range){
            this.strike(null);
        }

        /*if(this.y < 0){
            this.removeSelf();
        }*/
    }
}