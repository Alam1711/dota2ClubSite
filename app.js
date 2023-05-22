//Require Modules
const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
//Required Routes
const eventRoutes = require("./routes/eventRoutes");
const mainRoutes = require("./routes/mainRoutes");
const userRoutes = require("./routes/userRoutes");

//
//Create Application
const app = express();

//Configure App
let port = 3000;
let host = "localhost";
let url =
  "mongodb+srv://Andypandy123452:Linsanity7@cluster0.zvidd6i.mongodb.net/nbdaproject3";
app.set("view engine", "ejs");

//Connect to MongoDB
mongoose
  .connect(url)
  .then(() => {
    //start the server
    app.listen(port, host, () => {
      console.log("Server is running on port", port);
    });
  })
  .catch((err) => console.log(err.message));

//Mount middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: "randomString",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 }, //milliseconds
    store: new MongoStore({ mongoUrl: "mongodb://localhost:27017/demos" }),
  })
);

app.use(flash());

app.use((req, res, next) => {
  //console.log(req.session);
  res.locals.user = req.session.user || null;
  res.locals.rsvp = req.session.rsvp || null;
  res.locals.errorMessages = req.flash("error");
  res.locals.successMessages = req.flash("success");
  next();
});

//Set up routes

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/about", (req, res) => {
  res.render("about");
});
//Routes Router
app.use("/", mainRoutes);
app.use("/events", eventRoutes);
app.use("/users", userRoutes);

//Error Handling

app.use((req, res, next) => {
  let err = new Error("The server cannot locate " + req.url);
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  if (!err.status) {
    err.status = 500;
    err.message = "Internal Server Error";
  }

  res.status(err.status);
  res.render("error", { error: err });
});
