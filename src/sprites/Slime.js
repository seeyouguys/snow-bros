// example:
    
//     this.enemyGroup.add(new Slime({
//         scene: this,
//         key: 'slime',
//         x: 265, 
//         y: 16
//     }))


import Enemy from './Enemy'
import { Math } from 'phaser';
import Bigball from './Bigball';

export default class Slime extends Enemy {
    constructor(config) {
        super(config);
        this.anims.play('slime-walk');

        this.body.width = 32
        this.body.height = 16
        // разным врагам разные хитбоксы

        this.lastJumpTime = 0
        this.jumpCooldown = 1000 // no more than 1 jump per 1 sec
        this.frozenAt = 0 // time when the first hit procs
        this.hitCounter = 0 // enemy freezes after 4 hits
        this.meltingTime = 1000 // after this amount of time enemy loses one stage of freezing
        this.bigball = undefined // controller for the big snowball sprite

        this.seePlayer = undefined
        
        // bigball
        this.bigball = this.scene.physics.add.staticSprite(this.body.x, this.body.y, 'bigball')
        this.bigball.setOrigin(0, .5).refreshBody()
        this.bigball.setVisible(false)

    }


    // если слизняк на одном уровне по вертикали с игроком, (узнавать через флаг), то он разворачивается и идет в его сторону
    
    update(time, delta) {
        

        this.onGround = this.body.blocked.down || this.body.touching.down
        
        this.scene.physics.world.overlap(this, this.scene.player, (enemy, player) => {
            if (enemy.active) enemy.hitPlayer(player)
        })
        
        this.scene.physics.world.overlap(this, this.scene.snowballs, (enemy, snowball) => {
            if (snowball.anims.currentAnim.key === 'snowball-flying') {
                enemy.freeze(time)
                snowball.destroySnowball('snowball-hit')
            }
        })


        if (this.isFrozen) {
            // melt if some time has gone
            if (time > this.frozenAt + this.meltingTime) {
                this.hitCounter--
                this.frozenAt = time
                this.setVisible(true)
                this.setActive(true)
            }
        }

        // change the bigball depending on the hitCounter
        switch (this.hitCounter) {
            case 0:
                this.isFrozen = false
                this.bigball.setVisible(false)
                break;
            case 1:
                this.bigball.setVisible(true)
                this.bigball.setPosition(this.body.x, this.body.y)
                this.bigball.setFrame(0)
                break;
            case 2:
                this.bigball.setFrame(1)
                break;
            case 3:
                this.bigball.setFrame(2)
                break;
            case 4:
                this.bigball.setFrame(3)
                break;
            case 5:
                this.bigball.setFrame(4)
                this.setVisible(false)
                this.setActive(false)

                this.scene.physics.world.collide(this, this.scene.playerGroup, (enemy, player) => {
                    this.roll(player.flipX)
                })
                
                
                return
                break;
        }


        // jumps
        this.isJumpingAllowed = time > this.lastJumpTime + this.jumpCooldown
        if (this.isJumpingAllowed && this.couldJump()) {
            this.jump()
            this.lastJumpTime = time
        }

        // The slime stopped, better try to walk in the other direction.
        if (this.body.velocity.x === 0 && !this.isFrozen) {
            this.direction = -this.direction
            this.body.setVelocityX(this.direction * this.SPEED)
        }
    }

    freeze(time) {
        this.frozenAt = time
        this.isFrozen = true
        if (this.hitCounter < 5) this.hitCounter++

        this.body.setBounce(0)
        this.body.setVelocity(0)
    }

    // parameter tells the direction to roll 
    roll(left) {
        this.scene.player.score += 50

        this.scene.bigballGroup.add(new Bigball({
            scene: this.scene,
            key: 'bigball',
            x: this.x,
            y: this.y,
            direction: left ? 1 : -1,
        }))
        this.bigball.destroy()
        this.destroy()
    }

    hitPlayer(player) {
        player.getHurted()
    }
}