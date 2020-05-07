class MagicMissile extends Attack{
    constructor(scene, x, y, texture, frame, range){
        super(scene, x, y, texture, frame);

        //properties
        this.range = this.y - range;
        this.damage = 5;
        this.body.setVelocityY(-300);

        this.scene.mmShotSFX.play();

        //add to collision group
        //console.log(this.body);

        //I'd really like to group these two together but uhhhh
        /*this.missileCheckingEnemies = this.scene.physics.add.collider(this, this.scene.enemyGroup, this.detonate);
        this.missileCheckingObstacles = this.scene.physics.add.collider(this, this.scene.obstacleGroup, this.detonate);*/
    }

    strike(target){
        //stop
        this.body.setVelocityY(0);
        //become invisible
        this.setVisible(false);
        //create the blast
        this.scene.attackGroup.add(new MagicMissileBlast(
            this.scene, 
            this.x, 
            this.y, 
            'attacks', 
            'missle_explode1', 
            this.damage
            )
        );
        //cease to be
        this.removeSelf();
    }

    movementPattern(){
        if(this.y < this.range){
            this.strike(null);
        }

        if(this.y < 0){
            this.removeSelf();
        }
    }
}