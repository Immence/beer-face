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
  // eslint-disable-next-line no-param-reassign
  req.locals.imagePath = newPath;
  return insertImage(req.locals.db, newPath)
    .then(() => next())
    .catch(err => next(err));
}

export function getFaces(req, res, next) {
  return Faces.detect(req.locals.imagePath)
    .then((faces) => {
      res.send(faces);
      next();
    })
    .catch(err => next(err));
}

export function suggestBeers(req, res, next) {
  return next();
}


export function getSuggestions(req, res, next) {
  Faces.detect
    .catch(err => next(err))
    .then((beer) => {
      return next();
    });
}
