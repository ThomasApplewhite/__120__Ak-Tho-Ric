/*
DARKWORLD's Descent
CREATED BY AKASH D. KAPADIA, ERIC LONG, & THOMAS APPLEWHITE

UI Slider plugin by Rex Rainbow, liscensed with MIT Liscence. This technically means
    I don't need to credit them but I'll write it here anyways.

Hi. While walking around, you might notice a lot of old, commented code that's marked
DEPRECEATED
or is otherwise unused. This is because I am a code hoarder. I will clean it up eventually.
    -Thomas.
*/

let config = {
    type: Phaser.CANVAS,
    width: 1024,
    height: 640,
    pixelArt: true,
    scene: [ Load, Menu, End, Credits, TestMap, LevelOne, LevelTwo, LevelThree ],
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


//defining registry values
game.registry.set("score", 0);
game.registry.set("bodyCount", 0);

//reserving keyboard keys
let keyLEFT, keyRIGHT, keyUP, keyDOWN, keyQ, keyE, keyW;

if (game.sound.context.state === 'suspended') {
    game.sound.context.resume();
}

//don't forget to use python -m http.server to start the terminal server B