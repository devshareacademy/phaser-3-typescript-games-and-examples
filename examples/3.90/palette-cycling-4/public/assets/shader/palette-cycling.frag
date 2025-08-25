#pragma phaserTemplate(shaderName)

precision mediump float;

uniform sampler2D iChannel0;
uniform float uCycleSpeed;
varying vec2 outTexCoord;

uniform sampler2D uPaletteSampler;
uniform sampler2D uGreyScaleSampler;
uniform float uTime;
uniform float uPaletteWidth;

void main(void) {
  vec4 mainColor = texture2D(iChannel0, outTexCoord);
  if (mainColor.a == 0.0) {
    discard;
  }

  vec4 greyScaleColor = texture2D(uGreyScaleSampler, outTexCoord);

  float index = greyScaleColor.r;
  float animatedIndex = (index * uPaletteWidth) + (uTime * uCycleSpeed);
  float wrappedIndex = mod(animatedIndex, uPaletteWidth);
  float paletteCoordinate = wrappedIndex / uPaletteWidth;
  vec4 finalColor = texture2D(uPaletteSampler, vec2(paletteCoordinate, 0.5));
  gl_FragColor = vec4(finalColor.rgb, 1.0);
}
