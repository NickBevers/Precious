var express = require("express");
var router = express.Router();
const usersController = require("../../../controllers/api/v1/users");
const authenticateController = require("../../../controllers/api/v1/authenticate");

router.get("/", usersController.getAll);

router.get("/login", usersController.login);

router.get("/signup", usersController.signup);

router.post("/signup", (req, res, next) => {
    //signup
    //username uit request halen
    //password uit request halen
    //email uit request halen
    //bcrypt encrypt
    //databank
});

module.exports = router;