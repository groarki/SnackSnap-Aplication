require("dotenv").config();

const PORT = 3000;
const DB_NAME = "snacksnap";

const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;

const MONGODB_URI = `mongodb+srv://${DB_USER}:${DB_PASS}@snacksnap.o8g13lg.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=SnackSnap`;

if (!DB_USER || !DB_PASS) {
  console.error("Error with authentification data");
}

module.exports = {
  PORT,
  DB_USER,
  DB_PASS,
  DB_NAME,
  MONGODB_URI,
};
