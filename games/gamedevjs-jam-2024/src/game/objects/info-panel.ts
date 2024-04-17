import { IMAGE_ASSET_KEYS } from '../assets/asset-keys';

type InfoPanelConfig = {
  scene: Phaser.Scene;
};

export class InfoPanel {
  #scene: Phaser.Scene;
  #container: Phaser.GameObjects.Container;

  constructor(config: InfoPanelConfig) {
    this.#scene = config.scene;
    this.#container = this.#scene.add.container(config.scene.scale.width / 2, config.scene.scale.height / 2);
    const panel = this.#scene.add
      .nineslice(0, 0, IMAGE_ASSET_KEYS.INFO_PANEL, 0, 600, 350, 100, 100, 100, 100)
      .setScale(0.5);
    this.#container.add(panel);
    this.hide();
  }

  public show(): void {
    this.#container.setAlpha(1);
  }

  public hide(): void {
    this.#container.setAlpha(0);
  }

  public updateContent(gameObjects: Phaser.GameObjects.GameObject[]): void {
    this.#container.removeBetween(1, this.#container.list.length, true);
    this.#container.add(gameObjects);
  }

  public getInfoPanelTextStyle(): Phaser.Types.GameObjects.Text.TextStyle {
    return {
      fontFamily: "'Orbitron', sans-serif",
      fontSize: '12px',
      resolution: 20,
      wordWrap: {
        width: 175,
      },
      color: '#ffffff',
    };
  }
}
