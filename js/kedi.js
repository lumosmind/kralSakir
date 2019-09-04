class Kedi {

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

    this.bulletScale = ch / 797 * .5; //.5;
    this.jumpDelay = 100;
    this.brainDelay = 5000;
    this.firePossibility = .75;
    this.jumpPossibility = .2;
    this.idlPossibility = .05;

    this.positions = [
      { x: cw * .09, y: ch - ch * 0.04, charDepth: 104, bulletDepth: 103 }, //1. kulvar
      { x: cw * .09, y: ch - ch * 0.16, charDepth: 14, bulletDepth: 13 }, //2. kulvar
      { x: cw * .09, y: ch - ch * 0.28, charDepth: 4, bulletDepth: 3 }, //3. kulvar
    ];





    this.positionNumber = 2;


  }

  preload() {
    const baseURL = './assets/images/kedi/';
    this.scene.load.image('kedi', baseURL + 'kedi.png');
    this.scene.load.image('bullet', './assets/images/bullets/blueBullet.png');
  }

  create() {
    // this.character = this.scene.physics.add.image(cw * .15, ch - ch * 0.04, 'sakir')
    this.character = this.scene.physics.add.image(
      this.positions[this.positionNumber].x,
      this.positions[this.positionNumber].y, 'kedi')
      .setAlpha(1)
      .setOrigin(0, 1)
      .setImmovable();
    this.character.depth = this.positions[this.positionNumber].charDepth;
    this.character.depth = this.positions[this.positionNumber].charDepth;
    this.scaleFactor = this.ch / this.character.height / 4;
    this.character.setScale(this.scaleFactor);

    this.gunY = -this.character.displayHeight / 2.8;
    this.gunX = this.character.displayWidth / 1.5;

    this.bullets = this.scene.physics.add.group();

    // this.keyboard = this.scene.input.keyboard.createCursorKeys();
    this.startBrain();
  }

  update() {
    /* if (this.keyboard.up.isDown) {
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
    } */

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

  brain() {
    // 1- jump
    // 2- fire
    // 3- idl

    const dice = Math.random();
    console.log(`move dice ${dice}`);
    if (0 < dice && dice < this.firePossibility) {
      console.log('fil chose ... fire');
      this.fire();

    } else if (this.firePossibility < dice && dice < (this.firePossibility + this.jumpPossibility)) {
      console.log('fil chose ... jump');
      this.randomJump();
    } else {
      console.log('fil chose ... nothing');
    }

  }

  startBrain() {
    this.scene.time.addEvent({
      delay: this.brainDelay,
      callback: (() => {
        this.brain();
        console.log("run fil brain...");
      }),
      repeat: -1,
    });
  }

  randomJump() {
    const dice = Math.floor(Math.random() * 2);
    // debugger;
    const possibleJumps = {
      0: [1, 2], // sıfırıncı kulvarda atlayabileceği yerler
      1: [0, 2], // birinci kulvarda atlayabileceği yerler
      2: [0, 1], // ikinci kulvarda atlayabileceği yerler
    };

    const jumpPoint = possibleJumps[this.positionNumber][dice];



    /*     if (dice === this.positionNumber) {
          console.log('fil chose jump same where...');
          return;
        } */
    const difference = jumpPoint - this.positionNumber;
    if (difference < 0) {
      console.log(`fil chose jump ${-difference} step down`);
      for (let i = 0; i < -difference; i++) {
        this.scene.time.addEvent({
          delay: this.jumpDelay * (i + 1),
          callback: (() => { this.jumpDown(); }),
        });
      }
    } else {
      for (let i = 0; i < difference; i++) {
        console.log(`fil chose jump ${difference} step up`);
        this.scene.time.addEvent({
          delay: this.jumpDelay * (i + 1),
          callback: (() => { this.jumpUp(); }),
        });
      }
    }


  }
}