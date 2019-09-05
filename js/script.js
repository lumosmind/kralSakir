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
  parent: 'container',

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
    resize: onResize,         //cancas resize event
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
let startBtn;
let stopBtn;
let backgroundFactor;


function onPreload() {
  ch = game.canvas.height;
  cw = game.canvas.width;
  console.log('cw,ch :', cw, ch);
  //--------------------------------
  const baseURL = './assets/images/';
  this.load.image('background', baseURL + 'background/artılıback.png');
  this.load.spritesheet('fullscreen', baseURL + 'ui/fullscreen.png', { frameWidth: 64, frameHeight: 64 });


  sakir = new Sakir(this);
  sakir.preload();

  viruses = new Viruses(this);
  viruses.preload();

  fil = new Fil(this);
  fil.preload();

  kedi = new Kedi(this);
  kedi.preload();

}

function onCreate() {
  scene = this;
  background = this.add.image(game.canvas.width / 2, game.canvas.height / 2, 'background');
  backgroundFactor = ch / background.height;
  console.warn('first bg height:' + background.height);
  console.error('first bg height:' + background.height);
  console.log('backgroundFactor :', backgroundFactor);
  background.setScale(backgroundFactor);





  sakir.create();
  viruses.create();
  fil.create();
  kedi.create();


  this.physics.add.collider(sakir.bullets, viruses.viruses, bulletVirusCoolisionHandler);
  this.physics.add.collider(fil.bullets, viruses.viruses, bulletVirusCoolisionHandler);
  this.physics.add.collider(kedi.bullets, viruses.viruses, bulletVirusCoolisionHandler);



  const button = this.add.image(cw, 0, 'fullscreen', 0).setOrigin(1, 0).setInteractive();

  button.on('pointerup', function () {

    if (this.scale.isFullscreen) {
      button.setFrame(0);

      this.scale.stopFullscreen();
    }
    else {
      button.setFrame(1);

      this.scale.startFullscreen();
    }

  }, this);


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
  fil.update();
  kedi.update();

}


function openFullscreen() {
  console.log("fullscreen");
  const elem = document.getElementsByTagName('canvas')[0];
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
}

function onResize() {

}


game.scale.on('resize', function (gameSize, baseSize, displaySize, resolution, previousWidth, previousHeight) {
  try {
    console.warn('resized****************************************');
    console.warn('ch:' + ch);
    ch = game.canvas.height;
    console.warn('ch..>:' + ch);
    console.warn('bgFac:' + backgroundFactor);
    backgroundFactor = ch / background.height;
    console.warn('bgFac..>:' + backgroundFactor);
    console.log('backgroundFactor :', backgroundFactor);
    background.setScale(backgroundFactor);
    console.warn('bg heigth after scale:' + background.height);

    background.setPosition(game.canvas.width / 2, game.canvas.height / 2);
    //*************************************** */
    //reset all responsive values here
    //character width ,height
    //speeds
    //etc..
    //*************************************** */
  } catch (error) {
    console.error("some errors :D");
  }

});




