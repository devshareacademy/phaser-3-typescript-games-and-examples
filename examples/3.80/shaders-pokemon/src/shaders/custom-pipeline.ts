export abstract class CustomPipeline extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  protected _progress: number;

  constructor(game: Phaser.Game, fragShader: string) {
    super({
      game,
      fragShader,
    });
    this._progress = 0;
  }

  get progress(): number {
    return this._progress;
  }

  set progress(val: number) {
    this._progress = val;
  }

  onPreRender() {
    this.set1f('uCutoff', this._progress);
  }
}
