# Phaser 3 TypeScript - How to Pass a Texture to a Shader in Phaser 3 (Noise Overlay Example)

Contains example code of how to pass additional textures to a custom shader in Phaser 3. This is the sample code that I shared in my tutorial video hosted on YouTube here:

[<img src="https://i.ytimg.com/vi/qhYCpGKI2UM/hqdefault.jpg">](https://youtu.be/qhYCpGKI2UM "How to Pass a Texture to a Shader in Phaser 3 (Noise Overlay Example)")

You can see a live demo of the examples here: <a href="https://devshareacademy.github.io/phaser-3-typescript-games-and-examples/examples/3.90/pass-texture-to-shader-example/index.html" target="_blank">Pass Texture to Shader Example</a>

![Shader Examples 1](https://devshareacademy.github.io/cdn/images/documentation/examples/shaders-pass-texture-example/example.gif?raw=true)

![Shader Examples 2](https://devshareacademy.github.io/cdn/images/documentation/examples/shaders-pass-texture-example/example2.gif?raw=true)

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

The assets used in this demo were made from free assets that were created from the following artists: <a href="https://axulart.itch.io/" target="_blank">AxulArt</a> and <a href="https://the-pixel-nook.itch.io" target="_blank">The Pixel Nook</a>.

List of assets:

* <a href="https://axulart.itch.io/axularts-basicplains-tileset-ver2" target="_blank">Basic Plains Set</a>
* <a href="https://axulart.itch.io/small-8-direction-characters" target="_blank">Character</a>
* <a href="https://the-pixel-nook.itch.io/rpg-building-pack" target="_blank">Buildings</a>