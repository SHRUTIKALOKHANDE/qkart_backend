const mongoose = require("mongoose");
// NOTE - "validator" external library and not the custom middleware at src/middlewares/validate.js
const validator = require("validator");
const bcrypt = require("bcryptjs");
const config = require("../config/config");

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Complete userSchema, a Mongoose schema for "users" collection
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      validate:(value)=>{
        return validator.isEmail(value);
      }
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            "Password must contain at least one letter and one number"
          );
        }
      },
    },
    walletMoney: {
      type: Number,
      required: true,
      default: 500,
    },
    address: {
      type: String,
      //required: true,
      default: config.default_address,
    },
  },
  // Create createdAt and updatedAt fields automatically
  {
    timestamps: true,
  },
 // { strict: false }
);

userSchema.pre('save', function(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);

        // override the cleartext password with the hashed one
        user.password = hash;
        next();
    });
  });
});


// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement the isEmailTaken() static method
/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email) {
  const result = await this.findOne({'email':email}).exec();
  //console.log(result);
  //if (!result) return false;
  return result;
};


/**
 * Check if entered password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  // if (bcrypt.hash(password) === this.password){
  //   console.log("true");
  //   return true;
  // }
  // return false;

  // console.log("1");
  // bcrypt.compare(password, this.password, function(err, res, info) {
  //   console.log("2");
  //   if (err || info){
  //     console.log("3");
  //     return false;
  //   } 
  //   if(res){
  //     console.log("4",res);
  //     return true;
  //   }
  //   return false;
  // });
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  //console.log(compare);
  return compare;

}



// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS
/**
 * Check if user have set an address other than the default address
 * - should return true if user has set an address other than default address
 * - should return false if user's address is the default address
 *
 * @returns {Promise<boolean>}
 */
userSchema.methods.hasSetNonDefaultAddress = async function () {
  const user = this;
  if(user.address === config.default_address){
    return false;
  }
  return true;
};

/* 
 * Create a Mongoose model out of userSchema and export the model as "User"
 * Note: The model should be accessible in a different module when imported like below
 * const { User } = require("<user.model file path>");
 */
/**
 * @typedef User
 */
const User = mongoose.model("User", userSchema);
module.exports.User = User; 
