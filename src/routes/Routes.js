import restify from 'restify';
import path from 'path';
import { getBeer, listBeers, addBeer } from '../controllers/beers';
import { listImages, storeImage, getFaces, suggestBeers, getS3UploadParams } from '../controllers/suggestions';


export default class PublicRoutes {

  constructor(server) {
    this.server = server;
  }

  setupRoutes() {
    this.server.get('/', () => {
      console.log('dirname', __dirname);
      console.log('cwd', process.cwd());
    });

    this.server.get(/\/public\/?.*/, restify.serveStatic({
      directory: path.join(process.cwd(), '/dist'),
    }));

    this.server.get('/', restify.serveStatic({
      directory: path.join(process.cwd(), '/dist'),
      default: 'index.html',
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
      'api/beer',
      listBeers,
    );

    this.server.post(
      'api/beer',
      addBeer,
    );
  }
}
