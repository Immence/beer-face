export default class Beers {

  constructor(db) {
    this.db = db;
  }

  single(beer) {
    return this.db.get('SELECT beer, name, description FROM Beers WHERE beer = ?', beer);
  }

  list() {
    return this.db.all('SELECT * FROM Beers');
  }

  add({
    name,
    description,
    male,
    female,
    sideburns,
    moustach,
    beard,
    age,
    smile }) {
    return this.db
      .run('INSERT INTO Beers(beer, name, description, male, female, sideburns, moustache, beard, age, smile) values(NULL,?,?,?,?,?,?,?,?,?)',
      name, description, male, female, sideburns, moustach, beard, age, smile);
  }
}
