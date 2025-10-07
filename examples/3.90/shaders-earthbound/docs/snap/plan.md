  The Plan


  The core of this effect is to create a pseudo-3D illusion using multiple layers and shaders. We'll manipulate vertices for the character and
  texture coordinates for the background to simulate depth and movement.

  Here’s the step-by-step plan:


   1. Asset Loading & Scene Setup: We'll begin by loading all the necessary images from /public/assets/snap/ into the marvel-snap-scene.ts. Then,
      we'll layer them in the correct order to form the card.


   2. 3D Hero Effect (Vertex Displacement):
       * To make the character pop, we'll render the hero image onto a Plane mesh, which is essentially a grid of vertices.
       * We'll write a vertex shader that displaces these vertices based on a grayscale displacement map. White areas of the map will push vertices
         forward, and black areas will leave them in place, creating a 3D relief effect.
       * We'll tie the intensity of this displacement to the mouse position, creating a parallax effect where the character appears to shift as you
         move the cursor.


   3. Animated Cape:
       * We'll enhance the hero's vertex shader to create the waving cape animation.
       * This involves using a mask to isolate the cape area of the character.
       * A scrolling noise texture will be used to generate a dynamic, wave-like displacement that is applied only to the masked cape vertices.


   4. Parallax Background:
       * The background will have its own simple shader.
       * Instead of displacing vertices, this fragment shader will shift the background image's texture coordinates (UVs) in the opposite direction
         of the mouse movement.
       * By moving the background at a slower rate than the foreground, we'll create a convincing parallax effect that adds to the sense of depth.


   5. Interactivity:
       * Finally, in the scene's update loop, we'll track the mouse pointer's position.
       * This position will be used to calculate the card's "tilt," which will be passed as a uniform variable to our shaders to drive all the
         effects in real-time.


  To get started, I'll first examine the current state of your marvel-snap-scene.ts file.
