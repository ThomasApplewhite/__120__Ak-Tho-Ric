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
        this.deathSound = 'dreadDeath';

        //this.scene.bossLaughSFX.play();

        //listeners list
        this.on('animationcomplete', () => {this.setTexture('entities', frame,);}, this);
        this.on('dreadeyes_attackcomplete', () => {
            this.attackTimer.paused = false;
            this.scene.tweens.add(Enemy.getBossTween(this));
            this.attacking = false; //this is theoretically redundent
        }, this);

        this.scene.bossActive = true;
    }

    //how the enemy will specificly attack, if at all
    attackPattern(){
        //face the player
        this.scene.tweens.add(Enemy.getBossTween(this));
        this.scene.sound.play('dreadLaugh');
        
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
        if(this.aggressive && !this.attacking){
            this.rotation = this.scene.physics.moveToObject(this, this.scene.player, this.speed) - Math.PI/2;
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
        this.anims.play('dread_blightAnim');
        Phaser.Utils.Array.Add(this.timers, this.scene.time.addEvent({
            delay: 750,
            callback: () => {
                this.scene.hostileAttackGroup.addMultiple([
                    new BlightBeam(this.scene, this.x, this.y, 'attacks', 'dread_eyes_projectile1', this, 35),
                    new BlightBeam(this.scene, this.x, this.y, 'attacks', 'dread_eyes_projectile1', this, 0),
                    new BlightBeam(this.scene, this.x, this.y, 'attacks', 'dread_eyes_projectile1', this, -35),
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
        this.anims.play('dread_stonesAnim');
        let spawnTimer = this.scene.time.addEvent({
            delay: 250,
            callback: () => {
                xOff = Phaser.Math.Between(-256, 256);
                yOff = Phaser.Math.Between(-256, 256);
                this.scene.hostileAttackGroup.add(
                    new ShatteringStone(this.scene, this.x + xOff, this.y + yOff, 'attacks', 'dread_eyes_stones1', this, Phaser.Math.Between(1, 4))
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
        //I want to tween this, but I can do that later
        //this.rotation = 0;
        this.scene.tweens.add({
            targets: this,
            rotation: {from: this.rotation, to: 0},
            ease: 'linear',
            duration: 250
        });
        this.anims.play('dread_cardinalAnim');
        Phaser.Utils.Array.Add(this.timers, this.scene.time.addEvent({
            delay: 250,
            callback: () => {
                this.scene.hostileAttackGroup.addMultiple([
                    new CardinalRay(this.scene, this.x, this.y, 'attacks', 'dread_eyes_laser1', this, 1),
                    new CardinalRay(this.scene, this.x, this.y, 'attacks', 'dread_eyes_laser1', this, 2),
                    new CardinalRay(this.scene, this.x, this.y, 'attacks', 'dread_eyes_laser1', this, 3),
                    new CardinalRay(this.scene, this.x, this.y, 'attacks', 'dread_eyes_laser1', this, 4),
                ]);
            },
            loop: 0
        }));
    }

    //anything special that happens when the enemy dies
    onDeath(){
        ++this.scene.player.bodyCount;
        this.scene.player.score += this.points;

        this.scene.collectableGroup.add(new Portal(this.scene, this.x, this.y, 'attacks', 'portal', this.scene.nextScene));
    }

}