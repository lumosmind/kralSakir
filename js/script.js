const config = {
  // chose html5-canvas vs CanvasGL. 
  type: Phaser.AUTO,
  //width - height
  // width: 2560,
  // height: 1440,
  width: 1600,
  height: 900,
  //background color of canvas
  backgroundColor: 0x225566, //hexadecimal color code

  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH, // rescale with aspect ratio
    // mode: Phaser.Scale.FIT,               // vertical and horizontal center
    // mode: Phaser.Scale.ENVELOP,               // 
    mode: Phaser.Scale.RESIZE,               // 
  },
  // default scene objects properties
  scene: {
    preload: onPreload,     // load assetes before start the game
    create: onCreate,       // create game object before start game
    update: onUpdate,       // update game object in game
  },
  // physics engine
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 }, // set gravity
      debug: true,              // debug mode
    },
  },
};


const game = new Phaser.Game(config);
let cw, ch;
let background;
let sakir, fil, kedi;
let scene, camera;
let virus;


function onPreload() {
  ch = game.canvas.height;
  cw = game.canvas.width;
  console.log('cw,ch :', cw, ch);
  //--------------------------------
  const baseURL = './assets/images/';
  this.load.image('background', baseURL + 'background/backgroundPlus.png');
  // this.load.image('background', baseURL + 'background.jpg');
  /* this.load.image('sakir', baseURL + 'sakir.png');
  this.load.image('fil', baseURL + 'fil.png');
  this.load.image('kedi', baseURL + 'kedi.png'); */

  this.load.image('platform', baseURL + 'platform.png');

  sakir = new Sakir(this);
  sakir.preload();

  viruses = new Viruses(this);
  viruses.preload();

}

function onCreate() {
  scene = this;
  /*  camera = this.cameras.main;
   console.log('camera.width, camera.height :', camera.width, camera.height);
   console.log('camera.displayHeight, camera.displayWidth :', camera.displayHeight, camera.displayWidth); */
  background = this.add.image(game.canvas.width / 2, game.canvas.height / 2, 'background');
  const backgroundFactor = ch / background.height;
  console.log('backgroundFactor :', backgroundFactor);
  background.setScale(backgroundFactor);
  // sakir = this.add.image(cw * .01, ch - ch * .1, 'sakir').setOrigin();
  // sakir = this.physics.add.image(0, ch / 2, 'sakir').setAlpha(.4);
  /* fil = this.physics.add.image(cw * .01, ch - ch * 0.25, 'fil')
    .setScale(1)

    .setAlpha(1)
    .setOrigin(0, 1)
    .setImmovable(); */

  /*  const scaleFactor = ch / fil.height / 4;
   console.log('scaleFactor :', scaleFactor);
   fil.setScale(scaleFactor); */

  /* sakir = this.physics.add.image(cw * .15, ch - ch * 0.04, 'sakir')
    .setScale(scaleFactor)
    .setAlpha(1)
    .setOrigin(0, 1)
    .setImmovable(); */



  /* kedi = this.physics.add.image(cw * .01, ch - ch * 0.03, 'kedi')
  .setScale(scaleFactor)
  .setAlpha(1)
  .setOrigin(0, 1)
  .setImmovable(); */




  sakir.create();
  viruses.create();

  this.physics.add.collider(sakir.bullets, viruses.viruses, bulletVirusCoolisionHandler);



}

function bulletVirusCoolisionHandler(bullet, virus) {
  console.log('bullet, virus :', bullet, virus);
  // virus.setTint(0xff0000);
  bullet.disableBody(true, true);
  viruses.makeDisable(virus);

}

function onUpdate() {
  sakir.update();
  viruses.update();

}