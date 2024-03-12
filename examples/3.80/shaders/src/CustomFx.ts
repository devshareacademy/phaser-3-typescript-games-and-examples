const fragShader = `
#define SHADER_NAME HUE_ROTATE_FS

precision mediump float;

// uniform sampler2D uMainSampler;
uniform float uTime;
// uniform float uSpeed;

varying vec2 outTexCoord;

vec3 palette( float t ) {
  vec3 a = vec3(0.5, 0.5, 0.5);
  vec3 b = vec3(0.5, 0.5, 0.5);
  vec3 c = vec3(1.0, 1.0, 1.0);
  vec3 d = vec3(0.263,0.416,0.557);

  return a + b*cos( 6.28318*(c*t+d) );
}

void main()
{
  vec2 uv = outTexCoord;
  vec2 uv0 = uv;
  vec3 finalColor = vec3(0.0);

  for (float i = 0.0; i < 4.0; i++) {
    uv = fract(uv * 1.5) - 0.5;

    float d = length(uv) * exp(-length(uv0));

    vec3 col = palette(length(uv0) + i*.4 + uTime*.4);

    d = sin(d*8. + uTime)/8.;
    d = abs(d);

    d = pow(0.01 / d, 1.2);

    finalColor += col * d;
  }

  gl_FragColor = vec4(finalColor, 1.0);
    // float c = cos(uTime * uSpeed);
    // float s = sin(uTime * uSpeed);

    // mat4 r = mat4(0.299, 0.587, 0.114, 0.0, 0.299, 0.587, 0.114, 0.0, 0.299, 0.587, 0.114, 0.0, 0.0,  0.0, 0.0, 1.0);
    // mat4 g = mat4(0.701, -0.587, -0.114, 0.0, -0.299, 0.413, -0.114, 0.0, -0.300, -0.588, 0.886, 0.0, 0.0, 0.0, 0.0, 0.0);
    // mat4 b = mat4(0.168, 0.330, -0.497, 0.0, -0.328, 0.035, 0.292, 0.0, 1.250, -1.050, -0.203, 0.0, 0.0, 0.0, 0.0, 0.0);

    // mat4 hueRotation = r + g * c + b * s;

    // gl_FragColor = texture2D(uMainSampler, outTexCoord) * hueRotation;
}
`;

export default class CustomFx extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  constructor(game: Phaser.Game) {
    super({
      game,
      name: 'HueRotatePostFX',
      fragShader,
      uniforms: ['uMainSampler', 'uTime', 'uSpeed'],
    });

    this.speed = 1;
  }

  onPreRender() {
    this.setTime('uTime');
    this.set1f('uSpeed', this.speed);
  }
}
