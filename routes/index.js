var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('https://precious-coins.herokuapp.com/login.html')
});


module.exports = router;
