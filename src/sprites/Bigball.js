export default class Bigball extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.key);
        config.scene.physics.world.enable(this);
        config.scene.add.existing(this);
        this.body.setCollideWorldBounds(true)
        this.body.setSize(16, 16)

        this.body.offset.set(0, 16)
        this.setFrame(5)
        

        // this.isActive = false;

        // just a shortcut
        this.player = this.scene.player

        this.SPEED = 300
        this.bounceCounter = 0

        // Base horizontal velocity / direction.
        this.direction = config.direction;
        this.body.setGravityY(5001)
        
        // Standard sprite is 16x16 pixels with a smaller body
        // this.body.setSize(12, 12);
        // this.body.offset.set(10, 12);
    }

    update(time, delta) {
        // The ball stopped, better try to roll in the other direction.
        if (this.body.velocity.x < 10 && this.body.velocity.x > -10) {
            this.direction = -this.direction;
            this.body.setVelocityX(this.direction * this.SPEED)
            this.bounceCounter++
        }

        // remove if it is at lowest level, bounced at least 3 times, and collides something now
        if (this.bounceCounter > 5 && this.body.y >= 208) {
            this.destroyBall()
            return
        }

        // remove if it bounced to many times and stuck somewhere
        if (this.bounceCounter > 15) {
            this.destroyBall()
            return
        }
    }

    // Forget about this game object
    destroyBall() {
        this.anims.play('bigball-dying', true)
        
        this.body.setBounce(0)
        this.body.setVelocity(0)
        
        this.on('animationcomplete', () => {
            // this.scene.bigballGroup.remove(this);
            // this.sounds.snowball1.play()
            this.destroy()
        }, this)
    }

    jump(height = -260) {
        this.body.checkCollision.up = false

        this.body.setVelocityY(height)
        
        setTimeout(() => {
            this.body.checkCollision.up = true
        }, 300)
    }

    // checks if it overlaps allowed jump area
    // 1 is an id of the first item in the tilesheet
    couldJump() {
        // let onGround = this.body.blocked.down || this.body.touching.down
        let tile = this.scene.jumpTiles.getTileAtWorldXY(this.x, this.y)

        // return tile && tile.index === 1 && onGround
        return tile && tile.index === 1
    }


}