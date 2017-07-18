export default class Suggestions {

  constructor(db) {
    this.db = db;
  }

  addImage(imageUrl) {
    return this.db.query('INSERT INTO "suggestions" (suggestion, image_url) values(DEFAULT, $<imageUrl>) RETURNING suggestion', { imageUrl });
  }


  updateSuggestion(suggestion, suggestions) {
    return this.db.query('UPDATE "suggestions" SET suggestions = $<suggestions> WHERE suggestion = $<suggestion>', { suggestions, suggestion });
  }

  list() {
    return this.db.any('SELECT * FROM suggestions ORDER BY suggestion DESC WHERE suggestions IT NOT NULL');
  }
}
