import Phaser from 'phaser';
import GameScene from './GameScene';
import PreloadScene from './PreloadScene';
import GameOver from './GameOver';

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 900,
    height: 600,
    scene: [PreloadScene, GameScene, GameOver],
    physics: {
      default: 'arcade',
      arcade: {
        // debug: true,
        gravity: {y: 0}
      }
    }
};

export { config };
