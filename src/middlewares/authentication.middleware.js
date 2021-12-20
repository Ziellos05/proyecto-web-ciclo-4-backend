// vendors
import jwt from 'jsonwebtoken';

//models
//import Users from '../models/users.model.js'

const validateAuthentication = async (req) => {
  const token = req.headers.authorization;
  try {
    // eslint-disable-next-line no-undef
    const session = await jwt.verify(token, process.env.SECRET);
    //const user = await Users.findById(session.userId);
    return {
      user: session.user,
    }
  } catch (error) {
    return {
      errorMessage: error.message,
    }
  }
};

export default validateAuthentication;