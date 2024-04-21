import { IMAGE_ASSET_KEYS } from '../assets/asset-keys';
import { SceneKeys } from './scene-keys';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: SceneKeys.BootScene });
  }

  public preload(): void {
    this.load.image(IMAGE_ASSET_KEYS.PHASER_LOGO, '/assets/images/phaser-logo.png');
  }

  public create(): void {
    this.scene.start(SceneKeys.PreloadScene);
  }
}
