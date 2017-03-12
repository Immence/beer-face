import Beers from '../models/Beers';

export function listBeers(req, res, next) {
  return new Beers(req.locals.db).list()
    .catch(err => next(err))
    .then((beers) => {
      res.send(beers);
      return next();
    });
}

export function getBeer(req, res, next) {
  return new Beers(req.locals.db).single(req.params.beer)
    .catch(err => next(err))
    .then((beer) => {
      res.send(beer);
      return next();
    });
}

export function addBeer(req, res, next) {
  return new Beers(req.locals.db).add(req.params)
    .catch(err => next(err))
    .then((beers) => {
      res.send(beers);
      return next();
    });
}
