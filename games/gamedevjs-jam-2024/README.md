# Phaser 3 TypeScript - TEMPLATE

A Phaser 3 TypeScript implementation TEMPLATE.

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






concept
-----------
a group of people are trapped in a facility, and you want to help them get out.
however, you can only hack into the system and view them through a security camera
and talk to them through a speaker.

you need to guide these people to help them escape. to do this, you will view a room
and interact with different things to provide power to them. example, there is a light
in a room, if you click on it, it will turn on and provide a light source

however, there is limited power in the room, and by turning objects on, it consumes the power
and once drained, it will need time to refill

each room is a puzzle and you need to help the people escape
one idea is a npc is walking on a pathway and cannot see, by turning on a light
they can jump across the platform to get to the exit

another is an npc is on a path that keeps moving them backward, by turning off the power to the path
they can move forward

later their could be bad enemies that will kill the npc if they touch them


https://free-game-assets.itch.io/power-station-free-tileset-pixel-art
https://free-game-assets.itch.io/free-3-cyberpunk-sprites-pixel-art
https://free-game-assets.itch.io/free-industrial-zone-tileset-pixel-art
https://free-game-assets.itch.io/free-sci-fi-antagonists-pixel-character-pack
https://free-game-assets.itch.io/free-exclusion-zone-tileset-pixel-art
https://free-game-assets.itch.io/free-cyberpunk-overlay-effects-for-platformer-game
https://free-game-assets.itch.io/free-effects-for-platformer-pixel-art-pack
https://free-game-assets.itch.io/free-scrolling-city-backgrounds-pixel-art
https://free-game-assets.itch.io/free-townspeople-cyberpunk-pixel-art

https://sangoro.itch.io/vfx-starter-pack

Escape Circuit
Circuit Rescue
Power Breakout

https://github.com/yandeu/phaser3-optimal-resolution/tree/master/src
https://exceptrea.itch.io/laboratory-tileset-revamped-lite


## Bugs

if player closed door on npc, npc is stuck, this should result in player restarting level
