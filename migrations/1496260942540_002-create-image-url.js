exports.up = function(pgm) {
  pgm.dropTable('images');

  var suggestionColumns = {
    suggestion: { type: 'serial', primaryKey: true },
    image_url: { type: 'text', unique: true, notNull: true },
    suggestions: 'text',
  };

  pgm.createTable('suggestions', suggestionColumns);
};

exports.down = function (pgm) {
  pgm.dropTable('suggestions');
  var imageCols = {
    image: { type: 'integer', primaryKey: true },
    filepath: { type: 'text', unique: true, notNull: true },
    faces: 'text',
  };
  pgm.createTable('images', imageCols);
};
