# Tunnel Effect Shader Design

This document outlines the design for creating a pseudo-3D spinning tunnel effect, famously used in games like *Super Castlevania IV*.

## Core Concept

The effect creates the illusion of a 3D spinning tunnel from a single, flat 2D texture. This is achieved by transforming the screen's coordinate system in the fragment shader. Instead of a direct mapping of screen pixels to texture pixels, we treat the screen as a window looking into the tunnel.

For every pixel on the screen, we calculate its position relative to the center. We then convert these Cartesian coordinates (x, y) into polar coordinates (angle, radius). The magic lies in how we map these back to the 2D texture:

1.  **Angle:** This determines our position *around* the tunnel's circumference. It maps directly to the horizontal (u) coordinate of our flat texture. As the angle changes, we move left or right along the image, wrapping around to create a seamless cylinder.
2.  **Radius (Distance from Center):** This determines our position *down the length* of the tunnel. It maps to the vertical (v) coordinate of our texture. To create the illusion of perspective, we use the reciprocal of the radius (`1.0 / radius`). This makes pixels further from the center (deeper in the tunnel) appear smaller and more compressed, just as they would in a real 3D environment.

Animation is achieved by adding a time-based offset to the angle (for spinning) and the radius (for moving forward or backward).

## Required Assets

1.  **A "Tunnel" Texture:** A 2D image that is designed to be tileable horizontally. This image represents the tunnel's interior, unrolled and laid flat. The example is `docs/castlevania/original.png`.

## Shader Implementation (GLSL)

The effect is implemented entirely in a custom GLSL fragment shader.

### Uniforms (Inputs)

-   `sampler2D uMainSampler`: The flat texture of the tunnel's interior.
-   `float uTime`: A continuously increasing time value from Phaser for animation.
-   `vec2 uResolution`: The width and height of the screen, used to correct the aspect ratio and find the center.
-   `float uSpin`: A multiplier to control the speed of the tunnel's rotation.
-   `float uSpeed`: A multiplier to control the speed of movement into or out of the tunnel.

### Fragment Shader Logic

For each pixel on the screen, the fragment shader will perform the following steps:

1.  **Normalize Coordinates:** Convert the default `gl_FragCoord` (which is in pixels) to a `0.0-1.0` range, creating our initial UV coordinates.
2.  **Center Coordinates:** Shift the coordinate system so that `(0, 0)` is at the center of the screen, not the top-left. The range will now be roughly `[-0.5, 0.5]`.
3.  **Correct Aspect Ratio:** Multiply the centered x-coordinate by the screen's aspect ratio (`uResolution.x / uResolution.y`) to ensure the tunnel is circular, not oval.
4.  **Calculate Angle and Radius:** Convert the aspect-corrected Cartesian coordinates to polar coordinates using `atan(y, x)` for the angle and `length(x, y)` for the radius.
5.  **Animate:**
    -   Add `uTime * uSpin` to the `angle`.
    -   Add `uTime * uSpeed` to the calculated depth value.
6.  **Map to Texture UVs:**
    -   The final horizontal texture coordinate (`u`) is `angle / (2.0 * PI)`.
    -   The final vertical texture coordinate (`v`) is `(1.0 / radius) + animation_offset`.
7.  **Sample Texture:** Use these newly calculated UVs to look up the color from `uMainSampler`.
8.  **Output Final Color:** Set `gl_FragColor` to the sampled color.

## Phaser 3 Integration

This will be implemented as a custom `PostFXPipeline`.

1.  **Create Pipeline Class:** Define a new class extending `Phaser.Renderer.WebGL.Pipelines.PostFXPipeline`.
2.  **Load Shader:** The constructor will be given the GLSL fragment shader code.
3.  **Set Uniforms:** The `onPreRender` method will update `uTime` and other uniforms on every frame. Public properties like `spin` and `speed` will be added to the class to allow for easy control from the game scene.
4.  **Apply to Game Object:** The pipeline will be added to a full-screen `Image` or `Rectangle` Game Object.

---

## Tutorial Script for Beginners

**(Video begins)**

**Host:** "Hey everyone! Today, we're diving into one of the most iconic effects from the 16-bit era: the pseudo-3D spinning tunnel, made famous by games like *Super Castlevania IV*!"

**(Visual: Show the final spinning tunnel animation.)**

**Host:** "It looks like real 3D, but it's actually a brilliant 2D illusion. So how does it work? Imagine you have a poster with a brick pattern on it. Now, roll that poster up into a tube and look inside. You've got a tunnel! The shader's job is to do that 'rolling up' for us, digitally."

**(Visual: Show the flat, 2D source image, like `original.png`.)**

**Host:** "We start with a simple, flat image. This is our 'unrolled' tunnel wall. The magic happens when we tell the shader how to map the pixels on our screen to this flat image."

**(Visual: An animation shows a point on the screen. A line is drawn from the center to that point. The angle and length of the line are highlighted.)**

**Host:** "For every single pixel on your screen, the shader first asks two questions: What is its **angle** relative to the center, and what is its **distance** from the center?"

**(Visual: The animation now shows the angle value being used to look up a horizontal position on the flat source image. It shows the distance value being used to look up a vertical position.)**

**Host:** "It then uses those two answers to pick a pixel from our flat image. The **angle** tells it where to look horizontally. An angle of 0 degrees might be the far left of the image, 180 degrees the middle, and 360 degrees the far right, wrapping back around. This creates the cylinder."

**Host:** "The **distance** tells it where to look vertically. And here's the key to the 3D effect: the shader actually uses the *inverse* of the distance. This means pixels close to the center of the screen (which are far away in the tunnel) will be squished together, creating a powerful sense of depth and perspective."

**(Visual: Show the animation again, but this time a 'time' value is added to the angle, causing the horizontal lookup position on the flat image to slide. This makes the final tunnel on screen appear to rotate.)**

**Host:** "So how does it spin? That's the easiest part! On every frame, the shader just adds a small, constant value to the angle before it does its lookup. The result is a smooth, continuous rotation. To move forward, we just add a value to the distance lookup. It's that simple!"

**Host:** "To recap: we're converting the screen's coordinate system from (x, y) to (angle, distance), and using that to look up pixels on a flat image in a way that creates a 3D perspective. It's a beautiful example of how a little bit of math can create truly stunning visual effects. Thanks for watching!"

**(Video ends)**
