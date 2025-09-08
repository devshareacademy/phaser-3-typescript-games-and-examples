import { ASSET_KEYS, SCENE_KEYS } from '../common';

export class LoadingScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.LOADING_SCENE });
  }

  preload(): void {
    this.load.image(ASSET_KEYS.ROAD, 'assets/images/track/road.png');
    this.load.image(ASSET_KEYS.GRASS, 'assets/images/track/grass.png');
  }

  create(): void {
    // Create a simple car texture
    this.make.graphics({ width: 20, height: 40 })
      .fillStyle(0xff0000)
      .fillRect(0, 0, 20, 40)
      .generateTexture(ASSET_KEYS.CAR, 20, 40);

    this.scene.start(SCENE_KEYS.GAME_SCENE);
  }
}
