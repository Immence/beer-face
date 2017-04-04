import restify from 'restify';
import Promise from 'bluebird';

import Routes from './routes/Routes';

const pgp = require('pg-promise')();

global.Promise = Promise;

console.log(`${process.env.DATABASE_URL}?ssl=true`);
// Get the enviroment
const db = pgp(`${process.env.DATABASE_URL}?ssl=true`);

// get the port from env. variable or run on 8080
const port = (process.env.PORT || 8080);

const server = restify.createServer();
const routes = new Routes(server);


server.use(restify.gzipResponse());
server.pre(restify.pre.sanitizePath());
server.use(restify.bodyParser({
  keepExtensions: true,
}));


server.use((req, res, next) => {
  // eslint-disable-next-line no-param-reassign
  req.locals = { db };
  next();
});

routes.setupRoutes();

Promise.resolve()
  .finally(() => server.listen(port, () => console.log('%s listening at %s', server.name, server.url)));
