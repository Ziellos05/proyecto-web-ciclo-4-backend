import { gql } from 'apollo-server';

const userType = gql`
  # User
  type User {
    _id: ID!
    email: String!
    documentId: Float!
    name: String!
    lastName: String!
    fullName: String!
    role: UserRole!
    status: UserStatus!
    enrollments: [Enrollment]
  }
`;

const enums = gql`
  # Enum for role values
  enum UserRole {
    ADMIN
    LEADER
    STUDENT
  }

  # Enum for status values
  enum UserStatus {
    PENDING
    AUTHORIZED
    UNAUTHORIZED
  }
`;

const filtros = gql`
  input FiltroUsuarios{
    _id: ID
    email: String
    documentId: Float
    role: UserRole
    status: UserStatus
  }

`;


const queries = gql`
  # Query all users
  type Query {
    allUsers(filtro: FiltroUsuarios): [User]
  }

  type Query {
    allStudents: [User]
  }

  type Query {
    userById(_id: ID!): User
  }

  type Query {
    user: User!
  }

  type Query {
    userByEmail(email: String!): User
  }

  type Query {
    userByDocumentId(documentId: Float!): User
  }

  type Query {
    login(email: String!, password: String!): String!
  }
`;

const mutations = gql`
  type Mutation {
    register(input: RegisterInput!): User!
  }

  type Mutation {
    updateUser(input: UpdateUserInput!): User!
  }

  type Mutation {
    updateUserStatus(input: UpdateUserStatusInput!): User!
  }
`;

const inputs = gql`
  input RegisterInput {
    email: String!
    documentId: Float!
    name: String!
    lastName: String!
    role: UserRole!
    password: String!
  }

  input UpdateUserInput {
    email: String
    documentId: Float
    name: String
    lastName: String
    fullName: String
    role: UserRole
    password: String
  }

  input UpdateUserStatusInput {
    email: String!
    status: UserStatus!
  }
`;

export default [
  userType,
  enums,
  queries,
  mutations,
  inputs,
  filtros
];
