class Frog extends Enemy{
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame, 1, 20, 64 * 6);

        this.speed = 125;           //speed
        this.body.setBounce(0, 0);  //bounciness
        this.body.setSize(24, 28);  //hurtbox size
        this.attacking = false;
        this.tooClose = false;
        this.scene = scene;
    }

    attackPattern(){
        Phaser.Util.Array.Add(this.timers, this.scene.time.addEvent({
            delay: 2000,     //time between attacks
            callback: this.shoot,
            loop: true
        }));
    }

    movementPattern(){
        //if aggro'd and the player's not too close
        if(this.aggressive && !this.tooClose){
            //walk towards the player
            this.rotation = this.scene.physics.moveToObject(this, this.scene.player, this.speed) + Math.PI/2;
        }
        //if aggro'd and the player's too close
        else if(this.aggressive && this.tooClose){
            //walk away from the player while still facing them
            this.rotation = -(this.scene.physics.moveToObject(this, this.scene.player, -this.speed) + Math.PI/2);
        }

        //if the player's too close
        if(Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) < 64 * 4){
            //make note of that
            this.tooClose = true;
        }
        else{
            this.tooClose = false;
        }
    }

    //fire the projectile
    shoot(){
        //this will have an animation tied to it at some point, for right now it will just shoot

        //if the frog is in range
        if(Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) < 64 * 5){
            //attack in half a second
            this.attacking = true;
            //delayed call consistently does nothing when not called in a scene, but I'll try again here
            this.scene.time.delayedCall(
                500,
                () => {
                    this.scene.hostileAttackGroup(new AcidSpit(this.scene, this.x, this.y, 'acid_spit', 0, this));
                    this.attacking = false;
                }
            );
        }
        
    }
}

//I'm goint to experiment with Frog's attack being a 'private' class within the frog itself.
class AcidSpit extends Attack{
    constructor(scene, x, y, texture, frame, user){
        super(scene, x, y, texture, frame, user);

        this.damage = 3;
        this.range = 5 * 64;
        this.angle = user.angle - 90;
        this.speed = 250;

        scene.physics.velocityFromAngle(this.angle, -this.speed, this.body.velocity);
    }

    //what happens when the attack collides with a target
    strike(target){
        if(target == this.scene.player){
            target.takeDamage(this.damage);
        }

        this.removeSelf();
    }
}