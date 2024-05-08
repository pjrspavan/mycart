const dotenv = require("dotenv");
const { Pool } = require("pg");
dotenv.config();

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: "localhost",
  database: "shopper",
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

module.exports = pool;
