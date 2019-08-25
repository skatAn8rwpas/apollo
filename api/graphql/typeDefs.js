const { gql } = require('apollo-server-micro');


const typeDefs = gql`

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  "Description for the type"
  type User {
    """
    Description for field
    Supports **multi-line** description for your [API](http://example.com)!
    """
    _id: ID!
    name: String!
    email: String!
    password: String!
    token: String
  }

  type Author {
    _id: ID!
    firstName: String!
    lastName: String!
    books: [Book]! # the list of books by this author
  }

  type Book {
    _id: ID!
    title: String!
    rating: Int!
    author: Author!
  }

  type Post {
    _id: ID!
    title: String!
    author: User!
  }

  interface MutationResponse {
    code: String!
    success: Boolean!
    message: String!
  }

  type UpdateUserMutationResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    user: User
  }

  type LikePostMutationResponse implements MutationResponse {
    code: String!
    success: Boolean!
    message: String!
    post: Post
    user: User
  }

  # the schema allows the following query
  type Query {
    books: [Book]!
    book(id: ID!): Book!
    authors: [Author]!
    author(id: ID!): Author
    uploads: [File]!
    readError: String
  }

  # this schema allows the following mutation
  type Mutation {
    addBook(title: String!, rating: Int!, authorId: String!): Book!
    addAuthor(firstName: String!, lastName: String!): Author!
    addUser(name: String!, email: String!, password: String!): UpdateUserMutationResponse!
    singleUpload(file: Upload!): File!
  }
`;

module.exports = typeDefs
