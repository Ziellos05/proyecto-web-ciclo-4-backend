// vendors
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AuthenticationError } from 'apollo-server'

// constants
import { USER_STATUS, ROLES } from '../constants/user.constants.js';

// models
import Users from "../models/users.model.js";
import Enrollements from '../models/enrollments.model.js';

const allUsers = async (parent, args, { user, errorMessage }) => {
  if(!user) {
    throw new AuthenticationError(errorMessage);
  }
 /*  if(user.role !== ROLES.ADMIN) {
    throw new Error('Access denied');
  } */
  //console.log(args);
  return await Users.find({...args.filtro});
  
};

const allStudents = async (parent, args, { user, errorMessage }) => {
  if(!user) {
    throw new AuthenticationError(errorMessage);
  }
  if(user.role !== ROLES.LEADER) {
    throw new Error('Access denied');
  }
  return await Users.find({role: 'STUDENT'});
};

const user = async (parent, args, { user, errorMessage }) => {
  if(!user) {
    throw new Error(errorMessage);
  }
  return user;
};

const userByDocumentId = async (parent, args) => {
  const user = await Users.findOne({ documentId: args.documentId });
  if(!user) {
    throw new Error(`El usuario con el documento ${args.documentId} no existe`);
  }
  return user;
};

const register = async (parent, args) => {
  const user = new Users({
    ...args.input,
    status: USER_STATUS.PENDING,
    fullName: `${args.input.name} ${args.input.lastName}`,
    password: await bcrypt.hash(args.input.password, 12),
  });
  return user.save();
};

const updateUser = async (parent, args, { user, errorMessage }) => {
  if(!user) {
    throw new Error(errorMessage);
  }
  if(args.input.email) {
    var newEmail=args.input.email;
  } else {
    newEmail=user.email
  }
  if(args.input.documentId) {
    var newDocumentId=args.input.documentId;
  } else {
    newDocumentId=user.documentId
  }
  if(args.input.name) {
    var newName=args.input.name;
  } else {
    newName=user.name
  }
  if(args.input.lastName) {
    var newLastName=args.input.lastName;
  } else {
    newLastName=user.lastName
  }
  var newFullName= `${newName} ${newLastName}`
  if(args.input.role) {
    var newRole=args.input.role;
  } else {
    newRole=user.role
  }
  if(args.input.password) {
    var newPassword=args.input.password;
    newPassword=await bcrypt.hash(args.input.password, 12);
  } else {
    newPassword=user.password
  }
  return await Users.findOneAndUpdate({email: user.email}, {
    email: newEmail,
    documentId: newDocumentId,
    name: newName,
    lastName: newLastName,
    fullName: newFullName,
    role: newRole,
    password: newPassword,
  },
    {
      new:true
    });
};

const updateUserStatus = async (parent, args, {user, errorMessage} ) => {
  if(!user) {
    throw new AuthenticationError(errorMessage);
  }
  if(user.role !== ROLES.LEADER) {
    throw new Error('Access denied');
  }
  return await Users.findOneAndUpdate({email: args.input.email}, {
    status: args.input.status,
  },
    {
      new:true
    });;
}

const userByEmail = async (parent, args) => {
  const user = await Users.findOne({ email: args.email });
  return user;
};

const login = async (parent, args) => {
  const user = await Users.findOne({ email: args.email });
  const { _id, email, documentId, name, lastName, fullName, role, password } = user;
  if (!user) {
    throw new Error('User not found');
  }
  const isValid = await bcrypt.compare(args.password, user.password); // (user.password===args.password);
  if(!isValid) {
    throw new Error('Wrong password');
  }
  const token = await jwt.sign(
    { user: {
      _id,
      email,
      documentId,
      name,
      lastName,
      fullName,
      role,
      password
    } },
    // eslint-disable-next-line no-undef
    process.env.SECRET,
    { expiresIn: '360m' }
  );
  console.log(user);
  return token;
};

const enrollments = async (parent) => {
  const enrollments = await Enrollements.find({ user_id: parent._id });
  return enrollments;
};



export default {
  userQueries: {
    allUsers,
    user,
    userByEmail,
    userByDocumentId,
    login,
    allStudents,
  },
  userMutations: {
    register,
    updateUser,
    updateUserStatus,
  },
  User: {
    enrollments,
  }
}
