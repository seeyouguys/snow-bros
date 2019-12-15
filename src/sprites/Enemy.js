// Generic enemy class that all foe types are extending

export default class Enemy extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.key);
        config.scene.physics.world.enable(this);
        config.scene.add.existing(this);
        this.body.setCollideWorldBounds(true)
        this.body.offset.set(0, 16)
        
        this.isFrozen = false;

        // just a shortcut
        this.player = this.scene.player

        // Base horizontal velocity / direction.
        this.SPEED = 30
        this.direction = -1;
        
        // sounds
        this.sounds = {
            jump: config.scene.sound.add('sound-jump'),
            punch: [config.scene.sound.add('punch-1'),
                    config.scene.sound.add('punch-2'),
                    config.scene.sound.add('punch-3'),
                    config.scene.sound.add('punch-4')]
        }
    }

    destroyEnemy() {
        // Forget about this enemy
        // this.scene.enemyGroup.remove(this);
        this.destroy();
    }

    // triggers when the enemy collided w/ a bigball
    crush() {
        this.body.checkCollision.down = false
        this.body.checkCollision.up = false
        this.body.checkCollision.left = false
        this.body.checkCollision.right = false
        this.body.setCollideWorldBounds(false)

        this.scene.player.score += 100

        this.setActive(false)
        this.body.setVelocity(this.direction * this.SPEED, -400)

        let randint = Phaser.Math.Between(0, this.sounds.punch.length-1)
        this.sounds.punch[randint].play()

        setTimeout(() => {
            this.destroyEnemy()
        }, 3000)
    }

    jump(height = -260) {
        this.body.checkCollision.up = false
        this.body.setVelocityY(height)
        this.body.setVelocityX(this.direction * (this.SPEED + 10) )
        
        setTimeout(() => {
            this.body.checkCollision.up = true
            this.body.setVelocityX(this.direction * this.SPEED)
        }, 300)
    }

    // checks if a foe overlaps allowed jump area
    // 1 is an id of the first item in the tilesheet
    couldJump() {
        let tile = this.scene.jumpTiles.getTileAtWorldXY(this.x, this.y)
        return tile && tile.index === 1 && !this.isFrozen
    }
}