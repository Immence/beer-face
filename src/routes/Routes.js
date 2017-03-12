import { getBeer, listBeers, addBeer } from '../controllers/beers';

export default class PublicRoutes {

  constructor(server) {
    this.server = server;
  }

  setupRoutes() {
    this.server.get(
      '/beer/:beer',
      getBeer,
    );

    this.server.get(
      '/beer',
      listBeers,
    );

    this.server.post(
      '/beer',
      addBeer,
    );
  }
}
