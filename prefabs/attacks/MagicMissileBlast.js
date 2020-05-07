class MagicMissileBlast extends Attack{
    constructor(scene, x, y, texture, frame, damage){
        super(scene, x, y, texture, frame);

        this.damage = damage;
        this.body.setImmovable();
        this.body.setSize(160, 160);

        this.scene.mmBlastSFX.play();
        this.anims.play('missle_blastAnim');

        this.scene.time.addEvent({
            delay: 250,
            callback: this.removeSelf,
            callbackScope: this,
            loop: false
            }
        )
    }

    strike(target){
        if(target != null){
            console.log("Blast has hit something");
            //target.onDamage(this.damage);
            target.health -= this.damage;
        }
    }
}