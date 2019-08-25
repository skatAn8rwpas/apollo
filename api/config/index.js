const { DB_USER, DB_PASS } = process.env

module.exports = {
  DB_URI: `mongodb+srv://${DB_USER}:${encodeURIComponent(DB_PASS)}@cluster0-m08ua.azure.mongodb.net/test?retryWrites=true&w=majority`
}
