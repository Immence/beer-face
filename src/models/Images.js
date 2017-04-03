export default class Images {

  constructor(db) {
    this.db = db;
  }

  add(filepath) {
    return this.db.query('INSERT INTO images(image, filepath) values(NULL,?)', filepath);
  }

  list() {
    return this.db.any('SELECT * FROM images');
  }

  update(image) {
  }
}
