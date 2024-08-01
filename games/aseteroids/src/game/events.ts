export const CUSTOM_EVENTS = {
  PLAYER_DIE: 'PLAYER_DIE',
  GAME_OVER: 'GAME_OVER',
} as const;

export const eventBus = new Phaser.Events.EventEmitter();
