// Loading screen
// see more: https://github.com/nkholski/phaser3-es6-webpack/blob/master/src/scenes/BootScene.js

import makeAnimations from '../helpers/animations'

class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' })
    }

    preload() {
        this.load.bitmapFont('pixel-font', 'assets/font/font.png', 'assets/font/font.xml')

        this.load.image('taiga-bg',              'assets/images/taiga-bg.png')
        this.load.image('taiga-mg',              'assets/images/taiga-mg.png')
        this.load.image('taiga-tileset',         'assets/images/taiga-tileset.png')
        this.load.image('main_lev_build',         'assets/images/main_lev_build.png')
        this.load.image('castle-bg',         'assets/images/background1.png')
        this.load.image('castle-mg',         'assets/images/02-background.png')
        this.load.spritesheet('player',          'assets/player/player-spritesheet.png', { frameWidth: 16, frameHeight: 16 })
        this.load.spritesheet('snowball-flying', 'assets/player/snowball-flying.png', { frameWidth: 12, frameHeight: 12 })
        this.load.spritesheet('snowball-dying',  'assets/player/snowball-dying.png', { frameWidth: 12, frameHeight: 12 })
        this.load.spritesheet('snowball-hit',    'assets/player/snowball-hit.png', { frameWidth: 12, frameHeight: 12 })
        this.load.spritesheet('slime',           'assets/enemies/slime.png', { frameWidth: 32, frameHeight: 32 })
        this.load.spritesheet('bigball','assets/player/bigball.png', { frameWidth: 32, frameHeight: 32 })
        this.load.spritesheet('items-icons','assets/images/items-icons.png', { frameWidth: 16, frameHeight: 16 })

        // audio
        this.load.audio('sound-jump',            'assets/sounds/player-jump.wav')
        this.load.audio('snowball-1',            'assets/sounds/snowball-1.wav')
        this.load.audio('carefull',            'assets/sounds/carefull.wav')
        this.load.audio('death',            'assets/sounds/death.wav')
        this.load.audio('punch-1',               'assets/sounds/punch-1.wav')
        this.load.audio('punch-2',               'assets/sounds/punch-2.wav')
        this.load.audio('punch-3',               'assets/sounds/punch-3.wav')
        this.load.audio('punch-4',               'assets/sounds/punch-4.wav')
        
        // music
        // this.load.audio('epic',               'assets/music/epic.mp3')
        // this.load.audio('grustny',            'assets/music/grustny.mp3')
        // this.load.audio('krutoy',             'assets/music/krutoy.mp3')
        // this.load.audio('rockechnik',         'assets/music/rockechnik.mp3')
        // this.load.audio('zadumchivy',         'assets/music/zadumchivy.mp3')
        // this.load.audio('zloy',               'assets/music/zloy.mp3')
        

        // Levels
        this.load.tilemapTiledJSON('lvl1_1', 'src/levelmaps/lvl1_1.json')
        this.load.tilemapTiledJSON('lvl1_2', 'src/levelmaps/lvl1_2.json')
        this.load.tilemapTiledJSON('lvl1_3', 'src/levelmaps/lvl1_3.json')


        // Register a load complete event to launch the title screen when all files are loaded
        this.load.on('complete', () => {
            // prepare all animations, defined in a separate file
            makeAnimations(this);
            // this.scene.start('TitleScene');
            this.scene.start('GameScene', {
                tilemap: 'lvl1_3',
                tileset: 'main_lev_build',
                backgroundImg: 'castle-bg',
                middlegroundImg: 'castle-mg'
            });
        });
    }
}

export default BootScene
