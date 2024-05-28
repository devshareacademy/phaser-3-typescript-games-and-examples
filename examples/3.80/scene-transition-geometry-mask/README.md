# Phaser 3 TypeScript - Scene Transition With Geometry Mask Example

Contains example code of how to create a custom scene transition for when a scene starts by using a `GeometryMask`.

You can see a live demo of the example here: [Phaser 3 Scene Transition Geometry Mask](https://devshareacademy.github.io/phaser-3-typescript-games-and-examples/examples/scene-transition-geometry-mask/index.html)

![Example](./docs/example.gif?raw=true)

 To learn more about this example, you can watch this video on YouTube here:

[<img src="https://i.ytimg.com/vi/dRwGjVj29s0/hqdefault.jpg">](https://youtu.be/dRwGjVj29s0 "Phaser 3 Tutorial: Custom Level Transitions With Geometry Masks!")

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

The assets used in this demo were made from free assets that were created from the following artists: [ansimuz](https://ansimuz.itch.io/).

List of assets:

* [Star Fighter](https://ansimuz.itch.io/star-fighter)
* [Warped Vehicles](https://ansimuz.itch.io/warped-vehicles)
