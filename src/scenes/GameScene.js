import Player from '../sprites/Player'
import Snowball from '../sprites/Snowball'
import Slime from '../sprites/Slime'
import Enemy from '../sprites/Enemy'
import Bigball from '../sprites/Bigball'

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' })
    }

    // fetch level info
    init(data) {
        this.tilemap = data.tilemap
        this.tileset = data.tileset
        this.backgroundImg = data.backgroundImg
        this.middlegroundImg = data.middlegroundImg
    }

    preload() {
        
    }

    create() {
        // data dependent (level specific):
        // Background image
        this.background = this.add.tileSprite(0, 0, 320, 240, this.backgroundImg).setOrigin(0, 0)
        this.middleground = this.add.tileSprite(160, 160, 320, 240, this.middlegroundImg)

        const level = this.make.tilemap({ key: this.tilemap })
        const tileset = level.addTilesetImage(this.tileset, this.tileset)

        
        
        
        
        // middleground trees
        this.foreground = level.createStaticLayer("middleground", tileset, 0, 0)
        
        // platforms
        const platformsLayer = level.createStaticLayer("platforms", tileset, 0, 0)
        platformsLayer.setCollisionByProperty({ collides: true })
        
        // jumping tiles (invisible tiles marking the places where the foes are able to jump)
        this.jumpTiles = level.createStaticLayer('jumpTiles', tileset, 0, 0)


        // controls the music
        // this.music = {
        //     epic: this.sound.add('epic'),
        //     grustny: this.sound.add('grustny'),
        //     krutoy: this.sound.add('krutoy'),
        //     rockechnik: this.sound.add('rockechnik'),
        //     zadumchivy: this.sound.add('zadumchivy'),
        //     zloy: this.sound.add('zloy')
        // }

        // this.music['zadumchivy'].play()
        // const musicConfig = {
        //     mute: false, 
        //     volume: 1,
        //     rate: 1,
        //     detune: 0, 
        //     seek: 0,
        //     loop: false,
        //     delay: 0
        // }

        

        // this.keys contains all we need to control player
        this.keys = {
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
            jump: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
            fire: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
        };
        
    
        // Create player
        this.player = new Player({
            scene: this,
            key: 'player',
            x: 134,
            y: 216
        })
        // This group contains both players for collision and calling update-methods
        this.playerGroup = this.add.group()
        this.playerGroup.add(this.player)
        this.physics.add.collider(this.playerGroup, platformsLayer)

        // Define snowballs
        this.snowballs = this.add.group({
            classType: Snowball,
            // maxSize: 5,
        })
        this.physics.add.collider(this.snowballs, platformsLayer, (snowball, tile) => {

            if (snowball.body.blocked.down && snowball.anims.currentAnim.key === 'snowball-flying') {
                snowball.destroySnowball()
            }
        })
        
        
        // This group contains all enemies for collision and calling update-methods
        this.enemyGroup = this.add.group()
        this.physics.add.collider(this.enemyGroup, platformsLayer)
        
        
        // create dummy enemy (for the PoC reasons)
        this.enemyGroup.add(new Slime({
            scene: this,
            key: 'slime',
            x: 98, 
            y: 48
        }))
        this.enemyGroup.add(new Slime({
            scene: this,
            key: 'slime',
            x: 140, 
            y: 208
        }))
        this.enemyGroup.add(new Slime({
            scene: this,
            key: 'slime',
            x: 304, 
            y: 128
        }))
        this.enemyGroup.add(new Slime({
            scene: this,
            key: 'slime',
            x: 265, 
            y: 16
        }))

        // This group contains all bigballs for collision and calling update-methods
        this.bigballGroup = this.add.group()
        this.physics.add.collider(this.bigballGroup, platformsLayer)
        this.physics.add.collider(this.bigballGroup, this.enemyGroup, (bigball, enemy) => {
            enemy.crush()
        })
        // this.physics.add.collider(this.bigballGroup, this.playerGroup)
        this.physics.add.collider(this.bigballGroup, this.bigballGroup, (ball1, ball2) => {
            ball1.body.setVelocityX(0)
            ball2.body.setVelocityY(0)
        })


        // HUD
        const graphics = this.add.graphics();
        graphics.fillStyle("Black")
        graphics.fillRect(0, 224, 320, 16).alpha = .5
        this.HUD = this.add.bitmapText(16, 227, 'pixel-font', 'SCORE_ HEALTH_ LIVES_', 16)
        this.add.sprite(0, 224, 'items-icons', 11).setOrigin(0, 0)
    }
    
    update(time, delta) {
        this.updateHUD()

        // parallax
        this.middleground.tilePositionX = this.player.body.x * .1
        this.middleground.tilePositionY = this.player.body.y * .02
        this.background.tilePositionX = this.player.body.x * .02



        this.snowballs.children.entries.forEach((snowball)=>{
           snowball.update(time, delta);
        })

        this.enemyGroup.children.entries.forEach((enemy) => {
            enemy.update(time, delta)
        })
        
        this.bigballGroup.children.entries.forEach((bigball) => {
            bigball.update(time, delta)
        })

        this.player.update(this.keys, time, delta)
    }
    // {score, health, lives, lvl}
    updateHUD(config) {
        this.HUD.setText(`: ${this.player.lives}  HP: ${this.player.health}  SCORE: ${this.player.score}`)
    }
}

export default GameScene