# Phaser 3 TypeScript - Parallax Scrolling Background

A Phaser 3 TypeScript example of a parallax scrolling background.

Parallax scrolling is a technique where background images move past the camera more slowly than foreground images, which can be used to create an illusion of depth in 2D games.

**Credit:** The images used in this demo were created by <a href="https://ansimuz.itch.io/" target="_blank">Ansimuz</a>.

If you are interested in learning more about this example, you can watch a video on YouTube by clicking on the thumbnail below:

[<img src="https://i.ytimg.com/vi/-lJ2SQnbPSU/hqdefault.jpg">](https://youtu.be/-lJ2SQnbPSU "Parallax Scrolling Background Tutorial in Phaser 3")

You can see a live demo of this example here: <a href="https://devshareacademy.github.io/phaser-3-typescript-games-and-examples/examples/parallax-scrolling-background/index.html" target="_blank">Parallax Scrolling Background - Phaser 3</a>

![Phaser 3 Parallax Scrolling Background](https://devshareacademy.github.io/cdn/images/documentation/examples/parallax-scrolling-background/example.gif?raw=true)

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
