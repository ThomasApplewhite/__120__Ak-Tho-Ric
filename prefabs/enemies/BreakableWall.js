class BreakableWall extends Enemy{
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame, 1, 0, 0);

        this.body.setImmovable(true);
    }

        //breakable walls specifically do nothing
        onDeath(){

        }
}

//Breakable walls literally do nothing.
//I mean, they'll get an animation, eventually.