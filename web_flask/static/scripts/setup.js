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
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

let player;
let dirty;
let platforms;
let box;
let bouncy;
let dirty;
let pickle;
let movingPlatform;
let keyA;
let keyD;
let keyW;
let keySpace;
let keyR;
let game = new Phaser.Game(config);

function preload () {
  this.load.image('background', '../static/image_dump/JellyfishFields_V2.png');
  this.load.image('bubbles_platform', '../static/image_dump/bubbles_jump_flat.png');
  this.load.image('road', '../static/image_dump/spongebob_road_2x.png');
  this.load.image('moving', '../static/image_dump/BubbleBassSpriteMap_V2.png');
  this.load.image('box', '../static/image_dump/box.png');
  this.load.image('greenBox', '../static/image_dump/Green_full.png');
  this.load.spritesheet('bubbleBass',
    '../static/image_dump/BubbleBassSpriteMap_V2.png',
    { frameWidth: 210, frameHeight: 226 }
  );
  // Preload Function
}
function create () {
  // keyboard controls setup
  keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

  // background creation
  // background = this.add.tileSprite(width/2, height/2, width, height, 'background');
  const { width, height } = this.sys.game.canvas;
  this.add.image(width * 1.5, height, 'background').setScale(0.65);

  // static platforms
  platforms = this.physics.add.staticGroup();
  platforms.create(width, 885, 'road').setScale(1.2).refreshBody();
  platforms.create(400, 650, 'bubbles_platform').setScale(1).refreshBody();
  platforms.create(500, 550, 'bubbles_platform').setScale(1).refreshBody();

  // bouncing object
  bouncy = this.physics.add.staticGroup();
  bouncy.create(800, 850, 'bubbles_platform').setScale(1).refreshBody();
  bouncy.create(950, 400, 'bubbles_platform').setScale(1).refreshBody();

  // dirty bubble
  dirty = this.physics.add.sprite(1500, 800, 'greenBox').setScale(0.05).refreshBody();
  dirty.body.setAllowGravity(false);

  // the pickle
  pickle = this.physics.add.image(2800, 800, 'greenBox').setScale(0.05);
  pickle.body.setAllowGravity(false);

  // moving platforms
  movingPlatform = this.physics.add.image(1200, 900, 'moving').setScale(0.1).refreshBody();
  movingPlatform.setImmovable(true).setVelocity(100, -100).setMass(100000);
  movingPlatform.body.setAllowGravity(false);
  this.tweens.timeline({
    targets: movingPlatform.body.velocity,
    loop: -1,
    tweens: [
      { x: 0, y: -200, duration: 2000, ease: 'Stepped' },
      { x: 0, y: 0, duration: 1000, ease: 'Stepped' },
      { x: 150, y: 100, duration: 4000, ease: 'Stepped' },
      { x: 0, y: -200, duration: 2000, ease: 'Stepped' },
      { x: 0, y: 0, duration: 1000, ease: 'Stepped' },
      { x: -150, y: 100, duration: 4000, ease: 'Stepped' }
    ]
  });

  // movable box
  box = this.physics.add.image(300, 500, 'box').setScale(0.1).refreshBody();
  box.setMass(100).setBounce(0).setDragX(200).setCollideWorldBounds(true);

  // player object
  player = this.physics.add.sprite(200, 726, 'bubbleBass').setScale(0.35).refreshBody();
  player.setBounce(0.1).setCollideWorldBounds(true).setDragX(200);
  player.setMaxVelocity(200, 1500).setMass(1);
  player.custom = {};
  player.custom.falling = { falling: false, height: 0, fallHeight: 0 };
  player.custom.direction = 'right';

  // physics set ups
  this.physics.add.collider(player, bouncy, function () {
    if (player.body.onFloor()) {
      player.setVelocityY((player.y - player.custom.falling.height) * -80);
      // player.setVelocityY(player.body.velocity.y * -1.5);
    }
  });
  this.physics.add.collider(player, platforms);
  this.physics.add.collider(player, box);
  this.physics.add.collider(box, bouncy);
  this.physics.add.collider(platforms, box);
  this.physics.add.collider(player, movingPlatform);
  this.physics.add.collider(player, dirty);
  this.physics.add.overlap(player, pickle, win, null, this);

  // world and camera building
  this.add.text(100, 400, 'WASD AND SPACE TO MOVE', { font: '35px bold', fill: '#ffffff' }).setShadow(1.5, 1.5);
  this.physics.world.setBounds(0, 0, width * 3, height * 1.5);
  this.cameras.main.setBounds(0, 0, width * 3, height * 1.5);
  this.cameras.main.startFollow(player, true, 0.05, 0.05);
  this.cameras.main.setDeadzone(200);

  // animations creation
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
  // Create Function
}

function update () {
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

  if (keyR.isDown) {
    this.scene.restart();
  }
  // Update Function
}

// game over function
function gameOver () {

}

function win (player, pickle) {
  this.add.text(2300, 400, 'YOU WINNNN!!! YOU GOT THE PICKLE!!!', { font: '35px bold', fill: '#ffffff' }).setShadow(1.5, 1.5);
  this.cameras.main.shake(100000);
}

// object definitions
