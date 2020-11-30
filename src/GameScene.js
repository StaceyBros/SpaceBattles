import { Scene } from 'phaser';

class GameScene extends Scene {

  constructor() {
    super ('game')
  }

  preload(){
    this.load.image('space', 'assets/SpaceBackground1.png');
    this.load.image('ship', 'assets/8B.png');
  }
  create() {
    const space = this.add.image(500, 250, 'space');
    const ship = this.add.image(450, 520, 'ship').setScale(.6);
    const score = this.add.text(30, 30, 'score');

    // this.tweens.add({
    //     targets: space,
    //     y: 400,
    //     duration: 2000,
    //     ease: 'Power5',
    //     // yoyo: true,
    //     loop: -1
    // });
  }
}

export default GameScene;
