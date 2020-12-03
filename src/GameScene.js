import Phaser, { Scene } from 'phaser';
import { config } from './config';

class GameScene extends Scene {

  constructor() {
    super ('game')

    this.score = 0;
    this.gameOver = false;
    this.gameWin = false;
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
    this.load.spritesheet('exp','assets/exp.png', {
      frameWidth: 64, frameHeight: 64
    });
    this.load.audio('soundTrack', ['assets/audio/Patrol.mp3', 'assets/audio/Patrol.ogg']);
    this.load.audio('laser', 'assets/audio/laserfire.ogg');
    this.load.audio('explode', ['assets/audio/explode.ogg','assets/audio/explode.wav']);
    this.load.audio('ping', 'assets/audio/p-ping.mp3');
    }

  // ===============================================================
  // Create

  create() {

    this.background = this.add.tileSprite(0, 0, 900, 600, "background")
    .setOrigin(0);

    this.createSound();
    this.createShip();
    this.createAsteroid();
    this.createCursor();
    this.createPrism();
    this.createDiamond();
    this.makeAsteroids();
    // this.resetBullets();

    this.scoreText = this.add.text(16,16, 'score: 0', { fontSize: '32px', fill: 'white' });

    this.gameOverText = this.add.text(280, 300, 'Game Over Click to play again', {fontSize: '42px', fill: 'red'}).setOrigin(.25);
    this.gameOverText.visible = false;

  }

  // ===============================================================
  // Sound

  createSound(){

    this.soundTrack = this.sound.add('soundTrack');
    this.laser = this.sound.add('laser');
    this.explode = this.sound.add('explode');
    this.ping = this.sound.add('ping');

    this.explode.setVolume(.2);
    this.ping.setVolume(.5);

    this.soundTrack.play();
    this.soundTrack.loop = true;
    this.soundTrack.setVolume(.2);
  }

  // ===============================================================
  // Ship

  createShip(){
    this.ship = this.physics.add.sprite(450, 520, 'ship').setScale(.5);

    this.ship.setBounce(0.2);

    //Ship doesn't get past game bounderies
    this.ship.setCollideWorldBounds(true);

    const frameNames = this.anims.generateFrameNumbers('exp');

    //reverses the frameNumbers array in f2
    const f2 = frameNames.slice();
    f2.reverse();

    // adds the two arrays
    const f3 = f2.concat(frameNames);

    this.anims.create({
      key: 'boom',
      frames: f3,
      frameRate: 48,
      repeat: false
    });
    }

    //========================================================
    //Create start game asteroids

    createAsteroid(){

      this.asteroidGroup = this.physics.add.group({
        key:['asteroid'],
        frameQuantity: 5,
        angularVelocity: 12,
        bounceX: .5,
        bounceY: .5,
        CollideWorldBounds: true,
        setXY: { x: 9, y: 3, stepX:70 },
        setScale: { x: 0.1, y: 0.1 }
      });

      this.asteroidGroup1 = this.physics.add.group({
        key:['asteroid'],
        frameQuantity: 1,
        angularVelocity: 12,
        bounceX: .5,
        bounceY: .5,
        CollideWorldBounds: true,
        setXY: { x: 12, y: 3, stepX:70 },
        setScale: { x: 0.35, y: 0.35 }
      });

      this.asteroidGroup2 = this.physics.add.group({
        key:['asteroid'],
        frameQuantity: 3,
        angularVelocity: 20,
        bounceX: .5,
        bounceY: .5,
        CollideWorldBounds: true,
        setXY: { x: 12, y: 3, stepX:70 },
        setScale: { x: 0.25, y: 0.25 }
      });

      this.asteroidGroup.children.iterate(function (child) {
        var xx = Math.floor(Math.random() * 800);
        var yy = Math.floor(Math.random() * 300);

        child.x = xx;
        child.y = yy;

        child.setVelocityY(Phaser.Math.FloatBetween(80,20))
      })

      this.asteroidGroup1.children.iterate(function (child) {
        var xx = Math.floor(Math.random() * 800);
        var yy = Math.floor(Math.random() * 300);

        child.x = xx;
        child.y = yy;

        child.setVelocityY(Phaser.Math.FloatBetween(100,20))
      })

      this.asteroidGroup2.children.iterate(function (child) {
        var xx = Math.floor(Math.random() * 800);
        var yy = Math.floor(Math.random() * 300);

        child.x = xx;
        child.y = yy;

        child.setVelocityY(Phaser.Math.FloatBetween(100,20))
    })

    this.physics.add.collider(this.asteroidGroup);
    this.physics.add.collider(this.asteroidGroup, this.asteroidGroup1);
    this.physics.add.collider(this.asteroidGroup1, this.asteroidGroup2);
    this.physics.add.collider(this.asteroidGroup, this.asteroidGroup2);
    this.physics.add.collider(this.asteroidGroup,this.ship,this.shipHit1, null, this);
    this.physics.add.collider(this.asteroidGroup1,this.ship,this.shipHit2, null, this);
    this.physics.add.collider(this.asteroidGroup2,this.ship,this.shipHit3, null, this);
  }

  //========================================================
  //Once detroyed remake asteroids
  makeAsteroids(){

    if (this.asteroidGroup.getChildren().length === 0){
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

      this.asteroidGroup.children.iterate(function (child) {
        var xx = Math.floor(Math.random() * 800);
        var yy = Math.floor(Math.random() * -10);

        child.x = xx;
        child.y = yy;

        // child.setVelocityY(Phaser.Math.FloatBetween(80,20))
      })
    }

      if(this.asteroidGroup1.getChildren().length === 0){
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

        this.asteroidGroup1.children.iterate(function (child) {
          var xx = Math.floor(Math.random() * 800);
          var yy = Math.floor(Math.random() * -10);

          child.x = xx;
          child.y = yy;

          child.setVelocityY(Phaser.Math.FloatBetween(100,20))
        })
      }


      if(this.asteroidGroup2.getChildren().length === 0){
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
      }

      this.asteroidGroup2.children.iterate(function (child) {
        var xx = Math.floor(Math.random() * 800);
        var yy = Math.floor(Math.random() * -10);

        child.x = xx;
        child.y = yy;

        child.setVelocityY(Phaser.Math.FloatBetween(100,20))
      })

    this.physics.add.collider(this.asteroidGroup);
    this.physics.add.collider(this.asteroidGroup, this.asteroidGroup1);
    this.physics.add.collider(this.asteroidGroup1, this.asteroidGroup2);
    this.physics.add.collider(this.asteroidGroup, this.asteroidGroup2);
    this.physics.add.collider(this.asteroidGroup,this.ship,this.shipHit1, null, this);
    this.physics.add.collider(this.asteroidGroup1,this.ship,this.shipHit2, null, this);
    this.physics.add.collider(this.asteroidGroup2,this.ship,this.shipHit3, null, this);
  }

  shipHit1(asteroid, ship) {
      this.explosion = this.add.sprite(asteroid.x, asteroid.y, 'exp').setScale(.8);
      this.explosion.play('boom');

      this.explosion = this.add.sprite(ship.x, ship.y, 'exp').setScale(.8);
      this.explosion.play('boom');

      this.explode.play();

      this.physics.pause();
      this.soundTrack.pause();
      this.gameOver = true;
      this.gameOverText.visible = true
      this.input.on('pointerdown', () => this.scene.start('preload'))
  }

  shipHit2(asteroid, ship) {
      this.explosion = this.add.sprite(asteroid.x, asteroid.y, 'exp').setScale(2);
      this.explosion.play('boom');

      this.explosion = this.add.sprite(ship.x, ship.y, 'exp').setScale(2);
      this.explosion.play('boom');

      this.explode.play();

      this.physics.pause();
      this.soundTrack.pause();
      this.gameOver = true;
      this.gameOverText.visible = true
      this.input.on('pointerdown', () => this.scene.start('preload'))
  }

  shipHit3(asteroid, ship) {
      this.explosion = this.add.sprite(asteroid.x, asteroid.y, 'exp').setScale(1.2);
      this.explosion.play('boom');

      this.explosion = this.add.sprite(ship.x, ship.y, 'exp').setScale(1.2);
      this.explosion.play('boom');

      this.explode.play();

      this.physics.pause();
      this.soundTrack.pause();
      this.gameOver = true;
      this.gameOverText.visible = true
      this.input.on('pointerdown', () => this.scene.start('preload'))
  }
    createCursor() {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    // =======================================================
    // Create and collect Rubies
    createPrism(){

      this.prism = this.physics.add.sprite(Math.floor(Math.random() * 850), Math.floor(Math.random() * 550), 'prism').setScale(0.7);

          //rotating effect
        this.anims.create({
          key: 'prism',
          frames: this.anims.generateFrameNames('prism', { prefix: 'prism_', end: 15, zeroPad: 4 }),
          frameRate: 10,
          repeat: -1
        });

      this.prism.play('prism');

      this.physics.add.overlap(this.ship, this.prism, this.collectPrism, null, this);

    }

    createDiamond(){
      this.diamond = this.physics.add.sprite(Math.floor(Math.random() * 850), Math.floor(Math.random() * 550),'diamond').setScale(0.7);

      this.anims.create({
      key: 'diamond',
      frames: this.anims.generateFrameNames('diamond', { prefix: 'diamond_', end: 15, zeroPad: 4 }),
      frameRate: 10,
      repeat: -1
      });

      this.diamond.play('diamond');

      this.physics.add.overlap(this.ship, this.diamond, this.collectDiamond, null, this);
    }

    collectPrism(ship, prism) {
      prism.disableBody(true, true);
      this.ping.play();

      this.score += 10,
      this.scoreText.setText('Score: ' + this.score);
      this.prism = false;
    }

    collectDiamond(ship, diamond) {
      diamond.disableBody(true, true);
      this.ping.play();

      this.score += 60,
      this.scoreText.setText('Score: ' + this.score);
      this.diamond = false;
    }

    //===================================================================
    //Bullets
    createBullet(){

      this.bulletGroup = this.physics.add.group({
        key:'bullet',
        frameQuantity: 2,
        setRotation: { value: 300, step: 0.10 },
        CollideWorldBounds: true,
        setXY: { x: this.ship.x - 10, y: this.ship.y + -50, stepX:25 }
      });
      this.bulletGroup.setVelocityY(-160);

      this.bulletGroup.children.iterate(function (child) {

        if (child.y === 0){
          child.remove();
        }
      })

      this.physics.add.collider( this.bulletGroup,this.asteroidGroup, this.hit1, null, this);

      this.physics.add.collider( this.bulletGroup,this.asteroidGroup1, this.hit2, null, this);

      this.physics.add.collider( this.bulletGroup,this.asteroidGroup2, this.hit3, null, this);

      const frameNames = this.anims.generateFrameNumbers('exp');

      //reverses the frameNumbers array in f2
      const f2 = frameNames.slice();
      f2.reverse();

      // adds the two arrays
      const f3 = f2.concat(frameNames);

      this.anims.create({
        key: 'boom',
        frames: f3,
        frameRate: 48,
        repeat: false
      });

    }

    hit1(bullet, asteroid){
      bullet.destroy();
      this.explosion = this.add.sprite(asteroid.x, asteroid.y, 'exp').setScale(.8);
      this.explosion.play('boom');
      asteroid.destroy();
      this.explode.play();
      this.makeAsteroids();
    }

    hit2(bullet, asteroid){
      bullet.destroy();
      this.explosion = this.add.sprite(asteroid.x, asteroid.y, 'exp').setScale(2);
      this.explosion.play('boom');
      asteroid.destroy();
      this.explode.play();
      this.makeAsteroids();
    }

    hit3(bullet, asteroid){
      bullet.destroy();
      this.explosion = this.add.sprite(asteroid.x, asteroid.y, 'exp').setScale(1.3);
      this.explosion.play('boom');
      asteroid.destroy();
      this.explode.play();
      this.makeAsteroids();
    }

    // =====================================================
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

    //=================================
    //Player Controls
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
              this.createBullet();
              this.laser.play();


              // if (this.bulletGroup === this.config.x && this.bulletGroup === this.config.x )
              // this.bulletGroup.destroy();
          }

    //=================================
    //Calls the prism 5 seconds after it collected

          if (this.prism === false){
            this.time.addEvent({
            delay: 7000,
            callback: ()=>{

              this.prism = this.physics.add.sprite(Math.floor(Math.random() * 850), Math.floor(Math.random() * 550), 'prism').setScale(0.7);

                //rotating effect
              this.anims.create({
                key: 'prism',
                frames: this.anims.generateFrameNames('prism', { prefix: 'prism_', end: 15, zeroPad: 4 }),
                frameRate: 10,
                repeat: -1
              });

            this.prism.play('prism');

            this.physics.add.overlap(this.ship, this.prism, this.collectPrism, null, this);
            },
            loop: false
            })
            this.prism = true;
          }


          //=================================
          //Calls the diamond 5 seconds after it collected
          if (this.diamond === false){
            this.time.addEvent({
            delay: 20000,
            callback: ()=>{

              this.diamond = this.physics.add.sprite(Math.floor(Math.random() * 850), Math.floor(Math.random() * 550),'diamond').setScale(0.7);

              this.anims.create({
              key: 'diamond',
              frames: this.anims.generateFrameNames('diamond', { prefix: 'diamond_', end: 15, zeroPad: 4 }),
              frameRate: 10,
              repeat: -1
              });

              this.diamond.play('diamond');

              this.physics.add.overlap(this.ship, this.diamond, this.collectDiamond, null, this);
            },
            loop: false
            })
            this.diamond = true;
          }

        }
}

export default GameScene;
