class OrcPunch extends Attack{
    constructor(scene, x, y, texture, frame, damage){
        super(scene, x, y, texture, frame);

        this.damage = damage;
        this.body.setImmovable();
        this.mmGiven = false;
        
        this.body.setSize(64, 16);

        this.scene.punchSFX.play();
        this.anims.play('punch_effectAnim');

        this.destroyTimer = this.scene.time.addEvent({
            delay: 1/3 * 1000,       //active for 20 frames (1/3 of a second)
            callback: this.removeSelf,
            callbackScope: this,
            loops: false
        });
    }

    strike(target){
        if(target !== null){
            target.onDamage(this.damage, this.destroyTimer.elapsed);
            if(!this.mmGiven){
                ++this.scene.player.canSpecial;
                this.scene.meterUpdate(this.scene.player.canSpecial);
                this.mmGiven = true;
            }
        }
    }

    movementPattern(){
        //unlike most movement, the hitbox here MUST follow the player, 
        //  so its position is directly influenced
        this.x = this.scene.player.x + 32;
        this.y = this.scene.player.y - 8; //this.playerReference.sourceHeight/4;
    }
}