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
  }
}
