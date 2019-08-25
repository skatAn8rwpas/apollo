const {ApolloServer} = require('apollo-server-micro');
const {generateUserModel} = require('./models/User')
const {typeDefs, resolvers} = require('./graphql')
const cors = require('cors')({origin: true})


const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  context: ({ req }) => {
    // get the user token from the headers
    const token = req.headers.authorization || '';

    // try to retrieve a user with the token
    const user = getUser(token);

    /******************************************************************************************
    // optionally block the user
    // we could also check user roles/permissions here
    if (!user) throw new AuthenticationError('you must be logged in to query this schema');
    ******************************************************************************************/


    // add the user to the context
    return {
      user,
      models: {
        User: generateUserModel({user})
      }
    };
  },
});

const handler = server.createHandler({path: '/api'})

module.exports = (req, res) =>
  cors(req, res, () => handler(req, res))



function getUser(token) {
  if(!token) return null
}
