# ts-node-vue-monorepo

## Quick Start

Node.js v12 (or greater) and yarn are required:

```sh
git clone https://github.com/andrewmackrodt/ts-node-vue-monorepo
cd ts-node-vue-monorepo
yarn install
yarn start
```

## Commands

| Command | Description |
|---|---|
| `yarn start` | Starts [webpack][webpack] with HMR and [express][express] on ports `8080` and `5000` respectively. |
| `yarn build` | Creates a production bundle |

See `packages/${package}/package.json` for more commands.

Packages are prefixed with `@app`, e.g. to run eslint for the frontend project,
run `yarn workspace @app/frontend lint`.

[webpack]: http://localhost:8080
[express]: http://localhost:5000
