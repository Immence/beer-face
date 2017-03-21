-- Up
CREATE TABLE Beers (
  beer INTEGER PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  male DECIMAL,
  female DECIMAL,
  sideburns DECIMAL,
  glasses DECIMAL,
  moustache DECIMAL,
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
  moustache,
  beard,
  smile,
  glasses,
  age)
VALUES (
  'Ringnes Pilsner',
  'En lett pilsner som alle liker',
  '0.8',
  '0.2',
  '0',
  '0',
  '0',
  '0.5',
  '0',
  '30'
);

INSERT INTO Beers (
  name,
  description,
  male,
  female,
  sideburns,
  moustache,
  beard,
  smile,
  glasses,
  age)
VALUES (
  'Double imperial stout',
  'En heftig imperial som ingen egentlig liker',
  '1',
  '0',
  '1',
  '1',
  '1',
  '0',
  '0.4',
  '50'
);

INSERT INTO Beers (
  name,
  description,
  male,
  female,
  sideburns,
  moustache,
  beard,
  smile,
  glasses,
  age)
VALUES (
  'Cider',
  'Friskt og fint!',
  '0',
  '1',
  '0',
  '0',
  '0',
  '1',
  '0',
  '14'
);

-- Down
DROP TABLE Beers;
DROP TABLE Images;
