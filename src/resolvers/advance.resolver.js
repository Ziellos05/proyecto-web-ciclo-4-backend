// models
import Advances from '../models/advances.model.js';
import Projects from '../models/projects.model.js';
import Users from '../models/users.model.js';
import Enrollments from "../models/enrollments.model.js";
import { USER_STATUS, ROLES } from "../constants/user.constants.js";

const allAdvances = async () => {
  const advances = await Advances.find();
  return advances;
};

const studentProjectAdvances = async (parent, args, {user, errorMessage}) => {
  if (!user) {
    throw new Error(errorMessage);
  }
  if (user.role !== ROLES.STUDENT) {
    throw new Error("Access denied");
  }
  const studentEnrollment = await Enrollments.findOne({project_id: args.projectID, user_id:user._id});
  if (!(studentEnrollment)) {
    throw new Error("IT'S NOT UR PROJECT");
  }
  if (studentEnrollment.status !== 'ACEPTED') {
    throw new Error("U HAVEN'T ACCEPTED TO THIS PROJECT");
  }
  const advances = await Advances.find({projectID:args.projectID});
  return advances;
};

const newAdvance = async (parent, args, {user, errorMessage}) => {
  if (!user) {
    throw new Error(errorMessage);
  }
  if (user.role !== ROLES.STUDENT) {
    throw new Error("Access denied");
  }
  const studentEnrollment = await Enrollments.findOne({project_id: args.input.projectID, user_id:user._id});
  if (!(studentEnrollment)) {
    throw new Error("IT'S NOT UR PROJECT");
  }
  if (studentEnrollment.status !== 'ACEPTED') {
    throw new Error("U HAVEN'T ACCEPTED TO THIS PROJECT");
  }
  const advance = new Advances({
    ...args.input,
    date: Date.now(),
    userID: user._id,
  });
  return advance.save();
};

const updateAdvanceAdvance = async (parents, args, {user, errorMessage}) => {
  if (!user) {
    throw new Error(errorMessage);
  }
  if (user.role !== ROLES.STUDENT) {
    throw new Error("Access denied");
  }
  const projectAdvance = await Advances.findById(args.input._id);
  const studentEnrollment = await Enrollments.findOne({project_id: projectAdvance.projectID, user_id:user._id});
  if (!(studentEnrollment)) {
    throw new Error("IT'S NOT UR PROJECT");
  }
  if (studentEnrollment.status !== 'ACEPTED') {
    throw new Error("U HAVEN'T ACCEPTED TO THIS PROJECT");
  }
  return await Advances.findByIdAndUpdate(args.input._id, 
  {
    advance: args.input.advance
  },
    {
      new:true
    }
  );
};

const updateAdvanceComments = async (parent, args, {user, errorMessage}) => {
  if (!user) {
    throw new Error(errorMessage);
  }
  if (user.role !== ROLES.LEADER) {
    throw new Error("Access denied");
  }
  const advance = await Advances.findById(args.input._id);
  const project = await Projects.findById(advance.projectID);
  if ((user._id).toString() !== (project.leader_id).toString()) {
    throw new Error("IT'S NOT UR PROJECT");
  }
  return await Advances.findOneAndUpdate(args.input._id,
    {
      comments: args.input.comments,
    },
    {
      new:true
    }
  );
};

const project = async (parent) => {
  const project = await Projects.findById(parent.projectID);
  return project;
};

const user = async (parent) => {
  const user = await Users.findById(parent.userID);
  return user;
};

export default {
  advanceQueries: {
    allAdvances,
    studentProjectAdvances,
  },
  Advance: {
    project,
    user,
  },
  advanceMutations: {
    updateAdvanceComments,
    newAdvance,
    updateAdvanceAdvance,
  }
};
