class Player extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame);

        //add to scene
        scene.add.existing(this);           //add the sprite
        scene.physics.add.existing(this);   //add the physics
        this.body.setSize(24, 36);
        //set controls
        this.moveUp         =   keyUP;
        this.moveDown       =   keyDOWN;
        this.moveLeft       =   keyLEFT;
        this.moveRight      =   keyRIGHT;
        this.normalAttack   =   keyQ;
        this.specialAttack  =   keyE;
        //player properties
        this.lives = 3;
        this.stunned = false;
        this.immune = false;
        this.speed = 250;
        this.bodyCount = 0;
        this.score = 0;
        this.distance = 0;
        //attack cooldowns
        this.canNormal = true;
        this.canSpecial = 3;
        //animation logic
        this.walkAnim();
        this.on('animationcomplete', () => {this.anims.play('orc_walkAnim');}, this);
    }

    update(){
        ++this.distance;

        //left-right movement
        if(!this.stunned && this.moveLeft.isDown){
            this.body.setVelocityX(-this.speed);
            this.walkAnim();
        }
        else if(!this.stunned && this.moveRight.isDown){
            this.body.setVelocityX(this.speed);
            this.walkAnim();
        }
        else if(!this.stunned){
            this.body.setVelocityX(0);
        }

        //up-down movement
        if(!this.stunned && this.moveUp.isDown){
            this.body.setVelocityY(-this.speed * 1/2);
            this.walkAnim();
        }
        else if(!this.stunned && this.moveDown.isDown){
            this.body.setVelocityY(this.speed * 3/2);
            this.walkAnim();
        }
        else if(!this.stunned){
            this.body.setVelocityY(0);
        }

        /*if(this.body.speed == 0 && this.anims.getCurrentKey() == 'orc_walkAnim'){
            this.anims.stop();
        }*/

        if(!this.stunned && Phaser.Input.Keyboard.JustDown(this.normalAttack)){
            this.punchAttack();
        }

        if(!this.stunned && Phaser.Input.Keyboard.JustDown(this.specialAttack)){
            this.magicMissileAttack();
        }

        if(this.y > config.height){
            this.defeat();
        }

    }

    //stuns the player for 1 second
    startStun(stunTime){
        if(!this.stunned && !this.immune){
            console.log("You've been stunned!");
            this.anims.play('orc_stunAnim');
            this.stunned = true;
            this.scene.time.delayedCall(stunTime, () => {
                this.stunned = false;
                this.immune = true;
                this.anims.stop();
                console.log("Now you're immune!");
            }, null, this);
            this.scene.time.delayedCall(stunTime * 2, () => {
                this.immune = false;
            });
        }
    }

    takeDamage(){
        if(!this.stunned && !this.immune){
            this.scene.healthUpdate(this.lives);
            this.lives -= 1;
            if(this.lives > 0){
                this.startStun(250);
            }else{
                this.defeat();
            }
        }
    }

    defeat(){
        this.stunned = true;
        this.setVisible(false);
        /*console.log("You lose!");
        console.log("Score: " + this.score);
        console.log("Distance: " + this.distance);
        console.log("Body Count: " + this.bodyCount);
        console.log("Press Q to Restart");*/
        this.scene.gameOver = true;
        this.scene.time.delayedCall(1000, this.scene.finishGame());
    }

    punchAttack(){
        if(this.canNormal){
            //PUNCH HIM
            this.anims.play('orc_punchAnim');
            this.scene.attackGroup.add(new OrcPunch(
                this.scene,
                this.x + 32, //this.body.sourceWidth/2,
                this.y - 8, //this.body.sourceHeight/2,
                'attacks',
                'power_punch1',
                1               //the damage of the punch
                )
            );
            //start cooldown
            this.canNormal = false;
            this.scene.time.addEvent({
                delay: 500,     //total time before next punch is 30 frames i.e. half a second
                callback: function(){
                    this.canNormal = true;
                    console.log("PUNCH ready!");
                },
                callbackScope: this,
                loop: false
            });
        }
    }

    magicMissileAttack(){
        if(this.canSpecial >= 3){
            //reset UI
            this.scene.meterUpdate(0);
            //create magic missile
            //new MagicMissile(this.scene, this.x+16, this.y-16, 'magic_missile', 0, 400)
            this.scene.attackGroup.add(new MagicMissile(
                this.scene, 
                this.x+16, 
                this.y-16, 
                'magic_missile', 
                0, 
                300             //the range of the missile
                )
            );
            //start cooldown
            this.canSpecial = 0;
            /*this.scene.time.addEvent({
                delay: 4000,
                callback: function(){
                    this.canSpecial = true;
                    console.log("Magic Missle ready!");
                },
                //args: [],
                callbackScope: this,
                loop: false
            });*/
        }
    }

    exportScores(){
        let scores = new Array(this.score, this.distance, this.bodyCount);
        return scores;
    }

    walkAnim(){
        if(!this.anims.isPlaying && !this.stunned){
            this.anims.play('orc_walkAnim');
        }
    }
}