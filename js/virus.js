
class Viruses {
  constructor(scene) {
    this.scene = scene;
    // this.cw = scene.game.canvas.width;
    // this.ch = scene.game.canvas.height;
    this.activeVirusList = [];
    this.pasiveVirusList = [];
    this.totalVirusCount = 5;
    // this.speed = -cw * .1;//-150;
    this.speedConstant = .1;
    this.characterScaleConstant = .17;

    this.refreshSizes();

    /* this.positions = [
      { x: cw, y: ch - ch * 0.04, charDepth: 0 }, //1. kulvar
      { x: cw, y: ch - ch * 0.16, charDepth: 0 }, //2. kulvar
      { x: cw, y: ch - ch * 0.28, charDepth: 0 }, //3. kulvar
    ]; */
  }

  preload() {
    const baseURL = './assets/images/virus/';
    this.scene.load.image('virus', baseURL + 'virus.png');

  }

  create() {
    this.viruses = this.scene.physics.add.group();


    for (let i = 0; i < this.totalVirusCount; i++) {
      const virus = this.viruses.create(this.positions[0].x - 200, this.positions[0].y, 'virus')
        .setOrigin(0, 1)

      this.scaleFactor = this.ch / virus.height * this.characterScaleConstant;
      virus.setScale(this.scaleFactor);

      virus.disableBody(true, true);
      this.pasiveVirusList.push(virus);
    }

    this.virusManager();

  }

  update() {

    for (let i = 0; i < this.activeVirusList.length; i++) {
      const virus = this.activeVirusList[i]
      if (virus.x < -virus.width) {
        virus.disableBody(true, true);
        this.activeVirusList.splice(i, 1);
        this.pasiveVirusList.push(virus);
      }
    }

  }

  sendVirus(positionNumber) {
    if (positionNumber > this.positions.length - 1) {
      console.error("invalid position number");
      return;
    }
    const chosenVirus = this.pasiveVirusList.pop();
    if (chosenVirus === undefined) {
      console.error('pasive virues not found');
      return;
    }
    chosenVirus.enableBody(
      true,
      this.positions[positionNumber].x,
      this.positions[positionNumber].y,
      true,
      true);
    chosenVirus.setVelocity(this.speed, 0);
    chosenVirus.depth = this.positions[positionNumber].charDepth;
    this.activeVirusList.push(chosenVirus);
  }

  makeDisable(virus) {
    virus.disableBody(true, true);
    this.pasiveVirusList.push(virus);
    const index = this.activeVirusList.indexOf(virus);
    this.activeVirusList.splice(0, 1);
  }

  virusManager() {
    const schedule = [
      { positionNumber: 0, delay: 1000 * 5 },
      { positionNumber: 1, delay: 1000 * 8 },
      { positionNumber: 2, delay: 1000 * 12 },
      { positionNumber: 0, delay: 1000 * 15 },
      { positionNumber: 2, delay: 1000 * 18 },
      { positionNumber: 1, delay: 1000 * 20 },
      { positionNumber: 0, delay: 1000 * 25 },
      { positionNumber: 1, delay: 1000 * 28 },
      { positionNumber: 2, delay: 1000 * 32 },
      { positionNumber: 0, delay: 1000 * 35 },
      { positionNumber: 2, delay: 1000 * 38 },
      { positionNumber: 1, delay: 1000 * 30 },
    ];

    schedule.forEach(item => {
      this.scene.time.addEvent({
        delay: item.delay,
        callback: (() => { this.sendVirus(item.positionNumber) }),
      });

    });
  }

  refreshSizes() {
    // refresh screen sizes variables
    this.cw = this.scene.game.canvas.width;
    this.ch = this.scene.game.canvas.height;
    // refresh bullet speed and scale
    // this.bulletSpeed = cw * this.bulletSpeedConstant;
    // this.bulletScale = ch / 797 * this.bulletScaleConstant;
    this.speed = -cw * this.speedConstant;
    //refresh character positions
    /* this.positions = [
      { x: this.cw * .09, y: this.ch - this.ch * 0.04, charDepth: 104, bulletDepth: 103 }, //1. kulvar
      { x: this.cw * .09, y: this.ch - this.ch * 0.16, charDepth: 14, bulletDepth: 13 }, //2. kulvar
      { x: this.cw * .09, y: this.ch - this.ch * 0.28, charDepth: 4, bulletDepth: 3 }, //3. kulvar
    ]; */


    this.positions = [
      { x: this.cw, y: this.ch - this.ch * 0.04, charDepth: 0 }, //1. kulvar
      { x: this.cw, y: this.ch - this.ch * 0.16, charDepth: 0 }, //2. kulvar
      { x: this.cw, y: this.ch - this.ch * 0.28, charDepth: 0 }, //3. kulvar
    ];
    if (this.character) {
      this.scaleFactor = this.ch / this.character.height * this.characterScaleConstant;
      this.character.setScale(this.scaleFactor);

      this.character.setPosition(this.positions[this.positionNumber].x,
        this.positions[this.positionNumber].y);

      this.pasiveVirusList.forEach(virus => {
        virus.setScale(this.scaleFactor);
        virus.setPosition(this.positions[this.positionNumber].x,
          this.positions[this.positionNumber].y);
      });

      this.activeVirusList.forEach(virus => {
        virus.setScale(this.scaleFactor);
        virus.y = this.positions[this.positionNumber].y;
      });



    }


  }

}