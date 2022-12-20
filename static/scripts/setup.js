


let player;
let dirty;
let platforms;
let box;
let bouncy;
let bouncy2;
let column;
let volcano;
let pickle;
let movingPlatform;
let keyA;
let keyD;
let keyW;
let keySpace;
let keyR;
let rotated;
let game;
let game_over;
let you_win;
let bounce_up;
let bounce_left;
let bounce_right;
let columnPhysics;
class gameScene extends Phaser.Scene {

  preload () {
    // Background Images
    this.load.image('background', '../static/image_dump/JellyfishFields_V5.png');
    this.load.image('game_over', '../static/image_dump/game_over_v2.png');
    this.load.image('win', '../static/image_dump/win.png');

    // Static Objects
    this.load.image('bubbles_platform', '../static/image_dump/bubbles_jump_flat.png');
    this.load.image('bubble_column', '../static/image_dump/bubble_column.png');
    this.load.image('invisibleBlock', '../static/image_dump/150x800_transparent.png');
    this.load.image('pickle', '../static/image_dump/pickle.png');
    this.load.image('bigBubble', '../static/image_dump/big_bubble.png')

    // Sprite Maps
    this.load.spritesheet('bubbleBass',
    '../static/image_dump/BubbleBassSpriteMap_V2.png',
    { frameWidth: 210, frameHeight: 226 }
    );
    this.load.spritesheet('dirtyBubble',
      '../static/image_dump/DirtyBubble.png',
      { frameWidth: 300, frameHeight: 300 }
    );
    // Preload Function
  }
  create () {
    // keyboard controls setup
    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    // background creation
    const { width, height } = this.sys.game.canvas;
    this.add.image(width, height * 0.45, 'background').setScale(0.75);

    // static platform
    platforms = this.physics.add.staticGroup();

    // bouncy platforms
    bounce_up = this.physics.add.staticGroup();
    bounce_left = this.physics.add.staticGroup();
    bounce_right = this.physics.add.staticGroup();

    // Map Building
    platforms.create(0, 650, 'bubbles_platform');
    platforms.create(100, 650, 'bubbles_platform');
    platforms.create(200, 650, 'bubbles_platform');
    platforms.create(450, 650, 'bubbles_platform');
    platforms.create(550, 650, 'bubbles_platform');
    platforms.create(650, 650, 'bubbles_platform');

    bounce_up.create(900, 800, 'bigBubble').setScale(0.5).refreshBody();

    platforms.create(1100, 350, 'bubbles_platform');
    platforms.create(1200, 350, 'bubbles_platform');

    platforms.create(650, 200, 'bubbles_platform');
    platforms.create(600, 200, 'bubbles_platform' )
    platforms.create(500, 200, 'bubbles_platform');
    platforms.create(400, 200, 'bubbles_platform');
    platforms.create(300, 200, 'bubbles_platform');

    bounce_right.create(250, 120, 'bigBubble').setScale(0.5).refreshBody();

    rotated = platforms.create(1850, 350, 'bubbles_platform');
    rotated.setAngle(90);

    platforms.create(1700, 500, 'bubbles_platform');
    platforms.create(1800, 500, 'bubbles_platform');
    platforms.create(1900, 500, 'bubbles_platform');
    platforms.create(2000, 500, 'bubbles_platform');

    platforms.create(2150, 450, 'bubbles_platform').setAngle(90);
    platforms.create(2150, 350, 'bubbles_platform').setAngle(90);
    platforms.create(2150, 250, 'bubbles_platform').setAngle(90);

    platforms.create(2200, 200, 'bubbles_platform');
    platforms.create(2300, 200, 'bubbles_platform');
    platforms.create(2400, 200, 'bubbles_platform');
    platforms.create(2600, 200, 'bubbles_platform');
    platforms.create(2700, 200, 'bubbles_platform');

    column = this.add.tileSprite(2000, 350, 400, 800, 'bubble_column');
    columnPhysics = this.physics.add.image(2000, 350, 'invisibleBlock');
    columnPhysics.body.setAllowGravity(false);


    // the pickle
    pickle = this.physics.add.image(2200, 300, 'pickle').setScale(0.5);
    pickle.body.setAllowGravity(false);

    // moving platforms
    movingPlatform = this.physics.add.image(2800, 500, 'bubbles_platform').setScale(2).refreshBody();
    movingPlatform.setImmovable(true).setVelocity(100, -100).setMass(100000);
    movingPlatform.body.setAllowGravity(false);
    this.tweens.timeline({
      targets: movingPlatform.body.velocity,
      loop: -1,
      tweens: [
        { x: -100, y: 0, duration: 5000, ease: 'Stepped' },
        { x: 100, y: 0, duration: 5000, ease: 'Stepped'},
      ]
    });

    // dirty bubble
    dirty = this.physics.add.sprite(2500, 300, 'dirtyBubble').setScale(0.5).refreshBody();
    dirty.body.setAllowGravity(false).setImmovable(true);

    // player object
    player = this.physics.add.sprite(100, 560, 'bubbleBass').setScale(0.35).refreshBody();
    player.setBounce(0.1).setCollideWorldBounds(true).setDragX(200);
    player.setMaxVelocity(200, 1500).setMass(1);
    player.custom = {};
    player.custom.falling = { falling: false, height: 0, fallHeight: 0 };
    player.custom.direction = 'right';

    // physics set ups
    this.physics.add.collider(player, bounce_up, function () {
      if (player.body.onFloor()) {
        player.setVelocityY((player.y - player.custom.falling.height) * -80);
      }
    });
      
    this.physics.add.collider(player, bounce_right, function () {
      if (player.body.touching.left) {
        player.setMaxVelocity(2000, 1500);
        player.setVelocityX(2000);
      }
    });

    this.physics.add.collider(player, rotated, function() {
      if (player.body.touching.right) {
        player.setMaxVelocity(200,1500);
      }
    })
    this.physics.add.overlap(player, columnPhysics, function() {
      player.setVelocityY(-200);
    });
    
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(player, movingPlatform);
    this.physics.add.overlap(player, pickle, win, null, this);

    this.physics.add.overlap(player, dirty, function () {
      this.cameras.main.stopFollow(player)
      this.cameras.main.centerOn(400, 480)
      game_over.setVisible(true)
      this.scene.bringToTop(game_over)
    }, null, this);


    // world and camera building
    this.add.text(100, 400, 'WASD AND SPACE TO MOVE', { font: '35px bold', fill: '#ffffff' }).setShadow(1.5, 1.5);
    this.add.text(950, 150, 'GET THE PICKLE', { font: '35px bold', fill: '#ffffff' }).setShadow(1.5, 1.5);
    this.physics.world.setBounds(0, 0, width * 3, height * 1.5);
    this.cameras.main.setBounds(0, 0, width * 3, height * 1.5);
    this.cameras.main.startFollow(player, true, 0.05, 0.05);
    this.cameras.main.setDeadzone(200);

    // Player Animations
    this.anims.create({
      key: 'standRight',
      frames: [{ key: 'bubbleBass', frame: 9 }],
      frameRate: 20
    });
    this.anims.create({
      key: 'standLeft',
      frames: [{ key: 'bubbleBass', frame: 8 }],
      frameRate: 20
    });
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('bubbleBass', { start: 8, end: 0 }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'left-slow',
      frames: this.anims.generateFrameNumbers('bubbleBass', { start: 8, end: 0 }),
      frameRate: 6,
      repeat: -1
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('bubbleBass', { start: 9, end: 17 }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'right-slow',
      frames: this.anims.generateFrameNumbers('bubbleBass', { start: 9, end: 17 }),
      frameRate: 6,
      repeat: 0
    });

    // Dirty Bubble Animations
    this.anims.create({
      key: 'dirtyBubbleLeft',
      frames: [{key: 'dirtyBubble', frame: 0}],
      frameRate: 20
    });
    this.anims.create({
      key: 'dirtyBubbleRight',
      frames: [{key: 'dirtyBubble', frame: 1}],
      frameRate: 20
    });

    // Create win and lose screens
    game_over = this.add.image(516, 500, 'game_over').setVisible(false);
    you_win = this.add.image(516, 500, 'win').setVisible(false);

    function win (player, pickle) {
      this.cameras.main.stopFollow(player)
      this.cameras.main.centerOn(400, 480)
      you_win.setVisible(true);
      this.cameras.main.shake(100000);
    }    
  }

  update () {
    // Player movement
    if (keyA.isDown) {
      player.setAccelerationX(-160);
      player.custom.direction = 'left';
      if (player.body.velocity.x > 0) {
        player.anims.play('right-slow', true);
      } else if (player.body.velocity.x >= -100) {
        player.anims.play('left-slow', true);
      } else {
        player.anims.play('left', true);
      }
    } else if (keyD.isDown) {
      player.setAccelerationX(160);
      player.custom.direction = 'right';
      if (player.body.velocity.x < 0) {
        player.anims.play('left-slow', true);
      } else if (player.body.velocity.x <= 100) {
        player.anims.play('right-slow', true);
      } else {
        player.anims.play('right', true);
      }
    } else {
      player.setAccelerationX(0);
      if (player.body.velocity.x < 0) {
        player.anims.play('left-slow', true);
      } else if (player.body.velocity.x > 0) {
        player.anims.play('right-slow', true);
      } else {
        if (player.custom.direction === 'left') {
          player.anims.play('standLeft');
        } else {
          player.anims.play('standRight');
        }
      }
    }
    if ((keySpace.isDown || keyW.isDown) && player.body.touching.down) {
      player.setVelocityY(-700);
    }

    // Set custom falling value (boolean)
    if (player.body.velocity.y > 0) {
      player.custom.falling.falling = true;
      player.custom.falling.height = player.y;
    }
    if (player.body.onFloor() && player.custom.falling.falling) {
      player.custom.falling.fallHeight = player.y - player.custom.falling.height;
      if (player.custom.falling.fallHeight > 10) {
        this.cameras.main.shake(player.custom.falling.fallHeight * 10, (player.custom.falling.fallHeight - 10) / 500);
      }
      player.custom.falling.falling = false;
    }

    column.tilePositionY += 1;
    if (dirty.body.x - player.body.x > 0) {
      dirty.anims.play('dirtyBubbleLeft');
    }
    if (dirty.body.x - player.body.x < 0) {
      dirty.anims.play('dirtyBubbleRight');
    }

    // kill player on fall
    if (player.body.y >= 800) {
      this.cameras.main.stopFollow(player)
      this.cameras.main.centerOn(400, 480)
      game_over.setVisible(true)
      this.scene.bringToTop(game_over)
    }
    // restart
    if (keyR.isDown) {
      this.scene.restart();
    }
  }
}
// Config object
const config = {
  type: Phaser.AUTO,
  width: 1000,
  height: 600,
  parent: 'game_container',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1300 },
      debug: false
    }
  },
  scene: gameScene
};

// Game initalization
game = new Phaser.Game(config);
