var express = require("express");
var router = express.Router();
const usersController = require("../../../controllers/api/v1/users");

router.get("/", usersController.getAll);

router.get("/login", usersController.login);

router.get("/signup", usersController.signup);

module.exports = router;