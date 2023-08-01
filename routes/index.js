var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //Home page will be the catalog route
  res.redirect('/catalog')
});

module.exports = router;
