const passport = require("passport");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

/**
 * Custom callback function implementation to verify callback from passport
 * - If authentication failed, reject the promise and send back an ApiError object with
 * --- Response status code - "401 Unauthorized"
 * --- Message - "Please authenticate"
 *
 * - If authentication succeeded,
 * --- set the `req.user` property as the user object corresponding to the authenticated token
 * --- resolve the promise
 */

/**
 * Auth middleware to authenticate using Passport "jwt" strategy with sessions disabled and a custom callback function
 *
 */
const auth = () => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    // TODO: CRIO_TASK_MODULE_AUTH - Authenticate request
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      console.log(err, user, info);
      // The token expiration message is displayed in info param
      // if there is err or info of token expiration throw error
      if (err || info) {
        const error = new ApiError(
          httpStatus.UNAUTHORIZED,
          "Please authenticate"
        );
        reject(error);
      }
      if(!user){
        const error = new ApiError(
          httpStatus.UNAUTHORIZED,
          "Please authenticate"
        );
        reject(error);
      }
      console.log(user);
      req.user = user;
      resolve();
    })(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = auth;
