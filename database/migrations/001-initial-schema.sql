-- Up
CREATE TABLE Beers (
  beer INTEGER PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  male DECIMAL,
  female DECIMAL,
  sideburns DECIMAL,
  mustach DECIMAL,
  beard DECIMAL,
  smile DECIMAL,
  age DECIMAL);

CREATE TABLE Images (
  image INTEGER PRIMARY KEY,
  filepath TEXT UNIQUE NOT NULL,
  faces TEXT);

INSERT INTO Beers (
  name,
  description,
  male,
  female,
  sideburns,
  mustach,
  beard,
  smile,
  age)
VALUES (
  'Ringnes Pilsner',
  'En lett pilsner som alle liker',
  '0.8',
  '0.2',
  '0',
  '0',
  '0',
  '1',
  '30'
);

INSERT INTO Beers (
  name,
  description,
  male,
  female,
  sideburns,
  mustach,
  beard,
  smile,
  age)
VALUES (
  'Double imperial stout',
  'En heftig imperial som ingen egentlig liker',
  '0.8',
  '0.2',
  '1',
  '1',
  '1',
  '0.5',
  '50'
);

INSERT INTO Beers (
  name,
  description,
  male,
  female,
  sideburns,
  mustach,
  beard,
  smile,
  age)
VALUES (
  'Saison',
  'Digg øl!',
  '1',
  '1',
  '0.8',
  '0.4',
  '0',
  '0.9',
  '50'
);

-- Down
DROP TABLE Beers;
DROP TABLE Images;
