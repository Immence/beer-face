import uuid from 'uuid/v1';
import aws from 'aws-sdk';

import Faces from '../models/Faces';
import Beers from '../models/Beers';
import Suggestions from '../models/Suggestions';

function insertImageUrl(db, imageUrl) {
  return new Suggestions(db).addImage(imageUrl);
}

function updateSuggestion(db, suggestion, suggestions) {
  return new Suggestions(db).updateSuggestion(suggestion, JSON.stringify(suggestions));
}

function parseFaces(unparsedFaces) {
  return unparsedFaces.map((unparsedFace) => {
    const parsedFace = {
      smile: unparsedFace.faceAttributes.smile,
      moustache: unparsedFace.faceAttributes.facialHair.moustache,
      beard: unparsedFace.faceAttributes.facialHair.beard,
      sideburns: unparsedFace.faceAttributes.facialHair.sideburns,
      age: unparsedFace.faceAttributes.age,
      male: (unparsedFace.faceAttributes.gender === 'male') ? 1 : 0,
      female: (unparsedFace.faceAttributes.gender === 'female') ? 1 : 0,
      glasses: (unparsedFace.faceAttributes.glasses === 'NoGlasses') ? 0 : 1,
      faceRectangle: unparsedFace.faceRectangle,
    };
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
          beer: {
            beer: beer.beer,
            name: beer.name,
            description: beer.description,
          },
          parsedFace: face,
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
  return new Suggestions(req.locals.db)
    .list()
    .then((images) => {
      res.send(images);
      next();
    })
    .catch(err => next(err));
}

export function storeImage(req, res, next) {
  // eslint-disable-next-line no-param-reassign
  req.locals.imageUrl = JSON.parse(req.body).imageUrl;
  return insertImageUrl(req.locals.db, req.locals.imageUrl)
    .then((result) => {
      // eslint-disable-next-line no-param-reassign
      req.locals.suggestion = result[0].suggestion;
      return next();
    })
    .catch(err => next(err));
}

export function getFaces(req, res, next) {
  return Faces.detect(req.locals.imageUrl)
    .then((faces) => {
      // eslint-disable-next-line no-param-reassign
      req.locals.faces = parseFaces(JSON.parse(faces));
      return next();
    })
    .catch(err => next(err));
}

export function getS3UploadParams(req, res, next) {
  const s3 = new aws.S3();
  const filename = `${uuid()}-${Date.now()}`;
  const S3_BUCKET = process.env.S3_BUCKET;

  const s3Params = {
    Bucket: S3_BUCKET,
    Key: filename,
    Expires: 60,
    ContentType: 'image/jpeg',
    ACL: 'public-read',
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${s3Params.Key}`,
    };
    res.write(JSON.stringify(returnData));
    return res.end();
  });
}

export function listSuggestions(req, res, next) {
  return new Suggestions(req.locals.db).list()
    .then((beers) => {
      res.send(beers);
      return next();
    })
    .catch(err => next(err));
}

export function suggestBeers(req, res, next) {
  Promise.all(getSuggestions(req.locals.db, req.locals.faces))
    .then((suggestions) => {
      res.send(suggestions);
      updateSuggestion(req.locals.db, req.locals.suggestion, suggestions);
      return next();
    });
}
