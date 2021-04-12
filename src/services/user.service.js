const { User } = require("../models");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement getUserById(id)
/**
 * Get User by id
 * - Fetch user object from Mongo using the "_id" field and return user object
 * @param {String} id
 * @returns {Promise<User>}
 */
const getUserById = async(id) => {
    console.log(id);
    //const result = await User.findOne({'_id':id}).exec();
    const result = await User.findById(id).exec();
    console.log(result);
    return result;
}

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement getUserByEmail(email)
/**
 * Get user by email
 * - Fetch user object from Mongo using the "email" field and return user object
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async(email) => {
    const result = await User.findOne({'email':email}).exec();
    console.log(result);
    return result;
}
 
// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement createUser(user)
/**
 * Create a user
 *  - check if the user with the email already exists using `User.isEmailTaken()` method
 *  - If so throw an error using the `ApiError` class. Pass two arguments to the constructor,
 *    1. “200 OK status code using `http-status` library
 *    2. An error message, “Email already taken”
 *  - Otherwise, create and return a new User object
 *
 * @param {Object} userBody
 * @returns {Promise<User>}
 * @throws {ApiError}
 *
 * userBody example:
 * {
 *  "name": "crio-users",
 *  "email": "crio-user@gmail.com",
 *  "password": "usersPasswordHashed"
 * }
 *
 * 200 status code on duplicate email - https://stackoverflow.com/a/53144807
 */
const createUser = async(userBody) => {
    console.log(userBody);
    const isEmailTaken = await User.isEmailTaken(userBody.email);
    console.log(isEmailTaken);
    if(isEmailTaken){
        throw new ApiError(httpStatus.Ok, "\"\"userId\"\" Email already taken");
    }
    else{
        const newUser = await User.create({name:userBody.name, email:userBody.email, password:userBody.password});
        console.log(newUser);
        return newUser;
    } 
}
module.exports = {
    getUserById,
    getUserByEmail,
    createUser,
};