class BreakableWall extends Enemy{
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame, 1, 0, 0);

        this.body.setImmovable(true);

        this.on('animationcomplete', this.destroyCleanup);
        this.once('broken', this.onDeath);
    }

    update(){
        if(this.health <= 0){
            this.emit('broken');
        }
    }

    //breakable walls specifically do nothing
    onDeath(){
        this.setTexture('entities', 'bw_break1');
        this.anims.play('wall_breakAnim', true);
        this.body.checkCollision.none = true;
    }
}

//Breakable walls literally do nothing.
//I mean, they'll get an animation, eventually.