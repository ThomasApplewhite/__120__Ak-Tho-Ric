class SkeletonKnightBoss extends Enemy{
    constructor(scene, x, y, texture, frame, level){
        super(scene, x, y, texture, frame, 500, 100);

        //properties
        this.attackTimer;
        this.level = level;
        if(this.level > 3){ //level determines which attacks the boss can use
            this.level = 3;
        }
        this.body.setSize(169, 172);
        this.body.setBounce(0, 0);
        this.speed = 50;
        this.attacking = false;
        
        this.scene.bossLaughSFX.play();
        this.on('animationcomplete', () => {this.setTexture('entities', 'sb_dominating_strike18',);}, this);

        this.scene.bossActive = true;
    }

    //how the enemy will specificly attack, if at all
    attackPattern(){
        console.log("Starting attack timer!");
        //five seconds between attacks, use attacks based on level
        Phaser.Utils.Array.Add(this.timers, this.scene.time.addEvent({
            delay: 6000,            //5 seconds, plus 1 for the actual attack
            callback: this.pickAttack,
            //args: [],
            callbackScope: this,
            loop: true,
            startAt: 1000
        }));
    }

    //I wish there was a better way to do this, but moveTo won't stop anything so...
    movementPattern(){
        //accelerate towards the player
        this.body.setAcceleration(0, 0);
        if(!this.attacking){
            this.rotation = this.scene.physics.accelerateToObject(this, this.scene.player, 15000, this.speed*1.5/2,  this.speed*1.5) - (Math.PI / 2);
        }
        else{
            this.body.setVelocity(0, 0);
        }
    }
    
    //anything special that happens when the enemy dies
    onDeath(){
        //update player score
        ++this.scene.player.bodyCount;
        this.scene.player.score += this.points;

        //update boss scene variables
        ++this.scene.bossLevel;                                        //should start at 1
        this.scene.killsUntilBoss = this.scene.player.bodyCount + 15;   //should be at 15
        this.scene.bossActive = false;

        //this.scene.obstacleSpawnTimer.paused = false;
        //this.scene.enemySpawnTimer.paused = false;

        //console.log("Kills to boss: " + this.scene.killsUntilBoss);
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