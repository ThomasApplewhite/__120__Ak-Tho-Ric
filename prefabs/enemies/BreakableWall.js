class BreakableWall extends Enemy{
    constructor(scene, x, y, texture){
        super(scene, x, y, texture, 0, 1, 0);

        this.body.setImmovable(true);
    }
}

//Breakable walls literally do nothing.
//I mean, they'll get an animation, eventually.