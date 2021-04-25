const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        "status": "success",
        "user": "Gollum"
    })
});

router.get("/login", (req, res) => {
    res.json({
        "status": "success",
        "user": "Smeagol"
    })
});

router.get("/signup", (req, res) => {
    res.json({
        "status": "success",
        "user": "Precious!"
    });
});

module.exports = router;