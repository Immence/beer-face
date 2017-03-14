import Beers from '../models/Beers';

export function listBeers(req, res, next) {
  return new Beers(req.locals.db).list()
    .then((beers) => {
      res.send(beers);
      return next();
    })
    .catch(err => next(err));
}

export function getBeer(req, res, next) {
  return new Beers(req.locals.db).single(req.params.beer)
    .then((beer) => {
      res.send(beer);
      return next();
    })
    .catch(err => next(err));
}

export function addBeer(req, res, next) {
  return new Beers(req.locals.db).add(req.params)
    .then(() => {
      res.send();
      return next();
    })
    .catch(err => next(err));
}
