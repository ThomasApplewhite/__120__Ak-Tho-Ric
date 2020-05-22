class DreadEyes extends Enemy{
    constructor(scene, x, y, texture, frame, level){
        super(scene, x, y, texture, frame, 50, 100, 6 * 64);

        //properties
        this.attackTimer;
        this.level = level;
        if(this.level > 3){ //level determines which attacks the boss can use
            this.level = 3;
        }
        this.health = this.health +  (25 * (this.level - 1));
        this.points = this.points * this.level;
        this.body.setSize(1.5 * 64, 1.5 * 64);
        this.body.setBounce(0, 0);
        this.speed = 50;
        this.attacking = false;

        //this.scene.bossLaughSFX.play();

        //listeners list
        this.on('animationcomplete', () => {this.setTexture('entities', frame,);}, this);
        this.on('dreadeyes_attackcomplete', () => {
            this.attackTimer.paused = false;
            this.attacking = false;
        }, this);

        this.scene.bossActive = true;
    }

    //how the enemy will specificly attack, if at all
    attackPattern(){
        //five seconds between attacks, use attacks based on level
        this.attackTimer = Phaser.Utils.Array.Add(this.timers, this.scene.time.addEvent({
            delay: 5000,            //5 seconds, plus 1 for the actual attack
            callback: () => {
                this.attackTimer.paused = true;
                this.pickAttack();
            },
            //args: [],
            callbackScope: this,
            loop: true,
        }));
    }

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
    
    //randomly throws an attack, based on the boss' level
    pickAttack(){

        let attackCall = Phaser.Math.Between(1, this.level);

        console.log("Attack Calling: " + attackCall);
        
        this.attacking = true;
        if(attackCall == 3){
            this.cardinalRays();
        }
        else if(attackCall == 2){
            this.shatteringStones();
        }
        else{
            this.blightBeams();
        }

    }

    blightBeams(){
        Phaser.Utils.Array.Add(this.timers, this.scene.time.addEvent({
            delay: 750,
            callback: () => {
                this.scene.hostileAttackGroup.addMultiple([
                    new BlightBeam(this.scene, this.x, this.y, 'blight_beam', 0, this, 35),
                    new BlightBeam(this.scene, this.x, this.y, 'blight_beam', 0, this, 0),
                    new BlightBeam(this.scene, this.x, this.y, 'blight_beam', 0, this, -35),
                ]);
            },
            loop: 0
        }));
    }

    shatteringStones(){
        let stoneCount = Phaser.Math.Between(3, 5); //amount of stones spawned
        let xOff;   //the distance from the boss the rock should spawn on the x Axis
        let yOff;   //the distance from the boss the rock should spawn on the y Axis

        //timer that spawns the rocks
        let spawnTimer = this.scene.time.addEvent({
            delay: 250,
            callback: () => {
                xOff = Phaser.Math.Between(-256, 256);
                yOff = Phaser.Math.Between(-256, 256);
                this.scene.hostileAttackGroup.add(
                    new ShatteringStone(this.scene, this.x + xOff, this.y + yOff, 'shattering_stone', 0, this, Phaser.Math.Between(1, 4))
                );
            },
            repeat: stoneCount,   //this timer will repeat once for each rock
            //paused: true
        });
        Phaser.Utils.Array.Add(this.timers, spawnTimer);

        /*//timer that starts the rock fall
        Phaser.Utils.Array.Add(this.timers, this.scene.time.addEvent({
            delay: 750,
            callback: () => {spawnTimer.paused = true},
            callbackScope: this
        }))*/
    }

    cardinalRays(){
        Phaser.Utils.Array.Add(this.timers, this.scene.time.addEvent({
            delay: 1000,
            callback: () => {
                this.scene.hostileAttackGroup.addMultiple([
                    new CardinalRay(this.scene, this.x, this.y, 'cardinal_ray', 0, this, 1),
                    new CardinalRay(this.scene, this.x, this.y, 'cardinal_ray', 0, this, 2),
                    new CardinalRay(this.scene, this.x, this.y, 'cardinal_ray', 0, this, 3),
                    new CardinalRay(this.scene, this.x, this.y, 'cardinal_ray', 0, this, 4),
                ]);
            },
            loop: 0
        }));
    }


}