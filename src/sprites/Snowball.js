export default class Snowball extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.key)

        this.scene.physics.world.enable(this);
        config.scene.add.existing(this)
        config.scene.snowballs.add(this)
        this.body.setBounce(.3)

        this.body.setSize(4, 4)
        this.body.setOffset(4, 8)

        // Turn on wall collision checking for your sprite
        // this.body.setCollideWorldBounds(true);

        // Turning this on will allow you to listen to the 'worldbounds' event
        this.body.onWorldBounds = true;

        // 'worldbounds' event listener
        this.body.world.on('worldbounds', (body) => {
        // Check if the body's game object is the sprite you are listening for
            if (body.gameObject === this) {
                // Stop physics and render updates for this object
                this.scene.snowballs.remove(this);
                this.destroySnowball(config.scene)
            }
        }, this);

        // sounds
        this.sounds = {
            snowball1: this.scene.sound.add('snowball-1')
        }

    }
    

    throw(x, y, left) {
        this.setActive(true)
        this.setVisible(true)
        this.body.allowGravity = true

        this.setPosition(x, y)
        this.body.velocity.x = 200 * (left ? -1 : 1)
        this.body.velocity.y = -150
        this.flipX = left
        this.anims.play('snowball-flying')
    }

    //  anim = "snowball-hit" || "snowball-dying" (default)
    destroySnowball(anim = 'snowball-dying') {        
        this.anims.play(anim, true)

        this.body.setBounce(0)
        this.body.setVelocity(0)

        this.on('animationcomplete', () => {
            this.sounds.snowball1.play()
            this.destroy()
        }, this)
    }

}