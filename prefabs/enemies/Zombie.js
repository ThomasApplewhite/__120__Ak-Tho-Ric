class Zombie extends Enemy{
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame, 1, 10);

        //properties
        this.speed = 250;           //speed
        this.body.setBounce(0, 0);  //bounciness
        this.lunging = 0;           //is it attacking? 0 = not attacking but can, 1 = attacking, 2 = not attacking but can't
        this.body.setSize(24, 28);  //hurtbox size
        this.attackDuration = 1000; //how many miliseconds a zombie attack lasts
        this.attackRange = 100;     //how close the zombie must be to the player to lunge

        //animation
        this.anims.play('zombie_walkAnim');
        /*this.on('animationcomplete', () => {
            this.anims.play('zombie_walkAnim');
            this.lunging = false;
        }, this);*/
    }

    //frame-by-frame movement
    //the movement right now is REALLY stiff. I might need some time to clean this up
    movementPattern(){
        this.body.setAcceleration(0, 0);
        this.lunge();

        //if the zombie passes the player...
        if(this.y > this.scene.player.y){
            //run off the screen. It looks really weird tho.
            this.body.setVelocityY(this.speed);
            this.body.setDragX(this.speed);
        }else if(this.lunging == 1){
            //run at them twice as fast as normal
            this.scene.physics.accelerateToObject(this, this.scene.player, 15000, this.speed*1.5/2,  this.speed*1.5);
        }else{
            //run towards them without lunging                               
            this.scene.physics.accelerateToObject(this, this.scene.player, 10000, this.speed/2, this.speed);
        }

    }

    //what happens when the enemy collides with the player
    //  other forms of attack should go in attackPattern
    onAttack(player){
        if(this.lunging == 1){
            player.takeDamage();
        }
    }

    onDamage(damage){
        this.health -= damage;
    }

    //Thomas, did you just declare a timer within another timer's unnamed callback? Yes. Yes, I did.
    lunge(){
        let dist = Phaser.Math.Distance.Between(this.x, this.y , this.scene.player.x, this.scene.player.y);
        if(this.lunging == 0 && dist <= this.attackRange){
            this.lunging = 1;
            this.anims.play('zombie_attackAnim');
            this.scene.time.addEvent({
                delay: this.attackDuration,
                callback: () => {
                    this.lunging = 2;
                    //this prevents an anim being played on a dead zombie
                    //a better fix would be to destroy all timers on zombie death, but I'm lazy.
                    if(this.health !== null){
                        this.anims.play('zombie_walkAnim');
                    }
                },
                callbackScope: this
            });
            this.scene.time.addEvent({
                delay: this.attackDuration * 2,
                callback: () => {this.lunging = 0;},
                callbackScope: this
            });
        }
    }
}