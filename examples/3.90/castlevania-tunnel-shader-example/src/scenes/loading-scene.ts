import { ASSET_KEYS, SCENE_KEYS } from '../common';

export class LoadingScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEYS.LOADING_SCENE });
  }

  preload(): void {
    // this.load.image(ASSET_KEYS.GRID, 'assets/images/shader/grid.png');
    // this.load.image(ASSET_KEYS.TUNNEL, 'assets/images/shader/tunnel.png');

    this.load.setBaseURL("https://devshareacademy.github.io/static-cdn/images/misc/castlevania-tunnel-example");
    this.load.image(ASSET_KEYS.GRID, 'grid.png');
    this.load.image(ASSET_KEYS.TUNNEL, 'tunnel.png');
  }

  create(): void {
    this.scene.start(SCENE_KEYS.GAME_SCENE);
  }
}
