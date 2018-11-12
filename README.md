# feathers-forward

A [Feathers](https://feathersjs.com) forward service adapter. Supports only `rest` provider for now.

```bash
$ npm install --save feathers-forward
```

## API

### `configure(options)`

Configure [Feathers application](https://feathersjs.com) to forward all unknown services to remote server.

__Options:__

- `uri`        (**required**) - Uri to remote server
- `reqHeaders`                - Headers to forward from REST req object
- `resHeaders`                - Headers to be added to REST res object from forwarded response


## Example

Here's a example of configuration.

```js
const compress = require('compression');
const helmet = require('helmet');
const cors = require('cors');

const feathers = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');
const express = require('@feathersjs/express');
const forward = require('feathers-forward').configure;

const middleware = require('./middleware');
const services = require('./services');

const app = express(feathers());

// Load app configuration
app.configure(configuration());
// Enable security, CORS, compression, favicon and body parsing
app.use(helmet());
app.use(cors());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Set up Plugins and providers
app.configure(express.rest());

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
// Set up our services (see `services/index.js`)
app.configure(services);
// Forward everything else
app.configure(forward({
  uri: 'https://example.com',
  reqHeaders: ['Authorization'],
  resHeaders: ['custom-header']
}));

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({logger}));

```

## License

[MIT](LICENSE)

## Authors

- [Touch4IT, s.r.o. contributors](https://github.com/touch4it/feathers-forward/graphs/contributors)
