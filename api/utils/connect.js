const { MongoClient } = require('mongodb');
const { DB_URI } = require('../config');

/**@type {MongoClient} */
let client;


module.exports.connect = connect

async function connect (options = {}) {

  /** @type {mongodb.MongoClientOptions} */
  const defaults = { useNewUrlParser: true, bufferMaxEntries: 0 }

  if( client && client.isConnected()) return client;

  client = new MongoClient(DB_URI, { ...defaults, ...options });

  // if(client.isConnected()) return client;


  try {
    return await client.connect();
  } catch (error) { throw error }
}

module.exports.connectDb = async function(dbName) {
  const client = await connect();
  return client.db(dbName)
}
