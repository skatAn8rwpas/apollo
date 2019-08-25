const { ObjectID } = require('mongodb')
const { connectDb } = require('../utils/connect')
const fs = require('fs')

const resolvers = {
  Query: {
    books: () => connectDb('test').then(async (db) =>
      await db.collection('books').find().toArray()
    ),
    book: (root, { _id }) => connectDb('test').then(async (db) =>
      await db.collection('books').findOne({_id: new ObjectID(_id)})
    ),
    authors: async () => {
      const db = await connectDb('test')
      return await db.collection('authors').find({}).toArray()
    },
    author: async (_, { id }) => {
      const db = await connectDb('test')
      return await db.collection('authors').findOne({_id: new ObjectID(id)})
    },
    uploads: () => {
      // Return the record of files uploaded from your DB or API or filesystem.
    },

    readError: (parent, args, context, info) => {
      fs.readFileSync('/does/not/exist', {encoding: 'utf-8'});
    },

  },
  Mutation: {
    addBook: (_, { title, rating, authorId }) => connect().then(async client => {
      const newBook = {title, rating, authorId: new ObjectID(authorId)}
      const result = await client.db('test').collection('books').insertOne(newBook)
      return result.ops[0]
    }),

    addAuthor: (root, {firstName, lastName}) => connect().then(async client => {
      const result = await client.db('test').collection('authors').insertOne({ firstName, lastName })
      console.log(result)
      return result.ops[0]
    }),

    addUser: (root, {name, email, password}) => {
      connect().then(async client => {
        const insertResul = await client.db('test').collection('users').insertOne({name, email, password})
        const newUser = insertResul.ops[0]
        return {
          code: '200',
          success: true,
          message: 'Bravo... The User is saved.',
          user: newUser
        }
      })
    },

    singleUpload: async (parent, { file }) => {
      const { stream, filename, mimetype, encoding } = await file;

      // 1. Validate file metadata.

      // 2. Stream file contents into cloud storage:
      // https://nodejs.org/api/stream.html

      // 3. Record the file upload in your DB.
      // const id = await recordFile( … )

      return { filename, mimetype, encoding };
    }
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

  MutationResponse: {
    __resolveType(mutationResponse, context, info){
      return null;
    },
  },
};

module.exports = resolvers
