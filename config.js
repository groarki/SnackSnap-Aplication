require("dotenv").config();

const PORT = 3000;

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;

const MONGODB_URI = ``;

if (!DB_USER || !DB_PASS) {
  console.error("Error with authentification data");
}

module.exports = {
  PORT,
  DB_USER,
  DB_PASS,
  MONGODB_URI,
};
