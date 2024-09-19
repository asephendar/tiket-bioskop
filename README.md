# NextWeb Application

> Minimum required NodeJS version: v20.10.0

## Available Scripts

In the project directory, you can:

### Install dependencies

Use pnpm `install`, `add`, and `remove` command to manage application dependencies

```sh
pnpm install
```

### Run application (development mode)

Use `nextweb start` command to start the development server and serve the application

```sh
pnpm [nextweb] start
```

### Build application (production mode)

Use `nextweb build` command to build the application

> It is recommended to set the NODE_ENV variable to `production` when building the application. You can do this using the `cross-env` package or by using the `--production` flag

```sh
pnpm [nextweb] build --production
```

### Run static analysis

Use `nextweb lint` command to run the static analysis

```sh
pnpm [nextweb] lint
```


### Run unit testing

Use `nextweb test` command to run the unit testing

```sh
pnpm [nextweb] test
```

### Analyze outdated dependencies

Use `nextweb depcheck` command to run dependency analysis. 

```sh
pnpm [nextweb] depcheck
```

### Update dependencies

Use pnpm `update` command to update the application dependencies. 

```sh
pnpm update --latest -i
```

### Display build configuration

Use `nextweb config` command to display build configuration.

```sh
pnpm nextweb config
```

### Display help

Use `nextweb help` command to display usage text.

```sh
pnpm nextweb help
```
# tiket-bioskop
