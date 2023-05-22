const model = require("../models/event");
const RSVP = require("../models/RSVP");

exports.index = (req, res, next) => {
  model
    .find()
    .then((events) => res.render("./event/index", { events }))
    .catch((err) => next(err));
};

exports.new = (req, res) => {
  res.render("./event/new");
};

exports.create = (req, res, next) => {
  //create new event doc
  let event = new model(req.body);
  event.host = req.session.user;
  event.image = "../images/" + req.file.filename;
  event
    //inserts doc to database
    .save()
    .then((event) => {
      console.log(event);
      res.redirect("/events");
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        err.status = 400;
      }
      next(err);
    });
};

exports.show = (req, res, next) => {
  let id = req.params.id;
  let eventId = req.params.id;
  let user = req.session.user;
  let response = req.body.response;
  //Count

  //Show model
  model
    .findById(id)
    .populate("host", "firstName lastName")
    .then((event) => {
      if (event) {
        res.render("./event/show", { event });
      } else {
        let err = new Error("Cannot find a event with id " + id);
        err.status = 404;
        next(err);
      }
    })
    .catch((err) => next(err));
};

exports.edit = (req, res) => {
  let id = req.params.id;

  model
    .findById(id)
    .then((event) => {
      if (event) {
        res.render("./event/edit", { event });
      } else {
        let err = new Error("Cannot find a event with id " + id);
        err.status = 404;
        next(err);
      }
    })
    .catch((err) => next(err));
};

exports.update = (req, res, next) => {
  let event = req.body;
  let id = req.params.id;

  //objectId is 24-bit Hex string
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    let err = new Error("Invalid event id");
    err.status = 400;
    return next(err);
  }

  model
    .findByIdAndUpdate(id, event, {
      useFindAndModify: false,
      runValidators: true,
    })
    //Broke from Bootstrap
    //count the RSVPs
    // .count({ response: "Yes" }, (err, count) => {
    //   if (err) {
    //     console.error(err);
    //   } else {
    //     event.count = count;
    //   }
    // })
    .then((event) => {
      if (event) {
        res.redirect("/events/" + id);
      } else {
        let err = new Error("Cannot find a event with id " + id);
        err.status = 404;
        next(err);
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        err.status = 400;
      }
      next(err);
    });
};

exports.updateRSVP = (req, res, next) => {
  let eventId = req.params.id;
  let user = req.session.user;
  let response = req.body.response;

  RSVP.findOneAndUpdate(
    { user: user, event: eventId },
    { response: response },
    { userFindAndModify: true, runValidators: true, new: true, upsert: true }
  )
    .then((rsvp) => {
      if (rsvp) {
        req.flash("success", "Your RSVP to this event has been updated!");
        res.redirect("/users/profile");
      } else {
        let err = new Error("Cannot make RSVP");
        err.status = 404;
        next(err);
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        err.status = 400;
      }
      next(err);
    });
};

exports.delete = (req, res, next) => {
  let id = req.params.id;
  //objectId is 24-bit Hex string
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    let err = new Error("Invalid event id");
    err.status = 400;
    return next(err);
  }

  model
    .findByIdAndDelete(id, { useFindAndModify: false })
    .then((event) => {
      if (event) {
        if (event) {
          req.flash("success", "You have successfully deleted an event");
          res.redirect("/events");
        } else {
          let err = new Error("Cannot find a event with id " + id);
          err.status = 404;
          next(err);
        }
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        err.status = 400;
      }
      next(err);
    });
};
