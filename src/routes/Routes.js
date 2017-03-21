import restify from 'restify';
import path from 'path';
import { getBeer, listBeers, addBeer } from '../controllers/beers';
import { listImages, storeImage, getFaces, suggestBeers } from '../controllers/suggestions';

export default class PublicRoutes {

  constructor(server) {
    this.server = server;
  }

  setupRoutes() {
    this.server.get(
      /\/public\/?.*/,
      restify.serveStatic({
        directory: path.resolve(__dirname, '../public/'),
      }));


    this.server.post(
      'api/suggest',
      [storeImage, getFaces, suggestBeers],
    );

    this.server.get(
      'api/images',
      listImages,
    );

    this.server.get(
      'api/beer/:beer',
      getBeer,
    );

    this.server.get(
      'api/beer',
      listBeers,
    );

    this.server.post(
      'api/beer',
      addBeer,
    );
  }
}
