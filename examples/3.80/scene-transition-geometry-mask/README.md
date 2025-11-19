# Phaser 3 TypeScript - Scene Transition With Geometry Mask Example

Contains example code of how to create a custom scene transition for when a scene starts by using a `GeometryMask`.

You can see a live demo of the example here: <a href="https://devshareacademy.github.io/phaser-3-typescript-games-and-examples/examples/scene-transition-geometry-mask/index.html" target="_blank">Phaser 3 Scene Transition Geometry Mask</a>

![Example](https://devshareacademy.github.io/cdn/images/documentation/examples/scene-transition-geometry-mask/example.gif?raw=true)

 To learn more about this example, you can watch this video on YouTube here:

[<img src="https://i.ytimg.com/vi/dRwGjVj29s0/hqdefault.jpg">](https://youtu.be/dRwGjVj29s0 "Phaser 3 Tutorial: Custom Level Transitions With Geometry Masks!")

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

The assets used in this demo were made from free assets that were created from the following artists: <a href="https://ansimuz.itch.io" target="_blank">ansimuz</a>.

List of assets:

* <a href="https://ansimuz.itch.io/star-fighter" target="_blank">Star Fighter</a>
* <a href="https://ansimuz.itch.io/warped-vehicles" target="_blank">Warped Vehicles</a>