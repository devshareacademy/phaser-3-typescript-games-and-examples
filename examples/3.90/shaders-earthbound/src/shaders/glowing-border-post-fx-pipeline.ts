const fragShader = `
#define SHADER_NAME OUTLINE_POST_FX
#define MAX_THICKNESS 10

precision mediump float;

uniform sampler2D uMainSampler;
uniform vec2 uResolution;
uniform float uThickness;
uniform vec3 uOutlineColor;

varying vec2 outTexCoord;

void main() {
    vec4 originalColor = texture2D(uMainSampler, outTexCoord);

    vec2 onePixel = vec2(1.0 / uResolution.x, 1.0 / uResolution.y);

    float maxAlpha = 0.0;

    // Use a constant loop range
    for (int x = -MAX_THICKNESS; x <= MAX_THICKNESS; x++) {
        for (int y = -MAX_THICKNESS; y <= MAX_THICKNESS; y++) {
            // Check against the uniform thickness inside the loop
            if (abs(float(x)) > uThickness || abs(float(y)) > uThickness) {
                continue;
            }

            // Do not sample the center pixel
            if (x == 0 && y == 0) {
                continue;
            }
            vec2 sampleCoord = outTexCoord + vec2(float(x) * onePixel.x, float(y) * onePixel.y);
            maxAlpha = max(maxAlpha, texture2D(uMainSampler, sampleCoord).a);
        }
    }

    // If original pixel is transparent but a neighbor has alpha, we are on an edge
    if (originalColor.a < 0.1 && maxAlpha > 0.1) {
        gl_FragColor = vec4(uOutlineColor, maxAlpha);
    } else {
        gl_FragColor = originalColor;
    }
}
`;

// Renaming for clarity
export class OutlinePostFxPipeline extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  private _thickness: number = 2;
  private _color: Phaser.Display.Color = new Phaser.Display.Color(255, 255, 0);

  constructor(game: Phaser.Game) {
    super({
      game,
      fragShader,
    });
  }

  onPreRender() {
    this.set1f('uThickness', this._thickness);
    this.set3fv('uOutlineColor', [this._color.redGL, this._color.greenGL, this._color.blueGL]);
    // uResolution is set automatically by Phaser for PostFX Pipelines
  }

  get thickness(): number {
    return this._thickness;
  }
  set thickness(value: number) {
    this._thickness = value;
  }

  get color(): Phaser.Display.Color {
    return this._color;
  }
  set color(value: Phaser.Display.Color) {
    this._color = value;
  }
}

// https://penzilla.itch.io/free-animated-protagonist
// https://penzilla.itch.io/basic-gui-bundle
// https://free-game-assets.itch.io/free-scrolling-desert-backgrounds
