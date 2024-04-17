type DialogConfig = {
  scene: Phaser.Scene;
  x: number;
  y: number;
  uiBackGroundAssetKey: string;
  uiProfileAssetKey: string;
};

export class Dialog {
  #scene: Phaser.Scene;
  #container: Phaser.GameObjects.Container;
  #backgroundAssetKey: string;
  #backgroundProfileAssetKey: string;
  #dialogText: Phaser.GameObjects.Text;

  constructor(config: DialogConfig) {
    this.#scene = config.scene;
    this.#backgroundAssetKey = config.uiBackGroundAssetKey;
    this.#backgroundProfileAssetKey = config.uiProfileAssetKey;
    this.#container = this.#scene.add.container(config.x, config.y, []);
    this.#createUi();
    const profilePic = this.#scene.add.image(15, 0, this.#backgroundProfileAssetKey, 0).setScale(0.4).setOrigin(0, 0.2);
    this.#dialogText = this.#scene.add.text(10, 32, '', {
      fontFamily: "'Orbitron', sans-serif",
      fontSize: '12px',
      resolution: 20,
      wordWrap: {
        width: 190,
      },
      color: '#ffffff',
    });
    this.#container.add([profilePic, this.#dialogText]);
    this.#container.setAlpha(0);
  }

  public setPosition(x: number, y: number): void {
    this.#container.setPosition(x, y);
  }

  public async showDialog(text: string): Promise<void> {
    return new Promise((resolve) => {
      this.#container.setAlpha(1);
      this.#dialogText.setText(text);
      resolve();
    });
  }

  public hide(): void {
    this.#container.setAlpha(0);
  }

  #createUi(): void {
    const background = this.#scene.add.image(0, 0, this.#backgroundAssetKey, 0).setScale(0.2).setOrigin(0);
    this.#container.add(background);
  }
}
