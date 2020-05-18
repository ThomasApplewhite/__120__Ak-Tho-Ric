class BreakableWall extends Enemy{
    constructor(scene, x, y, texture){
        super(scene, x, y, texture, 0, 1, 0);

        this.body.setImmovable(true);
    }
}

//Breakable walls literally do nothing.
//I mean, they'll get an animation, eventually.

//Currently, Breakable Walls use a placeholder image,
//but if I load the tilemaps as a spritesheet, I'm pretty sure
//I can give it the image being used on the tilemap by matching
//the coordinates of the Tile to the coordinates of the Frame
//on the tileset/spritesheet respectively.