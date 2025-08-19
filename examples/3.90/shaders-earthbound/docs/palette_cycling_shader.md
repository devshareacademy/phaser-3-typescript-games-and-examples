# Palette Cycling Shader Design

This document outlines the design and methodology for creating a palette cycling shader in Phaser 3, inspired by the visual effects in the game Earthbound.

## Core Concept

The fundamental principle of palette cycling is to separate a visual asset into two parts:

1.  **Indexed Texture:** A grayscale image where the brightness of each pixel does not represent a color, but rather an **index** into a color lookup table.
2.  **Palette Texture:** A 1D texture (a strip of colors) that serves as the color lookup table.

The "cycling" animation is achieved in the shader by shifting the indices, causing the pixels in the indexed texture to look up different colors from the palette texture over time. This is highly efficient as it only requires updating a single uniform variable (`time`) in the shader, rather than manipulating large texture assets on the CPU/GPU.

## Required Assets

1.  **Indexed Image (`004_indexed.png`):** This is the main background image. It's a grayscale texture where each pixel's value (e.g., from its red channel) corresponds to a position in the palette. For example, a black pixel might be index 0, a dark gray index 1, and so on.
2.  **Palette Image (`004_palette.png`):** This is a small, 1-pixel-high image containing the sequence of colors that the indexed image will use. The horizontal position of a pixel in this image corresponds to the index.

## Shader Implementation (GLSL)

The effect is implemented entirely within a custom GLSL fragment shader. The vertex shader can remain the standard one used by Phaser's texture rendering.

### Uniforms (Inputs)

The fragment shader will require the following inputs (uniforms) from the Phaser game engine:

-   `sampler2D uMainSampler`: The primary indexed texture (e.g., `004_indexed.png`).
-   `sampler2D uPaletteSampler`: The 1D palette texture (e.g., `004_palette.png`).
-   `float uTime`: A continuously increasing value, provided by Phaser, used to drive the animation.
-   `float uCycleSpeed`: A multiplier to control the speed of the cycling effect.
-   `float uPaletteWidth`: The width (in pixels) of the palette texture. This is crucial for correctly mapping indices.

### Fragment Shader Logic

For each pixel on the screen, the fragment shader will perform the following steps:

1.  **Sample the Indexed Texture:** Read the color value from the main texture (`uMainSampler`) at the current texture coordinate.
2.  **Extract the Index:** Take the value from a single channel (e.g., the red channel) of the sampled color. This value will be a float between `0.0` and `1.0`.
3.  **Scale the Index:** Multiply the extracted value by the `uPaletteWidth` to convert it from the `0.0-1.0` range to the actual palette index range (e.g., `0-255`).
4.  **Animate the Index:** Add the time-based offset to the scaled index. The formula will be `animatedIndex = index + (uTime * uCycleSpeed)`.
5.  **Wrap the Index:** Use the `mod()` function to wrap the `animatedIndex` around the `uPaletteWidth`. This ensures that as the animation progresses, it loops back to the beginning of the palette, creating the cycling effect. `wrappedIndex = mod(animatedIndex, uPaletteWidth)`.
6.  **Normalize for Palette Lookup:** Convert the `wrappedIndex` back into the `0.0-1.0` range required for texture lookups. `paletteCoordinate = wrappedIndex / uPaletteWidth`.
7.  **Sample the Palette Texture:** Use the `paletteCoordinate` to look up the final color from the `uPaletteSampler`. Since it's a 1D texture, the Y-coordinate for the lookup will be constant (e.g., `0.5`).
8.  **Output Final Color:** Set the fragment's color (`gl_FragColor`) to the color retrieved from the palette.

## Phaser 3 Integration

To use this shader in Phaser 3, we will create a custom `PostFXPipeline`.

1.  **Create a Pipeline Class:** Define a new class that extends `Phaser.Renderer.WebGL.Pipelines.PostFXPipeline`.
2.  **Load Shader:** The pipeline's constructor will be given the GLSL code for the fragment shader.
3.  **Set Uniforms:**
    -   In the `onPreRender` method of the pipeline, we will update the `uTime` uniform on every frame.
    -   We will create custom methods on the pipeline class (e.g., `setCycleSpeed(speed)`) to allow the game code to control the shader's behavior.
    -   The `uPaletteSampler` uniform will be bound to texture unit 1, as texture unit 0 is used for the `uMainSampler` by default.
4.  **Apply to Game Object:** The pipeline will be added to a Game Object, such as an `Image`, using `image.setPostPipeline(MyPalettePipeline)`. The game code will be responsible for loading the two required texture assets.

---

## Tutorial Script for Beginners

**(Video begins)**

**Host:** "Hey everyone! Ever seen those cool, psychedelic, animated backgrounds in old-school games like Earthbound and wondered how they're made? Today, we're going to break down the magic behind one of the most classic effects: **Palette Cycling**."

**(Visual: Show a final palette-cycled animation, like the fire or rainbow effect.)**

**Host:** "Looks complicated, right? But the core idea is actually super simple. Think of it like a 'color-by-numbers' painting."

**(Visual: Show a grayscale indexed image, like the radial gradient.)**

**Host:** "First, you have your main image, but it's not a normal color picture. It's a grayscale image where the shade of each pixel isn't a color, it's a *number* or an *index*. So, black might be 'number 0', a light gray might be 'number 50', and white might be 'number 255'. This image is our 'map'. It tells us *which* color number goes where, but it doesn't know anything about the colors themselves."

**(Visual: Show the small, 1-pixel high palette texture, like the fire palette.)**

**Host:** "Next, we have our 'paint box'. This is a tiny image, usually just a single strip of pixels, called a **palette**. This palette holds all the actual colors we want to use. So, at position 0, we might have black. At position 50, we might have bright red. And at position 255, we might have glowing yellow. It's our list of available paints."

**(Visual: Animate the two images coming together. A pointer scans the grayscale image, picks a pixel, gets its "number", then moves to the palette, finds the color at that number, and paints it onto a final output image.)**

**Host:** "So, how do we combine them? That's where a **shader** comes in. A shader is a small program that runs on your graphics card, and its job here is to be our artist. For every single pixel on the screen, the shader does three simple things:"

**Host:** "One: It looks at our grayscale 'map' image to find the color number for that pixel."
**Host:** "Two: It takes that number and looks up the real color in our 'paint box' palette."
**Host:** "Three: It draws that final color to the screen."

**(Visual: Show the animation again, but this time, a 'time' value appears and is added to the 'number' before it looks up the color in the palette. Show the numbers wrapping around from the end back to the beginning.)**

**Host:** "But here's the magic trick for the animation! To make the colors 'cycle', the shader does one extra step. Before it looks up the color in the paint box, it adds a small, ever-increasing number—let's call it 'time'—to the number it got from the map. So, 'number 50' becomes 'number 51', then '52', then '53', and so on. When the numbers go past the end of our paint box, they just wrap right back around to the beginning."

**Host:** "And that's it! The structure of the image never changes. We're just shifting which color each part of the image points to. It's an incredibly efficient way to create complex and beautiful animations, because the computer only has to do a tiny bit of math for each pixel, instead of moving around a huge, pre-rendered video."

**Host:** "So, to recap: you have a grayscale map of numbers, a paint box of colors, and a shader that reads the map, shifts the numbers over time, and paints the result. A simple concept with some seriously awesome results. Thanks for watching!"

**(Video ends)**