class CardinalRay extends Attack{
    constructor(scene, x, y, texture, frame, user, orientation){
        super(scene, x, y-224, texture, frame, user);
        //the -224 places every ray in the 'above position while orientations are figured out
        //224 is half the length of a ray. We just don't have acces to the height property
        //before calling this consttructor

        this.damage = 15;
        this.duration = 500;
        
        this.setOrientation(orientation);

        Phaser.Utils.Array.Add(this.timers, this.scene.addEvent({
            delay: this.duration,
            callback: () => {
                this.emit('dreadeyes_attackcomplete');
                this.removeSelf();
            },
            callbackScope: this,
            loop: 0,
        }));
    }

    strike(target){
        target.takeDamage(this.damage);
    }

    setOrientation(orientation){
        switch(orientation){
            case 4:
                //right
                this.y += this.height / 2;
                this.setAngle(this.angle + 90);
                this.x -= this.height / 2
                break;
            case 3:
                //bottom
                this.y += this.height / 2;
                break;
            case 2:
                //right
                this.y += this.height / 2;
                this.setAngle(this.angle + 90);
                this.x += this.height / 2
                break;
            case 1:
                //top. do nothing
                break;
            default:
                //not found. pretend it's top
                break;
        }
    }
}