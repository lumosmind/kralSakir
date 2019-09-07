class Sakir {

  constructor(scene) {
    // debugger;
    this.scene = scene;
    this.characterScaleConstant = .25;
    this.bulletSpeedConstant = .4;
    this.bulletScaleConstant = .5;
    this.refreshSizes();
    // this.cw = scene.game.canvas.width;
    // this.ch = scene.game.canvas.height;
    // this.bulletSpeed = cw * .4;//600;
    /*     this.gunX = 50;
        this.gunY = -50; */
    this.fireDelay = 500;
    this.canFire = true;

    this.isUpPressed = false;
    this.isDownPressed = false;

    // this.bulletScale = ch / 797 * .5; //.5; //// *****   Düzenlenecek  *******

    /*  this.positions = [
       { x: cw * .15, y: ch - ch * 0.04, charDepth: 106, bulletDepth: 105 }, //1. kulvar
       { x: cw * .15, y: ch - ch * 0.16, charDepth: 16, bulletDepth: 15 }, //2. kulvar
       { x: cw * .15, y: ch - ch * 0.28, charDepth: 6, bulletDepth: 5 }, //3. kulvar
     ]; */





    this.positionNumber = 0;


  }

  preload() {
    const baseURL = './assets/images/sakir/';
    this.scene.load.image('sakir', baseURL + 'sakir.png');

    this.scene.load.spritesheet('sakirJump', baseURL + 'jump.png',
      { frameWidth: 177, frameHeight: 250 });

    this.scene.load.spritesheet('sakirFire', baseURL + 'fire.png',
      { frameWidth: 178, frameHeight: 250 });


    this.scene.load.image('bullet', './assets/images/bullets/blueBullet.png');
  }

  create() {
    // this.character = this.scene.physics.add.image(cw * .15, ch - ch * 0.04, 'sakir')
    this.character = this.scene.physics.add.sprite(
      this.positions[this.positionNumber].x,
      this.positions[this.positionNumber].y, 'sakirJump', 0)
      .setAlpha(1)
      .setOrigin(0, 1)
      .setImmovable();
    this.character.depth = this.positions[this.positionNumber].charDepth;
    this.scaleFactor = this.ch / this.character.height / 4;
    this.character.setScale(this.scaleFactor);

    this.scene.anims.create({
      key: 'sakirIDL',
      frames: this.scene.anims.generateFrameNumbers('sakirJump',
        { start: 0, end: 0 }),
      frameRate: 10,
      repeat: 0,
    });

    this.scene.anims.create({
      key: 'sakirJumpUpAnim',
      frames: this.scene.anims.generateFrameNumbers('sakirJump',
        { start: 0, end: 4 }),
      frameRate: 20,
      repeat: 0,
    });

    this.scene.anims.create({
      key: 'sakirJumpDownAnim',
      frames: this.scene.anims.generateFrameNumbers('sakirJump',
        { start: 5, end: 9 }),
      frameRate: 20,
      repeat: 0,
    });

    this.fireAnim = this.scene.anims.create({
      key: 'sakirFireAnim',
      frames: this.scene.anims.generateFrameNumbers('sakirFire',
        { start: 0, end: 7 }),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: false,
    });

    this.fireAnim.on('complete', (() => { this.character.anims.play('sakirIDL', true) }));

    this.gunY = -this.character.displayHeight / 2.8;
    this.gunX = this.character.displayWidth / 1.5;

    this.bullets = this.scene.physics.add.group();

    this.keyboard = this.scene.input.keyboard.createCursorKeys();
  }

  update(jumpDirection, isFiring) {
    if ((this.keyboard.up.isDown && !this.isUpPressed) || jumpDirection === 1) {
      this.isUpPressed = true;
      this.jumpUp();
      // console.log("up");
    } else if ((this.keyboard.down.isDown && !this.isDownPressed) || jumpDirection === -1) {
      this.isDownPressed = true;
      this.jumpDown();
      // console.log('down');
    }

    if (this.keyboard.up.isUp) {
      // key up action for up key
      this.isUpPressed = false;

    }
    if (this.keyboard.down.isUp) {
      // key up action for down key
      this.isDownPressed = false;

    }

    if (this.keyboard.space.isDown || isFiring) {
      //fire event
      this.fire();
    }



  }

  jumpUp() {
    if (this.positionNumber < this.positions.length - 1) {
      this.positionNumber += 1;

      this.character.depth = this.positions[this.positionNumber].charDepth;

      /* this.character.setPosition(this.positions[this.positionNumber].x,
        this.positions[this.positionNumber].y); */


      this.jumpEndTween = this.scene.tweens.add({
        targets: [this.character],
        x: this.positions[this.positionNumber].x,
        y: this.positions[this.positionNumber].y,
        duration: 250,
        paused: true,
        ease: 'Sine.easeInOut',
        repeat: 0,
        onStart: (() => { this.character.anims.play('sakirJumpDownAnim', true) }),
        onComplete: function () { },
      });

      this.jumpStartTween = this.scene.tweens.add({
        targets: [this.character],
        x: this.positions[this.positionNumber].x,
        y: this.positions[this.positionNumber].y - 50,
        duration: 250,
        ease: 'Sine.easeInOut',
        repeat: 0,
        onStart: (() => { this.character.anims.play('sakirJumpUpAnim', true) }),
        onComplete: (() => { this.jumpEndTween.play(); }),
      });

    }

  }

  jumpDown() {
    if (this.positionNumber > 0) {
      const exPositionNumber = this.positionNumber;
      this.positionNumber -= 1;

      this.character.depth = this.positions[this.positionNumber].charDepth;

      // this.character.setPosition(this.positions[this.positionNumber].x,
      //   this.positions[this.positionNumber].y);

      this.jumpEndTween = this.scene.tweens.add({
        targets: [this.character],
        x: this.positions[this.positionNumber].x,
        y: this.positions[this.positionNumber].y,
        duration: 250,
        paused: true,
        ease: 'Sine.easeInOut',
        repeat: 0,
        onStart: (() => { this.character.anims.play('sakirJumpDownAnim', true) }),
        onComplete: function () { },
      });

      this.jumpStartTween = this.scene.tweens.add({
        targets: [this.character],
        x: this.positions[this.positionNumber].x,
        y: this.positions[exPositionNumber].y - 25,
        duration: 250,
        ease: 'Sine.easeInOut',
        repeat: 0,
        onStart: (() => { this.character.anims.play('sakirJumpUpAnim', true) }),
        onComplete: (() => { this.jumpEndTween.play(); }),
      });
    }

  }

  fire() {
    if (!this.canFire) return;
    // debugger;
    this.bullets.create(this.character.x + this.gunX, this.character.y + this.gunY, 'bullet')
      .setScale(this.bulletScale)
      .setVelocity(this.bulletSpeed, 0)
      .depth = this.positions[this.positionNumber].bulletDepth;

    this.character.anims.play('sakirFireAnim', true);
    this.canFire = false;
    this.scene.time.addEvent({
      delay: this.fireDelay,
      callback: (() => { this.canFire = true; }),
    });
  }

  refreshSizes() {
    // refresh screen sizes variables
    this.cw = this.scene.game.canvas.width;
    this.ch = this.scene.game.canvas.height;
    // refresh bullet speed and scale
    this.bulletSpeed = cw * this.bulletSpeedConstant;
    this.bulletScale = ch / 797 * this.bulletScaleConstant;

    //refresh character positions
    this.positions = [
      { x: this.cw * .15, y: this.ch - this.ch * 0.04, charDepth: 106, bulletDepth: 105 }, //1. kulvar
      { x: this.cw * .15, y: this.ch - this.ch * 0.16, charDepth: 16, bulletDepth: 15 }, //2. kulvar
      { x: this.cw * .15, y: this.ch - this.ch * 0.28, charDepth: 6, bulletDepth: 5 }, //3. kulvar
    ];
    if (this.character) {
      this.scaleFactor = this.ch / this.character.height * this.characterScaleConstant;
      this.character.setScale(this.scaleFactor);

      this.character.setPosition(this.positions[this.positionNumber].x,
        this.positions[this.positionNumber].y);
    }


  }
}