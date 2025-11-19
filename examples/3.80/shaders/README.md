# Phaser 3 TypeScript - Basic Shader Examples

Contains example code of how to use various shaders in Phaser 3. This is the sample code that I shared in my tutorial video hosted on YouTube here:

[<img src="https://i.ytimg.com/vi/4Dj5PSKwjak/hqdefault.jpg">](https://youtu.be/4Dj5PSKwjak "Phaser 3 Tutorial: Getting Started with Shaders!")

You can see a live demo of the examples here: [Shader Examples](https://devshareacademy.github.io/phaser-3-typescript-games-and-examples/examples/shader-examples/index.html)

While viewing the examples, if you press the `space` key, you can navigate between various examples. Below is a list of the examples shaders that can be seen and the corresponding files to that example:

| Example | Description | Location |
|---------|-------------|----------|
| Simple Shader | Example of how to just render out the existing pixels using a shader. | `./src/shaders/nothing-post-fx-pipeline.ts` |
| Simple Color | Example of how to replace pixels with another color. | `./src/shaders/color-post-fx-pipeline.ts` |
| Grey Scale | Example of how to apply a grey scale affect to all pixels. | `./src/shaders/grey-scale-post-fx-pipeline.ts` |
| Screen Wipe | Example of how to use custom variables in a shader to create animations, like a scene transition. | `./src/shaders/wipe-post-fx-pipeline.ts` |
| Built In Fx | Example of how to use the built in shader effects on game objects. | `./src/scenes/built-in-fx-scene.ts` |

![Shader Examples](https://devshareacademy.github.io/cdn/images/documentation/examples/shaders/example.gif?raw=true)

## Local Development

### Requirements

<a href="https://nodejs.org" target="_blank">Node.js</a> and <a href="https://pnpm.io/" target="_blank">PnPm</a> are required to install dependencies and run scripts via `pnpm`.

<a href="https://vitejs.dev/" target="_blank">Vite</a> is required to bundle and serve the web application. This is included as part of the projects dev dependencies.

### Available Commands

| Command | Description |
|---------|-------------|
| `pnpm install --frozen-lockfile` | Install project dependencies |
| `pnpm start` | Build project and open web server running project |
| `pnpm build` | Builds code bundle for production |
| `pnpm lint` | Uses ESLint to lint code |

### Writing Code

After cloning the repo, run `pnpm install --frozen-lockfile` from your project directory. Then, you can start the local development
server by running `pnpm start`.

After starting the development server with `pnpm start`, you can edit any files in the `src` folder
and parcel will automatically recompile and reload your server (available at `http://localhost:8080`
by default).

### Deploying Code

After you run the `pnpm build` command, your code will be built into a single bundle located at
`dist/*` along with any other assets you project depended.

If you put the contents of the `dist` folder in a publicly-accessible location (say something like `http://myserver.com`),
you should be able to open `http://myserver.com/index.html` and play your game.

### Static Assets

Any static assets like images or audio files should be placed in the `public` folder. It'll then be served at `http://localhost:8080/path-to-file-your-file/file-name.file-type`.

## Credits

The assets used in this demo were made from free assets that were created from the following artists: [AxulArt](https://axulart.itch.io/) and [The Pixel Nook](https://the-pixel-nook.itch.io)

List of assets:

* [Basic Plains Set](https://axulart.itch.io/axularts-basicplains-tileset-ver2)
* [Character](https://axulart.itch.io/small-8-direction-characters)
* [Buildings](https://the-pixel-nook.itch.io/rpg-building-pack)
