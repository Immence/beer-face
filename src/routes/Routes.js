import restify from 'restify';
import { getBeer, listBeers, addBeer, updateBeer } from '../controllers/beers';
import { listImages, listSuggestions, storeImage, getFaces, suggestBeers, getS3UploadParams } from '../controllers/suggestions';

export default class PublicRoutes {

  constructor(server) {
    this.server = server;
  }

  setupRoutes() {
    this.server.get('/', restify.serveStatic({
      directory: __dirname,
      default: 'index.html',
    }));

    this.server.get(/\/public\/?.*/, restify.serveStatic({
      directory: __dirname,
    }));

    this.server.get(
      'api/uploadParameters',
      getS3UploadParams,
    );

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
      'api/suggestion',
      listSuggestions,
    );

    this.server.get(
      'api/beer',
      listBeers,
    );

    this.server.patch(
      'api/beer',
      updateBeer,
    );

    this.server.post(
      'api/beer',
      addBeer,
    );
  }
}
