# Phaser 3 TypeScript - Arcade Physics Conveyor Belt Example

Contains example code of how you can use the built in Phaser 3 Arcade Physics Engine to create a conveyor belt like game object that will move objects automatically, and modify their speed when the objects are moving.

You can see a live demo of the example here: [Phaser 3 Arcade Physics Conveyor Belt Demo](https://devshareacademy.github.io/phaser-3-typescript-games-and-examples/examples/arcade-physics-conveyor-belt/index.html)

![Example](https://devshareacademy.github.io/cdn/images/documentation/examples/arcade-physics-conveyor-belt/example.gif?raw=true)

## Local Development

### Requirements

[Node.js](https://nodejs.org) and [pNPm](https://pnpm.io/) are required to install dependencies and run scripts via `pnpm`.

[Vite](https://vitejs.dev/) is required to bundle and serve the web application. This is included as part of the projects dev dependencies.

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

The assets used in this demo were made from free assets that were created from the following artists: [craftpix.net](https://free-game-assets.itch.io/).

List of assets:

* [Cyberpunk Sprites](https://free-game-assets.itch.io/free-3-cyberpunk-sprites-pixel-art)
* [Industrial Zone Tileset](https://free-game-assets.itch.io/free-industrial-zone-tileset-pixel-art)
