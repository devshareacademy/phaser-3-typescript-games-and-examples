# Phaser 3 TypeScript - Zelda Health Bar

A Phaser 3 TypeScript example of implementing a Zelda style health bar.

If you click on the Phaser 3 Scene, the health bar will update to show that the player has taken damage.

You can see a live demo of this example here: [Zelda Like Health Bar - Phaser 3](https://devshareacademy.github.io/phaser-3-typescript-games-and-examples/examples/zelda-health-bar/index.html)

![Zelda Like Health Bar Example](example.gif?raw=true)

## Example with events

The `src/inter-scene-communication` folder contains the source code for an example of implementing the same Zelda like health bar in multiple scenes with an example of how to communicate between the two scenes. The example will look the same as the one above, but in the codebase we are using multiple Phaser Scenes!

You can view this example here: [Zelda Like Health Bar (Multiple Scenes & Events) - Phaser 3](https://devshareacademy.github.io/phaser-3-typescript-games-and-examples/examples/zelda-health-bar/inter-scene-communication.html)

## Example with simple dependency injection

The `src/simple-dependency-injection` folder contains the source code for an example of extending the same Zelda like health bar to use dependency injection when creating the custom Phaser 3 Scenes. The example will look the same as the one above, but in the codebase we are using dependency injection to provide the health and event components to the various classes!

You can view this example here: [Zelda Like Health Bar (Dependency Injection) - Phaser 3](https://devshareacademy.github.io/phaser-3-typescript-games-and-examples/examples/zelda-health-bar/simple-dependency-injection.html)

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
