// models
import Enrollments from '../models/enrollments.model.js';
import Projects from '../models/projects.model.js';
import Users from '../models/users.model.js';

// vendors
import { AuthenticationError } from "apollo-server";

// constants
import { USER_STATUS, ROLES } from "../constants/user.constants.js";

const leaderEnrollments = async (parents, args, { user, errorMessage }) => {
  if (!user) {
    throw new Error(errorMessage);
  }
  if (user.role !== ROLES.LEADER) {
    throw new Error("Access denied");
  }
  const enrollments = await Enrollments.find({ leader_id: user._id, status: 'PENDING' });
  return enrollments;
};

const newEnrollment = async (parents, args, { user, errorMessage }) => {
  if (!user) {
    throw new AuthenticationError(errorMessage);
  }
  if (user.role !== ROLES.STUDENT) {
    throw new Error("Access denied");
  }
  const oldEnrollment = await Enrollments.find({ user_id: user._id, project_id: args.project_id});
  if (oldEnrollment) {
    throw new Error("No te registres dos veces al mismo proyecto :)");
  }
  const project = await Projects.findById(args.project_id);
  console.log(args.project_id)
  const enrollment = new Enrollments({
    ...args,
    user_id: user._id,
    leader_id: project.leader_id,
    status: "PENDING",
  });
  return enrollment.save();
};

const updateEnrollmentStatus = async (parents, args, {user, errorMessage}) => {
  if (!user) {
    throw new Error(errorMessage);
  }
  if (user.role !== ROLES.LEADER) {
    throw new Error("Access denied");
  }
  const enrollment = await Enrollments.findById(args.input._id);
  if ((user._id).toString() !== (enrollment.leader_id).toString()) {
    throw new Error("IT'S NOT UR ENROLLMENT");
  }
  if ('PENDING' !== enrollment.status) {
    throw new Error("U CAN'T CHANGE THIS ENROLLMENT STATUS");
  }
  return await Enrollments.findByIdAndUpdate(args.input._id, 
  {
    status: args.input.status,
    admissionDate: Date.now(),
  },
    {
      new:true
    }
  );
};

const allEnrollments = async () => {
  const enrollments = await Enrollments.find();
  return enrollments;
}

const project = async (parent) => {
  const project = await Projects.findById(parent.project_id);
  return project;
};

const student = async (parent) => {
  const student = await Users.findById(parent.user_id);
  return student;
};

export default {
  enrollmentQueries: {
    allEnrollments,
    leaderEnrollments,
  },
  enrollmentMutations: {
    updateEnrollmentStatus,
    newEnrollment,
  },
  Enrollment: {
    project,
    student,
  }
};
