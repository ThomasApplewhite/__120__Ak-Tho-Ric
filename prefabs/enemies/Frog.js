class Frog extends Enemy{
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame, 1, 20, 64 * 6);

        this.speed = 125;           //speed
        this.body.setBounce(0, 0);  //bounciness
        this.body.setSize(24, 28);  //hurtbox size
        this.attacking = false;
        this.attackCharge = 500;    //how long it takes for an attack to charge
        this.attackCooldown = 750;  //how long before a frog can attack again
        //this.tooClose = false;
        this.scene = scene;
        this.deathSound = 'frog_death';

        //restart walk anim when done with shooting
        this.on('animationcomplete', () => {this.anims.play('frog_walkAnim');}, this);
    }

    movementPattern(){
        let dist = Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y);
        //unpause the walk anim if it's been stopped
        //should do nothing if an anim is currently playing
        this.anims.resume();

        this.shoot();

        //if aggro'd and the player's not too close
        if(this.aggressive && dist > 64 * 6){
            //walk towards the player if they're too far away
            this.rotation = this.scene.physics.moveToObject(this, this.scene.player, this.speed) + Math.PI/2;
        }
        /*//if aggro'd and the player's too close
        else if(this.aggressive && dist < 64 * 4){
            //walk away from the player while still facing them
            this.rotation = this.scene.physics.moveToObject(this, this.scene.player, -this.speed/2) - Math.PI*3/2;
        }*/
        //if the frog is in the goldilocks zone
        else{
            //don't actually move, just face them and pause the walk anim
            if(this.anims.getCurrentKey() === "frog_walkAnim"){this.anims.pause();}
            this.rotation = this.scene.physics.moveToObject(this, this.scene.player, 0) + Math.PI/2;
        }
    }
    
    //attack related behavior that only runs once
    attackPattern(){

    }

    //fire the projectile
    shoot(){
        //this will have an animation tied to it at some point, for right now it will just shoot

        //if the frog is in range
        if(!this.attacking && Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) < 64 * 5){
            //attack in half a second
            this.anims.play('frog_spitAnim');
            this.attacking = true;
            
            //attack timer
            Phaser.Utils.Array.Add(this.timers, this.scene.time.delayedCall(
                this.attackCharge,
                () => {
                    this.scene.sound.play('frog_spit');
                    this.scene.hostileAttackGroup.add(new AcidSpit(this.scene, this.x, this.y, 'attacks', 'spit_projectile', this));},
                null,
                this
            ));

            Phaser.Utils.Array.Add(this.timers, this.scene.time.delayedCall(
                this.attackCharge + this.attackCooldown,
                () => {this.attacking = false;},
                null,
                this
            ));

        }
        
    }
}