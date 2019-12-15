import 'phaser'
import BootScene from './scenes/BootScene'
import GameScene from './scenes/GameScene'
// import TitleScene from './scenes/TitleScene'

// For more settings see <https://github.com/photonstorm/phaser/blob/master/src/boot/Config.js>
// то что закоментировано мне не ясно, нужно 
// проверить, что делают эти строки
const config = {
    type: Phaser.WEBGL,
    pixelArt: true,
    roundPixels: false,
    scaleMode: 3,
    // parent: 'content',
    
    width: 320,
    height: 240,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            // debug: true
        }
    },

    scene: [
        BootScene,
        // TitleScene,
        GameScene
    ]
}

const game = new Phaser.Game(config);