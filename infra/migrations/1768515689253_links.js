/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("links", {
    code: {
      type: "varchar(50)",
      primaryKey: true,
      notNull: true,
    },
    url: {
      type: "text",
      notNull: true,
    },
    clicks: {
      type: "integer",
      notNull: true,
      default: 0,
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("NOW()"),
    },
  });

  pgm.createIndex("links", "created_at", {
    name: "idx_links_created_at",
    method: "btree",
  });
};

exports.down = (pgm) => {
  pgm.dropTable("links");
};

exports.down = (pgm) => {};
