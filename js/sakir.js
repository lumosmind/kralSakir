class Sakir {

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

    this.isUpPressed = false;
    this.isDownPressed = false;

    this.bulletScale = ch / 797 * .5; //.5; //// *****   Düzenlenecek  *******

    this.positions = [
      { x: cw * .15, y: ch - ch * 0.04, charDepth: 106, bulletDepth: 105 }, //1. kulvar
      { x: cw * .15, y: ch - ch * 0.16, charDepth: 16, bulletDepth: 15 }, //2. kulvar
      { x: cw * .15, y: ch - ch * 0.28, charDepth: 6, bulletDepth: 5 }, //3. kulvar
    ];





    this.positionNumber = 0;


  }

  preload() {
    const baseURL = './assets/images/sakir/';
    this.scene.load.image('sakir', baseURL + 'sakir.png');
    this.scene.load.image('bullet', './assets/images/bullets/blueBullet.png');
  }

  create() {
    // this.character = this.scene.physics.add.image(cw * .15, ch - ch * 0.04, 'sakir')
    this.character = this.scene.physics.add.image(
      this.positions[this.positionNumber].x,
      this.positions[this.positionNumber].y, 'sakir')
      .setAlpha(1)
      .setOrigin(0, 1)
      .setImmovable();
    this.character.depth = this.positions[this.positionNumber].charDepth;
    this.scaleFactor = this.ch / this.character.height / 4;
    this.character.setScale(this.scaleFactor);

    this.gunY = -this.character.displayHeight / 2.8;
    this.gunX = this.character.displayWidth / 1.5;

    this.bullets = this.scene.physics.add.group();

    this.keyboard = this.scene.input.keyboard.createCursorKeys();
  }

  update() {
    if (this.keyboard.up.isDown && !this.isUpPressed) {
      this.isUpPressed = true;
      this.jumpUp();
      console.log("up");
    } else if (this.keyboard.down.isDown && !this.isDownPressed) {
      this.isDownPressed = true;
      this.jumpDown();
      console.log('down');
    }

    if (this.keyboard.up.isUp) {
      // key up action for up key
      this.isUpPressed = false;

    }
    if (this.keyboard.down.isUp) {
      // key up action for down key
      this.isDownPressed = false;

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

      this.character.depth = this.positions[this.positionNumber].charDepth;
    }

  }

  jumpDown() {
    if (this.positionNumber > 0) {
      this.positionNumber -= 1;
      this.character.setPosition(this.positions[this.positionNumber].x,
        this.positions[this.positionNumber].y);

      this.character.depth = this.positions[this.positionNumber].charDepth;
    }

  }

  fire() {
    if (!this.canFire) return;
    // debugger;
    this.bullets.create(this.character.x + this.gunX, this.character.y + this.gunY, 'bullet')
      .setScale(this.bulletScale)
      .setVelocity(this.bulletSpeed, 0)
      .depth = this.positions[this.positionNumber].bulletDepth;
    this.canFire = false;
    this.scene.time.addEvent({
      delay: this.fireDelay,
      callback: (() => { this.canFire = true; }),
    });
  }
}