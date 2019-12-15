import Snowball from "./Snowball"

// as a reference: https://github.com/nkholski/phaser3-es6-webpack/blob/master/src/sprites/Mario.js

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.key)

        // add player's sprite on the screen and add physics to it, collider for enemies
        config.scene.physics.world.enable(this)
        config.scene.add.existing(this)
        this.body.setCollideWorldBounds(true)
        
        this.body.setSize(10, 15)

        this.SPEED = 80
        this.fireDelay = 300
        this.timeLastThrow = 0

        this.health = 3
        this.lives = 3
        this.score = 0

        this.isImmune = false
        this.isDead = false

        // let him jump through platforms
        this.body.checkCollision.up = false

        // sounds
        this.sounds = {
            jump: config.scene.sound.add('sound-jump'),
            punch1: config.scene.sound.add('punch-1'),
            respawn: config.scene.sound.add('carefull'),
            death: config.scene.sound.add('death')
        }
        console.log(this)
    }
    
    update(keys, time, delta) {
        
        // check if it's dead
        if (this.health <= 0 && !this.isDead) {
            this.die()
            
            if (this.lives > 0) {
                setTimeout(() => {
                    this.respawn()
                    this.lives--
                }, 500)
            } else {
                console.log('game over')
                this.respawn()
                this.lives = 3
                this.health = 3
            }
        }


        // check if idle anim should be interrupted
        if (this.anims.currentAnim)
            this.stopIdle = this.anims.currentAnim.key === 'throw'
        
        // player is on the ground
        this.onGround = this.body.blocked.down || this.body.touching.down
        this.isImmune = this.isTinted ? true : false
        
        // becomes true when player gets hurted (you can't control the dude when it's true)
        // control returns when you hit the ground
        if (this.onGround) {
            this.isHurted = false
            this.clearTint()
        }
        

        // MOVEMENT
        let input = {
            left: keys.left.isDown,
            right: keys.right.isDown,
            jump: keys.jump.isDown, 
            fire: keys.fire.isDown
        }

        // right-left walking
        if (!this.isHurted) {
            if (input.left) {
                this.body.setVelocityX(-this.SPEED)
                this.flipX = true
                this.anims.play('walk', true)
            } else if (input.right) {
                this.body.setVelocityX(this.SPEED)
                this.flipX = false
                this.anims.play('walk', true)
            } else {
                this.body.setVelocityX(0)
            }
        }
        
        // idle
        if (!this.body.velocity.x && !this.body.velocity.y && !this.stopIdle)
        this.anims.play('idle', true)
        
        // jumps
        if (input.jump && this.onGround) {
            this.jump()
        }
        
        if (this.body.velocity.y < 0) {
            this.anims.play('jump', true)
        } else if (this.body.velocity.y > 0) {
            // this.anims.play('fall', true)
        }
        
        
        // fire
        this.isFireAllowed = time > this.timeLastThrow + this.fireDelay
        
        if (input.fire && this.isFireAllowed) {
            this.fire()
            this.timeLastThrow = time
        }
    }

    debugInfo() {
        console.log('lives: ', this.lives)
        console.log('health: ', this.health)
        console.log('position: ', Math.round(this.x), Math.round(this.y))
        console.log('---------------------')
    }

    fire() {
        let snowball = new Snowball({
            scene: this.scene,
            key: 'snowball-flying',
            x: this.body.position.x,
            y: this.body.position.y
        })
        snowball.throw(this.x, this.y, this.flipX)
        this.anims.play('throw', true)
        // this.debugInfo()
    }

    jump() {
        this.body.setVelocityY(-260)
        this.sounds.jump.play()
    }

    // get damage and a little bounce back
    getHurted() {
        this.isHurted = true
        this.setTint(0xff0000)
        this.body.stopIdle = true
        this.body.setVelocityY(-200)
        this.body.setVelocityX((this.flipX ? 1 : -1) * 100)
        this.sounds.punch1.play()

        if (this.isImmune) return
        this.health--
        this.getImmune(100)

    }

    // immune to the enemy attacks because of the respawn or bonus
    getImmune(time) {
        this.alpha = 0.6
        this.isImmune = true

        setTimeout(() => {
            this.alpha = 1
            this.isImmune = false
        }, time)
    }

    die() {
        this.disableBody(true, true)
        this.sounds.death.play()
        this.isDead = true
    }

    // after death or in the beginning of the level
    respawn(x = 134, y = 216) {
        this.health = 3
        this.enableBody(true, x, y, true, true)
        this.getImmune(1500)
        this.sounds.respawn.play()
        this.isDead = false
    }
}