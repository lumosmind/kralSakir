class Fil {

  constructor(scene) {
    // debugger;
    this.scene = scene;
    this.cw = scene.game.canvas.width;
    this.ch = scene.game.canvas.height;
    this.bulletSpeed = cw * .4;//600;
    /*     this.gunX = 50;
        this.gunY = -50; */
    this.fireDelay = 500;
    this.canFire = true;
    this.depth = 10;
    this.bulletScale = .5;

    this.positions = [
      { x: cw * .05, y: ch - ch * 0.04 }, //1. kulvar
      { x: cw * .05, y: ch - ch * 0.16 }, //2. kulvar
      { x: cw * .05, y: ch - ch * 0.28 }, //3. kulvar
    ];

    this.positionNumber = 0;


  }

  preload() {
    const baseURL = './assets/images/fil/';
    this.scene.load.image('fil', baseURL + 'fil.png');
    this.scene.load.image('bullet', './assets/images/bullets/blueBullet.png');
  }

  create() {
    // this.character = this.scene.physics.add.image(cw * .15, ch - ch * 0.04, 'sakir')
    this.character = this.scene.physics.add.image(this.positions[0].x, this.positions[0].y, 'fil')
      .setAlpha(1)
      .setOrigin(0, 1)
      .setImmovable();
    this.character.depth = this.depth;
    this.scaleFactor = this.ch / this.character.height / 4;
    this.character.setScale(this.scaleFactor);

    this.gunY = -this.character.displayHeight / 2.8;
    this.gunX = this.character.displayWidth / 1.5;

    this.bullets = this.scene.physics.add.group();

    this.keyboard = this.scene.input.keyboard.createCursorKeys();
  }

  update() {
    if (this.keyboard.up.isDown) {
      this.isUpPressed = true;
    } else if (this.keyboard.down.isDown) {
      this.isDownPressed = true;
    }

    if (this.keyboard.up.isUp && this.isUpPressed) {
      // key up action for up key
      this.isUpPressed = false;
      this.jumpUp();
      console.log("up");
    } else if (this.keyboard.down.isUp && this.isDownPressed) {
      // key up action for down key
      this.isDownPressed = false;
      this.jumpDown();
      console.log('down');
    }

    if (this.keyboard.space.isDown) {
      //fire event
      this.fire();
    }

  }

  jumpUp() {
    if (this.positionNumber < this.positions.length - 1) {
      this.positionNumber += 1;
      this.character.setPosition(this.positions[this.positionNumber].x,
        this.positions[this.positionNumber].y);

    }

  }

  jumpDown() {
    if (this.positionNumber > 0) {
      this.positionNumber -= 1;
      this.character.setPosition(this.positions[this.positionNumber].x,
        this.positions[this.positionNumber].y);

    }

  }

  fire() {
    if (!this.canFire) return;
    // debugger;
    this.bullets.create(this.character.x + this.gunX, this.character.y + this.gunY, 'bullet')
      .setScale(this.bulletScale)
      .setVelocity(this.bulletSpeed, 0)
      .depth = 4;
    this.canFire = false;
    this.scene.time.addEvent({
      delay: this.fireDelay,
      callback: (() => { this.canFire = true; }),
    });
  }

  brain() {
    // 1- jump
    // 2- fire
    // 3- idl

    const dice = Math.floor(Math.random() * 3 + 1);
    switch (dice) {
      case 1:
        this.randomJump();
        break;
      case 2:
        this.fire();
        break;
      case 3:
        //
        break;
    }
  }

  randomJump() {
    const dice = Math.floor(Math.random() * 3);
    if (dice = this.positionNumber) return;


  }
}