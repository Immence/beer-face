import restify from 'restify';
import Promise from 'bluebird';
import db from 'sqlite';

import Routes from './routes/Routes';

global.Promise = Promise;

const port = (process.env.PORT || 5000);

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
  .then(() => db.open('./database/database.sqlite', { Promise }))
  .then(() => db.migrate({ force: 'last', migrationsPath: './database/migrations' }))
  .catch(error => console.error('Database Error:', error.stack))
  .finally(() => server.listen(port, () => console.log('%s listening at %s', server.name, server.url)));
