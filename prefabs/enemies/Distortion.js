class Distortion extends Enemy{
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame, -1, -1, -1);

        this.damage = scene.distortionFactor.damage/60;
        this.anims.play('fogAnim');
    }

    onAttack(target){
        target.takeDamage(this.damage, 0);
    }
}


//distortions have no health, points, or aggro radius, and they can't be struck.
//Every frame a player stands in one, they take one damage.