class HealthOrb extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame);

        scene.physics.add.existing(this);
        scene.add.existing(this);

        this.healAmount = 5;
        this.player = scene.player;
    }

    onPickup(){
        this.player.health += this.healAmount;

        if(this.player.health > player.maxHealth){
            this.player.health = player.maxHealth;
        }

        this.destroy();
    }
}

//This is a very simple entity that will probably become a child of a different class
//  should other collectables be added.