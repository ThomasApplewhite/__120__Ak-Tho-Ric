class Boss extends Enemy{
    constructor(scene, x, y, texture, frame, health, points){
        super(scene, x, y, texture, frame, health, points);

        this.bossVibes();
    }

    //what happens when the boss spawns
    bossVibes(){
        this.scene.obstacleSpawnTimer = false;
        this.scene.enemySpawnTimer.paused = false;
    }
    
    //anything special that happens when the enemy dies
    onDeath(){
        ++this.scene.player.bodyCount;
        this.scene.player.score += this.points;

        this.scene.obstacleSpawnTimer = true;
        this.scene.enemySpawnTimer.paused = true;
    }
}