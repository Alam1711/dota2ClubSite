const User = require("../models/user");
const Event = require("../models/event");
const RSVP = require("../models/RSVP");
const flash = require("connect-flash");

//Render
exports.new = (req, res) => {
  //Get the sign up
  console.log("user/new");
  res.render("./user/new");
};

exports.create = (req, res, next) => {
  let user = new User(req.body);
  user.host = req.session.user;
  user
    .save()
    .then(() => {
      if (1 === 1) {
        req.flash("success", "You have successfully signed up");
        res.redirect("./users/login");
      }
    })
    .catch((err) => {
      //Validation Error
      if (err.name === "ValidationError") {
        req.flash("error", err.message);
        return res.redirect("/login");
      }
      //Repeated Email Error
      if (err.code === 11000) {
        req.flash("error", "Email Address has been used");
        return res.redirect("./login");
      }

      next(err);
    });
};

exports.getUserLogin = (req, res, next) => {
  res.render("./user/login");
};

exports.authenticate = (req, res, next) => {
  //Authenticate user's login request0
  let email = req.body.email;
  let password = req.body.password;
  //Get the user that matches the email
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        //user is found in the database
        user.comparePassword(password).then((result) => {
          if (result) {
            req.session.user = user._id; //store user's id in the session
            req.flash("success", "You have successfully logged in");
            res.redirect("./profile");
          } else {
            //console.log("wrong password");
            req.flash("error", "Wrong password");
            res.redirect("./login");
          }
        });
      } else {
        req.flash("error", "Wrong email address");
        res.redirect("./login");
      }
    })
    .catch((err) => next(err));
};

//Login
exports.login = (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        console.log("wrong email address");
        req.flash("error", "wrong email address");
        res.redirect("/users/login");
      } else {
        user.comparePassword(password).then((result) => {
          if (result) {
            req.session.user = user._id;
            req.flash("success", "You have successfully logged in");
            res.redirect("/users/profile");
          } else {
            req.flash("error", "wrong password");
            res.redirect("/users/login");
          }
        });
      }
    })
    .catch((err) => next(err));
};

//Get Profile
exports.profile = (req, res, next) => {
  let id = req.session.user;
  Promise.all([
    User.findById(id),
    Event.find({ host: id }),
    RSVP.find({ user: id }).populate("event"),
  ])
    .then((results) => {
      const [user, events, RSVP] = results;
      res.render("./user/profile", { user, events, RSVP });
    })
    .catch((err) => next(err));
};

//Logout the user
exports.logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next();
    else res.redirect("./login");
  });
};
