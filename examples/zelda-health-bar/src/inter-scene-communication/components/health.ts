import { HEALTH_EVENTS, customEmitter } from './events';

class Health {
  #currentHealth: number;
  #maxHealth: number;

  constructor() {
    this.#currentHealth = 6;
    this.#maxHealth = 6;
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
    customEmitter.emit(HEALTH_EVENTS.LOSE_HEALTH, this.#currentHealth, this.#currentHealth + 1);
  }
}

export const health = new Health();
