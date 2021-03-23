// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

module.exports = {
  development: {
    dialect: 'postgres',
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
  },
  test: {
    dialect: 'postgres',
    host: process.env.TEST_DATABASE_HOST,
    port: process.env.TEST_DATABASE_PORT,
    username: process.env.TEST_DATABASE_USERNAME,
    password: process.env.TEST_DATABASE_PASSWORD,
    database: process.env.TEST_DATABASE,
  },
  production: {
    dialect: 'postgres',
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
  },
};
