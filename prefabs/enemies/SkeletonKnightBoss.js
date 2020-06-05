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
        this.body.setImmovable(true);
        this.speed = 50;
        this.attacking = false;
        this.lashCatch = false;     //whether or not the previous lashing strike hit something

        //this.attackContainer = this.scene.add.container(this.x, this.y);

        this.scene.bossLaughSFX.play();
        this.on('animationcomplete', () => {this.setTexture('entities', frame,);}, this);
        this.on('skeleton_attackComplete', () => {
            this.scene.tweens.add(Enemy.getBossTween(this));
        })

        this.scene.bossActive = true;
    }

    //how the enemy will specificly attack, if at all
    attackPattern(){
        //face the player
        this.scene.tweens.add(Enemy.getBossTween(this, false));

        if(this.level == 1){
            this.once('skeleton_inRangeFor_dominating', this.phaseOneBehaviors, this);
            /*  when the player first gets in for dominating...
                Stop checking for range, swing the axe, wait one
                second, then start checking for range again. Once
                back in range, repeat the whole process.*/
        }
        else if(this.level == 2){
            /*  when the player first gets in for sweeping...
                Stop checking for range, sweep the axe, wait one
                second, then start checking for dominating range. Once
                in range, repeat the process, but either sweep or swing
                
                Level Two's behavior can't be shunted into a method entirely
                because its behavior changes after its first attack*/
            this.once('skeleton_inRangeFor_sweeping', () => {
                this.attacking = true;  
                this.sweepingStrike();        //start attacking

                //once the attack is done...
                this.once('skeleton_attackComplete', () => {
                    Phaser.Utils.Array.Add(this.timers, this.scene.time.delayedCall(
                        1000,
                        () => {
                            this.attacking = false;
                            this.once('skeleton_inRangeFor_dominating', this.phaseTwoBehaviors, this);
                        },
                        null, 
                        this
                    ));
                });
            });
        }
        else if(this.level == 3){
            this.phaseThreeBehaviors();
            //this.once('skeleton_inRangeFor_lashing', this.phaseThreeBehaviors, this);
            /*  when the player first gets in for lashing (which will be as soon as the boss is aggro'd
                because lashing has a bigger range than the aggro radius)...
                Throw the hook. If it lands, follow up with Dominating strike half a second later.
                Once the attack is resolved, act as if it's phaseTwo, but if the player is in lashing range
                and the attack isn't on cooldown, throw it again.*/
        }
        else{
            //some error handling if the levels miscount for any reason
            throw new Error("Skeleton Knight Boss in level is out of range");
        }


        /*//five seconds between attacks, use attacks based on level
        this.on('skeleton_attackComplete', () => {
            this.attacking = false;
            this.scene.time.delayedCall(
                5000,
                this.pickAttack,
                null,
                this
            );
        });
        this.scene.time.delayedCall(
            5000,
            this.pickAttack,
            null,
            this
        );*/
    }

    //I wish there was a better way to do this, but moveTo won't stop anything so...
    movementPattern(){
        
        //check ranges on attacks
        let playerDistance = Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y);
        if(playerDistance <= 64 * 2.5){ //if player within range of dominatingStrike
            this.emit('skeleton_inRangeFor_dominating');
        }   
        if(playerDistance <= 64 * 6){ //if player within range of sweepingStrike
            this.emit('skeleton_inRangeFor_sweeping');
        }
        if(playerDistance <= 64 * 7 && playerDistance > 64 * 6){ //if player within range of lashingStrike but not the other two
            this.emit('skeleton_inRangeFor_lashing');
        }   

        //accelerate towards the player
        //this.body.setAcceleration(0, 0);
        if(this.aggressive && !this.attacking){
            this.rotation = this.scene.physics.moveToObject(this, this.scene.player, this.speed) - Math.PI/2;
        }
        else{
            this.body.setVelocity(0, 0);
        }
    }

    phaseOneBehaviors(){
        this.attacking = true;  
        this.dominatingStrike();        //start attacking
        //once the attack is done...
        this.once('skeleton_attackComplete', () => {
            this.attacking = false;
            Phaser.Utils.Array.Add(this.timers, this.scene.time.delayedCall(
                1000,
                () => {
                    this.once('skeleton_inRangeFor_dominating', this.phaseOneBehaviors, this);
                },
                null, 
                this
            ));
        });
    }

    phaseTwoBehaviors(whichAttack){
        this.attacking = true;  
        //If we aren't told which attack to use
        if(whichAttack == null){
            //randomly do either a sweeping strike or a dominating strike
            whichAttack = Phaser.Math.Between(0, 1);
        }
        //Do the attack the method told us to do
        //I'm using a ternary here because I like them
        whichAttack == 1 ? this.dominatingStrike() : this.sweepingStrike()
        //once the attack is done...
        this.once('skeleton_attackComplete', () => {
            this.attacking = false;
            Phaser.Utils.Array.Add(this.timers, this.scene.time.delayedCall(
                1000,
                () => {
                    this.once('skeleton_inRangeFor_dominating', this.phaseTwoBehaviors, this);
                },
                null, 
                this
            ));
        });
    }

    phaseThreeBehaviors(){
        this.off('skeleton_inRangeFor_dominating'); //stop listening for dominating for a bit
        this.attacking = true;
        this.lashingStrike();   //throw the hook
        //if the hook lands, make note of that
        this.once('skeleton_hooked!', () => {this.lashCatch = true}, this);
        //once the attack is over
        this.once('skeleton_attackComplete', this.lashHandling, this);
    }

    dominatingStrike(){
        let attack = new DominatingStrike(this.scene, this.x, this.y, 'sweeping_strike', 0, this, 0);
        this.scene.hostileAttackGroup.add(attack);
    }

    sweepingStrike(){
        let attack = new DominatingStrike(this.scene, this.x, this.y, 'sweeping_strike', 0, this, 1);
        this.scene.hostileAttackGroup.add(attack);
    }

    lashingStrike(){
        let attack = new LashingStrike(this.scene, this.x, this.y, 'lashing_strike', 0, this);
        this.scene.hostileAttackGroup.add(attack);
    }

    //anything special that happens when the enemy dies
    onDeath(){
        ++this.scene.player.bodyCount;
        this.scene.player.score += this.points;

        this.scene.collectableGroup.add(new Portal(this.scene, this.x, this.y, 'portal', 0, this.scene.nextScene));
    }

    lashHandling(){
        //if the lash caught something
        if(this.lashCatch){
            //wait half a second, ruin its day, then assume phaseTwo behaviors
            Phaser.Utils.Array.Add(this.timers, this.scene.time.delayedCall(
                500,
                this.phaseTwoBehaviors,
                [1],      //this 1 argument makes phaseTwoBehaviors throw dominating strike
                this
            ));
        }
        //if it didn't
        else{
            this.attacking = false;
            //assume phaseTwo behaviors in one second
            Phaser.Utils.Array.Add(this.timers, this.scene.time.delayedCall(
                1000,
                () => {
                    this.attacking = false;
                    this.once('skeleton_inRangeFor_dominating', this.phaseTwoBehaviors, this);
                },
                null, 
                this
            ));
        }

        //after seven seconds, start checking for lashing again.
        Phaser.Utils.Array.Add(this.timers, this.scene.time.delayedCall(
            7000,
            () => {this.once('skeleton_inRangeFor_lashing', this.phaseThreeBehaviors, this)},
            null,
            this
        ));
        
        //with the hook resolved, reset lashCatch
        this.lashCatch = false;
    }
}