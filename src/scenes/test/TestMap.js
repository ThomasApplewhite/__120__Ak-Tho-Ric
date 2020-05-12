class TestMap extends Phaser.Scene{
    constructor(){
        super("testMapScene");
    }

    preload(){

    }

    create(){
        SceneLoad.genericCreate(this, null);
    }

    update(){
        //game functionality
        if(!this.gameOver){
            //entity updating
            this.player.update();
        }
    }
}