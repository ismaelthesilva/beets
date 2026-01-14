/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("posts", {
    id: {
      type: "uuid",
      default: pgm.func("gen_random_uuid()"),
      primaryKey: true,
    },
    user_id: {
      type: "uuid",
      notNull: true,
      references: "users(id)",
      onDelete: "CASCADE",
    },
    title: {
      type: "varchar(255)",
      notNull: true,
    },
    content: {
      type: "text",
      notNull: true,
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.createIndex("posts", "user_id");
};

exports.down = (pgm) => {
  pgm.dropTable("posts");
};

exports.down = (pgm) => {};
