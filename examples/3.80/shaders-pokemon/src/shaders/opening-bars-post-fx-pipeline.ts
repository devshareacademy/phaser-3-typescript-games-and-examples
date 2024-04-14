import { CustomPipeline } from './custom-pipeline';

const frag = `
#define SHADER_NAME OPENING_BARS_POST_FX

#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uMainSampler;
// coordinate from the vertex shader
varying vec2 outTexCoord;
uniform float uCutoff;

void main() {
  // closing bars - next two lines of code
  // float dif = uCutoff / 2.0;
  // if ((outTexCoord.y >= 1.0 - dif) || (outTexCoord.y <= 0.0 + dif)) {



  float dif = (1.0 - uCutoff) / 2.0;
  if ((outTexCoord.y >= 1.0 - dif) || (outTexCoord.y <= 0.0 + dif)) {
  // if (abs(outTexCoord.y - 0.5) * 2.0 > (uCutoff)) {
    gl_FragColor = vec4(0, 0, 0, 1);
  } else {
    gl_FragColor = texture2D(uMainSampler, outTexCoord);
  }
}
`;

export class OpeningBarsPostFxPipeline extends CustomPipeline {
  constructor(game: Phaser.Game) {
    super(game, frag);
    this._progress = 1;
  }
}

/*
For this shader, we will need to do something a little more interesting to
calculate if a pixel should be rendered as a black color or the original texture color.

(show excalidraw)

so, if this represents our canvas, and the coordinates that are available to us
0 -> 1 for x, and 1 -> 0 for y, then we know the center will be (0.5, 0.5).

for our shader, we want the progress value, or cutoff, to represent how much of the screen
we should render out as black. for this, we want to do this in both halves of our screen.

(now on 3rd image)

to figure out what portions we actually need to color, we need to figure out how to take our Y
coordinate and see if this falls in the area we are looking to shade. as an example, if we want to shade 0.5,
then what this really means, is that for the top half of our screen, we want to shade 1/2 it, or 1/4 of our whole
screen.
likewise this would be the same for the bottom half. in terms of coordinates, this means from 1 -> 0.75, we would shade
and from 0.25 -> 0, we would shade and everything else would render out the same color.

- this is for closing bars
0.5 / 2 = .25, so, if we subtract from 1, we get 0.75, y > 0.75 color in
for the bottom, 0.0 + 0.25 = .25, y < .25, color in
if (y >= 1 - p/2) || (y <= 0 + p/2)) color black

- for open bars, we want
(1 - cutoff) / 2, so if progress is 0.75, subtract from 1, we get 0.25, now subtract that from 1 and get y > 0.75
for bottom, 0 + .25, y < .25 color in
*/
