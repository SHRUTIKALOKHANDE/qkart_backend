const httpStatus = require("http-status");
const userService = require("./user.service");
const ApiError = require("../utils/ApiError");

/**
 * Login with username and password
 * - Utilize userService methods to fetch user object corresponding to the email provided
 * - If user doesn't exist or incorrect password,
 * throw an ApiError with "401 Unauthorized" status code and message, "Incorrect email or password"
 * - Else, return the user object
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if(!user){
    throw new ApiError(httpStatus.UNAUTHORIZED, "User not found");
  }
  
  const isPasswordMatch = await user.isPasswordMatch(password);
  if(!isPasswordMatch){
    //console.log("isPasswordMatch",isPasswordMatch);
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  return user;    
};

module.exports = {
  loginUserWithEmailAndPassword,
};
