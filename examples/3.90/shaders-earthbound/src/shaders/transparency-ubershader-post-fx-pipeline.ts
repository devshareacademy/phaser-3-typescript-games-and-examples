import * as Phaser from 'phaser';

export const enum UbershaderEffect {
  NONE = 0,
  HORIZONTAL_OSCILLATION = 1,
  VERTICAL_OSCILLATION = 2,
  INTERLEAVED_OSCILLATION = 3,
}

const fragShader = `
precision mediump float;

varying vec2 outTexCoord;

// --- UNIFORMS ---
uniform sampler2D uTextureA; // Main texture (foreground)
uniform sampler2D uTextureB; // Secondary texture (background)
uniform float uTime;
uniform float uAlpha;

// Effect A
uniform int uEffectA;
uniform vec4 uParamsA; // x=speed, y=amplitude, z=frequency, w=speedY
uniform vec4 uParamsA2; // x=amplitudeY, y=frequencyY

// Effect B
uniform int uEffectB;
uniform vec4 uParamsB;
uniform vec4 uParamsB2;

// --- EFFECT FUNCTIONS ---

vec2 applyHorizontalWave(vec2 uv, float time, vec4 params) {
    float speed = params.x;
    float amplitude = params.y;
    float frequency = params.z;
    float wave = sin(uv.y * frequency + time * speed);
    float offset = wave * amplitude;
    return vec2(uv.x + offset, uv.y);
}

vec2 applyVerticalWave(vec2 uv, float time, vec4 params) {
    float speed = params.x;
    float amplitude = params.y;
    float frequency = params.z;
    float wave = sin(uv.x * frequency + time * speed);
    float offset = wave * amplitude;
    return vec2(uv.x, uv.y + offset);
}

vec2 applyInterleavedWave(vec2 uv, float time, vec4 params, vec4 params2) {
    // Horizontal part
    float speedX = params.x;
    float amplitudeX = params.y;
    float frequencyX = params.z;
    float waveX = sin(uv.y * frequencyX + time * speedX);
    float offsetX = waveX * amplitudeX;

    // Vertical part
    float speedY = params.w;
    float amplitudeY = params2.x;
    float frequencyY = params2.y;
    float waveY = sin(uv.x * frequencyY + time * speedY);
    float offsetY = waveY * amplitudeY;

    return vec2(uv.x + offsetX, uv.y + offsetY);
}

vec2 applyEffect(vec2 uv, int effect, float time, vec4 params, vec4 params2) {
    if (effect == 1) {
        return applyHorizontalWave(uv, time, params);
    } else if (effect == 2) {
        return applyVerticalWave(uv, time, params);
    } else if (effect == 3) {
        return applyInterleavedWave(uv, time, params, params2);
    }
    return uv; // No effect
}

// --- MAIN ---

void main() {
    vec2 originalCoords = outTexCoord;

    vec2 coordsA = applyEffect(originalCoords, uEffectA, uTime, uParamsA, uParamsA2);
    vec2 coordsB = applyEffect(originalCoords, uEffectB, uTime, uParamsB, uParamsB2);

    vec4 colorA = texture2D(uTextureA, coordsA);
    vec4 colorB = texture2D(uTextureB, coordsB);

    gl_FragColor = mix(colorB, colorA, uAlpha);
}
`;

export class UbershaderPostFxPipeline extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  // --- Public Properties ---
  alpha: number = 0.5;

  // Layer A
  effectA: UbershaderEffect = UbershaderEffect.NONE;
  paramsA: Phaser.Math.Vector4 = new Phaser.Math.Vector4(5, 0.01, 25, 5); // speedX, ampX, freqX, speedY
  paramsA2: Phaser.Math.Vector4 = new Phaser.Math.Vector4(0.01, 25, 0, 0); // ampY, freqY

  // Layer B
  effectB: UbershaderEffect = UbershaderEffect.NONE;
  paramsB: Phaser.Math.Vector4 = new Phaser.Math.Vector4(5, 0.01, 25, 5);
  paramsB2: Phaser.Math.Vector4 = new Phaser.Math.Vector4(0.01, 25, 0, 0);

  private secondaryTexture: Phaser.Renderer.WebGL.Wrappers.WebGLTextureWrapper | null = null;

  constructor(game: Phaser.Game) {
    super({
      game,
      fragShader,
      name: 'UbershaderPostFxPipeline',
    });
  }

  setSecondaryTexture(textureKey: string): void {
    console.log(textureKey);
    this.secondaryTexture = this.game.textures.getFrame(textureKey).glTexture;
  }

  onPreRender(): void {
    this.set1f('uTime', this.game.loop.time / 1000);
    this.set1f('uAlpha', this.alpha);

    // Layer A Uniforms
    this.set1i('uEffectA', this.effectA);
    this.set4f('uParamsA', this.paramsA.x, this.paramsA.y, this.paramsA.z, this.paramsA.w);
    this.set4f('uParamsA2', this.paramsA2.x, this.paramsA2.y, this.paramsA2.z, this.paramsA2.w);

    // Layer B Uniforms
    this.set1i('uEffectB', this.effectB);
    this.set4f('uParamsB', this.paramsB.x, this.paramsB.y, this.paramsB.z, this.paramsB.w);
    this.set4f('uParamsB2', this.paramsB2.x, this.paramsB2.y, this.paramsB2.z, this.paramsB2.w);

    if (this.secondaryTexture) {
      this.set1i('uTextureB', 1);
    }
  }

  onDraw(renderTarget: Phaser.Renderer.WebGL.RenderTarget) {
    if (this.secondaryTexture) {
      this.bindTexture(this.secondaryTexture, 1);
    }
    this.bindAndDraw(renderTarget);
  }
}
