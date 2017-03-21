import fs from 'fs';
import path from 'path';
import uuid from 'uuid/v1';
import Faces from '../models/Faces';
import Beers from '../models/Beers';
import Images from '../models/Images';

function insertImage(db, filePath) {
  return new Images(db).add(filePath);
}

function parseFaces(unparsedFaces) {
  return unparsedFaces.map((unparsedFace) => {
    const parsedFace = {
      smile: unparsedFace.faceAttributes.smile,
      moustache: unparsedFace.faceAttributes.facialHair.moustache,
      beard: unparsedFace.faceAttributes.facialHair.beard,
      sideburns: unparsedFace.faceAttributes.facialHair.sideburns,
      age: unparsedFace.faceAttributes.age,
    };

    if (unparsedFace.faceAttributes.gender === 'male') {
      parsedFace.male = 1;
      parsedFace.female = 0;
    } else if (unparsedFace.faceAttributes.gender === 'female') {
      parsedFace.male = 0;
      parsedFace.female = 1;
    }

    parsedFace.glasses = 0;
    if (unparsedFace.faceAttributes.glasses !== 'NoGlasses') {
      parsedFace.glasses = 1;
    }
    return parsedFace;
  });
}

function getWeight(key) {
  const weights = {
    beer: 100,
    male: 100,
    female: 100,
    sideburns: 100,
    moustache: 100,
    beard: 100,
    smile: 100,
    age: 1,
  };
  return weights[key];
}

function getAttributeScore(beerAttr, faceAttr, weight) {
  if (!isNaN(faceAttr) && !isNaN(beerAttr) && !isNaN(weight)) {
    return Math.abs((faceAttr - beerAttr)) * weight;
  }
  return 0;
}

function getBeerScore(beer, face) {
  const values = Object.keys(beer).map((key) => {
    const faceAttr = face[key];
    const beerAttr = beer[key];
    const weight = getWeight(key);
    return getAttributeScore(beerAttr, faceAttr, weight);
  });
  return values.reduce((acc, val) => acc + val, 0);
}

function getSuggestion(face, beers) {
  return beers.list()
    .then(beerList =>
      beerList.map((beer) => {
        const beerScore = {
          beer: beer.beer,
          score: getBeerScore(beer, face),
        };
        return beerScore;
      }))
    .then((scoreList) => {
      const finalWinner = scoreList.reduce((winner, beer) => {
        if (beer.score < winner.score) {
          return beer;
        }
        return winner;
      }, { score: 99999 });
      return finalWinner;
    });
}

function getSuggestions(db, faces) {
  const beers = new Beers(db);
  return faces.map(face => getSuggestion(face, beers));
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
      // eslint-disable-next-line no-param-reassign
      req.locals.faces = parseFaces(JSON.parse(faces));
      return next();
    })
    .catch(err => next(err));
}

export function suggestBeers(req, res, next) {
  Promise.all(getSuggestions(req.locals.db, req.locals.faces))
    .then((suggestions) => {
      // TODO: insert suggestion into image table
      // TODO: return more than just the suggesion:?
      // The features of the face? and the features of the beer we suggest?
      // Kanskje returner bildet, ølanbefaling(på koordinater?), og face score?
      res.send(suggestions);
      return next();
    });
}
