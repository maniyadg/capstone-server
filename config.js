const mongodb = require("mongodb");
const { MongoClient } = require("mongodb");
const JWT_SECRET = process.env.JWT_SECRET;
const url = process.env.URL;
const client = new MongoClient(url);
var connection;
var db;
async function connectDb() {
  connection = await client.connect();
  db = connection.db("investory_billing_app");
  return db
}
async function closeconnection() {
  if (connectDb) {
    await connection.close()
  } else {
    console.log('no connection');
  }
}




module.exports = { connectDb, connection, db, closeconnection }