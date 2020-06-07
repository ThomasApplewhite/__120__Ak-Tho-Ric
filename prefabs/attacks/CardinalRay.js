class CardinalRay extends Attack{
    constructor(scene, x, y, texture, frame, user, orientation){
        super(scene, x, y, texture, frame, user);

        this.damage = 15;
        this.startup = 750;     //based on animation length, currently 750ms
        this.user = user;
        this.hostile = false;

        Phaser.Utils.Array.Add(this.timers, this.scene.time.delayedCall(
            this.startup,
            () => {
                this.hostile = true;
                this.scene.sound.play('dreadRay');
            }
        ));

        this.setOrientation(orientation);

        this.anims.play('dreadAttack_cardinalAnim');

        this.on('animationcomplete', () => {
            user.emit('dreadeyes_attackcomplete');
            console.log("attack complete");
            this.removeSelf();
        });
    }
    strike(target){
        if(this.hostile && target != null){
            target.takeDamage(this.damage);
        }
    }

    setOrientation(orientation){
        switch(orientation){
            case 4:
                //left
                this.setAngle(90);
                this.x -= (this.user.width / 2) + (this.height / 2);
                this.body.setSize(this.height, this.width);
                break;
            case 3:
                //bottom
                this.y += (this.user.height / 2) + (this.height / 2);
                this.angle = 0;
                break;
            case 2:
                //right
                this.setAngle(90);
                this.x += (this.user.width / 2) + (this.height / 2);
                this.body.setSize(this.height, this.width);
                this.flipY = true;
                break;
            case 1:
                //top
                this.y -= (this.user.height / 2) + (this.height / 2);
                this.angle = 0;
                this.flipY = true;
                break;
            default:
                this.y -= (this.user.height / 2) + (this.height / 2);
                this.angle = 0;
                //not found. pretend it's top
                break;
        }
    }
}