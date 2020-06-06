class Player extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame);

        //add to scene
        scene.add.existing(this);           //add the sprite
        scene.physics.add.existing(this);   //add the physics
        this.body.setSize(24, 36);
        this.body.setBounce(0, 0);

        //this.body.syncBounds = true;
        //set controls
        this.moveUp         =   keyUP;
        this.moveDown       =   keyDOWN;
        this.moveLeft       =   keyLEFT;
        this.moveRight      =   keyRIGHT;
        this.normalAttack   =   keyQ;
        this.specialAttack  =   keyE;
        this.dash           =   keyW;
        //player properties
        this.maxHealth = 30;
        this.health = this.maxHealth;
        this.stunned = false;
        this.immune = false;
        this.speed = 250;
        this.bodyCount = 0;
        this.score = 0;
        //action cooldowns
        this.canNormal = true;
        this.canDash = true;
        this.canSpecial = 3;
        this.controlLock = false;
        //related timers
        this.actionTimers = {
            stunTime: null,
            immuneTime: null,
            punchCooldown: null,
            dashTime: null,
            dashCooldown: null,
        }
        //animation logic
        this.walkAnim();
        this.on('animationcomplete', () => {this.anims.play('orc_walkAnim');}, this);
        this.standingFrame = frame;
        //particle Logic
        /*console.log("particling");
        if(this.scene.particleManager == null){
            console.log("Something's wrong with the manager");
        }
        console.log(this.scene.particleManager.texture);
        this.particleEmitter = this.scene.particleManager.createEmitter({
            x: 400,
            y: 300,
            follow: this,
            frame: 0,
            lifespan: 1000,
            scale: 10,
            speed: 100,
            quantity: 100,
            blendMode: 'ADD'
        });
        console.log("particling done");*/
    }

    update(){
        ++this.distance;
        this.stats.update();

        if(!this.stunned && !this.controlLock){
            this.controlOperations();
        }

    }

    //handles keyboard inputs the do things
    controlOperations(){
        //left-right movement
        if(this.moveLeft.isDown){
            this.body.setVelocityX(-this.speed);
            this.walkAnim();
        }
        else if(this.moveRight.isDown){
            this.body.setVelocityX(this.speed);
            this.walkAnim();
        }
        else{
            this.body.setVelocityX(0);
        }

        //up-down movement
        if(this.moveUp.isDown){
            this.body.setVelocityY(-this.speed);
            this.walkAnim();
        }
        else if(this.moveDown.isDown){
            this.body.setVelocityY(this.speed);
            this.walkAnim();
        }
        else{
            this.body.setVelocityY(0);
        }

        //if the player stopped moving, stop the animation
        if(this.body.velocity.equals(Phaser.Math.Vector2.ZERO)){
            this.anims.pause();
            this.setFrame(this.standingFrame);
        }

        this.updateRotation();

        //actions
        if(Phaser.Input.Keyboard.JustDown(this.normalAttack)){
            this.punchAttack();
        }

        if(Phaser.Input.Keyboard.JustDown(this.specialAttack)){
            this.magicMissileAttack();
        }

        if(Phaser.Input.Keyboard.JustDown(this.dash)){
            this.dashAttack();
        }
    }

    //stuns the player for stunTime seconds, then makes them immune for that much time afterwards
    startStun(stunTime){
        if(!this.stunned && !this.immune && stunTime != 0){
            console.log("You've been stunned!");
            this.body.stop();
            this.anims.play('orc_stunAnim');
            this.stunned = true;
            this.actionTimers.stunTime = this.scene.time.delayedCall(stunTime, () => {
                this.stunned = false;
                this.immune = true;
                this.anims.stop();
                console.log("Now you're immune!");
            }, null, this);
            this.actionTimers.immuneTime = this.scene.time.delayedCall(stunTime * 2, () => {
                this.immune = false;
            });
        }
    }

    //player takes damage, if they're not immune
    takeDamage(damage, stunTime){
        //If an attack doesn't stun for a specific amount of time, make it stun for 250
        if(stunTime == null){
            stunTime = 250
        }

        //shake the screen while stunned which magnitude relative to damage
        this.scene.cameras.main.shake(
            stunTime,
            damage/300
        );

        if(!this.stunned && !this.immune){
            //emit some particles
            //this.particleEmitter.explode(damage, this.x, this.y)

            this.health -= damage;
            if(this.health > 0){
                this.startStun(stunTime);
            }else{
                this.defeat();
            }

            //make the screen red for a bit
            if(stunTime != 0){
                new RedScreenEffect(this.scene, game.config.width/2, game.config.height/2, stunTime);
            }
        }
    }

    //ends the game on player death
    defeat(){
        this.stunned = true;
        this.setVisible(false);
        this.body.stop();

        this.stats.healthUpdate(0);

        this.scene.gameOver = true;
        this.scene.time.delayedCall(1000, this.scene.finishGame());
    }

    punchAttack(){
        if(this.canNormal){
            //PUNCH HIM
            let attackOffset = this.spawningRotation(32); //change the number here to determine where the attack goes relative to the player
            this.anims.play('orc_punchAnim');
            this.scene.attackGroup.add(new OrcPunch(
                this.scene,
                attackOffset.x, 
                attackOffset.y, 
                'attacks',
                'power_punch1',
                this,
                1               //the damage of the punch
                )
            );
            //start cooldown
            this.canNormal = false;
            this.actionTimers.punchCooldown = this.scene.time.addEvent({
                delay: 500,     //total time before next punch is 30 frames i.e. half a second
                callback: function(){
                    this.canNormal = true;
                    //console.log("PUNCH ready!");
                },
                callbackScope: this,
                loop: false
            });
        }
    }

    magicMissileAttack(){
        if(this.canSpecial >= 3){
            //reset UI
            //this.scene.meterUpdate(0);
            //create magic missile
            //new MagicMissile(this.scene, this.x+16, this.y-16, 'magic_missile', 0, 400)
            let attackOffset = this.spawningRotation(32) //change the numbers here to determine where the attack goes relative to the player
            this.scene.attackGroup.add(new MagicMissile(
                this.scene, 
                attackOffset.x, 
                attackOffset.y, 
                'magic_missile', 
                0,
                this, 
                300             //the range of the missile
                )
            );
            //start cooldown
            this.canSpecial = 0;
        }
    }

    //locks player controls and launches them in the direction they're currently facing.
    dashAttack(){
        if(this.canDash){
            console.log("Dashing!");
            this.stats.dashIcon.emit('dashStarted');    //I need them to emit off of the icon because their container isn't a GameObject
            //if the player is facing forward, their destination is 128 pixels infront of them.
            //attackRotation will automatically set the destination coods based off of this offset and player rotation
            let destination = this.spawningRotation(128);
            this.anims.play('orc_dashAnim');    //start the anim
            this.scene.physics.moveTo(this, destination.x, destination.y, 60, 250);
            this.anims.pause(this.anims.currentAnim.getFrameAt(2));   //and immediately pause it at the lunge part
            //lock controls and raise dash flag
            this.controlLock = true;
            this.canDash = false;
            //The dash takes 1/4 of a second, and the player stops on arrival
            this.actionTimers.dashTime = this.scene.time.addEvent({
                delay: 250, 
                callback: () => {
                    this.anims.resume();    //finish the dash animation
                    this.body.stop()
                    this.controlLock = false;
                },
                callbackScope: this
            });
            //dash cools off after 4 seconds
            this.actionTimers.dashCooldown = this.scene.time.addEvent({
                delay: 4000,
                callback: () => {
                    this.canDash = true;
                    console.log("Dash ready!")
                    this.stats.dashIcon.emit('dashReady');
                },
                callbackScope: this
            });
        }
    }

    //exposes the player's score
    exportScores(){
        let scores = new Array(this.score, this.bodyCount);
        return scores;
    }

    //resets animations when an action ends
    walkAnim(){
        if(!this.anims.isPlaying && !this.stunned){
            this.anims.play('orc_walkAnim');
        }
    }

    //Sets the player's rotation based on the direction they're moving in, if they are moving
    updateRotation(){
        let vector = this.body.velocity;
        //I'd compare to Phaser.Math.Vector2.ZERO, but the comparison is inconsistent
        if(vector.x != 0 || vector.y != 0){
            //I know there's a smoother way to get rotation through the vector,
            //  but it's very difficult to get it precise, imo due to how phaser
            //  keeps switching between radians and degrees under the hood,
            //  unless I do it this way.
            let newRot = Phaser.Math.RadToDeg(vector.angle()) + 90;
            this.body.rotation = newRot;
            this.body.rotation = newRot;
        }
    }

    //calculates where a point should be based on player rotation
    //offset is how high above the point starts at
    spawningRotation(offset){
        let finalPoint = Phaser.Math.RotateAroundDistance(
            new Phaser.Geom.Point(this.x, this.y), 
            this.x, 
            this.y,
            this.rotation - (Math.PI/2),
            offset      //how far the hitCircle should be from the boss
        );
        return finalPoint;
    }
}