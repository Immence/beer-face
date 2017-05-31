export default class Suggestions {

  constructor(db) {
    this.db = db;
  }

  addImage(imageUrl) {
    return this.db.query('INSERT INTO "suggestions" (suggestion, image_url) values(DEFAULT, $<imageUrl>) RETURNING suggestion', { imageUrl });
  }


  updateSuggestion(suggestion, suggestions) {
    console.log('updateing');
    console.log(suggestion);
    console.log(suggestions);
    return this.db.query('UPDATE "suggestions" SET suggestions = $<suggestions> WHERE suggestion = $<suggestion>', { suggestions, suggestion });
  }

  list() {
    return this.db.any('SELECT * FROM images');
  }
}
