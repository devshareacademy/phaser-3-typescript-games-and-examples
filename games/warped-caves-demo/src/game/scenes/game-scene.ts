import Phaser from 'phaser';
import { SceneKeys } from './scene-keys';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: SceneKeys.GameScene });
  }

  preload(): void {
    // load in data
  }

  create(): void {
    // Create game objects
    this.add.text(this.scale.width/2,this.scale.height/2,'Hello World', {
      fontSize: '32px'
    }).setOrigin(0.5);
  }
}
