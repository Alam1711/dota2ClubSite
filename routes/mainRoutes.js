const express = require("express");
const controller = require("../controllers/mainController");

const router = express.Router();

//Load Homepage
router.get("/", controller.index);

router.get("/about", controller.about);

//export
module.exports = router;
