# Transparency Uber-Shader Design

This document outlines the design for a single, portable "uber-shader". This shader will contain the logic for multiple distortion effects and will be capable of applying a chosen effect to two separate textures, then blending the results with transparency.

## Core Concept

Instead of using multiple shaders and rendering passes, the uber-shader consolidates all logic into a single, highly-configurable fragment shader. This provides a portable, self-contained solution for creating complex, layered visual effects.

1.  **Consolidated Effects:** The GLSL code will contain functions for each of our distortion effects (e.g., `applyHorizontalWave`, `applyVerticalWave`, `applyInterleavedWave`).

2.  **Effect Selection via Uniforms:** The shader will accept integer uniforms that act as "switches." These integers tell the shader which effect function to execute for each of the two input textures.

3.  **Parameterized Effects:** The specific parameters for each effect (e.g., speed, amplitude, frequency) will also be passed in as uniforms, allowing for fine-grained control over the active effects.

4.  **Two-Texture Blending:** The shader takes two different textures as input. After applying the selected distortion to each, it samples the resulting colors and blends them together using GLSL's `mix()` function, controlled by a final `alpha` uniform.

This design results in a single, powerful shader that can be controlled entirely through its inputs, making it highly reusable.

## Required Assets

-   At least two images to be used as the two input textures (`textureA`, `textureB`).

## Shader Implementation (GLSL)

The GLSL fragment shader will be structured with helper functions and a main function that orchestrates them.

### Uniforms

-   `sampler2D uTextureA`: The first input texture (foreground).
-   `sampler2D uTextureB`: The second input texture (background).
-   `float uTime`: Global time value for animations.
-   `float uAlpha`: Blending factor. `0.0` shows only `uTextureB`, `1.0` shows only `uTextureA`.

-   `int uEffectA`: An integer to select the effect for `uTextureA` (e.g., 0=None, 1=H-Wave, 2=V-Wave).
-   `int uEffectB`: An integer to select the effect for `uTextureB`.

-   `vec3 uParamsA`: A vector for the parameters of `uEffectA` (e.g., x=speed, y=amplitude, z=frequency).
-   `vec3 uParamsB`: A vector for the parameters of `uEffectB`.

### GLSL Functions

The shader will contain functions that encapsulate the logic from our previous effects.

```glsl
// Applies horizontal wave
vec2 applyHorizontalWave(vec2 uv, float time, vec3 params) {
    float speed = params.x;
    float amplitude = params.y;
    float frequency = params.z;
    float wave = sin(uv.y * frequency + time * speed);
    float offset = wave * amplitude;
    return vec2(uv.x + offset, uv.y);
}

// Applies vertical wave
vec2 applyVerticalWave(vec2 uv, float time, vec3 params) {
    // ... similar logic ...
}

// Main dispatcher function
vec2 applyEffect(vec2 uv, int effect, float time, vec3 params) {
    if (effect == 1) {
        return applyHorizontalWave(uv, time, params);
    } else if (effect == 2) {
        return applyVerticalWave(uv, time, params);
    }
    // ... other effects ...
    return uv; // No effect
}
```

### Main Function Logic

```glsl
void main() {
    // 1. Get original coordinates
    vec2 originalCoords = outTexCoord;

    // 2. Calculate distorted coordinates for each texture
    vec2 coordsA = applyEffect(originalCoords, uEffectA, uTime, uParamsA);
    vec2 coordsB = applyEffect(originalCoords, uEffectB, uTime, uParamsB);

    // 3. Sample the colors
    vec4 colorA = texture2D(uTextureA, coordsA);
    vec4 colorB = texture2D(uTextureB, coordsB);

    // 4. Blend the final colors
    gl_FragColor = mix(colorB, colorA, uAlpha);
}
```

## Phaser 3 Integration

A new `PostFXPipeline` will be created to manage the uber-shader.

1.  **Create Pipeline Class:** `UbershaderPostFxPipeline` will extend `Phaser.Renderer.WebGL.Pipelines.PostFXPipeline`.
2.  **Load Shader:** The constructor will be given the GLSL uber-shader code.
3.  **Manage Uniforms:** The class will have public properties (`effectA`, `paramsA`, `effectB`, `paramsB`, `alpha`) to control the shader.
4.  **Secondary Texture:** A method like `setSecondaryTexture('key')` will be required to load and bind the second texture.
5.  **`onPreRender()`:** This method will be responsible for setting all the uniforms each frame.
6.  **`onDraw()`:** This method will be needed to correctly bind the secondary texture to a specific texture unit (e.g., unit 1) before drawing.

