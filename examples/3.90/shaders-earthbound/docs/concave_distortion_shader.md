# Concave Distortion Shader Design (Castlevania IV Effect)

This document outlines the design for creating a concave distortion effect, which makes a 2D image appear to be pushed inwards from the sides, as seen in the classic Super Nintendo game *Super Castlevania IV*.

## Core Concept

This effect is a non-linear, axis-independent distortion. Unlike a simple pincushion effect which pulls everything towards a single center point, this effect applies two separate distortions simultaneously:

1.  **Vertical Squeeze:** The vertical lines in the image are bent inwards towards the vertical centerline. The amount of bending is greatest at the horizontal centerline and zero at the top and bottom edges.
2.  **Horizontal Squeeze:** The horizontal lines in the image are bent inwards towards the horizontal centerline. The amount of bending is greatest at the vertical centerline and zero at the left and right edges.

When combined, these two effects create a unique concave appearance where the entire image seems to bow inwards away from the viewer.

## Required Assets

1.  **Any Image:** This effect can be applied to any texture. The example is `docs/castlevania/original.png`.

## Shader Implementation (GLSL)

The effect is implemented entirely in a custom GLSL fragment shader.

### Uniforms (Inputs)

-   `sampler2D u_main`: The texture to be distorted.
-   `float u_time`: A continuously increasing time value for animation.
-   `vec2 u_resolution`: The width and height of the screen.
-   `float u_strength`: A multiplier to control the intensity of the concave effect.
-   `float u_scrollSpeed`: A multiplier to control the speed of the vertical scrolling.
-   `float u_curve`: An exponent that controls the roundness of the distortion.

### Fragment Shader Logic

For each pixel on the screen, the fragment shader will perform the following steps:

1.  **Normalize and Center Coordinates:** Convert the pixel's coordinates so that `(0, 0)` is at the center of the screen.
2.  **Calculate Distortion Scale:** Calculate a scaling factor based on the pixel's vertical distance from the center, raised to the power of `u_curve`. This determines how much the horizontal coordinates will be squeezed.
    - `float scale = 1.0 + u_strength * pow(abs(uv.y - 0.5), u_curve);`
3.  **Apply Horizontal Distortion:** Remap the horizontal coordinate by dividing by the `scale` factor.
4.  **Apply Vertical Scroll:** Animate the vertical coordinate using `u_time` and `u_scrollSpeed`.
5.  **Sample Texture:** Use these new, distorted coordinates to look up the color from `u_main`.
6.  **Output Final Color:** Set `gl_FragColor` to the sampled color.

## Phaser 3 Integration

This will be implemented as a custom `PostFXPipeline`.

1.  **Create Pipeline Class:** Define a new class extending `Phaser.Renderer.WebGL.Pipelines.PostFXPipeline`.
2.  **Load Shader:** The constructor will be given the GLSL fragment shader code.
3.  **Set Uniforms:** Public properties like `strength`, `scrollSpeed`, and `curve` will be added to the class to allow for easy control from the game scene.
4.  **Apply to Game Object:** The pipeline will be added to a full-screen `Image` or `Rectangle` Game Object.
