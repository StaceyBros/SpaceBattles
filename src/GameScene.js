import Phaser, { Scene } from 'phaser';
import { config } from './config';

class GameScene extends Scene {

  constructor() {
    super ('game')

    this.score = 0;
  }
  // ===============================================================
  // Preload
  preload(){
    this.load.image('background', 'assets/space2.jpg');
    this.load.image('ship', 'assets/8B.png');
    this.load.image('asteroid', 'assets/asteroid.png');
    this.load.atlas('diamond', 'assets/gems.png', 'assets/gems.json');
    this.load.atlas('prism', 'assets/gems.png', 'assets/gems.json');
    this.load.image('bullet', 'assets/bullet.png');
    }

  // ===============================================================
  // Create

  create() {

    this.background = this.add.tileSprite(0, 0, 900, 600, "background")
    .setOrigin(0);

    this.createShip();
    this.createAsteroid();
    this.createCursor();
    this.createRubies();


    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.scoreText = this.add.text(16,16, 'score: 0', { fontSize: '32px', fill: 'white' });
  }

  createShip(){
    this.ship = this.physics.add.sprite(450, 520, 'ship').setScale(.5);

    this.ship.setBounce(0.2);

    //Ship doesn't get past game bounderies
    this.ship.setCollideWorldBounds(true);
    }

    createAsteroid(){

      this.asteroidGroup = this.physics.add.group({
        key:['asteroid'],
        frameQuantity: 5,
        angularVelocity: 12,
        bounceX: .5,
        bounceY: .5,
        CollideWorldBounds: true,
        setXY: { x: 9, y: 1, stepX:70 },
        setScale: { x: 0.1, y: 0.1 }
      });

      this.asteroidGroup1 = this.physics.add.group({
        key:['asteroid'],
        frameQuantity: 1,
        angularVelocity: 12,
        bounceX: .5,
        bounceY: .5,
        CollideWorldBounds: true,
        setXY: { x: 12, y: 1, stepX:70 },
        setScale: { x: 0.35, y: 0.35 }
      });

      this.asteroidGroup2 = this.physics.add.group({
        key:['asteroid'],
        frameQuantity: 3,
        angularVelocity: 20,
        bounceX: .5,
        bounceY: .5,
        CollideWorldBounds: true,
        setXY: { x: 12, y: 1, stepX:70 },
        setScale: { x: 0.25, y: 0.25 }
      });

      this.asteroidGroup.children.iterate(function (child) {
        var xx = Math.floor(Math.random() * 800);
        var yy = Math.floor(Math.random() * 500);

        child.x = xx;
        child.y = yy;

        child.setVelocityY(Phaser.Math.FloatBetween(80,20))
      })

      this.asteroidGroup1.children.iterate(function (child) {
        var xx = Math.floor(Math.random() * 800);
        var yy = Math.floor(Math.random() * 500);

        child.x = xx;
        child.y = yy;

        child.setVelocityY(Phaser.Math.FloatBetween(100,20))
      })

      this.asteroidGroup2.children.iterate(function (child) {
        var xx = Math.floor(Math.random() * 800);
        var yy = Math.floor(Math.random() * 500);

        child.x = xx;
        child.y = yy;

        child.setVelocityY(Phaser.Math.FloatBetween(100,20))
    })



    this.physics.add.collider(this.asteroidGroup);
    this.physics.add.collider(this.asteroidGroup, this.asteroidGroup1);
    this.physics.add.collider(this.asteroidGroup1, this.asteroidGroup2);
    this.physics.add.collider(this.asteroidGroup, this.asteroidGroup2);
    this.physics.add.collider(this.ship, this.asteroidGroup);
    this.physics.add.collider(this.ship, this.asteroidGroup1);
    this.physics.add.collider(this.ship, this.asteroidGroup2);

  }

    createCursor() {
      this.cursors = this.input.keyboard.createCursorKeys();
    }

    createRubies(){

      this.diamond = this.physics.add.sprite(300, 100, 'diamond').setScale(0.7);
      this.prism = this.physics.add.sprite(500, 200, 'prism').setScale(0.7);

        //rotating effect
        this.anims.create({
        key: 'diamond',
        frames: this.anims.generateFrameNames('diamond', { prefix: 'diamond_', end: 15, zeroPad: 4 }),
        frameRate: 10,
        repeat: -1
      });

      this.anims.create({
        key: 'prism',
        frames: this.anims.generateFrameNames('prism', { prefix: 'prism_', end: 15, zeroPad: 4 }),
        frameRate: 10,
        repeat: -1
      });

    this.diamond.play('diamond');
    this.prism.play('prism');

    this.physics.add.overlap(this.ship, this.prism, this.collectPrism, null, this);

    this.physics.add.overlap(this.ship, this.diamond, this.collectDiamond, null, this);
    }

    collectPrism(ship, prism) {
      prism.disableBody(true, true);

      this.score += 10,
      this.scoreText.setText('Score: ' + this.score);
    }

    collectDiamond(ship, diamond) {
      diamond.disableBody(true, true);

      this.score += 50,
      this.scoreText.setText('Score: ' + this.score);
    }

    createBullet(){

      this.bulletGroup = this.physics.add.group({
        key:'bullet',
        frameQuantity: 2,
        // active: false,
        // visible: false,
        setRotation: { value: 300, step: 0.10 },
        CollideWorldBounds: true,
        setXY: { x: this.ship.x - 10, y: this.ship.y + -50, stepX:25 }
      });
      this.bulletGroup.setVelocityY(-160);
    }

    // shootLaser(){
    //   this.bulletGroup.fireLaser();
    // }
    //
    // fireLaser() {
    //   const laser = this.getFirstDead(false);
    //     if (laser){
    //       laser.fire();
    //     }
    // }
    //
    // fire() {
    //   this.setActive(true);
    //   this.setVisible(true);
    //
    //   this.bulletGroup.setVelocityY(-160);
    // }


    // ===============================================================
    // Update

    update() {
      // scrolls space tile
      this.background.tilePositionY -= .5;

      //Wraps groups so that they continualy scroll through
      this.physics.world.wrap(this.asteroidGroup,32);
      this.physics.world.wrap(this.asteroidGroup1,32);
      this.physics.world.wrap(this.asteroidGroup2,32);

      // cursor controls
      this.ship.setVelocity(0);

        if (this.cursors.left.isDown) {
          this.ship.setVelocityX(-160);
        }
          else if (this.cursors.right.isDown) {
          this.ship.setVelocityX(160);
        }

        if (this.cursors.up.isDown) {
          this.ship.setVelocityY(-160);
        }
          else if (this.cursors.down.isDown) {
          this.ship.setVelocityY(160);
        }

        if(this.keySpace.isDown){
            let count = 0;
            if (count === 0){
              this.createBullet();
              return count = 1;
              console.log(count);
            } else if (count === 1){
              return count = 0;
              console.log(count);
            }
          }
        }
}

export default GameScene;
