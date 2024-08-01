import * as Phaser from 'phaser';
import { SceneKeys } from './scene-keys';
import { IMAGE_ASSET_KEYS } from '../assets/asset-keys';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: SceneKeys.PreloadScene });
  }

  preload(): void {
    // load in game assets
    this.load.setBaseURL('assets/images');
    this.load.image(IMAGE_ASSET_KEYS.SHIP, 'ship.png');
    this.load.image(IMAGE_ASSET_KEYS.BULLET, 'bullet.png');
    this.load.image(IMAGE_ASSET_KEYS.ASTEROID_SM, 'asteroid_small.png');
    this.load.image(IMAGE_ASSET_KEYS.ASTEROID_MED, 'asteroid_medium.png');
    this.load.image(IMAGE_ASSET_KEYS.ASTEROID_LG, 'asteroid_large.png');
  }

  create(): void {
    // transition to next scene
    this.scene.start(SceneKeys.GameScene);
  }
}
