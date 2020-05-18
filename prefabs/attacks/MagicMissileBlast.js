class MagicMissileBlast extends Attack{
    constructor(scene, x, y, texture, frame, user, damage){
        super(scene, x, y, texture, frame, user);

        //properties
        this.damage = damage;
        this.body.setImmovable();
        this.body.setSize(160, 160);
        this.body.isCircle = true;

        this.scene.mmBlastSFX.play();
        this.anims.play('missle_blastAnim');

        //this attack's plan is to blow up and act like it don't know nobody
        this.destroyTimer = this.scene.time.addEvent({
            delay: 250,
            callback: this.removeSelf,
            callbackScope: this,
            loop: false
            }
        )
    }

    strike(target){
        //hits everything but the player
        if(target !== null && target !== this.scene.player){
            target.onDamage(this.damage, this.destroyTimer.elapsed);
        }
    }
}