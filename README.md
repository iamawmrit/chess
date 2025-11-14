<div align="center">
  <a href="https://chess.awmrit.com">
    <img width="120" height="120" src="https://github.com/GuillaumeSD/Chesskit/blob/main/public/android-chrome-192x192.png" alt="Logo">
  </a>

<h3 align="center">Chessrith</h3>
  <p align="center">
    The Ultimate Chess Web App
    <br />
    <a href="https://chess.awmrit.com/" target="_blank" rel="noopener noreferrer"><strong>chess.awmrit.com</strong></a>
    <br />
  </p>
</div>
<br />

Chessrith is an open-source chess website to play, view, analyze and review your chess games for free on any device with Stockfish!

## Mission

Chessrith aims to offer comprehensive chess-related features while remaining free and open-source. It is designed to be easy to use, fast, and reliable with a beautiful modern interface.

## Features

- Load and review games from [chess.com](https://chess.com) and [lichess.org](https://lichess.org)
- Advanced analysis board with live Stockfish engine evaluation
- Custom arrows and visual indicators
- Evaluation graph with move-by-move analysis
- Comprehensive moves classification (Genius, Perfect, Best, Excellent, Good, Opening, Inaccuracy, Mistake, Blunder)
- Three-panel layout: Moves list on the left, board in center, analysis on the right
- Beautiful blue-gray board theme with customizable piece sets
- Chess960 and Puzzles support
- Play against Stockfish at any ELO level
- Responsive design optimized for mobile and desktop

<img src="https://github.com/GuillaumeSD/Chesskit/blob/main/assets/showcase.png" />

## Stack

Built with [Next.js](https://nextjs.org/docs), [React](https://react.dev/learn/describing-the-ui), [Material UI](https://mui.com/material-ui/getting-started/overview/), and [TypeScript](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html).

Deployed on AWS with [AWS CDK](https://docs.aws.amazon.com/cdk/v2/guide/home.html), see it live at [chess.awmrit.com](https://chess.awmrit.com).

## Running the app in dev mode

#### Using Node.js

> [!IMPORTANT]  
> At least [Node.js](https://nodejs.org) 22.11 is required.

Install the dependencies :

```bash
npm i
```

Run the development server :

```bash
npm run dev
```

#### Using Docker

Run the development server :

```bash
HOST_UID=$(id -u) HOST_GID=$(id -g) COMMAND=dev docker compose -f ./docker/docker-compose-dev.yml up
```

Open [http://localhost:3000](http://localhost:3000) in the browser to see the app running.

The app will automatically refresh on any source file change.

## Lint

Run it with :

```bash
npm run lint
```

or with docker :

```bash
HOST_UID=$(id -u) HOST_GID=$(id -g) COMMAND=lint docker compose -f ./docker/docker-compose-dev.yml up
```

## Contribute

See [contributing](CONTRIBUTING.md) for details on how to contribute to the project.

## Deploy

To deploy the app, install [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) and [authenticate](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-quickstart.html), then run :

```bash
npm run deploy
```

## License

Chessrith is licensed under the GNU Affero General Public License 3. See [copying](COPYING.md) for
details.

Based on [Chesskit](https://github.com/GuillaumeSD/Chesskit) by GuillaumeSD.

## Self-hosting

To run the project locally in production mode, you can use docker and the following command :

```bash
docker compose -f ./docker/docker-compose-prod.yml up
```
