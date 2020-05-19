class Enemy extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame, health, points){
        super(scene, x, y, texture, frame);

        scene.physics.add.existing(this);
        scene.add.existing(this);

        //properties
        this.health = health;
        this.points = points;
        this.immune = false;
        this.timers = new Array();
        this.attackPattern();

        //Enemies are really anything that isn't the player that still moves.
        //They come with methods to handle getting hurt, but are otherwise just moving images.
    }

    update(){
        this.movementPattern();

        if(this.health <= 0){
            this.onDeath();
            this.destroyCleanup();
        }
    }

    //frame-by-frame movement
    movementPattern(){

    }

    //how the enemy will specificly attack, if at all
    attackPattern(){

    }

    //what happens when the enemy collides with the player
    //  other forms of attack should go in attackPattern
    onAttack(){

    }

    onDamage(damage, immuneTime){
        if(!this.immune){
            this.health -= damage;
            this.startImmunity(immuneTime);
        }
    }

    startImmunity(immuneTime){
        this.immune = true;
        Phaser.Utils.Array.Add(this.timers, this.scene.time.addEvent({
            delay: immuneTime,
            callback: () => {this.immune = false},
            callbackScope: this
        }));
    }

    //anything special that happens when the enemy dies
    onDeath(){
        ++this.scene.player.bodyCount;
        this.scene.player.score += this.points;
    }

    destroyCleanup(){
        this.timers.forEach((item) => {item.remove()})
        this.destroy();
    }
}