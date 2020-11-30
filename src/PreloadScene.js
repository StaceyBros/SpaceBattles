// import { Scene } from 'phaser';
//
// var i = 0;
// var hsv = [];
//
// class PreloadScene extends Scene {
//   constructor() {
//     super('preload')
//   }
//
//   preload() {
//     this.load.image('space', 'assets/SpaceBackground1.png');
//     this.load.image('flare', 'assets/blue_flare.jpg');
//     this.load.image('knighthawks', 'assets/font/knight3.png');
//   }
//
//   create() {
//     const space = this.add.image(500, 250, 'space');
//     const flare = this.add.image(430, 300, 'flare').alpha=.5;
//
//     const play = this.add.text(350, 260, 'play').setScale(4);
//
//     this.input.on('pointerdown', () => this.scene.start('game'))
//   }
//
// }
//
//
// export default PreloadScene;
