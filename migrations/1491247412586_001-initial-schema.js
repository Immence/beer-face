exports.up = function (pgm) {
  var beerCols = {
    beer: { type: 'serial', primaryKey: true },
    name: { type: 'text', unique: true, notNull: true },
    description: { type: 'text', notNull: true },
    male: 'decimal',
    female: 'decimal',
    sideburns: 'decimal',
    glasses: 'decimal',
    moustache: 'decimal',
    beard: 'decimal',
    smile: 'decimal',
    age: 'decimal',
  };

  var imageCols = {
    image: { type: 'integer', primaryKey: true },
    filepath: { type: 'text', unique: true, notNull: true },
    faces: 'text',
  };

  pgm.createTable('beers', beerCols);
  pgm.createTable('images', imageCols);
};

exports.down = function (pgm) {
  pgm.dropTable('beers');
  pgm.dropTable('images');
};
