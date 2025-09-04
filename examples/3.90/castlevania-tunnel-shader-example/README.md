# Phaser 3 TypeScript - Super Castlevania IV Tunnel Shader Example

Recreate Castlevania IV’s legendary tunnel effect! 🌀 In this WebGL tutorial, we’ll build a concave distortion shader that bends a flat image into a scrolling tunnel — just like the SNES classic. This is the sample code that I shared in my tutorial video hosted on YouTube here:

[<img src="https://i.ytimg.com/vi/rCipJqPoRFU/hqdefault.jpg">](https://youtu.be/rCipJqPoRFU "WebGL Shader Tutorial: Castlevania IV Tunnel Effect")

You can see a live demo of the examples here: [Castlevania Tunnel Shader Example](https://devshareacademy.github.io/phaser-3-typescript-games-and-examples/examples/3.90/castlevania-tunnel-shader-example/index.html)

![Shader Example 1](./docs/example.gif?raw=true)

## Local Development

### Requirements

[Node.js](https://nodejs.org) and [Yarn](https://yarnpkg.com/) are required to install dependencies and run scripts via `yarn`.

[Vite](https://vitejs.dev/) is required to bundle and serve the web application. This is included as part of the projects dev dependencies.

### Available Commands

| Command | Description |
|---------|-------------|
| `yarn install --frozen-lockfile` | Install project dependencies |
| `yarn start` | Build project and open web server running project |
| `yarn build` | Builds code bundle for production |
| `yarn lint` | Uses ESLint to lint code |

### Writing Code

After cloning the repo, run `yarn install --frozen-lockfile` from your project directory. Then, you can start the local development
server by running `yarn start`.

After starting the development server with `yarn start`, you can edit any files in the `src` folder
and parcel will automatically recompile and reload your server (available at `http://localhost:8080`
by default).

### Deploying Code

After you run the `yarn build` command, your code will be built into a single bundle located at
`dist/*` along with any other assets you project depended.

If you put the contents of the `dist` folder in a publicly-accessible location (say something like `http://myserver.com`),
you should be able to open `http://myserver.com/index.html` and play your game.

### Static Assets

Any static assets like images or audio files should be placed in the `public` folder. It'll then be served at `http://localhost:8080/path-to-file-your-file/file-name.file-type`.
