const config = {
  type: Phaser.AUTO,
  width: 1000,
  height: 600,
  parent: 'game_container',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1300 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

let player;
let platforms;
let background;
let cursors;
let keyA;
let keyD;
let keyW;
let keySpace;
let playerFalling = {'falling': false, 'height': 0, 'fallHeight': 0};
const game = new Phaser.Game(config);

function preload () {
  this.load.image('background', '../static/image_dump/JellyfishFields_V2.png');
  this.load.image('bubbles_platform', '../static/image_dump/Green_full.png');
  this.load.image('road', '../static/image_dump/spongebob_road_2x.png');
  this.load.spritesheet('bubbleBass',
  '../static/image_dump/BubbleBassSpriteMap_V2.png',
  { frameWidth: 210, frameHeight: 226 }
  );
  // Preload Function
}
function create () {
  let { width, height } = this.sys.game.canvas;
  this.add.image((width / 2) * 3, height/2, 'background').setScale(.65);
  //background = this.add.tileSprite(width/2, height/2, width, height, 'background');
  platforms = this.physics.add.staticGroup();
  platforms.create(width, 590, 'road').setScale(1.2).refreshBody();
  platforms.create(400, 450, 'bubbles_platform').setScale(.05).refreshBody();
  platforms.create(500, 350, 'bubbles_platform').setScale(.05).refreshBody();
  //bouncing object
  bouncy = this.physics.add.staticGroup();
  bouncy.create(800, 580, 'bubbles_platform').setScale(.05).refreshBody();
  
  player = this.physics.add.sprite(200, 226, 'bubbleBass').setScale(0.35).refreshBody();
  player.setBounce(0.1);
  player.setCollideWorldBounds(true);
  player.setMaxVelocity(200, 100000)
  player.setDragX(200)
  
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('bubbleBass', { start: 0, end: 7 }),
    frameRate: 8,
    repeat: -1
  });
  this.anims.create({
    key: 'left-slow',
    frames: this.anims.generateFrameNumbers('bubbleBass', { start: 0, end: 7 }),
    frameRate: 6,
    repeat: -1
  });

  this.anims.create({
    key: 'turn',
    frames: [{ key: 'bubbleBass', frame: 14 }],
    frameRate: 20
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('bubbleBass', { start: 15, end: 8 }),
    frameRate: 8,
    repeat: -1
  });
  this.anims.create({
    key: 'right-slow',
    frames: this.anims.generateFrameNumbers('bubbleBass', { start: 15, end: 10 }),
    frameRate: 6,
    repeat: 0
  });
  keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

  this.physics.add.collider(player, bouncy, function () {
    if (player.body.onFloor()) {
      player.setVelocityY((player.y - playerFalling['height']) * -80);
    }
  });
  this.physics.add.collider(player, platforms);
  this.physics.add.collider(platforms, bouncy);

  this.physics.world.setBounds(0, 0, width * 3, height);
  this.cameras.main.setBounds(0, 0, width * 3, height);
  this.cameras.main.startFollow(player, true, 0.05, 0.05,);
  this.cameras.main.setDeadzone(200)

  // Create Function
}

function update () {
  if (keyA.isDown) {
    player.setAccelerationX(-160);
    if (player.body.velocity.x > 0) {
      player.anims.play('right-slow', true);
    } else if (player.body.velocity.x >= -100) {
      player.anims.play('left-slow', true);
    } else {
      player.anims.play('left', true);
    }
  } else if (keyD.isDown) {
    player.setAccelerationX(160);
    if (player.body.velocity.x < 0) {
      player.anims.play('left-slow', true);
    } else if (player.body.velocity.x <= 100) {
      player.anims.play('right-slow', true);
    } else {
      player.anims.play('right', true);
    }
    //player.anims.addMix('right-slow', 'right', 1000)
    //player.anims.play('right-slow', true);
    //player.anims.play('right', true);
  } else {
    player.setAccelerationX(0);
    player.anims.play('turn');
  }

  if ((keySpace.isDown || keyW.isDown) && player.body.touching.down) {
    player.setVelocityY(-700);
  }

  if (player.body.velocity.y > 0) {
    playerFalling['falling'] = true;
    playerFalling['height'] = player.y;
  }
  if (player.body.onFloor() && playerFalling['falling']) {
    console.log('landed')
    playerFalling['fallHeight'] = player.y - playerFalling['height'];
    if (playerFalling['fallHeight'] > 10) {
    this.cameras.main.shake(playerFalling['fallHeight'] * 10, (playerFalling['fallHeight'] - 10) / 500)
    }
    playerFalling['falling'] = false;
  };
  // Update Function
}
