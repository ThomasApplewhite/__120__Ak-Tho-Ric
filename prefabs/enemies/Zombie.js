class Zombie extends Enemy{
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame, 1, 10, 320);

        //properties
        this.speed = 125;           //speed
        this.body.setBounce(0, 0);  //bounciness
        this.lunging = 0;           //is it attacking? 0 = not attacking but can, 1 = attacking, 2 = not attacking but can't
        this.body.setSize(24, 28);  //hurtbox size
        this.attackDuration = 1000; //how many miliseconds a zombie attack lasts
        this.attackRange = 100;     //how close the zombie must be to the player to lunge

        //animation
        this.anims.play('zombie_walkAnim');
    }

    //frame-by-frame movement
    //the movement right now is REALLY stiff. I might need some time to clean this up
    movementPattern(){
        if(this.aggressive){
            this.lunge();

            //accelerateToObject returns the angle the Zombie needs to go, and we add pi/2 radians to correct the art's offset
            if(this.lunging == 1){
                //run at them twice as fast as normal
                this.rotation = this.scene.physics.moveToObject(this, this.scene.player, this.speed * 2) + Math.PI/2;;
            }else{
                //run towards them without lunging                               
                this.rotation = this.scene.physics.moveToObject(this, this.scene.player, this.speed) + Math.PI/2;;
            }
        }
    }

    //what happens when the enemy collides with the player
    //  other forms of attack should go in attackPattern
    onAttack(player){
        if(this.lunging == 1){
            player.takeDamage(2);   //melee enemies do 2 damage
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
        if(this.lunging == 0 && dist <= this.attackRange){
            //lunge at 'em
            this.lunging = 1;
            this.anims.play('zombie_attackAnim');
            Phaser.Utils.Array.Add(this.timers, this.scene.time.addEvent({
                delay: this.attackDuration,
                callback: () => {
                    //after the lunge, enter cooldown
                    this.lunging = 2;
                    this.anims.play('zombie_walkAnim');
                },
                callbackScope: this
            }));
            Phaser.Utils.Array.Add(this.timers, this.scene.time.addEvent({
                delay: this.attackDuration * 2,
                //after the cooldown, back to normal
                callback: () => {this.lunging = 0;},
                callbackScope: this
            }));
        }
    }
}