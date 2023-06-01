/**
 * Knex configuration file.
 *
 * You will not need to make changes to this file.
 */

require('dotenv').config();
const path = require("path");

const {
  DATABASE_URL = "postgres://tejobwpp:gAvKwQXWOKxzaDpHmeSDeZT1YGNLpKMz@lallah.db.elephantsql.com/tejobwpp",
  DATABASE_URL_DEVELOPMENT = "postgres://wwtgsnvd:oZ8YG-g0qzLaCBcTD0jFMGfDdQ9pkP99@lallah.db.elephantsql.com/wwtgsnvd",
  DATABASE_URL_TEST = "postgres://cxiendqr:iSvMjXzfuiab5Rqh1pofKBpN4L-mP8S-@lallah.db.elephantsql.com/cxiendqr",
  DATABASE_URL_PREVIEW = "postgres://ioznqukf:1_bqxMv4uuT8TiH4ur2TxwkFH7Wys4Qc@lallah.db.elephantsql.com/ioznqukf",
  DEBUG,
} = process.env;

module.exports = {
  development: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_DEVELOPMENT,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  test: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_TEST,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  preview: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_PREVIEW,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  production: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
};
