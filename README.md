# UPX Portal Frontend

Vue.js client to recreate the UCS5 portal for the Univention Phoenix suite.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

## Unit tests
### Run your unit tests
```
npm run test:unit
```
### Snapshot testing
This is done for simple components, just to ensure that they keep their design while we're changing other stuff.
Most IDEs support this in some degree, for example IDEA just puts a link to regenerate to every failed snapshot test.
#### Update snapshots interactively
Preferred way, all unittests run everytime when you change something, immediate feedback und regeneration with a keystroke. Not limited to snapshots...
```
test:unit:watch
```
#### Update all snapshots
(use this with care)
```
test:unit:updatesnapshots
```


### Run your end-to-end tests
```
npm run test:e2e
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Icons (Feather-Sprite)
[Preview / reference](https://feathericons.com/)

