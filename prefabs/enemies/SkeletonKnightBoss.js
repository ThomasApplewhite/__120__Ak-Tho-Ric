class SkeletonKnightBoss extends Enemy{
    constructor(scene, x, y, texture, frame, level){
        super(scene, x, y, texture, frame, 50, 100, 384);

        //properties
        this.attackTimer;
        this.level = level;
        if(this.level > 3){ //level determines which attacks the boss can use
            this.level = 3;
        }
        this.health = this.health +  (25 * (this.level - 1));
        this.points = this.points * this.level;
        this.body.setSize(169, 172);
        this.body.setBounce(0, 0);
        this.speed = 50;
        this.attacking = false;

        this.scene.bossLaughSFX.play();
        this.on('animationcomplete', () => {this.setTexture('entities', frame,);}, this);

        this.scene.bossActive = true;
        this.emit('skeleton_attackComplete');
    }

    //how the enemy will specificly attack, if at all
    attackPattern(){
        //five seconds between attacks, use attacks based on level
        this.on('skeleton_attackComplete', () => {
            this.attacking = false;
            this.scene.time.delayedCall(
                5000,
                this.pickAttack,
                null,
                this
            );
        });
        /*Phaser.Utils.Array.Add(this.timers, this.scene.time.addEvent({
            delay: 6000,            //5 seconds, plus 1 for the actual attack
            callback: this.pickAttack,
            //args: [],
            callbackScope: this,
            loop: true,
            startAt: 1000
        }));*/
    }

    //I wish there was a better way to do this, but moveTo won't stop anything so...
    movementPattern(){
        //accelerate towards the player
        //this.body.setAcceleration(0, 0);
        if(this.aggressive && !this.attacking){
            this.rotation = this.scene.physics.moveToObject(this, this.scene.player, this.speed) - Math.PI/2;
        }
        else{
            this.body.setVelocity(0, 0);
        }
    }

    //randomly throws an attack, based on the boss' level
    pickAttack(){
        //console.log("SkeletonKnight Health:" + this.health);

        let attackCall = Phaser.Math.Between(1, this.level);

        console.log("Attack Calling: " + attackCall);
        
        this.attacking = true;
        if(attackCall == 3){
            this.lashingStrike();
        }
        else if(attackCall == 2){
            this.sweepingStrike();
        }
        else{
            //Dominating Strike is disabled until it gets designed to not be bad
            //                  i mean functions with the new perspective
            //this.dominatingStrike();
            this.attacking = false;
        }

    }

    dominatingStrike(){
        //awaiting new behavior
    }

    sweepingStrike(){
        let attack = new DominatingStrike(this.scene, this.x, this.y, 'sweeping_strike', 0, this, 1);
        this.scene.hostileAttackGroup.add(attack);
    }

    lashingStrike(){
        let attack = new LashingStrike(this.scene, this.x, this.y, 'lashing_strike', 0, this);
        this.scene.hostileAttackGroup.add(attack);
    }
}