# Phaser 3 TypeScript - How to Create Pokémon Battle Transitions with One Shader in Phaser 3

Contains example code of how to create Pokemon like battle scene transitions using a single shader and gradient textures in Phaser 3. This is the sample code that I shared in my tutorial video hosted on YouTube here:

[<img src="https://i.ytimg.com/vi/qwtvU0bm7S0/hqdefault.jpg">](https://youtu.be/qwtvU0bm7S0 "How to Create Pokémon Battle Transitions with One Shader in Phaser 3")

You can see a live demo of the examples here: [Pokemon Battle Scene Transitions Gradient Shader Example](https://devshareacademy.github.io/phaser-3-typescript-games-and-examples/examples/shader-battle-scene-transitions-gradient-example/index.html)

While viewing the examples, you can use the [tweakpane](https://tweakpane.github.io/docs/) gui to switch between the various examples and play the scene transitions.

| Example | Description | Location |
|---------|-------------|----------|
| Screen Wipe | A simple screen wipe from left to right. | `./src/shaders/wipe-post-fx-pipeline.ts` |
| Curtain Fall | A screen wipe from top to bottom. | `./src/shaders/curtain-fall-post-fx-pipeline.ts` |
| Curtain Rise | A screen wipe that resembles curtains rising from a stage. | `./src/shaders/curtain-rise-post-fx-pipeline.ts` |
| Opening Bars | Vertical bars that open from the center of the screen. | `./src/shaders/opening-bars-post-fx-pipeline.ts` |
| Closing Bars | Vertical bars that close from the top and bottom of the screen. | `./src/shaders/closing-bars-post-fx-pipeline.ts` |
| Fade To White | Screen fades to the color white. | `./src/shaders/fade-to-white-post-fx-pipeline.ts` |
| Fade To Black | Screen fades to the color black. | `./src/shaders/fade-to-black-post-fx-pipeline.ts` |
| Gradient | Choose different gradients to create various effects | `./src/shaders/gradient-texture-post-fx-pipeline.ts` |

![Shader Examples 1](./docs/example.gif?raw=true)

![Shader Examples 2](./docs/example2.gif?raw=true)

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

## Credits

The assets used in this demo were made from free assets that were created from the following artists: [AxulArt](https://axulart.itch.io/) and [The Pixel Nook](https://the-pixel-nook.itch.io)

List of assets:

* [Basic Plains Set](https://axulart.itch.io/axularts-basicplains-tileset-ver2)
* [Character](https://axulart.itch.io/small-8-direction-characters)
* [Buildings](https://the-pixel-nook.itch.io/rpg-building-pack)
