export const frag = `#version 300 es
precision mediump float;

uniform vec2 resolution;
uniform sampler2D iChannel0;
in vec2 fragCoord;

uniform sampler2D uMainSampler;
in vec2 outTexCoord;
out vec4 fragColor;
#define radius 0.4
#define times 5
#define percent 0.5

void main ()
{

  vec2 uv = (fragCoord.xy - 0.5f * resolution.xy) / resolution.y;
  vec2 cv = vec2(radius, 0.0f);
  float distance = length(uv);
  vec3 cs = cross(vec3(uv, 0.0f), vec3(cv, 0.0f));
  // float rd = ;
  float angle = degrees(acos((dot(uv, cv)) / (length(cv) * distance)));
  if(cs.z < 0.0) {
      angle = 360.0f - angle;
  }
  if(abs(distance - radius) < dFdx(uv.x)) {
    float color = 0.0f;
    float m = mod(angle, float(times)) / float(times);
    color = step(percent, m);
    fragColor = vec4(color);
  }
}
`;

export const vtx = `#version 300 es
precision mediump float;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform vec2 uResolution;
in vec2 inPosition;
out vec2 fragCoord;
out vec2 outTexCoord;
void main () {
  gl_Position = uProjectionMatrix * uViewMatrix * vec4(inPosition, 1.0, 1.0);
  fragCoord = vec2(inPosition.x, uResolution.y - inPosition.y);
  outTexCoord = vec2(inPosition.x / uResolution.x, fragCoord.y / uResolution.y);
}
`;
