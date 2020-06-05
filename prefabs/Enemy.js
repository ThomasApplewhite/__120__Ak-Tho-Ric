class Enemy extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame, health, points, aggroRange){
        super(scene, x, y, texture, frame);

        scene.physics.add.existing(this);
        scene.add.existing(this);
        this.body.setBounce(0, 0);

        //properties
        this.health = health;
        this.points = points;
        this.immune = false;
        this.aggroRange = aggroRange;
        this.aggressive = false;
        this.timers = new Array();
        //adding a one-time event to cause a g g r e v a t i o n
        //I'm typing in an argument to make sure aggro'ing one enemy doesn't aggro them all
        this.once("aggressived", (enemy) => {enemy.aggressive = true; enemy.attackPattern();});

        //Enemies are really anything that isn't the player that still moves.
        //They come with methods to handle getting hurt, but are otherwise just moving images.
    }

    update(){
        this.movementPattern();

        if(!this.aggressive && 
            Phaser.Math.Distance.BetweenPoints(this.body.position, this.scene.player.body.position) < this.aggroRange)
        {
            this.emit("aggressived", this);
        }

        if(this.health <= 0){
            this.onDeath();
            this.destroyCleanup();
        }
    }

    //frame-by-frame movement
    movementPattern(){

    }

    //attack related behavior that needs to be checked on a frame-by-frame basis
    attackBehavior(){

    }

    //what happens when the enemy collides with the player
    //  other forms of attack should go in attackPattern
    onAttack(){

    }

    onDamage(damage, immuneTime){
        if(!this.immune){
            this.health -= damage;
            this.startImmunity(immuneTime);
        }
    }

    startImmunity(immuneTime){
        this.immune = true;
        Phaser.Utils.Array.Add(this.timers, this.scene.time.addEvent({
            delay: immuneTime,
            callback: () => {this.immune = false},
            callbackScope: this
        }));
    }

    //anything special that happens when the enemy dies
    onDeath(){
        if(this.deathSound != null){
            this.scene.sound.play(this.deathSound);
        }
        ++this.scene.player.bodyCount;
        this.scene.player.score += this.points;

        if(Phaser.Math.Between(1, 100) <= 5){
            this.scene.collectableGroup.add(new HealthOrb(this.scene, this.x, this.y, 'health_orb'));
        }
    }

    destroyCleanup(){
        this.timers.forEach((item) => {item.remove()})
        this.destroy();
    }

    //static functions
    static getBossTween(boss, attackRecovery){
        if(attackRecovery = null){attackRecovery = true;}

        let tweenConfig = {
            targets: boss,
            rotation: {
                from: boss.rotation, //this atan2 calculation is how phaser gets its rotations
                to: Math.atan2(boss.scene.player.y - boss.y, boss.scene.player.x - boss.x) - Math.PI/2
            },
            ease: 'linear',
            duration: 250,
            onComplete: () => {if(attackRecovery){boss.attacking = false;}},
            onCompleteScope: boss
            //Math.atan2(this.scene.player.y - this.y, this.scene.player.x - this.gameObject.x);
        }
        return tweenConfig
    }
}