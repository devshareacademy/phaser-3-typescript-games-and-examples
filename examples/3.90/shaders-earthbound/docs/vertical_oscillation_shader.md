# Vertical Oscillation Shader Design

This document outlines the design for creating a vertical oscillation (or "wave") shader in Phaser 3, a variation of the horizontal oscillation effect.

## Core Concept

The vertical oscillation effect creates a visual distortion where the image appears to wobble or wave up and down. This is achieved by displacing the vertical position of each pixel based on a sine wave. The sine wave itself is animated over time, creating a smooth, continuous back-and-forth motion.

This effect is the counterpart to the horizontal oscillation. Instead of displacing pixels based on their vertical position, we displace them based on their horizontal (`x`) position. This creates waves that move up and down, rather than side to side.

## Required Assets

1.  **Any Image:** Like the horizontal version, this effect does not require a tileable image. Any texture can have the wave effect applied to it.

## Shader Implementation (GLSL)

The effect is implemented in a custom GLSL fragment shader.

### Uniforms (Inputs)

The fragment shader will require the following inputs:

-   `sampler2D uMainSampler`: The primary texture to be distorted.
-   `float uTime`: A continuously increasing time value from Phaser to drive the animation.
-   `float uSpeed`: A multiplier to control the speed of the wave animation.
-   `float uAmplitude`: A multiplier that controls the magnitude of the wave, i.e., how far it pushes pixels up and down.
-   `float uFrequency`: A multiplier that controls the number of waves that appear horizontally on the screen. Higher frequency means more, tighter waves.

### Fragment Shader Logic

For each pixel on the screen, the fragment shader will perform the following steps:

1.  **Get Original Coordinates:** Start with the original texture coordinate (`outTexCoord`) for the current pixel.
2.  **Calculate Sine Wave:** Use the `sin()` function to create the wave. The input to the sine function is a combination of the pixel's horizontal position (`outTexCoord.x`), the `uFrequency`, and the `uTime` multiplied by `uSpeed`. This makes the wave move over time.
    - `float wave = sin(outTexCoord.x * uFrequency + uTime * uSpeed);`
3.  **Calculate Vertical Offset:** Multiply the `wave` value by the `uAmplitude`. This scales the sine wave (which is in the -1.0 to 1.0 range) to control the maximum displacement.
    - `float offset = wave * uAmplitude;`
4.  **Apply Offset:** Add the calculated `offset` to the original vertical texture coordinate (`outTexCoord.y`). The horizontal coordinate remains unchanged.
    - `vec2 newCoords = vec2(outTexCoord.x, outTexCoord.y + offset);`
5.  **Sample Texture:** Use these new, distorted `newCoords` to look up the color from the main texture (`uMainSampler`).
6.  **Output Final Color:** Set the fragment's color (`gl_FragColor`) to the color retrieved from the texture.

## Phaser 3 Integration

This effect will be implemented as a custom `PostFXPipeline`.

1.  **Create Pipeline Class:** Define a new class that extends `Phaser.Renderer.WebGL.Pipelines.PostFXPipeline`.
2.  **Load Shader:** The pipeline's constructor will be given the GLSL code for the fragment shader.
3.  **Set Uniforms:**
    -   The `onPreRender` method will update the `uTime` uniform on every frame.
    -   We will create public properties or methods on the pipeline class (e.g., `speed`, `amplitude`, `frequency`) to allow the game code to easily control the shader's behavior.
4.  **Apply to Game Object:** The pipeline can be added to any Game Object with a texture, such as an `Image` or `Sprite`.

---

## Tutorial Script for Beginners

**(Video begins)**

**Host:** "Hey everyone! Today we're going to look at another classic shader effect: **Vertical Oscillation**. It's perfect for creating effects like a rippling flag in the wind or a gentle bobbing motion on water."

**(Visual: Show a final animation of an image waving up and down.)**

**Host:** "If you saw our video on horizontal oscillation, the concept here is exactly the same, just flipped on its side! We're going to take an image and push its pixels up and down using a **sine wave**."

**(Visual: Show a static, straight image. Then, show a classic sine wave graph drawn horizontally above it.)**

**Host:** "We use a sine wave as our guide. But this time, we lay it horizontally across our image. Where the wave is at its peak, we push the pixels in that column all the way up. Where it's at its trough, we push them all the way down. And where it's in the middle, the pixels don't move at all."

**(Visual: Animate the sine wave being applied to the image. Show vertical lines of pixels from the image being displaced up or down according to the shape of the sine wave, resulting in a static, vertically wavy version of the image.)**

**Host:** "When we do this for every column of pixels, we get this cool, wavy distortion. To make it move, we do the same trick as before."

**(Visual: Show the sine wave graph again, but this time, it's animated, scrolling smoothly. As it scrolls, the distorted image updates in real-time to match the new shape of the wave.)**

**Host:** "We make the sine wave itself move by tying it to a 'time' variable. As the wave glides across the image, the pixel distortion follows it, creating a smooth, bobbing animation."

**Host:** "And just like before, we can control the 'amplitude' to change how *high* the waves are, and the 'frequency' to change how *many* waves appear on screen."

**Host:** "So, to recap: we use a moving sine wave as a guide to push the pixels of our image up and down. It's the same powerful technique as horizontal oscillation, just in a different direction, and it's another great tool for adding motion to your games. Thanks for watching!"

**(Video ends)**





## Differences

✦ Excellent question. The core difference lies in two key areas: the direction of the wave and the axis used to generate it.

  Here’s a breakdown:

  1. The Analogy


   * Horizontal Oscillation is like holding a rope tied to a wall and shaking your hand side-to-side. The waves travel down the rope, but the rope
     itself is displaced left and right.
   * Vertical Oscillation is like shaking that same rope up-and-down. The waves still travel down the rope, but the rope itself is displaced up and
     down.

  2. The Technical Difference in the Shader

  The distinction comes down to which coordinate is being modified and which coordinate is used as the input for the sin() function.



  ┌────────────────┬──────────────────────────────────────────────────────────┬────────────────────────────────────────────────────────────┐
  │ Feature        │ Horizontal Oscillation                                   │ Vertical Oscillation                                       │
  ├────────────────┼──────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────┤
  │ **Goal**       │ Displace pixels **horizontally** (left/right).           │ Displace pixels **vertically** (up/down).                  │
  │ **Input for... │ Uses the pixel's **vertical (`y`)** position to deter... │ Uses the pixel's **horizontal (`x`)** position to deter... │
  │ **Output Co... │ The final offset is applied to the **`x`** coordinate.   │ The final offset is applied to the **`y`** coordinate.     │
  └────────────────┴──────────────────────────────────────────────────────────┴────────────────────────────────────────────────────────────┘

  3. The Code


  This difference is most obvious in these two lines of the fragment shader code:

  Horizontal Oscillation:


   1 // Wave is based on the PIXEL'S VERTICAL (y) POSITION
   2 float wave = sin(outTexCoord.y * uFrequency + uTime * uSpeed);
   3
   4 // The final offset is applied to the HORIZONTAL (x) COORDINATE
   5 vec2 newCoords = vec2(outTexCoord.x + offset, outTexCoord.y);


  Vertical Oscillation:


   1 // Wave is based on the PIXEL'S HORIZONTAL (x) POSITION
   2 float wave = sin(outTexCoord.x * uFrequency + uTime * uSpeed);
   3
   4 // The final offset is applied to the VERTICAL (y) COORDINATE
   5 vec2 newCoords = vec2(outTexCoord.x, outTexCoord.y + offset);



  In short, they are mirror images of each other. One uses the y coordinate to change the x, and the other uses the x coordinate to change the y.



 > why does the vertical oscillation look like a flag waving in the air, while the horizontal oscillation look like water movement?  │
╰──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯

✦ That is a fantastic observation, and it gets to the very heart of how we perceive these effects. You're right, even though the code is nearly
  identical, the visual results feel completely different.

  The reason for this comes down to our real-world experience and how our brains interpret the direction of motion.

  ---

  The Vertical Oscillation (The "Flag Effect")


   * What it does: It takes the horizontal (`x`) position of a pixel to decide how much to move it vertically (`y`).
   * The Analogy: Think of a flag attached to a flagpole. The wind blows horizontally across it. This force causes different parts of the flag's
     vertical fabric to ripple up and down. The wave of motion travels from the fixed pole across the length of the flag.
   * Why it looks like a flag: Our shader does the exact same thing. The wave (sin(x)) travels horizontally across the screen, and for each
     vertical column of pixels, it pushes them up or down. Our brain sees this pattern and immediately matches it to the familiar physics of a
     flag, a curtain, or a piece of paper waving in the breeze.



  ---

  The Horizontal Oscillation (The "Water Effect")


   * What it does: It takes the vertical (`y`) position of a pixel to decide how much to move it horizontally (`x`).
   * The Analogy: Think of looking at your reflection in a pool of water, or looking through the heat haze rising from hot pavement. The distortion
     is organized in horizontal layers. The surface of the water is a series of horizontal lines, and when disturbed, these lines wobble left and
     right. The same is true for layers of hot air.
   * Why it looks like water: The shader mimics this perfectly. The wave (sin(y)) travels vertically up and down the screen. This means every pixel
     in a single horizontal row gets pushed left or right by the same amount, creating that distinct layered, shimmering, or wobbling effect that we
      associate with looking through a distorting medium like water or heat.



  ---

  Summary Table



  ┌───────────────────────┬──────────────────────────────────────────────────────┬────────────────────────────────────────────────────────┐
  │ Feature               │ Vertical Oscillation (The Flag)                      │ Horizontal Oscillation (The Water)                     │
  ├───────────────────────┼──────────────────────────────────────────────────────┼────────────────────────────────────────────────────────┤
  │ **Wave Direction**    │ Travels Horizontally (across the screen)             │ Travels Vertically (up/down the screen)                │
  │ **Pixel Displaceme... │ Up & Down                                            │ Left & Right                                           │
  │ **Real-World Analo... │ A flag fixed on a pole, waving in the wind.          │ Looking through layers of water or heat haze.          │
  │ **Shader Logic**      │ `sin(x)` affects the `y` coordinate.                 │ `sin(y)` affects the `x` coordinate.                   │
  │ **Perceptual Cue**    │ We see vertical columns of pixels moving up and d... │ We see horizontal rows of pixels moving left and ri... │
  └───────────────────────┴──────────────────────────────────────────────────────┴────────────────────────────────────────────────────────┘


  In short, you've stumbled upon a core principle of special effects: the most convincing effects are often simple mathematical tricks that
  successfully mimic a physical phenomenon our brains are already trained to recognize.
