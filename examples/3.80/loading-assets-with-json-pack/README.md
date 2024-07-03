# Phaser 3 TypeScript - Loading Assets via Pack JSON

Contains example code of how you can use the built in [Phaser 3 Pack Loader](https://newdocs.phaser.io/docs/3.80.0/focus/Phaser.Loader.LoaderPlugin-pack) to load your various asset files from one central JSON file. This can help you keep your code and config isolated.

You can see a live demo of the example here: [Phaser 3 Asset Loading via Pack Loader Demo](https://devshareacademy.github.io/phaser-3-typescript-games-and-examples/examples/loading-assets-with-json-pack/index.html)

![Example](./docs/example.png?raw=true)

By using the JSON file for loading assets, your `preload` code can go from this:

![Example 1](./docs/example1.png?raw=true)

to this:

![Example 2](./docs/example2.png?raw=true)

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

List of assets from some great artists used in this demo:

* [xdeviruchi Sound Cloud](https://soundcloud.com/xdeviruchi)
* [Small 8-direction Characters](https://axulart.itch.io/small-8-direction-characters)
