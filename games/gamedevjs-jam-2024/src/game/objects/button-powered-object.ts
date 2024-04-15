export interface ButtonPoweredObject {
  powerLevelChanged(powerLevel: number): void;
  setInitialPowerLevel(powerLevel: number): void;
}
