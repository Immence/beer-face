export default class Beers {

  constructor(db) {
    this.db = db;
  }

  single(beer) {
    return this.db.one('SELECT * FROM "beers" WHERE beer = $1', beer);
  }

  update(beerParams) {
    return this.db.query('UPDATE "beers" SET (name, description, male, female, sideburns, moustache, beard, age, smile) = ($<name>, $<description>, $<male>, $<female>, $<sideburns>, $<moustache>, $<beard>, $<age>, $<smile>) WHERE beer = $<beer>', beerParams);
  }

  list() {
    return this.db.query('SELECT * FROM "beers"');
  }

  add(beerParams) {
    return this.db
      .query('INSERT INTO "beers" (beer, name, description, male, female, sideburns, moustache, beard, age, smile) values (DEFAULT, $<name>, $<description>, $<male>, $<female>, $<sideburns>, $<moustache>, $<beard>, $<age>, $<smile>)',
      beerParams);
  }
}
