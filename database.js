const { MongoClient } = require("mongodb");
const { MONGODB_URI, DB_NAME } = require("./config");

let database;

const mongoConnect = (callback) => {
  MongoClient.connect(MONGODB_URI)
    .then((client) => {
      console.log("Successfully connected to MongoDB!");
      database = client.db(DB_NAME);
      callback();
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error);
      process.exit(1);
    });
};

const getDatabase = () => {
  if (!database) {
    throw new Error("Database not initialized! Call mongoConnect() first");
  }
  return database;
};

module.exports = { mongoConnect, getDatabase };
