//Required
const express = require("express");
const router = express.Router();
const { isLoggedIn, isAuthor } = require("../middlewares/auth");
const { validateId } = require("../middlewares/validator");
const { validateEvent, validateDates } = require("../middlewares/validator");
const controller = require("../controllers/eventController");
const { fileUpload } = require("../middlewares/fileUpload");

//Load Homepage
router.get("/", controller.index);
//Send html to create new event
router.get("/new", isLoggedIn, validateDates, controller.new);
//Create New event
router.post("/", isLoggedIn, validateEvent, fileUpload, controller.create);
//Show details of event
router.get("/:id", validateId, controller.show);
//Send html to edit event
router.get("/:id/edit", isLoggedIn, validateId, controller.edit);
//Update an event
router.put("/:id", isLoggedIn, validateId, controller.update);
//Update event's RSVP
router.post("/:id/RSVP", isLoggedIn, controller.updateRSVP);
//Delete an event
router.delete("/:id", isLoggedIn, controller.delete);

//export

module.exports = router;
