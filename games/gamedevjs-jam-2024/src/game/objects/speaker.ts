import { SPRITE_SHEET_ASSET_KEYS } from '../assets/asset-keys';
import GameScene from '../scenes/game-scene';

type SpeakerConfig = {
  scene: GameScene;
  x: number;
  y: number;
  flipX: boolean;
  startingEnergy: number;
  id: number;
};

export class Speaker {
  #scene: GameScene;
  #sprite: Phaser.GameObjects.Sprite;
  #energyLevel: number;
  #maxEnergy: number;
  #id: number;

  constructor(config: SpeakerConfig) {
    this.#id = config.id;
    this.#scene = config.scene;
    this.#maxEnergy = 3;
    this.#energyLevel = config.startingEnergy;
    this.#sprite = config.scene.add
      .sprite(config.x, config.y, SPRITE_SHEET_ASSET_KEYS.SPEAKER, 0)
      .setFlipX(config.flipX)
      .setOrigin(0, 1)
      .setInteractive();

    this.#sprite.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.#handlePlayerClick();
    });
  }

  get sprite(): Phaser.GameObjects.Sprite {
    return this.#sprite;
  }

  get currentEnergy(): number {
    return this.#energyLevel;
  }

  #handlePlayerClick(): void {
    console.log(`speaker ${this.#id} click`);

    if (this.#scene.currentEnergy === 0 && this.#energyLevel === 0) {
      return;
    }
    // if we are below max energy, and there is available energy, bump usage here
    if (this.#energyLevel < this.#maxEnergy && this.#scene.currentEnergy > 0) {
      this.#energyLevel += 1;
      this.#scene.updateEnergy(-1);
    } else {
      // if we are below or at max, then take energy from here and move to global store
      this.#scene.updateEnergy(this.#energyLevel);
      this.#energyLevel = 0;
    }

    // TODO: animate
  }
}
