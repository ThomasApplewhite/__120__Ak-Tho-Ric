/*
INTO THE DARKWORLD
CREATED BY AKASH D. KAPADIA, ERIC LONG, & THOMAS APPLEWHITE
COMPLETED MAY 3RD, 2020

From a technical perspective, we're really proud of how everything is handled under the hood.
    Each object (with the exception of the player) inherits from a base class, which itself
    inherits from Sprite. This inheritence not only makes collision groups easy to make 
    (as objects can by grouped by literal type), but also makes adding new obstacles, enemies,
    and attacks a breeze. It also makes it easier to integrate the beat 'em up/shoot 'em up
    mechanics our game has.
From an artistic perspective, we decided to go for a pixel-art style because it's an homage 
    to the retro genre of gaming. Also our artist is best at pixel art. All assets 
    (with the exception of the font) are hand-made by our artist, and designed to be goofy 
    while creating a brutal, gothic atmosphere by using relatively simple visuals and sounds.
*/

let config = {
    type: Phaser.CANVAS,
    width: 1024,
    height: 640,
    pixelArt: true,
    scene: [ Load, Menu, Play, End, Credits, TestMap ],
    physics:{
        default: "arcade",
        arcade:{
            debug: true
        }
    },
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
}

let game = new Phaser.Game(config);
game.settings = {
}

//setting magic missile particle emitter
/*let mmParticleConfig = {

}*/

//defining registry values
game.registry.set("score", 0);
game.registry.set("distance", 0);
game.registry.set("bodyCount", 0);
//game.registry.set("backgroundScroll", mmParticleConfig);

//reserving keyboard keys
let keyLEFT, keyRIGHT, keyUP, keyDOWN, keyQ, keyE, keyW;

if (game.sound.context.state === 'suspended') {
    game.sound.context.resume();
}

//don't forget to use python -m http.server to start the terminal server B