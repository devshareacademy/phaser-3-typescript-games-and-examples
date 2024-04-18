import { SPRITE_SHEET_ASSET_KEYS } from '../assets/asset-keys';
import GameScene from '../scenes/game-scene';
import { ButtonPoweredObject } from './button-powered-object';

type ButtonConfig = {
  scene: GameScene;
  x: number;
  y: number;
  flipX: boolean;
  startingEnergy: number;
  id: number;
  connectedObject: ButtonPoweredObject;
  maxEnergy: number;
};

export class Button {
  #scene: GameScene;
  #sprite: Phaser.GameObjects.Sprite;
  #energyLevel: number;
  #maxEnergy: number;
  #id: number;
  #connectedObject: ButtonPoweredObject;
  #inTutorial: boolean;

  constructor(config: ButtonConfig) {
    this.#inTutorial = false;
    this.#id = config.id;
    this.#scene = config.scene;
    this.#maxEnergy = config.maxEnergy;
    this.#energyLevel = config.startingEnergy;
    this.#connectedObject = config.connectedObject;
    this.#sprite = config.scene.add
      .sprite(config.x, config.y, SPRITE_SHEET_ASSET_KEYS.BUTTON, 0)
      .setFlipX(config.flipX)
      .setOrigin(0, 1)
      .setInteractive();
    this.#setTexture();

    this.#sprite.on(Phaser.Input.Events.POINTER_DOWN, () => {
      this.handlePlayerClick();
    });
    this.#connectedObject.setInitialPowerLevel(this.#energyLevel);
  }

  get sprite(): Phaser.GameObjects.Sprite {
    return this.#sprite;
  }

  get currentEnergy(): number {
    return this.#energyLevel;
  }

  set inTutorial(val: boolean) {
    this.#inTutorial = val;
  }

  public handlePlayerClick(): void {
    if (this.#inTutorial) {
      return;
    }
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

    this.#setTexture();
    this.#connectedObject.powerLevelChanged(this.#energyLevel);
  }

  #setTexture(): void {
    if (this.#energyLevel === 0) {
      this.#sprite.setAlpha(0.25);
      return;
    }
    if (this.#energyLevel === 1) {
      this.#sprite.setAlpha(0.5);
      return;
    }
    if (this.#energyLevel === 2) {
      this.#sprite.setAlpha(0.75);
      return;
    }
    this.#sprite.setAlpha(1);
  }
}
