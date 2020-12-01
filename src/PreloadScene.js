import { Scene } from 'phaser';
import { config } from './config';

var i = 0;
var hsv = [];

class PreloadScene extends Scene {
  constructor() {
    super('preload')
  }

  preload() {
    this.load.image('space', 'assets/SpaceBackground1.png');
    this.load.image('flare', 'assets/blue_flare.jpg');
    this.load.image('knighthawks', 'assets/font/knight3.png');
  }

  create() {
    const space = this.add.image(500, 250, 'space');
    const flare = this.add.image(430, 300, 'flare').alpha=.5;

    const play = this.add.text(399, 299, 'play').setScale(4);


    this.cache.bitmapFont.add('knighthawks', Phaser.GameObjects.RetroFont.Parse(this, config));

    // const text = this.add.dynamicBitmapText(0, 300, 'knighthawks', 'Space Battles').setScale(4);

    // text.setDisplayCallback(textCallback());


    this.input.on('pointerdown', () => this.scene.start('game'))
  }

  //   textCallback(data) {
  //
  //   data.tint.topLeft = hsv[Math.floor(i)].color;
  //   data.tint.topRight = hsv[359 - Math.floor(i)].color;
  //   data.tint.bottomLeft = hsv[359 - Math.floor(i)].color;
  //   data.tint.bottomRight = hsv[Math.floor(i)].color;
  //
  // }
}

export default PreloadScene;
