class Zombie extends Enemy{
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame, 1, 10, 320);

        //properties
        this.speed = 125;           //speed
        this.lungeSpeed = 200;      //speed while lunging
        this.body.setBounce(0, 0);  //bounciness
        this.lunging = 0;           //is it attacking? 
        //^0 = not attacking but can, 1 = about to attack, 2 = attacking, 3 = not attacking but can't
        this.deathSound = 'zombie_death';
        this.body.setSize(24, 28);  //hurtbox size
        this.attackDuration = ((1.5 * 64) / this.lungeSpeed) * 1000 //how many miliseconds a zombie attack lasts. 
        //^Determined by how long it should take for a zombie to cross a certain number of tiles (currently 1.5)
        this.recoveryTimeShort = 500;     //how long recovering from a lunge takes on whiff
        this.recoveryTimeLong = 1000;     //how long recovering from a lunge takes on hit
        this.chargeTime = 500       //how long charging a lunge takes
        

        this.attackRange = 64;     //how close the zombie must be to the player to lunge
        this.damage = 2;            //melee enemies do 2 damage

        //animation
        this.anims.play('zombie_walkAnim');
    }

    //how the enemy attacks
    attackPattern(){
        //event declarations
        //when a zombie starts lunging
        this.on("zombie_lungeStart", () => {
            this.lunging = 1;
            this.scene.time.delayedCall(
                //charge for chargeTime miliseconds
                this.chargeTime,
                () => {
                //lunge at 'em
                    this.emit("zombie_lunging");
                },
            this
        )}, null, this);

        this.on("zombie_lunging", () => {
            //start lunging!
            this.lunging = 2;
            this.anims.play('zombie_attackAnim');
            this.scene.sound.play('zombie_attack');
            //lunge managment timer
            this.scene.time.delayedCall(
                this.attackDuration,
                () => {
                    this.emit("zombie_lungeDone", this.recoveryTimeShort);
                },
                this
            )}, null, this);

        this.on("zombie_lungeDone", (cooldown) => {
            //lunge cooldown timer
            //after the lunge, enter cooldown
            this.lunging = 3;
            this.anims.play('zombie_walkAnim');
            this.scene.time.delayedCall(
                cooldown,
                //after the cooldown, back to normal
                () => {this.lunging = 0;},
                this
            )}, null, this);

    }

    //frame-by-frame movement
    //the movement right now is REALLY stiff. I might need some time to clean this up
    movementPattern(){
        if(this.aggressive){
            this.lunge();

            //moveToObject returns the angle the Zombie needs to go, and we add pi/2 radians to correct the art's offset
            if(this.lunging == 2){
                //run at them twice as fast as normal
                this.rotation = this.scene.physics.moveToObject(this, this.scene.player, this.lungeSpeed) + Math.PI/2;
            }else if(this.lunging == 1){
                //keep facing them, but don't move
                this.rotation = this.scene.physics.moveToObject(this, this.scene.player, 0) + Math.PI/2;
            }else{
                //run towards them without lunging                               
                this.rotation = this.scene.physics.moveToObject(this, this.scene.player, this.speed) + Math.PI/2;
            }
        }
    }

    //what happens when the enemy collides with the player
    //  other forms of attack should go in attackPattern
    onAttack(player){
        if(this.lunging == 2){
            player.takeDamage(this.damage);
            this.emit("zombie_lungeDone", this.recoveryTimeLong);
        }
    }

    onDamage(damage){
        this.health -= damage;
    }

    //The zombie's attack. When close to the player, zombies will enter a speedy rage for
    //  attackDuration seconds, then take a break
    lunge(){
        let dist = Phaser.Math.Distance.Between(this.x, this.y , this.scene.player.x, this.scene.player.y);

        //if close enough and not on cool down
        //yes, I know stacking timers like this aren't great, but it'll have to do for now
        if(this.lunging == 0 && dist <= this.attackRange){
            this.emit("zombie_lungeStart");
            /*//charge-up timer
            Phaser.Utils.Array.Add(this.timers, this.scene.time.addEvent({
                delay: this.chargeTime,
                callback: () => {
                    //lunge at 'em
                    this.lunging = 1;
                    this.anims.play('zombie_attackAnim');
                },
                callbackScope: this
            }));

            //lunge managment timer
            Phaser.Utils.Array.Add(this.timers, this.scene.time.addEvent({
                delay: this.attackDuration + this.chargeTime,
                callback: () => {
                    //after the lunge, enter cooldown
                    this.lunging = 2;
                    this.anims.play('zombie_walkAnim');
                },
                callbackScope: this
            }));

            //lunge cooldown timer
            Phaser.Utils.Array.Add(this.timers, this.scene.time.addEvent({
                delay: this.recoveryTime + this.attackDuration + this.chargeTime,
                //after the cooldown, back to normal
                callback: () => {this.lunging = 0;},
                callbackScope: this
            }));*/
        }
    }
}