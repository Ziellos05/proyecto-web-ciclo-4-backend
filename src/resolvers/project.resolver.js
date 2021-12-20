// models

import Projects from "../models/projects.model.js";
import Users from "../models/users.model.js";
import Enrollements from "../models/enrollments.model.js";
import Advances from "../models/advances.model.js";

// vendors
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AuthenticationError } from "apollo-server";

// constants
import { USER_STATUS, ROLES } from "../constants/user.constants.js";



  




const newProject = async (parents, args, { user, errorMessage }) => {
  if (!user) {
    throw new AuthenticationError(errorMessage);
  }
  if (user.role !== ROLES.LEADER) {
    throw new Error("Access denied");
  }
  const project = new Projects({
    ...args.input,
    // startDate: Date.now(),
    leader_id: user._id,
    status: "INACTIVE",
    phase: "CREATED",
  });
  return project.save();
};

const allProjects = async (parent, args, { user, errorMessage }) => {
  if (!user) {
    throw new Error(errorMessage);
  }
  const projects = await Projects.find();
  return projects;
};

const leaderProjects = async (parent, args, { user, errorMessage }) => {
  if (!user) {
    throw new Error(errorMessage);
  }
  if (user.role !== ROLES.LEADER) {
    throw new Error("Access denied");
  }
  const projects = await Projects.find({ leader_id: user._id });
  return projects;
};

const updateProjectStatus = async (parent, args, { user, errorMessage }) => {
  if (!user) {
    throw new AuthenticationError(errorMessage);
  }
  if (user.role !== ROLES.ADMIN) {
    throw new Error("Access denied");
  }
  return await Projects.findOneAndUpdate(
    { name: args.input.name },
    {
      status: args.input.status,
    },
    {
      new:true
    }
  );
};

const updateProjectPhase = async (parent, args, { user, errorMessage }) => {
  if (!user) {
    throw new AuthenticationError(errorMessage);
  }
  if (user.role !== ROLES.ADMIN) {
    throw new Error("Access denied");
  }
  return await Projects.findOneAndUpdate(
    { name: args.input.name },
    {
      phase: args.input.phase,
    },
    {
      new:true
    }
  );
};

const updateProject = async (parent, args, { user, errorMessage }) => {
  if (!user) {
    throw new Error(errorMessage);
  }
  if (user.role !== ROLES.LEADER) {
    throw new Error("Access denied");
  }
  const project = await Projects.findById(args.input._id);
  if ((user._id).toString() !== (project.leader_id).toString()) {
    throw new Error("IT'S NOT UR PROJECT");
  }
  if (args.input.name) {
    var newName = args.input.name;
  } else {
    newName = project.name;
  }
  if (args.input.generalObjective) {
    var newGeneralObjective = args.input.generalObjective;
  } else {
    newGeneralObjective = project.generalObjective;
  }
  if (args.input.specificObjectives) {
    var newSpecificObjectives = args.input.specificObjectives;
  } else {
    newSpecificObjectives = project.specificObjectives;
  }
  if (args.input.budget) {
    var newBudget = args.input.budget;
  } else {
    newBudget = project.budget;
  }
  return await Projects.findByIdAndUpdate(
    args.input._id,
    {
      name: newName,
      generalObjective: newGeneralObjective,
      specificObjectives: newSpecificObjectives,
      budget: newBudget,
    },
    {
      new:true
    }
  );
};


  const project = async (parent, args) => {
    const project = await Projects.findOne(args._id);
    return project;
  };


const leaderProject = async (parent, args, {user, errorMessage}) => {
  if (!user) {
    throw new Error(errorMessage);
  }
  if (user.role !== ROLES.LEADER) {
    throw new Error("Access denied");
  }
  const project = await Projects.findById(args._id);
  if ((user._id).toString() !== (project.leader_id).toString()) {
    throw new Error("IT'S NOT UR PROJECT");
  }
  return project;
};

const leader = async (parent) => {
  const user = await Users.findById(parent.leader_id);
  return user;
};

const enrollments = async (parent) => {
  const enrollments = await Enrollements.find({
    project_id: parent._id.toString(),
  });
  return enrollments;
};

const advances = async (parent) => {
  const advances = await Advances.find({
    projectID: parent._id.toString(),
  });
  return advances;
};


export default {
  projectQueries: {
    allProjects,
    project,
    leaderProjects,
    leaderProject,
  },
  projectMutations: {
    updateProjectStatus,
    updateProjectPhase,
    updateProject,
    newProject,
  },
  Project: {
    leader,
    enrollments,
    advances,
  },
};
