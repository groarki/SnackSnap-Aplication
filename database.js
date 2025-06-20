const { MongoClient } = require("mongodb");
const { MONGODB_URI, DB_NAME } = require("./config");

let database;

const mongoConnect = (callback) => {
  MongoClient.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  })
    .then((client) => {
      console.log("Successfully connected to MongoDB!");
      database = client.db(DB_NAME);
      callback();
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error);
      setTimeout(() => {
        console.log("Retrying connection...");
        mongoConnect(callback);
      }, 5000);
    });
};

const getDatabase = () => {
  if (!database) {
    throw new Error("Database not initialized! Call mongoConnect() first");
  }
  return database;
};

module.exports = { mongoConnect, getDatabase };
