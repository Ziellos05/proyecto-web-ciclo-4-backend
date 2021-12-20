import { gql } from 'apollo-server';

const enrollmentType = gql`
  # Enrollment
  type Enrollment {
    _id: ID!
    user_id: ID!
    project_id: ID!
    leader_id: ID!
    status: EnrollmentStatus!
    admissionDate: String
    outputDate: String
    project: Project!
    student: User!
  }
`;

const enums = gql`
  # Enum for status values
  enum EnrollmentStatus {
    PENDING
    ACEPTED
    REJECTED
  }
`;

const queries = gql`
  # Query all enrollments
  type Query {
    allEnrollments: [Enrollment]
  }
  type Query {
    leaderEnrollments: [Enrollment]
  }
`;

const mutations = gql`
  type Mutation {
    updateEnrollmentStatus(input: UpdateEnrollmentStatusInput!): Enrollment!
  }

  type Mutation {
    newEnrollment(project_id: ID!): Enrollment!
  }
`;

const inputs = gql`
  input UpdateEnrollmentStatusInput {
    _id: ID!
    status: EnrollmentStatus!
  }
`;

export default [
  enrollmentType,
  enums,
  queries,
  mutations,
  inputs,
];
