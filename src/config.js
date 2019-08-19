const { MongoClient } = require('mongodb');

const { DB_USER, DB_PASS } = process.env
const DB_URI = `mongodb+srv://${DB_USER}:${encodeURIComponent(DB_PASS)}@cluster0-m08ua.azure.mongodb.net/test?retryWrites=true&w=majority`

module.exports.connect = connect

// const client = new MongoClient(DB_URI, { useNewUrlParser: true });



// client.connect(err => {


//   console.log('Connection with mongoAltas establish')
//   const collection = client.db("test").collection("users");

//   // collection.insertOne({
//   //   username: 'coolAngel',
//   //   email: 'coolangel@hotmail.gr'
//   // })

//   // perform actions on the collection object
//   client.close();
// });



async function connect (options = {}) {

  /** @type {MongoClientOptions} */
  const defaults = { useNewUrlParser: true, bufferMaxEntries: 0 }

  const client = new MongoClient(DB_URI, { ...defaults, ...options });

  if(client.isConnected()) return client;


  try {
    return await client.connect()
  } catch (error) { }

}
