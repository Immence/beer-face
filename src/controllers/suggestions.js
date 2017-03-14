import fs from 'fs';
import path from 'path';
import uuid from 'uuid/v1';
import Faces from '../models/Faces';
import Images from '../models/Images';

function insertImage(db, filePath) {
  return new Images(db).add(filePath);
}

export function listImages(req, res, next) {
  return new Images(req.locals.db)
    .list()
    .then((images) => {
      console.log('got it');
      console.log(images);
      res.send(images);
      next();
    })
    .catch(err => next(err));
}

export function storeImage(req, res, next) {
  const folder = path.resolve(__dirname, '../public/faces/');
  const filename = `${uuid()}${path.extname(req.files.image.path)}`;
  const newPath = path.join(folder, filename);
  fs.rename(req.files.image.path, newPath, (err) => {
    next({ error: 'Failed to store image', err });
  });
  return insertImage(req.locals.db, newPath)
  .then(() => next())
  .catch(err => next(err));
}

export function getFaces(req, res, next) {
  console.log('getting faces');
  return next();
}

export function suggestBeers(req, res, next) {
  console.log('suggest beers');
  res.send('fuck');
  return next();
}


export function getSuggestions(req, res, next) {
  // store file
  // store filename in database over suggestions
  // return suggestions

  Faces.detect
    .catch(err => next(err))
    .then((beer) => {
      res.send(beer);
      return next();
    });
}
