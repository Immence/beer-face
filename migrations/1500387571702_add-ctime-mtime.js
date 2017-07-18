exports.up = function (pgm) {

  // add ctime to suggestions
  pgm.addColumns('suggestions', { ctime: { type: 'timestamp', notNull: true, default: pgm.func('NOW()') } });

  // add ctime & mtime to beers
  pgm.addColumns('beers', {
    ctime: { type: 'timestamp', notNull: true, default: pgm.func('NOW()') },
    mtime: { type: 'timestamp', notNull: true, default: pgm.func('NOW()') },
  });

  // create mtime function
  pgm.sql(`
    CREATE FUNCTION mtime() RETURNS TRIGGER
        LANGUAGE plpgsql
        AS $$
    BEGIN
      NEW.mtime := NOW();
      RETURN NEW;
    END;
    $$;
    `);

  // create trigger for beer mtime
  pgm.sql(`
    CREATE TRIGGER beer_mtime
      BEFORE UPDATE ON beers
      FOR EACH ROW
      EXECUTE PROCEDURE mtime();
    `);
};

exports.down = function (pgm) {

};
