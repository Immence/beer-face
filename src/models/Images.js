export default class Images {

  constructor(db) {
    this.db = db;
  }

  add(filepath) {
    return this.db.run('INSERT INTO Images(image, filepath) values(NULL,?)', filepath);
  }

  list() {
    return this.db.all('SELECT * FROM Images');
  }

  update(image) {
  }
}
