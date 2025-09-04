import { ASSET_KEYS, SCENE_KEYS } from '../common';

export class LoadingScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.LOADING_SCENE });
  }

  preload(): void {
    this.load.image(ASSET_KEYS.GRID, 'assets/images/shader/grid.png');
    this.load.image(ASSET_KEYS.TUNNEL, 'assets/images/shader/tunnel.png');
  }

  create(): void {
    this.scene.start(SCENE_KEYS.GAME_SCENE);
  }
}
