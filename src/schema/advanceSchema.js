import { gql } from 'apollo-server';

const advanceType = gql`
  # Advance
  type Advance {
    _id: ID!
    projectID: ID!
    userID: ID!
    advance: String!
    comments: String
    date: String!
    project: Project!
    user: User!
  }
`;

const queries = gql`
  # Query all advances
  type Query {
    allAdvances: [Advance]
  }

  type Query {
    studentProjectAdvances(projectID: ID!): [Advance]
  }
`;

const mutations = gql`
  type Mutation {
  updateAdvanceComments(input: UpdateAdvanceCommentsInput!): Advance!
  }

  type Mutation {
    newAdvance(input: NewAdvanceInput!): Advance!
  }
  type Mutation {
    updateAdvanceAdvance(input: UpdateAdvanceAdvanceInput!): Advance!
  }
`;

const inputs = gql`
  input UpdateAdvanceCommentsInput {
    _id: ID!
    comments: String!
  }
  input NewAdvanceInput {
    projectID: ID!
    advance: String!
  }
  input UpdateAdvanceAdvanceInput {
    _id: ID!
    advance: String!
  }
`;


export default [
  advanceType,
  queries,
  mutations,
  inputs
];
