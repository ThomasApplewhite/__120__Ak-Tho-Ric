class Boss extends Enemy{
    constructor(scene, x, y, texture, frame, health, points){
        super(scene, x, y, texture, frame, health, points);

        this.bossVibes();

        //Bosses are spicy enemies that run bossVibes on spawn,
        //which usually sets logical flags to tell the level that
        //it's boss time.
    }

    //what happens when the boss spawns
    bossVibes(){
        //might be depreciated? We'll see
    }
    
    //anything special that happens when the enemy dies
    onDeath(){
        ++this.scene.player.bodyCount;
        this.scene.player.score += this.points;
    }
}