const { ApolloServer, gql } = require('apollo-server-micro');
const { connect } = require('./src/config')
const {ObjectID} = require('mongodb')




// let bookId = 5;
// const books = [
//   { id: 1, title: 'The Trials of Brother Jero', rating: 8, authorId: 1 },
//   { id: 2, title: 'Half of a Yellow Sun', rating: 9, authorId: 3 },
//   { id: 3, title: 'Americanah', rating: 9, authorId: 3 },
//   { id: 4, title: 'King Baabu', rating: 9, authorId: 1 },
//   { id: 5, title: 'Children of Blood and Bone', rating: 8, authorId: 2 },
// ];

// const authors = [
//   { id: 1, firstName: 'Wole', lastName: 'Soyinka' },
//   { id: 2, firstName: 'Tomi', lastName: 'Adeyemi' },
//   { id: 3, firstName: 'Chimamanda', lastName: 'Adichie' },
// ];

const typeDefs = gql`
  type Author {
    _id: String!
    firstName: String!
    lastName: String!
    books: [Book]! # the list of books by this author
  }

  type Book {
    _id: String!
    title: String!
    rating: Int!
    author: Author!
  }

  # the schema allows the following query
  type Query {
    books: [Book!]!
    book(_id: String!): Book!
    authors: [Author!]!
    author(_id: String!): Author!
  }

  # this schema allows the following mutation
  type Mutation {
    addBook(title: String!, rating: Int!, authorId: String!): Book!
    addAuthor(firstName: String!, lastName: String!): Author!
  }
`;


const resolvers = {
  Query: {
    books: () => connect().then(async (client) =>
      await client.db('test').collection('books').find().toArray()
    ),
    book: (root, { _id }) => connect().then(async (client) =>
      await client.db('test').collection('books').findOne({_id: new ObjectID(_id)})
    ),
    authors: () => connect().then(async (client) =>
      await client.db('test').collection('authors').find().toArray()
    ),
    author: (_, { _id }) => connect().then(async (client) =>
      await client.db('test').collection('authors').findOne({_id: new ObjectID(_id)})
    ),
  },
  Mutation: {
    addBook: (_, { title, rating, authorId }) => {
      bookId++;

      const newBook = {
        id: bookId,
        title,
        rating,
        authorId,
      };

      books.push(newBook);
      return newBook;
    },

    addAuthor: (root, {firstName, lastName}) => connect().then(async client => {
      const result = await client.db('test').collection('authors').insertOne({ firstName, lastName })
      console.log(result)
      return result.ops[0]
    })
  },
  Author: {
    books: author => connect().then(async (client) =>
      await client.db('test').collection('books').find({authorId: new ObjectID(author._id)}).toArray()
    )
  },

  Book: {
    author: book => connect().then(async (client) =>
      await client.db('test').collection('authors').findOne({_id: new ObjectID(book.authorId)})
    )
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
});

module.exports = server.createHandler();
