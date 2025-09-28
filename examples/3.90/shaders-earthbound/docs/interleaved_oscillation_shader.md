# Interleaved Oscillation Shader Design

This document outlines the design for creating an "interleaved" oscillation shader, which combines both horizontal and vertical waves to create a complex, swirling distortion effect, famously used in Earthbound's battle backgrounds.

## Core Concept

The interleaved oscillation effect is a powerful distortion created by applying two separate sine wave oscillations simultaneously: one displacing pixels horizontally and the other displacing them vertically.

1.  **Horizontal Wave:** A sine wave, based on the pixel's **vertical (`y`) position**, pushes pixels to the left and right.
2.  **Vertical Wave:** A second sine wave, based on the pixel's **horizontal (`x`) position**, pushes pixels up and down.

When these two independent waves are applied at the same time, they "interleave" or interfere with each other, transforming a static grid of pixels into a fluid, swirling, and psychedelic pattern. By giving each wave its own frequency, speed, and amplitude, we can create a vast range of complex visual styles, from gentle ripples to chaotic, liquid-like distortions.

## Required Assets

1.  **Any Image:** This effect is a distortion applied to the entire texture, so no special tileable asset is required. It can be applied to any image.

## Shader Implementation (GLSL)

The effect is implemented entirely in a custom GLSL fragment shader.

### Uniforms (Inputs)

The fragment shader will require two sets of uniforms to control the two independent waves:

-   `sampler2D uMainSampler`: The primary texture to be distorted.
-   `float uTime`: A continuously increasing time value from Phaser to drive the animation.
-   **Horizontal Wave Controls:**
    -   `float uSpeedX`: Controls the speed of the horizontal wave.
    -   `float uAmplitudeX`: Controls the magnitude (strength) of the horizontal displacement.
    -   `float uFrequencyX`: Controls the number of horizontal waves that appear vertically.
-   **Vertical Wave Controls:**
    -   `float uSpeedY`: Controls the speed of the vertical wave.
    -   `float uAmplitudeY`: Controls the magnitude (strength) of the vertical displacement.
    -   `float uFrequencyY`: Controls the number of vertical waves that appear horizontally.

### Fragment Shader Logic

For each pixel on the screen, the fragment shader will perform the following steps:

1.  **Get Original Coordinates:** Start with the original texture coordinate (`outTexCoord`).
2.  **Calculate Horizontal Displacement:** Create a sine wave based on the pixel's `y` position and animate it with `uTime`. This will be the offset for the `x` coordinate.
    -   `float waveX = sin(outTexCoord.y * uFrequencyX + uTime * uSpeedX);`
    -   `float offsetX = waveX * uAmplitudeX;`
3.  **Calculate Vertical Displacement:** Create a second sine wave based on the pixel's `x` position and animate it. This will be the offset for the `y` coordinate.
    -   `float waveY = sin(outTexCoord.x * uFrequencyY + uTime * uSpeedY);`
    -   `float offsetY = waveY * uAmplitudeY;`
4.  **Apply Both Offsets:** Add the calculated offsets to their respective coordinates.
    -   `vec2 newCoords = vec2(outTexCoord.x + offsetX, outTexCoord.y + offsetY);`
5.  **Sample Texture:** Use these new, distorted `newCoords` to look up the color from the main texture (`uMainSampler`).
6.  **Output Final Color:** Set the fragment's color (`gl_FragColor`) to the color retrieved from the texture.

## Phaser 3 Integration

This effect will be implemented as a custom `PostFXPipeline`.

1.  **Create Pipeline Class:** Define a new class that extends `Phaser.Renderer.WebGL.Pipelines.PostFXPipeline`.
2.  **Load Shader:** The pipeline's constructor will be given the GLSL code for the fragment shader.
3.  **Set Uniforms:**
    -   The `onPreRender` method will update the `uTime` uniform on every frame.
    -   Public properties will be created on the pipeline class (e.g., `speedX`, `amplitudeX`, `frequencyX`, `speedY`, `amplitudeY`, `frequencyY`) to allow the game code to easily control the shader's behavior.
4.  **Apply to Game Object:** The pipeline can be added to any Game Object with a texture, such as an `Image` or `Sprite`.

---

## Tutorial Script for Beginners

**(Video begins)**

**Host:** "Hey everyone! Today, we're creating one of the most iconic and mesmerizing effects from the 16-bit era: the swirling, psychedelic backgrounds you've seen in games like Earthbound. This is the **Interleaved Oscillation Shader**."

**(Visual: Show a final animation of an image swirling and distorting.)**

**Host:** "This looks incredibly complex, but it's actually the combination of two simpler effects we've already talked about: horizontal and vertical oscillation. It's like making a 'wave' and a 'ripple' at the same time!"

**(Visual: Show an image with just the horizontal (water/haze) oscillation. Then, show an image with just the vertical (flag) oscillation.)**

**Host:** "First, remember the horizontal wave? We use a sine wave based on a pixel's vertical position to push it left and right. This gives us that 'heat haze' or 'underwater' look."

**Host:** "And remember the vertical wave? We use a sine wave based on a pixel's horizontal position to push it up and down, which looks like a waving flag."

**(Visual: An animation shows the two effects being combined. First, a grid is shown. Then the horizontal wave is applied, making the vertical lines wavy. Then, the vertical wave is applied to that result, making the horizontal lines wavy too. The final result is a swirling grid.)**

**Host:** "Now, what happens if we do both at the exact same time? That's the secret! For every single pixel, the shader asks two questions: 'Based on my row, how much should I move left or right?' and 'Based on my column, how much should I move up or down?'"

**Host:** "It calculates both of those movements and applies them simultaneously. The horizontal wave and the vertical wave 'interfere' with each other, creating this beautiful, complex, and organic-looking motion."

**(Visual: Show the final animation again, perhaps with on-screen sliders controlling the different frequency and amplitude values to show how the effect can be changed from gentle to chaotic.)**

**Host:** "And because we can control the properties of each wave independently—their speed, their size, and how many of them there are—we can create an infinite variety of swirling patterns. We can make it look like flowing water, thick smoke, or a wild psychedelic vortex."

**Host:** "So, it's not one complicated effect. It's two simple wave effects layered together to create something much more interesting. A perfect example of how combining simple ideas can lead to stunning results in game development. Thanks for watching!"

**(Video ends)