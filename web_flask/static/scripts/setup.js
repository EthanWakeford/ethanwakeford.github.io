console.log("loaded js file");

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 400,
  physics: {
    default: 'arcade'
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image('road', '/static/image_dump/spongebob_road.png');
  // Preload Function
}
function create() {
  platforms = this.physics.add.staticGroup();
  platforms.create(200,390, 'road');
  // Create Function
}
function update() {
  // Update Function
}