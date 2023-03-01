export const HEALTH_EVENTS = {
  LOSE_HEALTH: 'LOSE_HEALTH',
} as const;

export const customEmitter = new Phaser.Events.EventEmitter();
