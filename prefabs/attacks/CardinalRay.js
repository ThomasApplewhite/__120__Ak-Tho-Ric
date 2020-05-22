class CardinalRay extends Attack{
    constructor(scene, x, y, texture, frame, user, orientation){
        super(scene, x, y, texture, frame, user);

        this.damage = 15;
        this.duration = 500;
        this.user = user;
        
        this.setOrientation(orientation);

        Phaser.Utils.Array.Add(this.timers, this.scene.time.addEvent({
            delay: this.duration,
            callback: () => {
                user.emit('dreadeyes_attackcomplete');
                this.removeSelf();
            },
            callbackScope: this,
            loop: 0,
        }));
    }

    strike(target){
        if(target != null){
            target.takeDamage(this.damage);
        }
    }

    setOrientation(orientation){
        switch(orientation){
            case 4:
                //right
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
                break;
            case 1:
                this.y -= (this.user.height / 2) + (this.height / 2);
                this.angle = 0;
                //top. do nothing
                break;
            default:
                this.y -= (this.user.height / 2) + (this.height / 2);
                this.angle = 0;
                //not found. pretend it's top
                break;
        }
    }
}