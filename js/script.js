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
let viruses;
let startBtn;
let stopBtn;
let backgroundFactor;
let fpsText;

let btnUp, btnDown, btnFire;
let isUpUp = true;
let isDownUp = true;
let isFireUp = true;

// 1: up 0: stay -1:down
let sakirJumDirection = 0;
let isFiring = false;


function onPreload() {
  ch = game.canvas.height;
  cw = game.canvas.width;
  console.log('cw,ch :', cw, ch);
  //--------------------------------
  const baseURL = './assets/images/';
  this.load.image('background', baseURL + 'background/artılıback.png');
  this.load.spritesheet('fullscreen', baseURL + 'ui/fullscreen.png', { frameWidth: 64, frameHeight: 64 });

  //buttons
  this.load.image('btnUp', baseURL + 'buttons/up.png');
  this.load.image('btnDown', baseURL + 'buttons/down.png');
  this.load.image('btnFire', baseURL + 'buttons/fire.png');

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
  fpsText = this.add.text(0, 0, 'sdvsd', { fontSize: '80px' });
  fpsText.depth = 100;
  background = this.add.image(game.canvas.width / 2, game.canvas.height / 2, 'background');
  backgroundFactor = ch / background.height;
  //console.warn('first bg height:' + background.height);
  //console.error('first bg height:' + background.height);
  //console.log('backgroundFactor :', backgroundFactor);
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


  addButtons();

}

function bulletVirusCoolisionHandler(bullet, virus) {
  // console.log('bullet, virus :', bullet, virus);
  // virus.setTint(0xff0000);
  bullet.disableBody(true, true);
  viruses.makeDisable(virus);

}

function onUpdate() {
  sakir.update(sakirJumDirection, isFiring);
  sakirJumDirection = 0;
  isFiring = false;

  viruses.update();
  fil.update();
  kedi.update();

  fpsText.setText(Math.round(game.loop.actualFps));
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
    //console.warn('resized****************************************');
    //console.warn('ch:' + ch);
    if (sakir) sakir.refreshSizes();
    if (kedi) kedi.refreshSizes();
    if (fil) fil.refreshSizes();
    if (viruses) viruses.refreshSizes();
    ch = game.canvas.height;
    //console.warn('ch..>:' + ch);
    //console.warn('bgFac:' + backgroundFactor);
    if (background) {
      backgroundFactor = ch / background.height;
      background.setScale(backgroundFactor);
      background.setPosition(game.canvas.width / 2, game.canvas.height / 2);
    }

    if (btnUp) resizeButtons();
    //console.warn('bgFac..>:' + backgroundFactor);
    //console.log('backgroundFactor :', backgroundFactor);
    //console.warn('bg heigth after scale:' + background.height);

    //*************************************** */
    //reset all responsive values here
    //character width ,height
    //speeds
    //etc..

    //*************************************** */
  } catch (error) {
    console.error("some errors :D");
    console.error(error);
  }

});


function addButtons() {
  btnDown = scene.add.sprite(0, ch, 'btnDown').setOrigin(0, 1);
  btnDown.depth = 200;
  btnDown.alpha = .3;
  btnUp = scene.add.sprite(0, ch - btnDown.height, 'btnUp').setOrigin(0, 1);
  btnUp.depth = 200;
  btnUp.alpha = .3;
  btnFire = scene.add.sprite(cw, ch, 'btnFire').setOrigin(1, 1);
  btnFire.depth = 200;
  btnFire.alpha = .3;

  resizeButtons();
  setButtonsActions();
}

function resizeButtons() {
  const btnDownFactor = ch / 797 * .7;
  const btnUpFactor = ch / 797 * .7;
  const paddingFactorBetweenUpDown = 0.11;
  const btnFireFactor = ch / 797 * .7;
  btnDown.setScale(btnDownFactor);
  btnDown.setPosition(0, ch);

  btnUp.setScale(btnUpFactor);
  btnUp.setPosition(0, (ch - btnDown.displayHeight * (1 + paddingFactorBetweenUpDown)));

  btnFire.setScale(btnFireFactor);
  btnFire.setPosition(cw, ch);
}



function setButtonsActions() {
  //up
  btnUp.setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
    console.log(event);
    if (isUpUp) {
      // sakir.jumpUp();
      sakirJumDirection = 1;
    }
  });

  btnUp.setInteractive().on('pointerup', function (pointer, localX, localY, event) {
    isUpUp = true;
  });


  //down

  btnDown.setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
    console.log(event);
    if (isDownUp) {
      // sakir.jumpUp();
      sakirJumDirection = -1;
    }
  });

  btnDown.setInteractive().on('pointerup', function (pointer, localX, localY, event) {
    isDownUp = true;
  });

  //fire
  btnFire.setInteractive().on('pointerdown', function (pointer, localX, localY, event) {
    console.log(event);
    if (isFireUp) {
      // sakir.jumpUp();
      isFiring = true;
    }
  });

  btnDown.setInteractive().on('pointerup', function (pointer, localX, localY, event) {
    isFireUp = true;
    isFiring = false;
  });
}




