import { HEALTH_EVENTS } from './events';

export default class Health {
  #customEventEmitter: Phaser.Events.EventEmitter;
  #currentHealth: number;
  #maxHealth: number;

  constructor(customEventEmitter: Phaser.Events.EventEmitter) {
    this.#currentHealth = 6;
    this.#maxHealth = 6;
    this.#customEventEmitter = customEventEmitter;
  }

  get maxHealth(): number {
    return this.#maxHealth;
  }

  get currentHealth(): number {
    return this.#currentHealth;
  }

  public loseHealth(): void {
    if (this.#currentHealth === 0) {
      return;
    }

    this.#currentHealth -= 1;
    // emit event with health now and previous health value
    this.#customEventEmitter.emit(HEALTH_EVENTS.LOSE_HEALTH, this.#currentHealth, this.#currentHealth + 1);
  }
}
