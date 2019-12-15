// Import the function to declare all animations

export default function makeAnimations(scene) {
    // PLAYER
    // Movement
    scene.anims.create({
        key: 'walk',
        frames: scene.anims.generateFrameNumbers('player', {start: 6, end: 11 }),
        repeat: -1,
        frameRate: 8
    })
    
    scene.anims.create({
        key: 'idle',
        frames: scene.anims.generateFrameNumbers('player', {start: 0, end: 3 }),
        repeat: -1,
        frameRate: 5
    })
    
    scene.anims.create({
        key: 'jump',
        frames: scene.anims.generateFrameNumbers('player', {start: 12, end: 13 }),
        repeat: 0,
        frameRate: 4
    })
    
    scene.anims.create({
        key: 'fall',
        frames: scene.anims.generateFrameNumbers('player', {start: 14, end: 15 }),
        repeat: 0,
        frameRate: 4
    })

    scene.anims.create({
        key: 'throw',
        frames: scene.anims.generateFrameNumbers('player', {start: 24, end: 26 }),
        repeat: 0,
        frameRate: 15
    })

    // SNOWBALL
    scene.anims.create({
        key: 'snowball-flying',
        frames: scene.anims.generateFrameNumbers('snowball-flying', {start: 0, end: 3 }),
        repeat: -1,
        frameRate: 8
    })

    scene.anims.create({
        key: 'snowball-dying',
        frames: scene.anims.generateFrameNumbers('snowball-dying', {start: 0, end: 4 }),
        repeat: 0,
        frameRate: 20
    })

    scene.anims.create({
        key: 'snowball-hit',
        frames: scene.anims.generateFrameNumbers('snowball-hit', {start: 0, end: 3 }),
        repeat: 0,
        frameRate: 20
    })

    // BIGBALL
    scene.anims.create({
        key: 'bigball-dying',
        frames: scene.anims.generateFrameNumbers('bigball', {start: 4, end: 0 }),
        repeat: 0,
        frameRate: 20
    })


    // ENEMIES
    scene.anims.create({
        key: 'slime-walk',
        frames: scene.anims.generateFrameNumbers('slime', {start: 0, end: 3 }),
        repeat: -1,
        frameRate: 6
    })
}