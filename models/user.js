const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  firstName: { type: String, required: [true, "first name is required"] },
  lastName: { type: String, required: [true, "Last name is required"] },
  email: { type: String, required: [true, "Email is required"], unique: true },
  password: { type: String, required: [true, "cannot be empty"] },
});

//Replace plainetext password with hashed password ebfore saving the document in the database\
//Pre-middleware

userSchema.pre("save", function (next) {
  let user = this;
  if (!user.isModified("password")) return next();
  bcrypt
    .hash(user.password, 10)
    .then((hash) => {
      user.password = hash;
      next();
    })
    .catch((err) => next(err));
});

//Implement a method to compare the login password and the hash stored in the database

userSchema.methods.comparePassword = function (loginPassword) {
  return bcrypt.compare(loginPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
