# Background Scrolling Shader Design

This document outlines the design for creating a background scrolling shader in Phaser 3, another common effect seen in classic games like Earthbound.

## Core Concept

The background scrolling effect creates the illusion of movement by continuously shifting the texture coordinates of a background image over time. Instead of moving the camera or the image Game Object itself, we can do this efficiently on the GPU within a shader.

The key is to modify the texture coordinates (UVs) that the shader uses to read from the image. By adding a time-based offset to the coordinates, we effectively sample a different part of the texture for each pixel on every frame. When the coordinates go beyond the texture's boundary (beyond 1.0), they can be wrapped back to 0.0, creating a seamless, infinite scrolling loop, provided the texture is designed to be tileable.

## Required Assets

1.  **Tileable Background Image (`bg.png`):** A single image where the right edge matches up perfectly with the left edge, and the top edge matches the bottom edge. This is crucial for the scrolling to be seamless.

## Shader Implementation (GLSL)

The effect is implemented in a custom GLSL fragment shader.

### Uniforms (Inputs)

The fragment shader will require the following inputs:

-   `sampler2D uMainSampler`: The primary background texture that will be scrolled.
-   `float uTime`: A continuously increasing time value from Phaser to drive the animation.
-   `vec2 uSpeed`: A 2D vector `(x, y)` that controls the speed and direction of the scrolling. For example, `(0.1, 0.0)` would scroll to the right, and `(0.0, -0.1)` would scroll upwards.

### Fragment Shader Logic

For each pixel on the screen, the fragment shader will perform the following steps:

1.  **Get Original Coordinates:** Start with the original texture coordinate for the current pixel, which is passed from the vertex shader (`v_tex_coord`).
2.  **Calculate Offset:** Multiply the `uSpeed` vector by the `uTime` value. This gives us a 2D offset that increases over time.
    - `vec2 offset = uSpeed * uTime;`
3.  **Apply Offset:** Add the calculated offset to the original texture coordinates to get the new, scrolled coordinates.
    - `vec2 scrolledCoords = v_tex_coord + offset;`
4.  **Wrap Coordinates (Tiling):** The GPU can handle the wrapping automatically if the texture is set to `REPEAT` mode. Alternatively, we can use the `fract()` function in the shader, which takes the fractional part of a number. This effectively wraps any value greater than 1.0 back to the 0.0-1.0 range, creating the tiling effect.
    - `vec2 wrappedCoords = fract(scrolledCoords);`
5.  **Sample Texture:** Use these new `wrappedCoords` to look up the color from the main texture (`uMainSampler`).
6.  **Output Final Color:** Set the fragment's color (`gl_FragColor`) to the color retrieved from the texture.

## Phaser 3 Integration

This effect will also be implemented as a custom `PostFXPipeline`.

1.  **Create Pipeline Class:** Define a new class that extends `Phaser.Renderer.WebGL.Pipelines.PostFXPipeline`.
2.  **Load Shader:** The pipeline's constructor will be given the GLSL code for the fragment shader.
3.  **Set Uniforms:**
    -   The `onPreRender` method will update the `uTime` uniform on every frame.
    -   We will create a custom method on the pipeline, like `setSpeed(x, y)`, to allow the game code to control the `uSpeed` uniform.
4.  **Apply to Game Object:** The pipeline will be added to a background `Image` Game Object. For this to work correctly, the underlying texture in Phaser should have its wrap mode set to `REPEAT`. This is done via `this.textures.get(key).setWrap(Phaser.Textures.WrapModes.REPEAT);`.

---

## Tutorial Script for Beginners

**(Video begins)**

**Host:** "Hey everyone! You know those classic 2D games where the background just scrolls on forever, like in a side-scrolling shooter or an RPG world map? Ever wonder how they make it look so smooth and endless?"

**(Visual: Show a final scrolling background animation.)**

**Host:** "You might think they're moving a gigantic image across the screen, but that would be super inefficient! The real secret is much cleverer and happens inside a **shader**."

**(Visual: Show a single, static, tileable background image. Highlight how the left and right edges match up, and the top and bottom edges match up.)**

**Host:** "It all starts with one special image. This isn't just any picture; it's a **tileable** image. That's a fancy way of saying its edges are designed to perfectly match up with each other. If you put two of these images side-by-side, you wouldn't be able to see the seam. Think of it like a single piece of patterned wallpaper."

**(Visual: Animate the image being placed on a 2D grid, showing how it tiles perfectly.)**

**Host:** "Now, instead of moving this image, we're going to tell our graphics card to just *change its viewpoint*. Imagine you're looking at this wallpaper through a small window—your game screen. To make it look like it's scrolling, you don't move the whole wall. You just shift your window's view across it."

**(Visual: Show a "camera" frame moving over the tiled wallpaper background. Then, show that the camera frame is actually static, and it's the wallpaper *behind* it that's being told to shift its coordinates.)**

**Host:** "That's exactly what our shader does. It's a tiny program that tells the GPU, 'For every frame, just shift the position where you start drawing the image by a tiny amount.' So, on frame one, you start at the top-left. On frame two, you start a few pixels over. On frame three, a few more pixels over, and so on."

**(Visual: Show a 2D coordinate plane (UV) from (0,0) to (1,1) over the image. An arrow shows a value (time * speed) being added to the coordinates.)**

**Host:** "But what happens when we reach the edge of the image? This is the clever part. The shader is told to 'wrap around'. As soon as its viewpoint goes off the right edge, it instantly jumps back to the left edge. Because our image is tileable, this jump is completely seamless! It creates the illusion of an infinitely scrolling background."

**Host:** "So, the image itself never moves. The camera never moves. All that's changing is a simple instruction to the graphics card: 'Look at this spot... now this spot... now this spot...' It's an incredibly efficient way to create the illusion of movement, and it's a fundamental technique in game development."

**Host:** "To recap: you take one tileable image, and you use a shader to constantly shift the 'viewing window' over it, wrapping around the edges to create a perfect, endless loop. Simple, smart, and super effective. Thanks for watching!"

**(Video ends)**